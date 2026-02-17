# Backend

This folder contains the backend services for UniVoice Hub.

## UniVoice

The UniVoice backend has been moved to `backend/UniVoice/`.

### Run locally

From repo root:

```bash
cd backend/UniVoice
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

### Docker

```bash
cd backend/UniVoice
docker compose up --build
```
