import time
import logging
import boto3
import certifi
import dns.resolver
import os
import re
import json
import requests
import sys
from datetime import datetime, timedelta
from urllib.parse import urlparse

from pymongo import MongoClient
from botocore.exceptions import ClientError
from strands import Agent, tool
from strands.models import BedrockModel
from bedrock_agentcore.runtime import BedrockAgentCoreApp

custom_dns_nameservers = os.getenv('MONGODB_DNS_NAMESERVERS')
if custom_dns_nameservers:
    dns.resolver.default_resolver = dns.resolver.Resolver(configure=False)
    dns.resolver.default_resolver.nameservers = [
        nameserver.strip()
        for nameserver in custom_dns_nameservers.split(',')
        if nameserver.strip()
    ]

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = BedrockAgentCoreApp()
AWS_REGION = os.getenv('AWS_REGION', 'eu-central-1')
SECRET_REGION = os.getenv('AWS_SECRET_REGION', 'us-west-2')
BEDROCK_REGION = os.getenv('BEDROCK_REGION', 'us-east-1')
MONGODB_SECRET_NAME = os.getenv('MONGODB_SECRET_NAME', 'workshop/atlas_secret')
MONGODB_DATABASE_NAME = os.getenv('MONGODB_DATABASE_NAME', 'smarthome')

@tool
def current_time() -> int:
    """Gets the current time in seconds"""
    logger.info("Getting current time in seconds")
    return int(time.time())

@tool
def current_month() -> str:
    """Gets the current month"""
    logger.info("Getting current month")
    return time.strftime("%B")

def get_appliances_collection(client):
    logger.info("Getting appliances collection from MongoDB (%s.appliances)", MONGODB_DATABASE_NAME)
    db = client[MONGODB_DATABASE_NAME]
    collection = db['appliances']
    return collection


def get_user_preferences_collection(client):
    logger.info(
        "Getting user preferences collection from MongoDB (%s.user_preferences)",
        MONGODB_DATABASE_NAME,
    )
    db = client[MONGODB_DATABASE_NAME]
    collection = db['user_preferences']
    return collection


def emit_tool_debug(tool_name: str, payload: dict) -> None:
    """Write tool-call details to stdout for local debugging without changing UI output."""
    event = {
        'event': 'tool_call',
        'tool_name': tool_name,
        'timestamp': datetime.utcnow().isoformat(),
        'payload': payload,
    }
    print(json.dumps(event, default=str), file=sys.stdout, flush=True)


SEARCHABLE_COLLECTIONS = [
    'ambient_assisted_living',
    'users',
    'household_members',
    'rooms',
    'appliances',
    'user_preferences',
    'calendar_events',
    'sensor_readings',
    'appliance_events',
    'food_inventory',
    'autonomy_rules',
    'llm_context_snapshots',
    'insight_cards',
    'action_log',
    'weekly_report',
]


@tool
def mongodb_search(query: str) -> str:
    """Fetch smart-home context from MongoDB using keyword matching."""
    logger.info(f"Fetching smart-home context for query: {query}")
    try:
        client = get_mongo_client()
        db = client[MONGODB_DATABASE_NAME]

        query_terms = [
            term.strip()
            for term in re.split(r"\s+", query.lower())
            if len(term.strip()) > 2
        ]
        if not query_terms:
            query_terms = [query.lower()]

        context_bundle = {}
        available_collections = set(db.list_collection_names())
        for collection_name in SEARCHABLE_COLLECTIONS:
            records = get_use_case_records(client, collection_name)
            if not records and collection_name not in available_collections:
                continue

            matches = []
            if records:
                docs = records[:200]
            else:
                docs = db[collection_name].find({}, {'_id': 0}).limit(200)

            for doc in docs:
                if document_matches_query(doc, query_terms):
                    matches.append(doc)
                    if len(matches) >= 10:
                        break

            if matches:
                unique = []
                seen = set()
                for doc in matches:
                    marker = json.dumps(doc, sort_keys=True, default=str)
                    if marker not in seen:
                        seen.add(marker)
                        unique.append(doc)
                context_bundle[collection_name] = unique[:5]

        if not context_bundle and 'ambient_assisted_living' in available_collections:
            docs = get_use_case_records(client, 'ambient_assisted_living')
            if not docs:
                docs = list(
                    db['ambient_assisted_living']
                    .find({}, {'_id': 0})
                    .limit(5)
                )
            if docs:
                context_bundle['ambient_assisted_living'] = docs[:5]

        if not context_bundle:
            return (
                "No matching smart-home context found. Available collections: "
                + ", ".join(sorted(available_collections))
            )

        return json.dumps(context_bundle, indent=2, default=str)
    except Exception as e:
        logger.error(f"Error fetching smart-home context for query '{query}': {e}")
        raise


