#!/usr/bin/env python

"""Deploy the Sentient Home assistant to Amazon Bedrock AgentCore Runtime."""

import argparse
import os
import re
import time
import json
from pathlib import Path

from bedrock_agentcore_starter_toolkit import Runtime
import boto3

AWS_REGION = os.getenv('AWS_REGION', 'us-east-1')
SECRET_REGION = os.getenv('AWS_SECRET_REGION', 'us-west-2')
BEDROCK_REGION = os.getenv('BEDROCK_REGION', 'us-east-1')
DEFAULT_AGENT_NAME = os.getenv('AGENT_NAME', 'sentient_home_assistant')
DEFAULT_ENTRY_POINT = os.getenv('AGENT_ENTRY_POINT', 'agent.py')
DEFAULT_DEPLOYMENT_TYPE = os.getenv('AGENT_DEPLOYMENT_TYPE', 'direct_code_deploy')
DEFAULT_RUNTIME_TYPE = os.getenv('AGENT_RUNTIME_TYPE', 'PYTHON_3_12')

agentcore_runtime = Runtime()


def wait_for_status():
    """Poll the AgentCore runtime until deployment finishes."""
    status_response = agentcore_runtime.status()
    status = status_response.endpoint['status']
    end_status = ['READY', 'CREATE_FAILED', 'DELETE_FAILED', 'UPDATE_FAILED']
    print(f"Runtime status: {status}")
    while status not in end_status:
        time.sleep(10)
        status_response = agentcore_runtime.status()
        status = status_response.endpoint['status']
        print(f"Runtime status: {status}")


def build_runtime_policy() -> dict:
    """Build permissions required by agent.py at runtime."""
    return {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "ReadSentientHomeSecrets",
                "Effect": "Allow",
                "Action": "secretsmanager:GetSecretValue",
                "Resource": f"arn:aws:secretsmanager:{SECRET_REGION}:*:secret:*",
            },
            {
                "Sid": "InvokeBedrockModel",
                "Effect": "Allow",
                "Action": [
                    "bedrock:InvokeModel",
                    "bedrock:InvokeModelWithResponseStream",
                    "bedrock:Converse",
                    "bedrock:ConverseStream",
                ],
                "Resource": f"arn:aws:bedrock:{BEDROCK_REGION}::foundation-model/*",
            },
        ]
    }


def add_runtime_policy(role_name: str):
    """Add Sentient Home runtime permissions to the execution role."""
    iam = boto3.client('iam', region_name=AWS_REGION)
    
    try:
        iam.put_role_policy(
            RoleName=role_name,
            PolicyName='SentientHomeRuntimeAccess',
            PolicyDocument=json.dumps(build_runtime_policy())
        )
        print(f"Added Sentient Home runtime policy to role: {role_name}")
    except Exception as e:
        print(f"Failed to add runtime policy: {e}")


def deploy_agentcore(
    agent_name: str,
    entry_point: str,
    requirements_file: str = 'requirements.txt',
    local_build: bool = False,
    deployment_type: str = DEFAULT_DEPLOYMENT_TYPE,
    runtime_type: str = DEFAULT_RUNTIME_TYPE,
):
    """Configure and launch the AgentCore runtime."""
    entry_path = Path(entry_point)
    requirements_path = Path(requirements_file)

    if not re.fullmatch(r"[A-Za-z][A-Za-z0-9_]{0,47}", agent_name):
        raise ValueError(
            "Invalid agent name. Use 1-48 characters, start with a letter, "
            "and use only letters, numbers, and underscores. Example: sentient_home_assistant"
        )
    if not entry_path.exists():
        raise FileNotFoundError(f"Entry point not found: {entry_point}")
    if not requirements_path.exists():
        raise FileNotFoundError(f"Requirements file not found: {requirements_file}")

    print(f"Deploying AgentCore runtime '{agent_name}'")
    print(f"AgentCore region: {AWS_REGION}")
    print(f"Secrets region: {SECRET_REGION}")
    print(f"Bedrock model region: {BEDROCK_REGION}")
    print(f"Entry point: {entry_point}")
    print(f"Requirements: {requirements_file}")
    print(f"Deployment type: {deployment_type}")
    if deployment_type == 'direct_code_deploy':
        print(f"Runtime type: {runtime_type}")

    agentcore_runtime.configure(
        entrypoint=entry_point,
        auto_create_execution_role=True,
        auto_create_ecr=(deployment_type == 'container'),
        auto_create_s3=(deployment_type == 'direct_code_deploy'),
        requirements_file=requirements_file,
        region=AWS_REGION,
        agent_name=agent_name,
        deployment_type=deployment_type,
        runtime_type=runtime_type if deployment_type == 'direct_code_deploy' else None,
    )
    launch_result = agentcore_runtime.launch(
        local_build=local_build,
        env_vars={
            'AWS_REGION': AWS_REGION,
            'AWS_SECRET_REGION': SECRET_REGION,
            'BEDROCK_REGION': BEDROCK_REGION,
        },
    )
    
    # Add permissions needed by agent.py after the toolkit creates the role.
    try:
        status_response = agentcore_runtime.status()
        role_arn = status_response.agent.get('roleArn', '')
        print(f"Role ARN from status: {role_arn}")
        
        role_name = role_arn.split('/')[-1] if role_arn else None
        print(f"Extracted role name: {role_name}")
        
        if role_name:
            add_runtime_policy(role_name)
        else:
            print("Could not determine role name from runtime status")
    except Exception as e:
        print(f"Could not add runtime policy: {e}")
    
    return launch_result, agentcore_runtime


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Deploy the Sentient Home AgentCore runtime')
    parser.add_argument('--agent_name', type=str, default=DEFAULT_AGENT_NAME, help='Name of the AgentCore runtime')
    parser.add_argument('--entry_point', type=str, default=DEFAULT_ENTRY_POINT, help='Entry point file for the agent')
    parser.add_argument('--requirements_file', type=str, default='requirements.txt', help='Requirements file for the runtime')
    parser.add_argument(
        '--deployment_type',
        choices=['direct_code_deploy', 'container'],
        default=DEFAULT_DEPLOYMENT_TYPE,
        help='Use direct code deploy to avoid Docker/ECR/CodeBuild, or container for image-based deploys',
    )
    parser.add_argument(
        '--runtime_type',
        type=str,
        default=DEFAULT_RUNTIME_TYPE,
        help='Python runtime for direct code deploy, for example PYTHON_3_12',
    )
    parser.add_argument('--local_build', action='store_true', help='Use local build (only for arm64 platforms)')
    args = parser.parse_args()

    deploy_agentcore(
        agent_name=args.agent_name,
        entry_point=args.entry_point,
        requirements_file=args.requirements_file,
        local_build=args.local_build,
        deployment_type=args.deployment_type,
        runtime_type=args.runtime_type,
    )
    wait_for_status()
