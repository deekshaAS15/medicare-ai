import { useEffect, useState } from "react";
import axios from "axios";
import {
  CalendarDays,
  Clock3,
  ArrowLeft,
  UserRound,
  ClipboardList,
} from "lucide-react";

function MyAppointments({ onBack }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.get(
        "http://127.0.0.1:8000/appointments/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppointments(response.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please login again.");
      } else {
        setError("Unable to load your appointments.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId) => {
  const confirmCancel = window.confirm(
    "Are you sure you want to cancel this appointment?"
  );

  if (!confirmCancel) {
    return;
  }

  try {
    const token = localStorage.getItem("access_token");

    await axios.delete(
      `http://127.0.0.1:8000/appointments/${appointmentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setAppointments((currentAppointments) =>
      currentAppointments.filter(
        (appointment) => appointment.id !== appointmentId
      )
    );
  } catch (err) {
    console.error("Error cancelling appointment:", err);

    alert(
      err.response?.data?.detail ||
        "Unable to cancel appointment."
    );
  }
};

const formatDate = (date) => {
  if (!date) return "";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatTime = (time) => {
  if (!time) return "";

  const [hours, minutes] = time.split(":");
  const date = new Date();

  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

  return (
    <section className="min-h-screen bg-slate-50 px-6 pb-20 pt-28">
      <div className="mx-auto max-w-5xl">

        {/* Back */}
        <button
          type="button"
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-slate-600 transition hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
            Patient Area
          </p>

          <h1 className="mt-2 text-4xl font-extrabold text-slate-900">
            My Appointments
          </h1>

          <p className="mt-3 text-slate-500">
            View and manage your upcoming healthcare appointments.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-5">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-3xl bg-white p-6 shadow-sm"
              >
                <div className="h-6 w-1/3 rounded bg-slate-200" />
                <div className="mt-4 h-4 w-1/2 rounded bg-slate-200" />
                <div className="mt-3 h-4 w-1/4 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
            <p className="font-semibold text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchAppointments}
              className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && appointments.length === 0 && (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <ClipboardList size={30} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No appointments yet
            </h2>

            <p className="mt-2 text-slate-500">
              You haven't booked any appointments yet.
            </p>
          </div>
        )}

        {/* Appointments */}
        {!loading && !error && appointments.length > 0 && (
          <div className="space-y-5">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="p-6">

                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                    {/* Doctor */}
                    <div className="flex items-center gap-4">

                      {appointment.doctor_image ? (
                        <img
                          src={appointment.doctor_image}
                          alt={appointment.doctor_name}
                          className="h-16 w-16 rounded-2xl object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                          <UserRound size={28} />
                        </div>
                      )}

                      <div>
                        <p className="text-sm font-medium text-blue-600">
                          Doctor
                        </p>

                        <h2 className="text-lg font-bold text-slate-900">
                          {appointment.doctor_name}
                        </h2>

                        <p className="text-sm text-slate-500">
                          {appointment.specialization}
                        </p>

                        <p className="text-sm text-slate-500">
                          {appointment.department}
                        </p>

                      </div>

                    </div>

                    {/* Status */}
                    <div>
                      <span
                        className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                          appointment.status === "Pending"
                            ? "bg-yellow-50 text-yellow-700"
                            : appointment.status === "Confirmed"
                            ? "bg-green-50 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                       <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                            appointment.status === "Confirmed"
                              ? "bg-green-100 text-green-700"
                              : appointment.status === "Cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </span>
                    </div>

                  </div>

                  {/* Details */}
                  <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">

                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <CalendarDays size={19} />
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">
                          Date
                        </p>

                        <p className="font-semibold text-slate-800">
                          {formatDate(appointment.appointment_date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                        <Clock3 size={19} />
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">
                          Time
                        </p>

                        <p className="font-semibold text-slate-800">
                          {formatTime(appointment.appointment_time)}
                        </p>

                        {appointment.consultation_fee && (
                          <div className="flex items-center gap-3">
                           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                                 ₹
                           </div>

                          <div>
                           <p className="text-xs text-slate-400">
                              Consultation Fee
                          </p>

                          <p className="font-semibold text-slate-800">
                            ₹{appointment.consultation_fee}
                         </p>
                       </div>
                      </div>
                    )}  
                      </div>
                    </div>

                  </div>

                  <div className="mt-5 flex justify-end">
                    <button
                      type="button"
                       onClick={()=>
                        handleCancel(appointment.id)}
                        className="rounded-xl bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 transition
                         hover:bg-red-600 hover:text-white">Cancel Appointment</button>
                  </div>

                  {/* Reason */}
                  {appointment.reason && (
                    <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Reason / Symptoms
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        {appointment.reason}
                      </p>
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

export default MyAppointments;