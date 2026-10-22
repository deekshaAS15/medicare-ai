from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Appointment, Doctor, User
from schemas import AppointmentCreate, AppointmentResponse
from routers.auth import get_current_user, get_current_admin


router = APIRouter(
    prefix="/appointments",
    tags=["Appointments"]
)

@router.post("/", response_model=AppointmentResponse)
def create_appointment(
    appointment_data: AppointmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doctor = db.query(Doctor).filter(
        Doctor.id == appointment_data.doctor_id
    ).first()

    if not doctor:
        raise HTTPException(
            status_code=404,
            detail="Doctor not found"
        )

    new_appointment = Appointment(
        user_id=current_user.id,
        doctor_id=appointment_data.doctor_id,
        appointment_date=appointment_data.appointment_date,
        appointment_time=appointment_data.appointment_time,
        reason=appointment_data.reason,
        status="Pending"
    )

    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)

    return new_appointment

@router.get("/my")
def get_my_appointments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    appointments = (
        db.query(Appointment)
        .filter(Appointment.user_id == current_user.id)
        .order_by(Appointment.appointment_date.asc())
        .all()
    )

    result = []

    for appointment in appointments:
        doctor = (
            db.query(Doctor)
            .filter(Doctor.id == appointment.doctor_id)
            .first()
        )

        result.append({
            "id": appointment.id,
            "doctor_id": appointment.doctor_id,
            "doctor_name": doctor.name if doctor else "Unknown Doctor",
            "specialization": (
                doctor.specialization
                if doctor
                else "Unknown"
            ),
            "doctor_image": (
                doctor.image
                if doctor
                else None
            ),
            "appointment_date": str(
                appointment.appointment_date
            ),
            "appointment_time": str(
                appointment.appointment_time
            ),
            "reason": appointment.reason,
            "status": appointment.status,
        })

    return result

@router.delete("/{appointment_id}")
def cancel_appointment(
    appointment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    appointment = (
        db.query(Appointment)
        .filter(
            Appointment.id == appointment_id,
            Appointment.user_id == current_user.id
        )
        .first()
    )

    if not appointment:
        raise HTTPException(
            status_code=404,
            detail="Appointment not found"
        )

    db.delete(appointment)
    db.commit()

    return {
        "message": "Appointment cancelled successfully"
    }

@router.get("/admin")
def get_all_appointments(
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    appointments = (
        db.query(Appointment)
        .order_by(
            Appointment.appointment_date.asc(),
            Appointment.appointment_time.asc()
        )
        .all()
    )

    result = []

    for appointment in appointments:
        patient = (
            db.query(User)
            .filter(User.id == appointment.user_id)
            .first()
        )

        doctor = (
            db.query(Doctor)
            .filter(Doctor.id == appointment.doctor_id)
            .first()
        )

        result.append({
            "id": appointment.id,
            "patient_id": appointment.user_id,
            "patient_name": patient.name if patient else "Unknown Patient",
            "patient_email": patient.email if patient else None,
            "patient_phone": patient.phone if patient else None,
            "doctor_id": appointment.doctor_id,
            "doctor_name": doctor.name if doctor else "Unknown Doctor",
            "appointment_date": str(appointment.appointment_date),
            "appointment_time": str(appointment.appointment_time),
            "reason": appointment.reason,
            "status": appointment.status,
        })

    return result


@router.patch("/admin/{appointment_id}/status")
def update_admin_appointment_status(
    appointment_id: int,
    status: str,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    allowed_statuses = [
        "Pending",
        "Confirmed",
        "Completed",
        "Cancelled"
    ]

    if status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Invalid appointment status"
        )

    appointment = (
        db.query(Appointment)
        .filter(Appointment.id == appointment_id)
        .first()
    )

    if not appointment:
        raise HTTPException(
            status_code=404,
            detail="Appointment not found"
        )

    appointment.status = status

    db.commit()
    db.refresh(appointment)

    return {
        "message": "Appointment status updated successfully",
        "status": appointment.status
    }

@router.delete("/admin/{appointment_id}")
def delete_admin_appointment(
    appointment_id: int,
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    appointment = (
        db.query(Appointment)
        .filter(Appointment.id == appointment_id)
        .first()
    )

    if not appointment:
        raise HTTPException(
            status_code=404,
            detail="Appointment not found"
        )

    db.delete(appointment)
    db.commit()

    return {
        "message": "Appointment deleted successfully"
    }
