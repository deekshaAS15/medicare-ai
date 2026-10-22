from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Doctor
from schemas import DoctorCreate, DoctorResponse,DoctorUpdate
from routers.auth import get_current_admin


router = APIRouter(
    prefix="/doctors",
    tags=["Doctors"]
)


# Get all doctors
@router.get("/", response_model=list[DoctorResponse])
def get_doctors(
    db: Session = Depends(get_db)
):
    doctors = db.query(Doctor).all()
    return doctors


# Admin creates a doctor
@router.post("/", response_model=DoctorResponse)
def create_doctor(
    doctor_data: DoctorCreate,
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    doctor = Doctor(
        name=doctor_data.name,
        specialization=doctor_data.specialization,
        department=doctor_data.department,
        experience=doctor_data.experience,
        rating=doctor_data.rating,
        availability=doctor_data.availability,
        consultation_fee=doctor_data.consultation_fee,
        consultation_hours=doctor_data.consultation_hours,
        available_days=doctor_data.available_days,
        image=doctor_data.image,
        description=doctor_data.description,
    )

    db.add(doctor)
    db.commit()
    db.refresh(doctor)

    return doctor

# Admin updates a doctor
@router.put("/{doctor_id}", response_model=DoctorResponse)
def update_doctor(
    doctor_id: int,
    doctor_data: DoctorUpdate,
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    doctor = (
        db.query(Doctor)
        .filter(Doctor.id == doctor_id)
        .first()
    )

    if not doctor:
        raise HTTPException(
            status_code=404,
            detail="Doctor not found"
        )

    update_data = doctor_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(doctor, field, value)

    db.commit()
    db.refresh(doctor)

    return doctor


# Admin deletes a doctor
@router.delete("/{doctor_id}")
def delete_doctor(
    doctor_id: int,
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    doctor = (
        db.query(Doctor)
        .filter(Doctor.id == doctor_id)
        .first()
    )

    if not doctor:
        raise HTTPException(
            status_code=404,
            detail="Doctor not found"
        )

    db.delete(doctor)
    db.commit()

    return {
        "message": "Doctor deleted successfully"
    }