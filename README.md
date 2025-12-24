# AI Ops Desk — Event-Driven AI Support Desk (Monorepo)

AI Ops Desk is a production-style, **event-driven support ticketing system** designed to demonstrate modern backend + workflow patterns used by large companies.

It includes:
- **Backend API**: Express + TypeScript + Sequelize + Postgres  
- **Event streaming**: Kafka-compatible broker (Redpanda)  
- **Durable workflows**: Inngest (retries, scheduling, idempotency)  
- **AI triage**: OpenAI (summary, category, priority, entity extraction)  
- **Admin dashboard**: Next.js (internal support/ops tool)  
- **User portal**: Next.js (public ticket creation)  
- **Infra**: Docker Compose (Postgres + Redpanda + Redis)

This repo is a monorepo (npm workspaces) with separate folders for backend, admin, and frontend.

---

## Why this project is useful (Job/Interview ready)

This project showcases real-world engineering skills:
- **Event-driven architecture** (emit events, decouple services)
- **Async job/workflow orchestration** (durable retries, scheduling)
- **Idempotency** (safe reprocessing, prevents duplicates)
- **Database migrations** (production schema management)
- **Audit timelines** (ticket_events as a source of truth for history)
- **LLM integration** (structured outputs, safe prompting)
- Clean monorepo structure (backend + internal tool + public app)

If you're learning **Kafka / Inngest / AI workflows** for better job opportunities, this is a practical portfolio project.

---

## What the system does (Real-world example)

In a fintech / marketplace / SaaS product, users raise tickets like:
- “Payment succeeded but order still pending”
- “OTP not received”
- “KYC verification stuck”
- “App crashes on login”

AI Ops Desk handles this flow:

1. User raises a ticket from **frontend**
2. Backend stores the ticket in Postgres
3. Backend writes a timeline event: `ticket.created`
4. Backend emits:
   - Kafka event: `ticket.created` (topic)
   - Inngest event: `ticket/created` (workflow trigger)
5. **Inngest triage workflow** runs:
   - fetches ticket
   - calls OpenAI
   - generates: summary, category, priority, entities
   - stores result in `ticket_ai`
   - logs `ticket.classified` in `ticket_events`
6. **SLA monitor workflow** runs periodically:
   - logs `sla.warning` as deadline approaches
   - logs `sla.breached` when overdue

This mirrors how real support systems are built: **tickets + event stream + workflows + SLA**.

---

## Repository Structure



ai-ops-desk/
infra/ # docker compose (postgres, redis, redpanda/kafka)
backend/ # express + sequelize + kafka + inngest + openai
admin/ # next.js internal dashboard (support agents)
frontend/ # next.js user portal (raise tickets)
package.json # npm workspaces root
package-lock.json
README.md


---

## Architecture Overview

### High-level flow



Frontend (User) ---> Backend API ---> Postgres
|
+--> ticket_events (audit timeline)
|
+--> Kafka topic: ticket.created
|
+--> Inngest event: ticket/created ---> OpenAI
|
+--> ticket_ai (triage output)
+--> ticket_events (classified / sla)
+--> schedules SLA checks


### Key concepts used
- **Command**: user submits ticket (HTTP request)
- **Write model**: DB persists ticket state + immutable events
- **Event bus**: Kafka topic for scalable fan-out
- **Workflows**: Inngest ensures reliable async work
- **Idempotency**: `processed_events` prevents duplicates
- **Auditability**: timeline of events in `ticket_events`

---

## Tech Stack

### Backend
- Node.js + TypeScript
- Express
- Sequelize ORM
- Postgres
- Zod validation
- KafkaJS
- Inngest
- OpenAI SDK

### Infra
- Docker Compose
- Postgres 16
- Redpanda (Kafka-compatible)
- Redis (optional/future use)

### Apps
- Next.js (Admin + Frontend)
- TailwindCSS (recommended)

---

## Prerequisites

- Node.js (recommended **20+**)
- Docker Desktop
- Git

> Note: Node 23 works but may show ESM/CJS warnings from tooling; warnings are safe to ignore.

---

## Setup (Local Development)

