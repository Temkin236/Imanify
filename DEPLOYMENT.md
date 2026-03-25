# 🚀 Deployment Guide

Complete guide for deploying Imanify to production environments.

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Docker Deployment](#docker-deployment)
3. [Cloud Platforms](#cloud-platforms)
4. [Docker Compose](#docker-compose-production)
5. [Environment Configuration](#environment-configuration)
6. [Monitoring](#monitoring)
7. [Troubleshooting](#troubleshooting)
8. [Rollback](#rollback)

## ✅ Pre-Deployment Checklist

Before deploying to production:

- [ ] All tests passing (`npm test`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No ESLint issues (`npm run lint`)
- [ ] Dependencies updated and secure (`npm audit`)
- [ ] Environment variables configured
- [ ] Database backups created (if applicable)
- [ ] Git tags created for release
- [ ] Documentation updated
- [ ] API endpoints tested
- [ ] Performance tested and optimized

## 🐳 Docker Deployment

### 1. Building Docker Images

#### Backend Image

```bash
# Build backend image
cd backend
docker build -t imanify-backend:latest .

# Tag for registry
docker tag imanify-backend:latest myregistry/imanify-backend:latest

# Push to registry
docker push myregistry/imanify-backend:latest
```

#### Frontend Image

```bash
# Build frontend image
cd frontend
docker build -t imanify-frontend:latest .

# Tag for registry
docker tag imanify-frontend:latest myregistry/imanify-frontend:latest

# Push to registry
docker push myregistry/imanify-frontend:latest
```

### 2. Running Docker Containers

#### Backend

```bash
docker run -d \
  --name imanify-backend \
  -p 5000:5000 \
  -e NODE_ENV=production \
  -e LOG_LEVEL=warn \
  -e PORT=5000 \
  -v /var/log/imanify:/app/logs \
  --restart unless-stopped \
  --health-cmd="curl -f http://localhost:5000/health || exit 1" \
  --health-interval=30s \
  --health-timeout=10s \
  --health-retries=3 \
  myregistry/imanify-backend:latest
```

#### Frontend

```bash
docker run -d \
  --name imanify-frontend \
  -p 80:80 \
  --restart unless-stopped \
  myregistry/imanify-frontend:latest
```

### 3. Network Setup

```bash
# Create shared network
docker network create imanify-prod

# Run containers on network
docker run -d \
  --name imanify-backend \
  --network imanify-prod \
  -p 5000:5000 \
  myregistry/imanify-backend:latest

docker run -d \
  --name imanify-frontend \
  --network imanify-prod \
  -p 80:80 \
  myregistry/imanify-frontend:latest
```

## ⛅ Cloud Platforms

### AWS ECS/Fargate

#### 1. Push to ECR

```bash
# Create ECR repositories
aws ecr create-repository --repository-name imanify-backend
aws ecr create-repository --repository-name imanify-frontend

# Get login token
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Tag and push
docker tag imanify-backend:latest \
  <account-id>.dkr.ecr.us-east-1.amazonaws.com/imanify-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/imanify-backend:latest
```

#### 2. Create ECS Task Definition

```json
{
  "family": "imanify-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "imanify-backend",
      "image": "your-account-id.dkr.ecr.region.amazonaws.com/imanify-backend:latest",
      "portMappings": [
        {
          "containerPort": 5000,
          "hostPort": 5000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "LOG_LEVEL",
          "value": "warn"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/imanify-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:5000/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3
      }
    }
  ]
}
```

#### 3. Create ECS Service

```bash
aws ecs create-service \
  --cluster imanify-prod \
  --service-name imanify-backend-service \
  --task-definition imanify-backend \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx]}
```

### Heroku

```bash
# Login to Heroku
heroku login

# Create apps
heroku create imanify-backend
heroku create imanify-frontend

# Set environment variables
heroku config:set NODE_ENV=production PORT=5000 -a imanify-backend

# Deploy
git push heroku main
```

### DigitalOcean App Platform

1. Connect GitHub repository
2. Configure build and run commands
3. Set environment variables
4. Deploy

### Google Cloud Run

```bash
# Build and push
gcloud builds submit --tag gcr.io/PROJECT_ID/imanify-backend ./backend

# Deploy
gcloud run deploy imanify-backend \
  --image gcr.io/PROJECT_ID/imanify-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## 🐳 Docker Compose Production

```bash
# Create production environment file
cat > .env.prod << EOF
NODE_ENV=production
LOG_LEVEL=warn
PORT=5000
CORS_ORIGIN=https://imanify.app
EOF

# Start services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f backend

# Update services
docker-compose down
docker pull myregistry/imanify-backend:latest
docker-compose up -d
```

### Production docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    image: myregistry/imanify-backend:latest
    container_name: imanify-backend-prod
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - LOG_LEVEL=warn
      - CORS_ORIGIN=https://imanify.app
    volumes:
      - ./logs:/app/logs
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    image: myregistry/imanify-frontend:latest
    container_name: imanify-frontend-prod
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: always

  nginx:
    image: nginx:alpine
    container_name: imanify-nginx
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
    depends_on:
      - frontend
    restart: always
```

## 🔐 Environment Configuration

### Production .env

```env
# Server
NODE_ENV=production
PORT=5000
LOG_LEVEL=warn

# CORS
CORS_ORIGIN=https://imanify.app,https://www.imanify.app

# API
ALQURAN_API_TIMEOUT=5000
API_CACHE_TTL_HOURS=24

# Security
SECURE_COOKIES=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_FILE_PATH=/var/log/imanify/server.log

# Database (if needed)
DB_HOST=prod-db.example.com
DB_PORT=5432
DB_NAME=imanify_prod
DB_USER=imanify_user
DB_PASSWORD=secure_password

# Gemini API
GEMINI_API_KEY=your_production_key
```

## 📊 Monitoring

### Health Checks

```bash
# Check backend
curl https://api.imanify.app/health

# Check frontend
curl https://imanify.app/health
```

### Logging Setup

```bash
# System logging
journalctl -u docker -f

# Container logs
docker logs -f imanify-backend --tail=100

# Application logs
tail -f /var/log/imanify/server.log
```

### Monitoring Tools

- **Prometheus**: Metrics collection
- **Grafana**: Visualization
- **ELK Stack**: Log management
- **New Relic**: APM
- **DataDog**: Monitoring

### Docker Stats

```bash
# Monitor resource usage
docker stats imanify-backend imanify-frontend
```

## 🆘 Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs imanify-backend

# Inspect configuration
docker inspect imanify-backend

# Verify image
docker images | grep imanify
```

### Port Already in Use

```bash
# Find process
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Memory Issues

```bash
# Set memory limits
docker run -m 1g imanify-backend:latest

# Monitor usage
docker stats imanify-backend
```

### Network Issues

```bash
# Check container connectivity
docker exec imanify-backend curl http://localhost:5000/health

# Test network
docker network inspect imanify-prod
```

## 🔄 Rollback

### Docker Rollback

```bash
# Stop current version
docker-compose down

# Start previous version
docker run -d \
  --name imanify-backend \
  -p 5000:5000 \
  myregistry/imanify-backend:v1.0.0

# Verify
curl http://localhost:5000/health
```

### Database Rollback

```bash
# Restore backup
pg_restore -U imanify_user -d imanify_prod backup.sql
```

## ✅ Post-Deployment

1. **Verify Services**
   ```bash
   curl https://imanify.app
   curl https://api.imanify.app/health
   ```

2. **Test Functionality**
   - Access frontend
   - Test API endpoints
   - Verify authentication
   - Check error handling

3. **Monitor**
   - Watch logs
   - Monitor resources
   - Track performance
   - Set up alerts

4. **Document**
   - Update runbooks
   - Record versions
   - Note configuration
   - Document issues

## 🔒 Security Notes

- Use HTTPS/TLS in production
- Secure API keys and credentials
- Enable authentication
- Implement rate limiting
- Set up firewall rules
- Regular security updates
- Monitor for vulnerabilities

## 📞 Support

For deployment issues:
1. Check logs
2. Verify environment variables
3. Test connectivity
4. Review configuration
5. Contact support

---

<div align="center">

**Happy Deploying! 🚀**

</div>
