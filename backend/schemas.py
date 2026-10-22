from pydantic import BaseModel, EmailStr
from datetime import date,time


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str | None = None


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str | None = None

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class AppointmentCreate(BaseModel):
    doctor_id: int
    appointment_date: date
    appointment_time: time
    reason: str | None = None

class AppointmentResponse(BaseModel):
    id: int
    user_id: int
    doctor_id: int
    appointment_date: date
    appointment_time: time 
    reason: str | None = None
    status: str

    class Config:
        from_attributes = True

class DoctorResponse(BaseModel):
    id: int
    name: str
    specialization: str
    department: str
    experience: int
    rating: str | None = None
    availability: str | None = None
    consultation_fee: int | None = None
    consultation_hours: str | None = None
    available_days: str | None = None
    image: str | None = None
    description: str | None = None

    class Config:
        from_attributes = True

class AdminCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class DoctorCreate(BaseModel):
    name: str
    specialization: str
    department: str
    experience: int
    rating: str | None = None
    availability: str | None = None
    consultation_fee: int | None = None
    consultation_hours: str | None = None
    available_days: str | None = None
    image: str | None = None
    description: str | None = None


class DoctorUpdate(BaseModel):
    name: str | None = None
    specialization: str | None = None
    department: str | None = None
    experience: int | None = None
    rating: str | None = None
    availability: str | None = None
    consultation_fee: int | None = None
    consultation_hours: str | None = None
    available_days: str | None = None
    image: str | None = None
    description: str | None = None