### 1) Clone
```bash
git clone <YOUR_REPO_URL>
cd ai-ops-desk

2) Start infrastructure
docker compose -f infra/docker-compose.yml up -d


Verify:

docker ps

Environment Variables
Backend (backend/.env)

Create .env from .env.example:

cp backend/.env.example backend/.env


Fill the values in backend/.env:

PORT=4000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=opsdesk
DB_USER=ops
DB_PASS=ops

REDIS_URL=redis://localhost:6379

KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=opsdesk
KAFKA_TOPIC_TICKET_CREATED=ticket.created

INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4.1-mini


✅ Do NOT commit .env. Only commit .env.example.

Admin (admin/.env.local)
NEXT_PUBLIC_API_BASE=http://localhost:4000

Frontend (frontend/.env.local)
NEXT_PUBLIC_API_BASE=http://localhost:4000

Install Dependencies (Monorepo)

From repo root:

npm install

Database (Migrations)

This project uses Sequelize migrations.

From backend/:

npx sequelize-cli db:migrate


If you need to reset the DB (removes docker volumes):

docker compose -f infra/docker-compose.yml down -v
docker compose -f infra/docker-compose.yml up -d
cd backend
npx sequelize-cli db:migrate

Run the project
Backend

From repo root:

npm run backend


Backend URL:

http://localhost:4000

Health:

GET http://localhost:4000/health

Admin (Support dashboard)
npm run admin


http://localhost:3000

Frontend (User portal)
npm run frontend


http://localhost:3001
 (or next free port)

Inngest (Local)

Backend exposes Inngest handler at:

POST /api/inngest

Run Inngest dev server:

npx inngest-cli@latest dev -u http://localhost:4000/api/inngest


Then create a ticket from frontend or via curl to see workflows run.

Kafka / Redpanda (Local)

Redpanda runs Kafka-compatible broker on:

localhost:9092

Backend publishes events:

topic: ticket.created

Kafka makes it easy to scale later:

add separate consumers (notifications, analytics, integrations)

multiple services can react to the same event

API Endpoints

Base URL: http://localhost:4000

Create Ticket

POST /api/tickets

Request:

{
  "subject": "Payment failed",
  "description": "UPI succeeded but order still pending",
  "source": "web"
}


Example:

curl -X POST http://localhost:4000/api/tickets \
  -H "Content-Type: application/json" \
  -d '{"subject":"Payment failed","description":"UPI succeeded but order still pending","source":"web"}'

List Tickets

GET /api/tickets

curl http://localhost:4000/api/tickets

Get Ticket (with AI + events)

GET /api/tickets/:id

curl http://localhost:4000/api/tickets/1

Database Tables
tickets

Core ticket data:

subject, description, source

status, category, priority

created_at, updated_at

ticket_ai

AI output (1:1 with ticket):

summary

category

priority

entities (JSONB)

citations (JSONB) (optional)

ticket_events

Immutable audit timeline (1:many):

ticket.created

ticket.classified

sla.warning

sla.breached

processed_events

Idempotency store:

ensures workflows don’t process the same event twice

kb_docs

Knowledge base docs (future RAG support)

Workflows
Triage Workflow (triageTicket)

Triggered by: ticket/created

Does:

idempotency check (processed_events)

fetch ticket

OpenAI call for classification & summary

save ticket_ai

write ticket.classified event

schedule SLA monitoring

SLA Monitor (slaMonitor)

Triggered by: scheduled event (e.g. every 10 minutes)

Does:

checks open tickets

writes sla.warning near deadline

writes sla.breached when overdue

can reschedule itself until resolved

Example SLA policy:

P0: 15 minutes

P1: 60 minutes

P2: 6 hours

P3: 24 hours

Security Notes (Important)

Never commit .env or .env.local

Rotate OpenAI/Inngest keys if they ever leak

For production, add:

authentication + RBAC (admin roles)

rate limiting

PII redaction before AI calls

structured logging + monitoring

Troubleshooting
1) Postgres auth failed (password authentication failed)

Reset infra volumes:

docker compose -f infra/docker-compose.yml down -v
docker compose -f infra/docker-compose.yml up -d
cd backend
npx sequelize-cli db:migrate

2) Node ESM/CJS warnings

Safe to ignore. Recommended: Node 20 LTS for stable tooling.

3) Ports in use

If 5432 is already used by local Postgres:

change docker to 5433:5432

set DB_PORT=5433

Roadmap / Improvements

RAG pipeline (embeddings + vector store)

Ticket assignment, tags, comments

Integrations: Slack/Email/PagerDuty

Observability: OpenTelemetry tracing + metrics

Auth: JWT + RBAC

Better admin UI (filters, search, SLA views)

License

MIT (or update as needed)