def document_matches_query(value, query_terms: list[str]) -> bool:
    """Return true if any query term appears in any scalar value of a document."""
    if isinstance(value, dict):
        return any(document_matches_query(item, query_terms) for item in value.values())
    if isinstance(value, list):
        return any(document_matches_query(item, query_terms) for item in value)
    if value is None:
        return False

    text = str(value).lower()
    return any(term in text for term in query_terms)


def strip_mongo_id(value):
    if isinstance(value, dict):
        return {
            key: strip_mongo_id(item)
            for key, item in value.items()
            if key != '_id'
        }
    if isinstance(value, list):
        return [strip_mongo_id(item) for item in value]
    return value


def records_from_dataset_document(document: dict, use_case_name: str) -> list[dict]:
    """Extract records from either one use_case document or a full dataset document."""
    if document.get('use_case') == use_case_name and isinstance(document.get('records'), list):
        return [strip_mongo_id(record) for record in document['records']]

    use_cases = document.get('use_cases')
    if isinstance(use_cases, list):
        for use_case in use_cases:
            if use_case.get('use_case') == use_case_name and isinstance(use_case.get('records'), list):
                return [strip_mongo_id(record) for record in use_case['records']]

    return []


def get_use_case_records(client, use_case_name: str) -> list[dict]:
    """Read records from direct collections or the dataset's use_case/records schema."""
    db = client[MONGODB_DATABASE_NAME]
    available_collections = db.list_collection_names()

    if use_case_name in available_collections:
        docs = list(db[use_case_name].find({}, {'_id': 0}).limit(500))
        direct_docs = [
            strip_mongo_id(doc)
            for doc in docs
            if not ('use_case' in doc and 'records' in doc)
            and not ('use_cases' in doc)
        ]
        if direct_docs:
            emit_tool_debug('mongodb_schema_lookup', {
                'use_case': use_case_name,
                'source': f'{MONGODB_DATABASE_NAME}.{use_case_name}',
                'layout': 'direct_collection',
                'record_count': len(direct_docs),
            })
            return direct_docs

        for doc in docs:
            records = records_from_dataset_document(doc, use_case_name)
            if records:
                emit_tool_debug('mongodb_schema_lookup', {
                    'use_case': use_case_name,
                    'source': f'{MONGODB_DATABASE_NAME}.{use_case_name}',
                    'layout': 'wrapped_collection',
                    'record_count': len(records),
                })
                return records

    for collection_name in available_collections:
        collection = db[collection_name]
        wrapped_doc = collection.find_one(
            {'use_case': use_case_name, 'records': {'$exists': True}},
            {'_id': 0}
        )
        if wrapped_doc:
            records = records_from_dataset_document(wrapped_doc, use_case_name)
            if records:
                emit_tool_debug('mongodb_schema_lookup', {
                    'use_case': use_case_name,
                    'source': f'{MONGODB_DATABASE_NAME}.{collection_name}',
                    'layout': 'use_case_document',
                    'record_count': len(records),
                })
                return records

        for doc in collection.find({'use_cases': {'$exists': True}}, {'_id': 0}).limit(20):
            records = records_from_dataset_document(doc, use_case_name)
            if records:
                emit_tool_debug('mongodb_schema_lookup', {
                    'use_case': use_case_name,
                    'source': f'{MONGODB_DATABASE_NAME}.{collection_name}',
                    'layout': 'full_dataset_document',
                    'record_count': len(records),
                })
                return records

    emit_tool_debug('mongodb_schema_lookup', {
        'use_case': use_case_name,
        'source': None,
        'layout': 'not_found',
        'available_collections': sorted(available_collections),
        'record_count': 0,
    })
    return []


