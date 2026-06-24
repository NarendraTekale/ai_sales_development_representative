from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError

from app.core.config import settings
from app.core.logging import setup_logging
from app.api.routes import auth, leads
from app.middleware.error_handler import (
    validation_exception_handler,
    sqlalchemy_exception_handler,
    generic_exception_handler,
)

setup_logging()

app = FastAPI(
    title="AI SDR API",
    description="Mini AI Sales Development Representative Application",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(SQLAlchemyError, sqlalchemy_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(leads.router, prefix="/api/v1")


@app.get("/health")
def health_check():
    return {"status": "healthy", "version": "1.0.0"}
