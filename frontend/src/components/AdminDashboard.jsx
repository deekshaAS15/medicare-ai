import { useEffect, useState } from "react";
import axios from "axios";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  HeartPulse,
  LogOut,
  Users,
  XCircle,
  Stethoscope,
  Trash2,
} from "lucide-react";
import AdminDoctors from "./AdminDoctors";

function AdminDashboard({ onLogout }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
    try {
      setError("");
      const token = localStorage.getItem("admin_access_token");

      const response = await axios.get(
        "http://127.0.0.1:8000/appointments/admin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAppointments(response.data);

    } catch (err) {
      console.error("Error loading appointments:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const isAppointmentPast = (appointment) => {
  if (!appointment.appointment_date) {
    return false;
  }

  const dateTimeString =
    `${appointment.appointment_date}T${
      appointment.appointment_time || "00:00:00"
    }`;

  const appointmentDate = new Date(dateTimeString);

  return appointmentDate < new Date();
};

  const updateStatus = async (appointmentId, status) => {
    try {
      const token = localStorage.getItem("admin_access_token");

      await axios.patch(
        `http://127.0.0.1:8000/appointments/admin/${appointmentId}/status`,
        null,
        {
          params: {
            status,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchAppointments();
    } catch (err) {
      console.error("Error updating appointment:", err);

      alert(
        err.response?.data?.detail ||
          "Unable to update appointment."
      );
    }
  };

  const pendingCount = appointments.filter(
    (appointment) => appointment.status === "Pending"
  ).length;

  const confirmedCount = appointments.filter(
    (appointment) => appointment.status === "Confirmed"
  ).length;

  const completedCount = appointments.filter(
    (appointment) => appointment.status === "Completed"
  ).length;

  const uniquePatients = new Set(
    appointments.map(
      (appointment) => appointment.patient_id
    )
  ).size;

  const deleteAppointment = async (appointmentId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this appointment?"
  );

  if (!confirmed) {
    return;
  }

  try {
    const token = localStorage.getItem(
      "admin_access_token"
    );

    await axios.delete(
      `http://127.0.0.1:8000/appointments/admin/${appointmentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchAppointments();
  } catch (err) {
    console.error("Error deleting appointment:", err);

    alert(
      err.response?.data?.detail ||
        "Unable to delete appointment."
    );
  }
};

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-100">
              <HeartPulse className="text-white" size={24} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                MediCare <span className="text-blue-600">AI</span>
              </h1>

              <p className="text-xs text-slate-400">
                Hospital Staff Dashboard
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600">
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="animate-fade-in">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Hospital Staff Portal
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Welcome, Admin 
          </h2>

          <p className="mt-3 max-w-2xl text-slate-500">
            Manage doctors and patient appointments from one
            place.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<CalendarDays size={23} />}
            title="Total Appointments"
            value={appointments.length}
          />

          <StatCard
            icon={<Clock3 size={23} />}
            title="Pending"
            value={pendingCount}
          />

          <StatCard
            icon={<CheckCircle2 size={23} />}
            title="Confirmed"
            value={confirmedCount}
          />

          <StatCard
            icon={<Users size={23} />}
            title="Patients"
            value={uniquePatients}
          />
        </div>

        <section className="mt-10 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Appointment Requests
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Confirm or cancel patient appointments.
              </p>
            </div>
          </div>

          {loading && (
            <div className="mt-8 rounded-2xl bg-slate-50 p-10 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

              <p className="mt-4 text-sm text-slate-500">
                Loading appointments...
              </p>
            </div>
          )}

          {!loading && appointments.length === 0 && !error && (
            <div className="mt-8 rounded-2xl bg-slate-50 px-6 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <CalendarDays size={26} />
              </div>

              <h4 className="mt-4 font-bold text-slate-800">
                No appointments yet
              </h4>

              <p className="mt-2 text-sm text-slate-500">
                Patient appointment requests will appear here.
              </p>
            </div>
          )}

          {!loading && appointments.length > 0 && (
            <div className="mt-8 space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-5 transition hover:border-blue-100 hover:bg-white hover:shadow-md"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-600">
                        {appointment.patient_name
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900">
                          {appointment.patient_name}
                        </h4>

                        <p className="mt-1 text-sm text-slate-500">
                          {appointment.patient_email}
                        </p>

                        {appointment.patient_phone && (
                          <p className="mt-1 text-sm text-slate-500">
                            {appointment.patient_phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-600">
                        <Stethoscope size={17} className="text-blue-600"/>
                        {appointment.doctor_name}
                      </div>

                      <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-600">
                        <CalendarDays size={17} className="text-blue-600"/>
                        {appointment.appointment_date}
                      </div>

                      <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-600">
                        <Clock3 size={17} className="text-blue-600" />
                        {appointment.appointment_time}
                      </div>
                    </div>

                    <span
                      className={`inline-flex w-fit rounded-full px-4 py-2 text-xs font-bold ${
                        appointment.status === "Pending"
                          ? "bg-yellow-50 text-yellow-600"
                          : appointment.status === "Confirmed"
                          ? "bg-blue-50 text-blue-600"
                          : appointment.status === "Completed"
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>

                  {appointment.reason && (
                    <div className="mt-5 rounded-xl bg-white p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Reason for visit
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {appointment.reason}
                      </p>
                    </div>
                  )}

                  {appointment.status === "Pending" && (
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          updateStatus(
                            appointment.id,
                            "Confirmed"
                          )
                        }
                        className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-green-700"
                      >
                        <CheckCircle2 size={17} />
                        Confirm
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateStatus(
                            appointment.id,
                            "Cancelled"
                          )
                        }
                        className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100"
                      >
                        <XCircle size={17} />
                        Cancel
                      </button>
                    </div>
                  )}

                  {appointment.status === "Confirmed" && (
                    <button
                      type="button"
                      onClick={() =>
                        updateStatus(
                          appointment.id,
                          "Completed"
                        )
                      }
                      className="mt-5 flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
                    >
                      <CheckCircle2 size={17} />
                      Mark Completed
                    </button>
                  )}
                  {(
                    appointment.status === "Completed" ||
                    appointment.status === "Cancelled" ||
                    isAppointmentPast(appointment)
                    ) && (
                    <button
                        type="button"
                        onClick={() =>
                        deleteAppointment(appointment.id)
                        }
                        className="mt-5 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100"
                    >
                        <Trash2 size={17} />
                        Delete
                    </button>
                    )}
                </div>
              ))}
            </div>
          )}
        </section>
        <AdminDoctors 
          onDoctorAdded={()=> {
            console.log("Doctor added successfully");
          }}
        />
      </main>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>

        <span className="text-2xl font-bold text-slate-900">
          {value}
        </span>
      </div>

      <p className="mt-4 text-sm font-semibold text-slate-500">
        {title}
      </p>
    </div>
  );
}

export default AdminDashboard;