import { useEffect, useState } from "react";
import axios from "axios";

import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Star,
} from "lucide-react";

function Doctors({ onBook,onProfile,selectedDepartment,onClearDepartment}) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAllDoctors,setShowAllDoctors] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/doctors/`
      );

      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setError("Unable to load doctors.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="doctors"
      className="bg-white px-6 py-24"
    >
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div className="max-w-2xl animate-fade-in">

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              Meet Our Doctors
            </p>

            <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Experienced doctors,
              <span className="text-blue-600">
                {" "}compassionate care
              </span>
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-500">
              Connect with trusted healthcare professionals across
              multiple medical specialties.
            </p>

          </div>

          {/* View All Doctors */}
          <button
            type="button"
            onClick={() => {
              if (showAllDoctors) {
                setShowAllDoctors(false);
              } else {
                setShowAllDoctors(true);
              }
            }}
            className="hidden items-center gap-2 rounded-full border border-blue-200 px-5 py-3 text-sm font-bold text-blue-600 transition duration-300 hover:-translate-y-1 hover:bg-blue-600 hover:text-white md:flex"
          >
            {showAllDoctors ? "Show Less" : "View All Doctors"}
            <ArrowRight
              size={17}
              className={`transition-transform ${
                showAllDoctors ? "rotate-180" : ""
              }`}
            />
          </button>

        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-3xl border border-slate-100 bg-white"
              >
                <div className="h-72 bg-slate-200" />

                <div className="space-y-4 p-6">

                  <div className="h-5 w-3/4 rounded bg-slate-200" />

                  <div className="h-4 w-1/2 rounded bg-slate-200" />

                  <div className="h-4 w-full rounded bg-slate-200" />

                </div>
              </div>
            ))}

          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-14 rounded-3xl border border-red-100 bg-red-50 p-8 text-center">

            <p className="font-semibold text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchDoctors}
              className="mt-4 rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>

          </div>
        )}

           {/* Doctors */}
              {!loading && !error && doctors.length > 0 && (
              <div className="mt-14">
              {selectedDepartment && (
              <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-blue-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-blue-500">
                    Showing doctors for
                  </p>

                  <p className="text-lg font-bold text-blue-700">
                    {selectedDepartment}
                  </p>
                </div>
              </div>
            )}
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
              {doctors
                .filter((doctor) =>
                  selectedDepartment
                    ? doctor.department === selectedDepartment
                    : true
                )
                .slice(0,showAllDoctors ? undefined : 4)
                .map((doctor, index) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    index={index}
                    onBook={onBook}
                    onProfile={onProfile}
                  />
                ))}
            </div>
          </div>
        )}

        {/* No doctors */}
        {!loading && !error && doctors.length === 0 && (
          <div className="mt-14 rounded-3xl bg-slate-50 p-10 text-center">

            <p className="font-semibold text-slate-600">
              No doctors available at the moment.
            </p>

          </div>
        )}

        {/* Mobile button */}
        <div className="mt-10 text-center md:hidden">

          <button
            type="button"
            onClick={() => {
              setShowAllDoctors(!showAllDoctors);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-200 px-5 py-3 text-sm font-bold text-blue-600 transition hover:bg-blue-600 hover:text-white"
          >
            {showAllDoctors ? "Show Less" : "View All Doctors"}

            <ArrowRight
              size={17}
              className={`transition-transform ${
                showAllDoctors ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

      </div>
    </section>
  );
}


/* =====================================================
   Doctor Card
===================================================== */

function DoctorCard({ doctor, index, onBook , onProfile}) {
  return (
    <div
      className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-100 animate-fade-in"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >

      {/* Image */}
      <div className="relative h-72 overflow-hidden bg-slate-100">

        <img
          src={doctor.image}
          alt={doctor.name}
          className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-105"
        />

        {/* Rating */}
        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/95 px-3 py-2 text-sm font-bold shadow-lg backdrop-blur-sm">

          <Star
            size={15}
            className="fill-yellow-400 text-yellow-400"
          />

          {doctor.rating}

        </div>

      </div>


      {/* Content */}
      <div className="p-6">

        {/* Doctor Name */}
        <h3 className="text-xl font-bold text-slate-900">
          {doctor.name}
        </h3>

        {/* Specialization */}
        <p className="mt-1 font-semibold text-blue-600">
          {doctor.specialization}
        </p>

        {/* Experience */}
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">

          <Clock3 size={16} />

          {doctor.experience}+ Years Experience

        </div>

        {/* Description */}
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
          {doctor.description}
        </p>


        {/* Buttons */}
        <div className="mt-6 flex gap-3">

          {/* Profile */}
          <button
            type="button"
            onClick={()=> onProfile(doctor)}
            className="flex flex-1 items-center justify-center rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold text-slate-700 transition duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          >
            Profile
          </button>


          {/* Book */}
          <button
            type="button"
            onClick={() => onBook(doctor)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-3 text-sm font-bold text-white shadow-lg shadow-blue-100 transition duration-300 hover:bg-blue-700 hover:shadow-blue-200"
          >
            <CalendarDays size={16} />

            Book
          </button>

        </div>

      </div>

    </div>
  );
}

export default Doctors;