def find_use_case_record(client, use_case_name: str, field_name: str, field_value: str):
    for record in get_use_case_records(client, use_case_name):
        if str(record.get(field_name)) == field_value:
            return record
    return None

def get_secret(secret_name):
    """
    Retrieve secret from AWS Secrets Manager
    """
    client = boto3.client(
        service_name='secretsmanager',
        region_name=SECRET_REGION
    )

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except ClientError as e:
        logger.error(f"Error retrieving secret {secret_name}: {e}")
        raise e
    else:
        if 'SecretString' in get_secret_value_response:
            logger.info(f"Successfully retrieved secret {secret_name}")
            return get_secret_value_response['SecretString']


def extract_mongodb_uri(secret_value: str) -> str:
    """Extract a MongoDB connection URI from a raw or JSON Secrets Manager value."""
    secret_value = secret_value.strip()
    if not secret_value:
        raise ValueError("MongoDB secret value is empty")

    if secret_value.startswith('{'):
        data = json.loads(secret_value)
        for key in ('mongodb_uri', 'MONGODB_URI', 'uri', 'connectionString', 'connection_string'):
            uri = data.get(key)
            if uri:
                return uri.strip()
        raise ValueError(
            "MongoDB secret JSON must contain one of: mongodb_uri, MONGODB_URI, "
            "uri, connectionString, connection_string"
        )

    return secret_value.strip('"')


def redact_mongodb_uri(mongodb_uri: str) -> str:
    return re.sub(r"//([^:/@]+)(:[^@]*)?@", r"//\1:***@", mongodb_uri)


def mongodb_uri_host(mongodb_uri: str) -> str:
    parsed = urlparse(mongodb_uri)
    return parsed.hostname or "unknown-host"


def get_mongo_client():
    try:
        secret_value = os.getenv('MONGODB_URI') or get_secret(MONGODB_SECRET_NAME)
        mongodb_uri = extract_mongodb_uri(secret_value)
        logger.info(
            "Creating MongoDB client connection to %s using secret %s in %s",
            mongodb_uri_host(mongodb_uri),
            MONGODB_SECRET_NAME,
            SECRET_REGION,
        )
        logger.debug("MongoDB URI: %s", redact_mongodb_uri(mongodb_uri))
        client = MongoClient(
            mongodb_uri,
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=5000,
        )
        client.admin.command('ping')
        logger.info("Successfully connected to MongoDB")
        return client
    except Exception as e:
        logger.error(f"Failed to create MongoDB client: {e}")
        raise


def get_ha_credentials():
    """Get Home Assistant URL and token from environment or Secrets Manager.

    Priority: environment vars `HA_URL` and `HA_TOKEN`, else try Secrets Manager
    secret name: `homeassistant/creds` expected to be JSON with keys `url` and `token`.
    """
    ha_url = os.getenv('HA_URL')
    ha_token = os.getenv('HA_TOKEN')
    if ha_url and ha_token:
        return ha_url.rstrip('/'), ha_token

    try:
        cred_str = get_secret('homeassistant/creds')
        creds = json.loads(cred_str)
        return creds.get('url').rstrip('/'), creds.get('token')
    except Exception:
        logger.warning('Home Assistant credentials not found in env or Secrets Manager')
        return None, None


