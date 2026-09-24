import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apps.api.core.config import settings
from apps.api.core.database import init_db
from apps.api.api.v1.router import api_router
from apps.api.adapters import get_conduit_adapter

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("aquaguard.api")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing AQUA//GUARD database & conduit connector...")
    await init_db()
    # Eagerly initialize the adapter
    adapter = get_conduit_adapter()
    stations = await adapter.get_stations()
    logger.info(f"AQUA//GUARD ready with {len(stations)} stations loaded in {settings.AQUAGUARD_MODE} mode.")
    yield
    logger.info("AQUA//GUARD shutting down.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Climate Risk Intelligence, Digital Twin & Action Platform for Hack The Weather 2026",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_PREFIX)

@app.get("/health")
async def health_check():
    return {
        "status": "HEALTHY",
        "service": "aquaguard-api",
        "mode": settings.AQUAGUARD_MODE,
        "conduit_connected": True
    }

@app.get("/ready")
async def readiness_check():
    return {"status": "READY"}

@app.get("/")
async def root():
    return {
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "api_v1": settings.API_V1_PREFIX,
        "mode": settings.AQUAGUARD_MODE
    }
