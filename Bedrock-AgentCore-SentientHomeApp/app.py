import boto3
import json
import os
from botocore.exceptions import BotoCoreError, ClientError

input_text = "What smart-home actions can you help me with?"


def region_from_arn(arn):
    parts = arn.split(':')
    if len(parts) > 3 and parts[0] == 'arn':
        return parts[3]
    return None


def get_agent_runtime_arn():
    configured_arn = os.getenv('AGENT_RUNTIME_ARN')
    if configured_arn:
        return configured_arn, region_from_arn(configured_arn)

    configured_region = os.getenv('AWS_REGION')
    candidate_regions = [
        region
        for region in [configured_region, 'us-east-1', 'us-west-2']
        if region
    ]

    seen = set()
    lookup_errors = []
    for region in candidate_regions:
        if region in seen:
            continue
        seen.add(region)

        try:
            control_client = boto3.client('bedrock-agentcore-control', region_name=region)
            response = control_client.list_agent_runtimes()
        except (BotoCoreError, ClientError) as e:
            lookup_errors.append(f"{region}: {e}")
            print(f"Could not list AgentCore runtimes in {region}: {e}")
            continue

        runtimes = response.get('agentRuntimes', [])
        if not runtimes:
            print(f"No AgentCore runtimes found in {region}")
            continue

        runtime = runtimes[0]
        print(f"Using Agent Runtime: {runtime['agentRuntimeName']}")
        print(f"ARN: {runtime['agentRuntimeArn']}")
        return runtime['agentRuntimeArn'], region

    if lookup_errors:
        raise RuntimeError(
            "Could not list AgentCore runtimes. Check AWS credentials in this shell, "
            "or set AGENT_RUNTIME_ARN to a full runtime ARN. Errors: "
            + "; ".join(lookup_errors)
        )

    raise RuntimeError(
        "No AgentCore runtimes found in the checked regions. Set AGENT_RUNTIME_ARN "
        "to a full runtime ARN or deploy a runtime first."
    )


agent_runtime_arn, region = get_agent_runtime_arn()
region = region or os.getenv('AWS_REGION', 'us-east-1')
client = boto3.client('bedrock-agentcore', region_name=region)

# Make request to the agent
response = client.invoke_agent_runtime(
    agentRuntimeArn=agent_runtime_arn,
    qualifier="DEFAULT",
    payload=json.dumps({"prompt": input_text})
)

# Extract and display the response
raw_content = response['response'].read()
decoded_content = raw_content.decode('utf-8')

print("Raw decoded content:", repr(decoded_content))

# The content is JSON-encoded, so we need to parse it to get the actual text
if decoded_content.startswith('"') and decoded_content.endswith('"'):
    agent_response = json.loads(decoded_content)
else:
    agent_response = decoded_content

print("Agent Response:")
print(agent_response)
