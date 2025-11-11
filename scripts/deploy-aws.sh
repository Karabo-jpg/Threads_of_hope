#!/bin/bash

# Threads of Hope - AWS Deployment Script
# This script deploys the application to AWS using Docker and EC2

set -e

echo "🚀 Starting Threads of Hope AWS Deployment..."

# Configuration
APP_NAME="threads-of-hope"
AWS_REGION="${AWS_REGION:-us-east-1}"
ECR_REPO_NAME="${APP_NAME}"
EC2_INSTANCE_TAG="Name=threads-of-hope-prod"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Building Docker images...${NC}"
docker-compose -f docker-compose.prod.yml build

echo -e "${BLUE}Step 2: Tagging images for ECR...${NC}"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_URL="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

docker tag ${APP_NAME}-backend:latest ${ECR_URL}/${APP_NAME}-backend:latest
docker tag ${APP_NAME}-frontend:latest ${ECR_URL}/${APP_NAME}-frontend:latest

echo -e "${BLUE}Step 3: Logging into ECR...${NC}"
aws ecr get-login-password --region ${AWS_REGION} | \
  docker login --username AWS --password-stdin ${ECR_URL}

echo -e "${BLUE}Step 4: Creating ECR repositories if they don't exist...${NC}"
aws ecr create-repository --repository-name ${APP_NAME}-backend --region ${AWS_REGION} || true
aws ecr create-repository --repository-name ${APP_NAME}-frontend --region ${AWS_REGION} || true

echo -e "${BLUE}Step 5: Pushing images to ECR...${NC}"
docker push ${ECR_URL}/${APP_NAME}-backend:latest
docker push ${ECR_URL}/${APP_NAME}-frontend:latest

echo -e "${BLUE}Step 6: Deploying to EC2...${NC}"
# Get EC2 instance IP
EC2_IP=$(aws ec2 describe-instances \
  --filters "Name=tag:${EC2_INSTANCE_TAG},Values=*" \
  --query 'Reservations[0].Instances[0].PublicIpAddress' \
  --output text \
  --region ${AWS_REGION})

if [ "$EC2_IP" == "None" ] || [ -z "$EC2_IP" ]; then
  echo "Error: No EC2 instance found with tag ${EC2_INSTANCE_TAG}"
  exit 1
fi

echo "Deploying to EC2 instance: ${EC2_IP}"

# SSH into EC2 and deploy
ssh -o StrictHostKeyChecking=no ec2-user@${EC2_IP} << EOF
  aws ecr get-login-password --region ${AWS_REGION} | \
    docker login --username AWS --password-stdin ${ECR_URL}
  
  docker pull ${ECR_URL}/${APP_NAME}-backend:latest
  docker pull ${ECR_URL}/${APP_NAME}-frontend:latest
  
  cd /home/ec2-user/${APP_NAME}
  docker-compose -f docker-compose.prod.yml down
  docker-compose -f docker-compose.prod.yml up -d
  
  echo "✅ Deployment complete!"
EOF

echo -e "${GREEN}✅ Deployment successful!${NC}"
echo -e "Application is running at: http://${EC2_IP}"


