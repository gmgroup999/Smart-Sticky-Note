# SmartStickyNote — Deployment Guide

## Server

| Item | Value |
|------|-------|
| Provider | Hetzner Dedicated (Auction #2980542) |
| Public IP | 195.201.81.33 |
| CPU / RAM | Intel i7-8700 / 64 GB RAM |
| OS | Ubuntu 24.04 LTS |
| SSH user | jack |
| SSH key | `~/.ssh/smartstickynote_deploy` |

## Domains

| Domain | Target | SSL |
|--------|--------|-----|
| `note.z-node.cc` | Nginx → port 5010 | Cloudflare Orange Cloud |

## Ports

| Port | Service | Bound to |
|------|---------|----------|
| 5010 | Next.js web | 127.0.0.1 |
| 5011 | Fastify API | 127.0.0.1 |
| 5433 | PostgreSQL (Docker) | 127.0.0.1 |

## Directory Layout

```
/opt/smartstickynote/
├── app/                    ← monorepo source
│   ├── apps/api/
│   ├── apps/web/
│   └── packages/
├── logs/                   ← PM2 stdout + stderr
├── backups/
├── scripts/
└── ecosystem.config.cjs    ← PM2 process config
```

## Environment Files

| File | Purpose |
|------|---------|
| `apps/api/.env` | API runtime (DATABASE_URL, BOARD_ID, PORT) |
| `apps/web/.env.production` | Web runtime (API_INTERNAL_URL) |
| `packages/db/.env` | Migration + seed scripts |

## PM2 Processes

| Name | Script | Port |
|------|--------|------|
| `smartstickynote-api` | `pnpm start` in `apps/api/` | 5011 |
| `smartstickynote-web` | `next start` | 5010 |

### PM2 Commands

```bash
# Status
pm2 list

# Logs (live)
pm2 logs smartstickynote-api
pm2 logs smartstickynote-web

# Restart
pm2 restart smartstickynote-api
pm2 restart smartstickynote-web

# Stop
pm2 stop smartstickynote-api

# Survive reboot (run once after first deploy)
pm2 startup systemd
pm2 save
```

## Nginx

**Config file:** `/etc/nginx/sites-available/smartstickynote`
**Symlink:** `/etc/nginx/sites-enabled/smartstickynote`

```nginx
server {
    listen 80;
    server_name note.z-node.cc;
    return 301 https://note.z-node.cc$request_uri;
}

server {
    listen 443 ssl;
    server_name note.z-node.cc;

    ssl_certificate     /etc/ssl/cloudflare/z-node.cc.pem;
    ssl_certificate_key /etc/ssl/cloudflare/z-node.cc.key;

    location /api/ {
        rewrite ^/api/(.*) /$1 break;
        proxy_pass http://127.0.0.1:5011;
    }

    location / {
        proxy_pass http://127.0.0.1:5010;
    }
}
```

### Nginx Commands

```bash
sudo nginx -t                    # test syntax
sudo systemctl reload nginx      # reload (no downtime)
sudo systemctl restart nginx     # full restart
sudo nginx -T | grep note        # verify active config
```

## SSL

**Certificate:** Cloudflare Origin Certificate
**Path:** `/etc/ssl/cloudflare/z-node.cc.pem`
**Key:** `/etc/ssl/cloudflare/z-node.cc.key`
**Covers:** `*.z-node.cc`
**Expires:** 2041

## Deploy (manual — no CI yet)

```bash
# On local machine:
cd "h:\NEO Second Brain"
tar --exclude=node_modules --exclude=.next -czf /tmp/ssnote.tar.gz .
scp -i ~/.ssh/smartstickynote_deploy /tmp/ssnote.tar.gz jack@195.201.81.33:/tmp/

# On server:
cd /opt/smartstickynote/app
tar -xzf /tmp/ssnote.tar.gz
pnpm install
pnpm --filter @neo/web build
pm2 restart smartstickynote-api smartstickynote-web
```

## Database

```
Container: smartstickynote-postgres (Docker, pgvector:pg16)
Port:      127.0.0.1:5433
Database:  smartstickynote_prod
User:      smartstickynote_app
```

### DB Commands

```bash
# Connect
docker exec -it smartstickynote-postgres psql -U smartstickynote_app -d smartstickynote_prod

# Run migrations (from /opt/smartstickynote/app)
pnpm db:migrate

# Backup
docker exec smartstickynote-postgres pg_dump -U smartstickynote_app smartstickynote_prod \
  > /opt/smartstickynote/backups/$(date +%Y%m%d_%H%M%S).sql
```

## Health Check

```bash
curl https://note.z-node.cc/api/health
# Expected: {"status":"ok","service":"SmartStickyNote","timestamp":"..."}
```

## Troubleshooting

### App not loading

```bash
pm2 list                          # check processes are online
curl http://127.0.0.1:5010        # test web direct
curl http://127.0.0.1:5011/health # test api direct
sudo nginx -T | grep 443          # check HTTPS config
```

### 502 Bad Gateway

```bash
pm2 restart smartstickynote-web
pm2 restart smartstickynote-api
```

### HTTPS shows wrong site

The `listen 443 ssl` block for `note.z-node.cc` must exist in the Nginx config. If missing, Nginx falls back to the first 443 block (another project).

```bash
sudo nginx -T | grep -A5 "server_name note.z-node.cc"
```

### Notes not saving

```bash
docker ps | grep smartstickynote-postgres  # container running?
curl http://127.0.0.1:5011/health           # API healthy?
pm2 logs smartstickynote-api --lines 50     # check for DB errors
```
