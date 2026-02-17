# UniVoice

This folder contains the UniVoice backend service.

It was moved from `/UniVoice` to `/backend/UniVoice` so the frontend can remain at the repository root.

## Run locally

```bash
cd backend/UniVoice
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

## Docker

```bash
cd backend/UniVoice
docker compose up --build
```
