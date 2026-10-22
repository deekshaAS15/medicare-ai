import {
  Brain,
  Baby,
  Bone,
  HeartPulse,
  Eye,
  Stethoscope,
  Smile,
  Venus,
  ArrowRight,
} from "lucide-react";

function Departments({
  onDepartmentSelect,
  onAskAI,
}) {
  const departments = [
    {
      icon: <HeartPulse size={28} />,
      title: "Cardiology",
      description:
        "Expert care for heart health, cardiovascular conditions, and prevention.",
      style: "bg-red-50 text-red-600",
    },
    {
      icon: <Brain size={28} />,
      title: "Neurology",
      description:
        "Specialized diagnosis and treatment for brain and nervous system conditions.",
      style: "bg-purple-50 text-purple-600",
    },
    {
      icon: <Bone size={28} />,
      title: "Orthopedics",
      description:
        "Comprehensive care for bones, joints, muscles, and movement.",
      style: "bg-orange-50 text-orange-600",
    },
    {
      icon: <Baby size={28} />,
      title: "Pediatrics",
      description:
        "Caring healthcare services designed especially for children.",
      style: "bg-pink-50 text-pink-600",
    },
    {
      icon: <Stethoscope size={28} />,
      title: "General Medicine",
      description:
        "Primary healthcare for common illnesses, checkups, and prevention.",
      style: "bg-blue-50 text-blue-600",
    },
    {
      icon: <Smile size={28} />,
      title: "Dental Care",
      description:
        "Complete dental care including preventive and restorative treatments.",
      style: "bg-cyan-50 text-cyan-600",
    },
    {
      icon: <Eye size={28} />,
      title: "Ophthalmology",
      description:
        "Advanced eye care, vision examinations, and treatment.",
      style: "bg-green-50 text-green-600",
    },
    {
      icon: <Venus size={28} />,
      title: "Gynecology",
      description:
        "Specialized healthcare and wellness services for women.",
      style: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <section
      id="departments"
      className="bg-slate-50 px-6 py-24"
    >
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center animate-fade-in">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
            Our Departments
          </p>

          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Find the right
            <span className="text-blue-600"> specialist care</span>
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-500">
            Explore our medical departments and connect with experienced
            healthcare professionals for your needs.
          </p>
        </div>

        {/* Department Cards */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {departments.map((department, index) => (
            <div
              key={department.title}
              className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-100 animate-fade-in"
              style={{
                animationDelay: `${index * 80}ms`,
              }}
            >
              {/* Decorative Circle */}
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-slate-50 transition duration-500 group-hover:scale-150" />

              {/* Icon */}
              <div
                className={`relative flex h-14 w-14 items-center justify-center rounded-2xl ${department.style} transition duration-300 group-hover:scale-110`}
              >
                {department.icon}
              </div>

              {/* Content */}
              <h3 className="relative mt-6 text-xl font-bold text-slate-900">
                {department.title}
              </h3>

              <p className="relative mt-3 min-h-21 text-sm leading-7 text-slate-500">
                {department.description}
              </p>

              {/* Button */}
              <button
                type="button"
                onClick={() => onDepartmentSelect(department.title)}
                className="relative mt-5 flex items-center gap-2 text-sm font-bold text-blue-600"
              >
                View Doctors

                <ArrowRight
                  size={16}
                  className="transition duration-300 group-hover:translate-x-1"
                />
              </button>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <p className="text-sm text-slate-500">
            Not sure which department you need?
          </p>

          <button
            type="button"
            onClick={onAskAI}
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-6 py-3 text-sm font-bold text-blue-600 shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-blue-600 hover:text-white hover:shadow-lg"
          >
            <Stethoscope size={18} />

            Ask our AI Assistant

            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </section>
  );
}

export default Departments;