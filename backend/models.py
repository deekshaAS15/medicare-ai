from sqlalchemy import ( Column, Integer, String, Text, Date, Time, ForeignKey,DateTime,)
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)

    appointments = relationship(
        "Appointment",
        back_populates="user"
    )


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    specialization = Column(String(100), nullable=False)
    department = Column(String(100), nullable=False)
    experience = Column(Integer, nullable=False)
    rating = Column(String(10), nullable=True)
    availability = Column(String(100), nullable=True)
    consultation_fee = Column(Integer,nullable=True)
    consultation_hours = Column(String(100),nullable=True)
    available_days = Column(String(200),nullable=True)
    image = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)

    appointments = relationship(
        "Appointment",
        back_populates="doctor"
    )

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    doctor_id = Column(
        Integer,
        ForeignKey("doctors.id"),
        nullable=False
    )

    appointment_date = Column(Date, nullable=False)
    appointment_time = Column(Time, nullable=False)

    reason = Column(Text, nullable=True)

    status = Column(
        String(30),
        default="Pending"
    )

    user = relationship(
        "User",
        back_populates="appointments"
    )

    doctor = relationship(
        "Doctor",
        back_populates="appointments"
    )

class Admin(Base):
    __tablename__ = "admins"
    id = Column(Integer,primary_key=True,index=True)
    name = Column(String(100),nullable=False)
    email = Column(String(150),unique=True,nullable=False,index=True)
    password = Column(String(255),nullable=False)

class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    token_hash = Column(String(64), unique=True, nullable=False, index=True)

    expires_at = Column(DateTime(timezone=True), nullable=False)

    used = Column(Integer, default=0, nullable=False)

    user = relationship("User")