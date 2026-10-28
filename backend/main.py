from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine 
from routers.auth import router as auth_router
from routers.doctors import router as doctors_router
from routers.appointments import router as appointments_router
from routers import ai
import models

app = FastAPI(
    title="MediCare AI",
    description="AI-powered Healthcare Management System",
    version="1.0.0"
)

Base.metadata.create_all(bind=engine)
app.include_router(auth_router)
app.include_router(doctors_router)
app.include_router(appointments_router)
app.include_router(ai.router)

# React frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://deekshaas15.github.io",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message":"MediCare AI Backend is running"
    }

@app.get("/health")
def health():
    return{
        "status":"healthy"
    }

