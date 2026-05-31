# Agent Bora - Prototype Baseline

This repo now has a basic working setup:

- `frotend`: Next.js app (port 3000)
- `backend`: FastAPI app (port 8000)

## Quick start

### 1) Backend

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2) Frontend

Open a second terminal:

```powershell
cd frotend
Copy-Item .env.local.example .env.local
npm install
npm run dev
```

Visit:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend docs: [http://localhost:8000/docs](http://localhost:8000/docs)