def ha_turn_off_entities(entity_ids: list) -> dict:
    """Call Home Assistant REST API to turn off a list of entity ids.

    Returns a dict with the response or a simulated result when credentials missing.
    """
    ha_url, ha_token = get_ha_credentials()
    if not ha_url or not ha_token:
        logger.info('HA creds missing; returning simulated shutdown response')
        return {'status': 'simulated', 'entities': entity_ids}

    endpoint = f"{ha_url}/api/services/homeassistant/turn_off"
    headers = {'Authorization': f'Bearer {ha_token}', 'Content-Type': 'application/json'}
    payload = {'entity_id': entity_ids}
    try:
        resp = requests.post(endpoint, headers=headers, json=payload, timeout=10)
        resp.raise_for_status()
        return {'status': 'ok', 'response': resp.text}
    except Exception as e:
        logger.error(f'Failed to call HA API: {e}')
        return {'status': 'error', 'error': str(e)}


@tool
def list_appliances() -> str:
    """Return a list of known appliances from MongoDB."""
    try:
        client = get_mongo_client()
        docs = get_use_case_records(client, 'appliances')
        fields = [
            'appliance_id',
            'appliance_type',
            'ecosystem',
            'room',
            'connection_status',
            'risk_level',
            'automation_policy',
            'default_program',
            'notes',
        ]
        appliances = [
            {field: doc.get(field) for field in fields if field in doc}
            for doc in docs
        ]
        emit_tool_debug('list_appliances', {
            'record_count': len(appliances),
            'appliance_ids': [doc.get('appliance_id') for doc in appliances],
        })
        return json.dumps(appliances, indent=2, default=str)
    except Exception as e:
        logger.error(f'Error listing appliances: {e}')
        raise


@tool
def find_user_preferences(query: str, user_id: str = "user_erna_001") -> str:
    """Find user preferences from MongoDB by keyword, category, key, scope, or sensitivity."""
    logger.info("Finding user preferences for user_id=%s query=%s", user_id, query)
    try:
        client = get_mongo_client()

        query_terms = [
            term.strip()
            for term in re.split(r"\s+", query.lower())
            if len(term.strip()) > 2
        ]

        docs = get_use_case_records(client, 'user_preferences')
        if user_id:
            docs = [
                doc for doc in docs
                if str(doc.get('user_id')) == user_id
            ]
        if query_terms:
            docs = [
                doc for doc in docs
                if document_matches_query(doc, query_terms)
            ]

        result = {
            'user_id': user_id,
            'query': query,
            'matches': docs[:10],
            'match_count': min(len(docs), 10),
        }
        emit_tool_debug('find_user_preferences', result)
        return json.dumps(result, indent=2, default=str)
    except Exception as e:
        logger.error(f'Error finding user preferences: {e}')
        raise


