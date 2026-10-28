import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  UserPlus,
  User,
  Stethoscope,
  Building2,
  BriefcaseMedical,
  Star,
  IndianRupee,
  Clock3,
  CalendarDays,
  Image,
  FileText,
  Pencil,
  Trash2,
  RefreshCw,
  X,
} from "lucide-react";

const emptyForm = {
  name: "",
  specialization: "",
  department: "",
  experience: "",
  rating: "",
  availability: "",
  consultation_fee: "",
  consultation_hours: "",
  available_days: "",
  image: "",
  description: "",
};

function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingDoctor, setEditingDoctor] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const formRef = useRef(null);

  const token = localStorage.getItem("admin_access_token");

  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true);
      setError("");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/doctors/`
      );

      setDoctors(response.data);
    } catch (err) {
      console.error("Error loading doctors:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load doctors."
      );
    } finally {
      setLoadingDoctors(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingDoctor(null);
    setMessage("");
    setError("");
  };

  const prepareDoctorData = () => {
    return {
      name: formData.name,
      specialization: formData.specialization,
      department: formData.department,
      experience: Number(formData.experience),
      rating: formData.rating || null,
      availability: formData.availability || null,
      consultation_fee: formData.consultation_fee
        ? Number(formData.consultation_fee)
        : null,
      consultation_hours:
        formData.consultation_hours || null,
      available_days: formData.available_days || null,
      image: formData.image || null,
      description: formData.description || null,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const doctorData = prepareDoctorData();

      if (editingDoctor) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/doctors/${editingDoctor.id}`,
          doctorData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage("Doctor updated successfully!");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/doctors/`,
          doctorData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage("Doctor added successfully!");
      }

      resetForm();
      await fetchDoctors();
    } catch (err) {
      console.error("Doctor save error:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to save doctor."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);

    setFormData({
      name: doctor.name || "",
      specialization: doctor.specialization || "",
      department: doctor.department || "",
      experience: doctor.experience ?? "",
      rating: doctor.rating || "",
      availability: doctor.availability || "",
      consultation_fee: doctor.consultation_fee ?? "",
      consultation_hours:
        doctor.consultation_hours || "",
      available_days: doctor.available_days || "",
      image: doctor.image || "",
      description: doctor.description || "",
    });

    setMessage("");
    setError("");

   setTimeout(() => {
    formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
    })
   },100)
  };

  const handleDelete = async (doctor) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${doctor.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/doctors/${doctor.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Doctor deleted successfully!");

      if (editingDoctor?.id === doctor.id) {
        resetForm();
      }

      await fetchDoctors();
    } catch (err) {
      console.error("Doctor delete error:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to delete doctor."
      );
    }
  };

  return (
    <div className="mt-10 space-y-10">

      {/* Add / Edit Doctor */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div ref={formRef} className="flex items-center gap-4 scroll-mt-24">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              {editingDoctor ? (
                <Pencil size={23} />
              ) : (
                <UserPlus size={23} />
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {editingDoctor
                  ? "Edit Doctor"
                  : "Add New Doctor"}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {editingDoctor
                  ? "Update the doctor's information."
                  : "Add a hospital doctor from the admin portal."}
              </p>
            </div>
          </div>

          {editingDoctor && (
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <X size={17} />
              Cancel Edit
            </button>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-blue-600">
              Basic Information
            </h4>

            <div className="grid gap-5 md:grid-cols-2">

              <InputField
                icon={<User size={18} />}
                label="Doctor Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Dr. John Smith"
                required
              />

              <InputField
                icon={<Stethoscope size={18} />}
                label="Specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="Cardiologist"
                required
              />

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Department
                </label>

                <div className="relative">
                  <Building2
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">
                      Select Department
                    </option>
                    <option value="Cardiology">
                      Cardiology
                    </option>
                    <option value="Neurology">
                      Neurology
                    </option>
                    <option value="Orthopedics">
                      Orthopedics
                    </option>
                    <option value="Pediatrics">
                      Pediatrics
                    </option>
                    <option value="Dermatology">
                      Dermatology
                    </option>
                    <option value="Gynecology">
                      Gynecology
                    </option>
                    <option value="General Medicine">
                      General Medicine
                    </option>
                    <option value="Dentistry">
                      Dentistry
                    </option>
                    <option value="Ophthalmology">
                      Ophthalmology
                    </option>
                    <option value="ENT">ENT</option>
                  </select>
                </div>
              </div>

              <InputField
                icon={<BriefcaseMedical size={18} />}
                label="Experience (Years)"
                name="experience"
                type="number"
                min="0"
                value={formData.experience}
                onChange={handleChange}
                placeholder="5"
                required
              />
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-blue-600">
              Consultation Information
            </h4>

            <div className="grid gap-5 md:grid-cols-2">

              <InputField
                icon={<Star size={18} />}
                label="Rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                placeholder="4.8"
              />

              <InputField
                icon={<IndianRupee size={18} />}
                label="Consultation Fee"
                name="consultation_fee"
                type="number"
                min="0"
                value={formData.consultation_fee}
                onChange={handleChange}
                placeholder="500"
              />

              <InputField
                icon={<Clock3 size={18} />}
                label="Consultation Hours"
                name="consultation_hours"
                value={formData.consultation_hours}
                onChange={handleChange}
                placeholder="10:00 AM - 2:00 PM"
              />

              <InputField
                icon={<CalendarDays size={18} />}
                label="Available Days"
                name="available_days"
                value={formData.available_days}
                onChange={handleChange}
                placeholder="Monday, Wednesday, Friday"
              />

            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-blue-600">
              Profile Information
            </h4>

            <div className="space-y-5">

              <InputField
                icon={<Image size={18} />}
                label="Image URL"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/doctor.jpg"
              />

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <div className="relative">
                  <FileText
                    size={18}
                    className="absolute left-4 top-4 text-slate-400"
                  />

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Experienced doctor specializing in..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {message && (
            <div className="rounded-xl border border-green-100 bg-green-50 p-4 text-sm font-semibold text-green-600">
              {message}
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {editingDoctor ? (
              <Pencil size={18} />
            ) : (
              <UserPlus size={18} />
            )}

            {loading
              ? "Saving..."
              : editingDoctor
              ? "Update Doctor"
              : "Add Doctor"}
          </button>
        </form>
      </section>

      {/* Doctor List */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Doctors Management
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Manage doctors registered in the hospital.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchDoctors}
            className="flex w-fit items-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {loadingDoctors && (
          <div className="mt-8 rounded-2xl bg-slate-50 p-10 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

            <p className="mt-4 text-sm text-slate-500">
              Loading doctors...
            </p>
          </div>
        )}

        {!loadingDoctors && doctors.length === 0 && (
          <div className="mt-8 rounded-2xl bg-slate-50 p-10 text-center">
            <Stethoscope
              size={32}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 font-semibold text-slate-700">
              No doctors found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Add your first doctor using the form above.
            </p>
          </div>
        )}

        {!loadingDoctors && doctors.length > 0 && (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 transition hover:border-blue-100 hover:bg-white hover:shadow-lg"
              >
                {doctor.image ? (
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center bg-blue-50 text-blue-300">
                    <Stethoscope size={52} />
                  </div>
                )}

                <div className="p-5">
                  <h4 className="text-lg font-bold text-slate-900">
                    {doctor.name}
                  </h4>

                  <p className="mt-1 text-sm font-semibold text-blue-600">
                    {doctor.specialization}
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-slate-500">
                    <p>
                      <span className="font-semibold text-slate-700">
                        Department:
                      </span>{" "}
                      {doctor.department}
                    </p>

                    <p>
                      <span className="font-semibold text-slate-700">
                        Experience:
                      </span>{" "}
                      {doctor.experience} years
                    </p>

                    {doctor.rating && (
                      <p>
                        <span className="font-semibold text-slate-700">
                          Rating:
                        </span>{" "}
                        ⭐ {doctor.rating}
                      </p>
                    )}

                    {doctor.consultation_fee && (
                      <p>
                        <span className="font-semibold text-slate-700">
                          Fee:
                        </span>{" "}
                        ₹{doctor.consultation_fee}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(doctor)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-600 transition hover:bg-blue-100"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(doctor)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function InputField({
  icon,
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  min,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          min={min}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
        />
      </div>
    </div>
  );
}

export default AdminDoctors;