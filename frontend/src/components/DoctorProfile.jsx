import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Star,
  UserRound,
  IndianRupee,
} from "lucide-react";

function getAvailabilityText(doctor) {
  const availableDays =
    doctor.available_days ||
    doctor.availableDays ||
    doctor.availability_days ||
    [];

  let days = availableDays;

  // If database returns "Monday, Wednesday, Friday"
  if (typeof days === "string") {
    days = days.split(",").map((day) => day.trim());
  }

  if (!Array.isArray(days) || days.length === 0) {
    return doctor.availability || "Availability not available";
  }

  const dayMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const today = new Date();
  const todayNumber = today.getDay();

  const availableNumbers = days
    .map((day) => dayMap[day])
    .filter((day) => day !== undefined);

  if (availableNumbers.includes(todayNumber)) {
    return "Available Today";
  }

  // Find the next available day
  let daysUntilNext = 7;

  availableNumbers.forEach((dayNumber) => {
    let difference = dayNumber - todayNumber;

    if (difference <= 0) {
      difference += 7;
    }

    if (difference < daysUntilNext) {
      daysUntilNext = difference;
    }
  });

  if (daysUntilNext === 1) {
    return "Available Tomorrow";
  }

  return `Available in ${daysUntilNext} days`;
}

function DoctorProfile({ doctor, onBack, onBook }) {
  if (!doctor) {
    return null;
  }

  return (
    <section className="min-h-screen bg-slate-50 px-6 pb-20 pt-28">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 flex items-center gap-2 font-semibold text-slate-600 transition hover:text-blue-600">
          <ArrowLeft size={18} />
          Back 
        </button>

        <div className="w-full overflow-hidden rounded-3xl bg-white shadow-xl">
          <div className="grid md:grid-cols-2">

            {/* Doctor Image */}
            <div className="relative min-h-105 bg-slate-100">
              {doctor.image ? (
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="h-full w-full object-cover object-top"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-blue-600">
                  <UserRound size={80} />
                </div>
              )}

              <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-bold shadow-lg">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                {getAvailabilityText(doctor)}
              </div>
            </div>

            {/* Details */}
            <div className="p-8 md:p-10">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                Doctor Profile
              </p>

              <h1 className="mt-3 text-3xl font-extrabold text-slate-900">
                {doctor.name}
              </h1>

              <p className="mt-2 text-lg font-semibold text-blue-600">
                {doctor.specialization}
              </p>

              <div className="mt-6 space-y-4">

              {/* Department */}
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <UserRound size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400">Department</p>
                  <p className="wrap-break-word font-semibold text-slate-800">
                    {doctor.department}
                  </p>
                </div>
              </div>

              {/* Experience */}
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                  <Clock3 size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400">Experience</p>
                  <p className="font-semibold text-slate-800">
                    {doctor.experience}+ Years
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-50 text-yellow-500">
                  <Star size={20} className="fill-yellow-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400">Rating</p>
                  <p className="font-semibold text-slate-800">
                    {doctor.rating} / 5
                  </p>
                </div>
              </div>

              {/* Consultation Fee */}
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <IndianRupee size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400">Consultation Fee</p>
                  <p className="wrap-break-word font-semibold text-slate-800">
                    ₹{doctor.consultation_fee}
                  </p>
                </div>
              </div>

              {/* Consultation Hours */}
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <Clock3 size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400">Consultation Hours</p>
                  <p className="wrap-break-word font-semibold text-slate-800">
                    {doctor.consultation_hours || "Not specified"}
                  </p>
                </div>
              </div>

              {/* Available Days */}
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                  <CalendarDays size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-400">Available Days</p>
                  <p className="whitespace-normal wrap-break-word font-semibold leading-6 text-slate-800">
                    {Array.isArray(doctor.available_days)
                      ? doctor.available_days.join(", ")
                      : doctor.available_days || "Not specified"}
                  </p>
                </div>
              </div>

            </div>
              <div className="mt-7">
                <h2 className="text-lg font-bold text-slate-900">
                  About the Doctor
                </h2>

                <p className="mt-2 leading-7 text-slate-500">
                  {doctor.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onBook(doctor)}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700"
              >
                <CalendarDays size={19} />
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DoctorProfile;