@tool
def mock_bosch_appliance_call(
    appliance_id: str,
    action: str,
    value: str = "",
    reason: str = ""
) -> str:
    """Mock a Bosch Home Connect API call for a known appliance and print the call to stdout."""
    logger.info(
        "Mocking Bosch appliance call appliance_id=%s action=%s value=%s",
        appliance_id,
        action,
        value,
    )
    allowed_actions = {
        'turn_on',
        'turn_off',
        'pause',
        'resume',
        'delay_start',
        'set_program',
        'start_program',
        'stop_program',
        'set_temperature',
        'set_mode',
        'notify',
    }
    normalized_action = action.strip().lower()
    if normalized_action not in allowed_actions:
        result = {
            'status': 'rejected',
            'error': f"Unsupported Bosch mock action: {action}",
            'allowed_actions': sorted(allowed_actions),
        }
        emit_tool_debug('mock_bosch_appliance_call', result)
        return json.dumps(result, indent=2, default=str)

    try:
        client = get_mongo_client()
        appliance = find_use_case_record(client, 'appliances', 'appliance_id', appliance_id)
        if not appliance:
            result = {
                'status': 'not_found',
                'appliance_id': appliance_id,
                'message': 'No appliance with this appliance_id was found.',
            }
            emit_tool_debug('mock_bosch_appliance_call', result)
            return json.dumps(result, indent=2, default=str)

        ecosystem = str(appliance.get('ecosystem', ''))
        if 'bosch' not in ecosystem.lower() and 'home connect' not in ecosystem.lower():
            result = {
                'status': 'rejected',
                'appliance_id': appliance_id,
                'ecosystem': ecosystem,
                'message': 'Only Bosch Home Connect appliances are supported by this mock tool.',
            }
            emit_tool_debug('mock_bosch_appliance_call', result)
            return json.dumps(result, indent=2, default=str)

        risk_level = appliance.get('risk_level')
        automation_policy = appliance.get('automation_policy')
        safety_note = None
        if risk_level == 'safety_critical':
            safety_note = (
                'Safety-critical appliance. This is still only a mock call, '
                'but the assistant should ask before real-world execution.'
            )

        result = {
            'status': 'mocked',
            'provider': 'bosch_home_connect_mock',
            'endpoint': '/mock/homeconnect/appliances/actions',
            'method': 'POST',
            'appliance_id': appliance_id,
            'appliance_type': appliance.get('appliance_type'),
            'room': appliance.get('room'),
            'connection_status': appliance.get('connection_status'),
            'risk_level': risk_level,
            'automation_policy': automation_policy,
            'action': normalized_action,
            'value': value,
            'reason': reason,
            'safety_note': safety_note,
            'timestamp': datetime.utcnow().isoformat(),
        }
        emit_tool_debug('mock_bosch_appliance_call', result)

        try:
            client[MONGODB_DATABASE_NAME]['action_log'].insert_one({
                'action_id': f"act_bosch_mock_{int(time.time())}",
                'timestamp': result['timestamp'],
                'action_type': 'bosch_home_connect_mock',
                'appliance_id': appliance_id,
                'appliance_type': appliance.get('appliance_type'),
                'risk_level': risk_level,
                'automation_policy': automation_policy,
                'requested_action': normalized_action,
                'value': value,
                'reason': reason,
                'result': 'mocked',
            })
        except Exception:
            logger.warning('Failed to write Bosch mock action to action_log')

        return json.dumps(result, indent=2, default=str)
    except Exception as e:
        logger.error(f'Error mocking Bosch appliance call: {e}')
        raise


