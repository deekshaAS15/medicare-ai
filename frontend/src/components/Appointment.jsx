import { useState } from "react";
import axios from "axios";
import {
  CalendarDays,
  UserRound,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

function Appointment({ doctor, onBack }) {
  const [formData, setFormData] = useState({
    doctor_id: doctor?.id || "",
    appointment_date: "",
    appointment_time: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("Please login before booking an appointment.");
        return;
      }

      await axios.post(
        `${import.meta.env.VITE_API_URL}/appointments/`,
        {
        doctor_id:doctor?.id,
        appointment_date:formData.appointment_date,
        appointment_time:convertTimeTo24Hour(formData.appointment_time),
        reason:formData.reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(true);

      setFormData({
        doctor_id: doctor?.id || "",
        appointment_date: "",
        appointment_time: "",
        reason: "",
      });
    } catch (err) {
  console.error("Booking error:", err);

  if (err.response?.status === 401) {
    setError("Your session has expired. Please login again.");
  } else {
    const detail = err.response?.data?.detail;

    if (Array.isArray(detail)) {
      const message = detail
        .map((item) => item.msg)
        .join(", ");

      setError(message || "Invalid appointment details.");
    } else if (typeof detail === "string") {
      setError(detail);
    } else {
      setError("Unable to book appointment. Please try again.");
    }
  }
} finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const isDoctorAvailableDate = (dateString) => {
  if (!dateString || !doctor?.available_days) {
    return true;
  }

  const selectedDate = new Date(`${dateString}T00:00:00`);

  const dayName = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const availableDays = doctor.available_days
    .split(",")
    .map((day) => day.trim());

  return availableDays.includes(dayName);
};

const generateTimeSlots = (hours) => {
  if (!hours) return [];

  const [startText, endText] = hours.split("-").map((item) => item.trim());

  const convertToMinutes = (time) => {
    const [value, modifier] = time.split(" ");
    let [hour, minute] = value.split(":").map(Number);

    if (modifier === "PM" && hour !== 12) {
      hour += 12;
    }

    if (modifier === "AM" && hour === 12) {
      hour = 0;
    }

    return hour * 60 + minute;
  };

  const convertToTime = (minutes) => {
    let hour = Math.floor(minutes / 60);
    const minute = minutes % 60;

    const modifier = hour >= 12 ? "PM" : "AM";

    if (hour > 12) {
      hour -= 12;
    }

    if (hour === 0) {
      hour = 12;
    }

    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(
      2,
      "0"
    )} ${modifier}`;
  };

  const start = convertToMinutes(startText);
  const end = convertToMinutes(endText);

  const slots = [];

  for (let time = start; time < end; time += 30) {
    slots.push(convertToTime(time));
  }

  return slots;
};

const timeSlots = generateTimeSlots(doctor?.consultation_hours);

const convertTimeTo24Hour = (time12) => {
  if (!time12) return "";

  const [time, modifier] = time12.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  }

  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
};
  return (
    <section className="min-h-screen bg-slate-50 pt-28 pb-16">
      <div className="max-w-3xl mx-auto px-6">

        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-6 transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">

          {/* Header */}
          <div className="bg-linear-to-r from-blue-600 to-cyan-500 p-8 text-white">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                <CalendarDays size={28} />
              </div>

              <div>
                <h1 className="text-3xl font-bold">
                  Book an Appointment
                </h1>

                <p className="text-blue-100 mt-1">
                  Schedule your visit with our specialist
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">

            {/* Selected Doctor */}
            {doctor && (
              <div className="flex items-center gap-4 bg-blue-50 rounded-2xl p-4 mb-7">
                {doctor.image ? (
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                    <UserRound size={28} />
                  </div>
                )}

                <div>
                  <p className="text-sm text-blue-600 font-medium">
                    Selected Doctor
                  </p>

                  <h2 className="text-lg font-bold text-slate-900">
                    {doctor.name}
                  </h2>

                  <p className="text-sm text-slate-500">
                    {doctor.specialization}
                  </p>

                  {doctor?.consultation_fee && (<p className="font-semibold text-green-600">
                    Consultation Fee: ₹ {doctor.consultation_fee}
                    </p>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Doctor ID */}
              {!doctor && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Doctor ID
                  </label>

                  <input
                    type="number"
                    name="doctor_id"
                    value={formData.doctor_id}
                    onChange={handleChange}
                    required
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter doctor ID"
                  />
                </div>
              )}

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Appointment Date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={19}
                    className="absolute left-4 top-3.5 text-slate-400"
                  />

                 <input
                  type="date"
                  min={today}
                  value={formData.appointment_date}
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    if (!isDoctorAvailableDate(selectedDate)) {
                      alert(
                        `${doctor.name} is available only on ${doctor.available_days}.`
                      );
                    return;
                  }
                  setFormData({
                    ...formData,
                    appointment_date: selectedDate,
                  });
                }}
               className="w-full rounded-xl border border-slate-200 px-11 py-3 outline-none transition
                focus:border-blue-500 focus:ring-4 focus:ring-blue-50"/>
                <p className="mt-2 text-sm text-slate-500">
                  Available days:{" "}
                  <span className="font-semibold text-blue-600">
                    {doctor?.available_days}
                    </span>
                    </p>
                </div>
              </div>

              {/* Time */}
             <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Appointment Time
              </label>

              <select
                value={formData.appointment_time}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    appointment_time: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              >
              <option value="" disabled>Select a time</option>

              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>

              <p className="mt-2 text-sm text-slate-500">
                Consultation hours:{" "}
                <span className="font-semibold text-blue-600">
                  {doctor?.consultation_hours}
                </span>
              </p>
            </div>

            {/* Reason */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Reason / Symptoms
                </label>

                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Briefly describe your symptoms or reason for the visit..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 text-red-600 rounded-xl p-4 text-sm">
                  {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="bg-green-50 text-green-700 rounded-xl p-5 flex items-center gap-3">
                  <CheckCircle size={24} />
                  <div>
                    <p className="font-bold">
                      Appointment booked successfully!
                    </p>
                    <p className="text-sm">
                      Your appointment has been saved.
                    </p>
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-200"
              >
                {loading ? "Booking Appointment..." : "Confirm Appointment"}
              </button>

            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Appointment;