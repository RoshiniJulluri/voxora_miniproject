from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routes.api import router

app = FastAPI(title='VOXORA API', version='1.0.0')
app.add_middleware(CORSMiddleware, allow_origins=[origin.strip() for origin in settings.frontend_origin.split(',')], allow_credentials=False, allow_methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], allow_headers=['Authorization', 'Content-Type'])
app.include_router(router, prefix='/api/v1')
