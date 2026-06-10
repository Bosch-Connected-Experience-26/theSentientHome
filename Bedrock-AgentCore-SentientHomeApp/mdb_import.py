import json
import logging
import certifi
import dns.resolver
from pymongo import MongoClient
import boto3
from botocore.exceptions import ClientError

dns.resolver.default_resolver = dns.resolver.Resolver(configure=False)
dns.resolver.default_resolver.nameservers = ['169.254.169.253', '8.8.8.8']

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('mdb_import')


def get_secret(secret_name):
    """
    Retrieve secret from AWS Secrets Manager
    """
    client = boto3.client(service_name='secretsmanager')

    try:
        get_secret_value_response = client.get_secret_value(SecretId=secret_name)
    except ClientError as e:
        logger.error(f"Error retrieving secret {secret_name}: {e}")
        raise e
    else:
        if 'SecretString' in get_secret_value_response:
            logger.info(f"Successfully retrieved secret {secret_name}")
            return get_secret_value_response['SecretString']


# Get the MongoDB connection string from Secrets Manager
logger.info("Retrieving MongoDB connection string from Secrets Manager")
mongodb_uri = get_secret("workshop/atlas_secret")  # Replace with your secret name

# MongoDB connection
logger.info("Connecting to MongoDB Atlas")
client = MongoClient(mongodb_uri, tlsCAFile=certifi.where())

# JSON dataset path (project root)
json_file_path = './smart_home_aal_dataset_use_cases_comma_separated.json'

logger.info('Starting data import from JSON to MongoDB (smarthome DB)')

with open(json_file_path, 'r', encoding='utf-8') as jf:
    payload = json.load(jf)

    use_cases = payload.get('use_cases', [])
    for uc in use_cases:
        use_case_name = uc.get('use_case')
        records = uc.get('records', [])
        if not use_case_name or not records:
            continue

        collection = client['smarthome'][use_case_name]
        logger.info(f'Inserting {len(records)} records into smarthome.{use_case_name}')
        # insert many (replace existing for idempotency could be added)
        try:
            collection.insert_many(records)
        except Exception as e:
            logger.error(f'Failed inserting into {use_case_name}: {e}')

logger.info('Finished JSON import successfully')
