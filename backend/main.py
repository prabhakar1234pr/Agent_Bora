from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="Agent Bora API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "message": "FastAPI backend is running"}


@app.get("/api/prototype-summary")
def prototype_summary() -> dict[str, object]:
    return {
        "project": "Agent Bora",
        "stack": {
            "frontend": "Next.js",
            "backend": "FastAPI",
        },
        "pages": ["landing", "dashboard", "agents", "meetings", "actions"],
    }
