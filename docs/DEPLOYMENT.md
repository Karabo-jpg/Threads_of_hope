# Threads of Hope - Deployment Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Local Development](#local-development)
5. [Docker Deployment](#docker-deployment)
6. [AWS Deployment](#aws-deployment)
7. [Production Checklist](#production-checklist)
8. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

### Required Software

- Node.js >= 18.x
- PostgreSQL >= 14.x
- Docker & Docker Compose (for containerized deployment)
- AWS CLI (for AWS deployment)
- Git

### Third-Party Services

- SendGrid account (for email notifications)
- Twilio account (for SMS notifications)
- AWS account (for production deployment)

---

## Environment Setup

### Backend Environment Variables

Create `backend/.env` file:

```bash
# Server
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=postgresql://user:password@host:5432/database
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=threads_of_hope
DB_USER=your-db-user
DB_PASSWORD=your-db-password

# JWT
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=30d

# SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@threadsofhope.org
SENDGRID_FROM_NAME=Threads of Hope

# Twilio
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# AWS
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=threads-of-hope-uploads

# Frontend URL
FRONTEND_URL=https://your-domain.com
```

### Frontend Environment Variables

Create `frontend/.env`:

```bash
REACT_APP_API_URL=https://api.your-domain.com/api
REACT_APP_SOCKET_URL=https://api.your-domain.com
```

---

## Database Setup

### Create Database

```bash
# Using psql
createdb threads_of_hope

# Or using SQL
psql -U postgres -c "CREATE DATABASE threads_of_hope;"
```

### Run Migrations

```bash
cd backend
npm install
npm run migrate
```

### Seed Initial Data (Optional)

```bash
npm run seed
```

Or use the setup script:

```bash
chmod +x scripts/setup-database.sh
./scripts/setup-database.sh
```

---

## Local Development

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend will run on http://localhost:5000

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend will run on http://localhost:3000

---

## Docker Deployment

### Using Docker Compose

1. **Build and start containers:**

```bash
docker-compose up -d
```

2. **View logs:**

```bash
docker-compose logs -f
```

3. **Stop containers:**

```bash
docker-compose down
```

### Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
    ports:
      - "5000:5000"
    depends_on:
      - postgres
    restart: always

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: always

volumes:
  postgres_data:
```

Run with:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## AWS Deployment

### Option 1: EC2 Deployment

#### 1. Launch EC2 Instance

- **Instance Type:** t2.medium or larger
- **AMI:** Amazon Linux 2
- **Security Groups:**
  - Port 22 (SSH)
  - Port 80 (HTTP)
  - Port 443 (HTTPS)
  - Port 5000 (API)

#### 2. Install Dependencies

```bash
# Connect to EC2
ssh -i your-key.pem ec2-user@your-ec2-ip

# Update system
sudo yum update -y

# Install Docker
sudo yum install docker -y
sudo service docker start
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 3. Deploy Application

```bash
# Clone repository
git clone https://github.com/yourusername/threads-of-hope.git
cd threads-of-hope

# Create .env files
nano backend/.env
nano frontend/.env

# Deploy with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

#### 4. Automated Deployment Script

```bash
chmod +x scripts/deploy-aws.sh
./scripts/deploy-aws.sh
```

### Option 2: AWS Elastic Beanstalk

1. **Install EB CLI:**

```bash
pip install awsebcli
```

2. **Initialize Application:**

```bash
eb init -p docker threads-of-hope
```

3. **Create Environment:**

```bash
eb create threads-of-hope-prod
```

4. **Deploy:**

```bash
eb deploy
```

### Option 3: AWS ECS (Elastic Container Service)

Use the provided CloudFormation template or Terraform scripts in `/infrastructure` directory.

---

## Production Checklist

### Security

- [ ] Change all default passwords and secrets
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure firewall rules
- [ ] Enable 2FA for admin accounts
- [ ] Set up rate limiting
- [ ] Configure CORS properly
- [ ] Enable database encryption
- [ ] Set up VPC and security groups
- [ ] Regular security audits

### Performance

- [ ] Enable Redis caching
- [ ] Configure CDN for static assets
- [ ] Set up database connection pooling
- [ ] Enable GZIP compression
- [ ] Optimize database queries
- [ ] Configure auto-scaling
- [ ] Load balancing setup

### Monitoring

- [ ] Set up CloudWatch (AWS) or equivalent
- [ ] Configure error tracking (Sentry)
- [ ] Enable application logging
- [ ] Set up uptime monitoring
- [ ] Configure alerts and notifications
- [ ] Database backup automation
- [ ] Log aggregation setup

### Backups

- [ ] Daily automated database backups
- [ ] Backup file uploads to S3
- [ ] Test backup restoration
- [ ] Off-site backup storage
- [ ] Backup retention policy

---

## Monitoring & Maintenance

### Health Checks

Check application health:

```bash
curl http://your-domain.com/health
curl http://your-domain.com/api
```

### View Logs

```bash
# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend

# System logs
tail -f /var/log/threads-of-hope/app.log
```

### Database Backup

```bash
# Manual backup
pg_dump -U postgres threads_of_hope > backup_$(date +%Y%m%d).sql

# Automated backup (cron)
0 2 * * * /usr/bin/pg_dump -U postgres threads_of_hope > /backups/db_$(date +\%Y\%m\%d).sql
```

### Database Restore

```bash
psql -U postgres threads_of_hope < backup_20240115.sql
```

### Update Application

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# Run migrations if needed
docker-compose exec backend npm run migrate
```

---

## SSL/HTTPS Setup

### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo yum install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
    }

    location /api {
        proxy_pass http://localhost:5000;
    }
}
```

---

## Troubleshooting

### Common Issues

**Database Connection Failed:**
```bash
# Check PostgreSQL is running
sudo service postgresql status

# Check connection string in .env
echo $DATABASE_URL
```

**Port Already in Use:**
```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>
```

**Docker Issues:**
```bash
# Clean up Docker
docker system prune -a

# Restart Docker service
sudo service docker restart
```

---

## Support

For deployment issues, contact:
- Email: devops@threadsofhope.org
- Slack: #deployment-support
- Documentation: https://docs.threadsofhope.org