@tool
def take_break(user_input: str) -> str:
    """Parse a user instruction like 'I want to take a break for the next 2h' and shut down non-critical appliances.

    This tool will:
    - parse the duration
    - select appliances that are `connected` and not `safety_critical`
    - call Home Assistant API to turn them off (simulated if creds missing)
    """
    try:
        # parse duration in hours or minutes
        m = re.search(r"(\d+)\s*h", user_input.lower())
        hours = int(m.group(1)) if m else 0
        m2 = re.search(r"(\d+)\s*m", user_input.lower())
        minutes = int(m2.group(1)) if m2 else 0
        if hours == 0 and minutes == 0:
            # fallback: look for pattern 'for the next X' where X is hours
            m3 = re.search(r"next\s*(\d+)", user_input.lower())
            if m3:
                hours = int(m3.group(1))

        duration = timedelta(hours=hours, minutes=minutes)

        client = get_mongo_client()

        appliances = get_use_case_records(client, 'appliances')
        candidates = [
            appliance for appliance in appliances
            if appliance.get('connection_status') == 'connected'
            and appliance.get('risk_level') != 'safety_critical'
        ]
        skipped = [
            {
                'appliance_id': appliance.get('appliance_id'),
                'appliance_type': appliance.get('appliance_type'),
                'risk_level': appliance.get('risk_level'),
                'reason': 'safety_critical' if appliance.get('risk_level') == 'safety_critical' else 'not_connected',
            }
            for appliance in appliances
            if appliance not in candidates
        ]
        emit_tool_debug('take_break_selection', {
            'duration_minutes': int(duration.total_seconds() // 60),
            'candidate_count': len(candidates),
            'candidate_appliances': [
                {
                    'appliance_id': appliance.get('appliance_id'),
                    'appliance_type': appliance.get('appliance_type'),
                    'risk_level': appliance.get('risk_level'),
                    'automation_policy': appliance.get('automation_policy'),
                }
                for appliance in candidates
            ],
            'skipped_appliances': skipped,
        })

        if not candidates:
            return 'No eligible appliances found to turn off.'

        # map appliance_id to Home Assistant entity ids (convention: switch.appl_<id>)
        entity_ids = [f"switch.{c['appliance_id']}" for c in candidates]

        result = ha_turn_off_entities(entity_ids)

        # log action to action_log collection
        try:
            action_db = client[MONGODB_DATABASE_NAME]
            action_db['action_log'].insert_one({
                'action_id': f'act_take_break_{int(time.time())}',
                'timestamp': datetime.utcnow().isoformat(),
                'duration_minutes': int(duration.total_seconds()//60),
                'entities': entity_ids,
                'result': result
            })
        except Exception:
            logger.warning('Failed to write action log')

        return str(result)
    except Exception as e:
        logger.error(f'Error executing take_break: {e}')
        raise


# Initialize Bedrock client and agent with local tools
bedrock_client = boto3.client('bedrock-runtime', region_name=BEDROCK_REGION)
model = BedrockModel(
    client=bedrock_client,
    model_id="us.amazon.nova-pro-v1:0"
)
agent = Agent(
    model=model,
    tools=[
        current_time,
        current_month,
        mongodb_search,
        list_appliances,
        find_user_preferences,
        mock_bosch_appliance_call,
        take_break,
    ],
    system_prompt=(
        "You are a smart-home assistant. Help manage appliances, suggest energy saving, "
        "and run approved automations. Use find_user_preferences when the user's request "
        "depends on comfort, budget, privacy, work, language, notification, or automation "
        "preferences. Use mock_bosch_appliance_call for simulated Bosch Home Connect "
        "appliance actions. The Bosch tool is a mock only; do not claim that a real "
        "appliance API was called. Keep frontend-facing replies concise and natural. "
        "Do not include raw tool JSON in the user response unless the user explicitly asks."
    )
)

@app.entrypoint
def run_agent(user_input) -> str:
    """Run the agent with user input and return response"""
    # Extract the actual prompt from the input
    if isinstance(user_input, dict) and 'prompt' in user_input:
        prompt = user_input['prompt']
    elif isinstance(user_input, str):
        prompt = user_input
    else:
        prompt = str(user_input)
    
    logger.info(f"Processing user input: {prompt}")
    response = agent(prompt)
    
    # Handle different response types
    try:
        # Try to get the content from message structure
        if hasattr(response, 'message') and response.message:
            return response.message['content'][0]['text']
        # Try to get content attribute
        elif hasattr(response, 'content'):
            return response.content
        # Try to get text attribute
        elif hasattr(response, 'text'):
            return response.text
        # Handle Starlette JSONResponse objects specifically
        elif hasattr(response, 'body'):
            if isinstance(response.body, bytes):
                return response.body.decode('utf-8')
            else:
                return str(response.body)
        # Check if it's a Starlette JSONResponse and try to get the body
        elif str(type(response)).find('starlette') != -1:
            # For Starlette responses, try to access the body directly
            if hasattr(response, '_body'):
                body = response._body
                if isinstance(body, bytes):
                    return body.decode('utf-8')
                else:
                    return str(body)
            # If no _body, try other Starlette-specific attributes
            elif hasattr(response, 'content'):
                return response.content
            else:
                logger.warning(f"Starlette response detected but couldn't extract content: {type(response)}")
                return "I apologize, but I'm experiencing a technical issue with the response format. Please try again."
        # Fallback to string conversion
        else:
            result = str(response)
            # If we get a Starlette object string, return an error message
            if "starlette.responses.JSONResponse object" in result:
                logger.error(f"Failed to extract content from Starlette response: {result}")
                return "I apologize, but I'm experiencing a technical issue with the response format. Please try again."
            return result
    except Exception as e:
        logger.error(f"Error extracting response: {e}")
        result = str(response)
        if "starlette.responses.JSONResponse object" in result:
            return "I apologize, but I'm experiencing a technical issue with the response format. Please try again."
        return result

if __name__ == "__main__":  
    app.run()
