import {
  ArrowRight,
  CalendarDays,
  MessageCircle,
  Stethoscope,
} from "lucide-react";

const Services = ({
  onAI,
  onAppointments,
  onDoctors,
}) => {
  return (
    <section
      id="services"
      className="mx-auto max-w-7xl px-6 py-24"
    >
      <div className="mx-auto max-w-2xl text-center animate-fade-in">

        <p className="font-semibold uppercase tracking-widest text-blue-600">
          Our Services
        </p>

        <h2 className="mt-3 text-4xl font-bold tracking-tight">
          Everything you need for better health
        </h2>

        <p className="mt-4 text-slate-500">
          From AI guidance to specialist consultations, we make
          healthcare simpler and more accessible.
        </p>

      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">

        <ServiceCard
          icon={<MessageCircle size={26} />}
          title="AI Health Assistant"
          description="Ask questions about your symptoms and get helpful general health guidance anytime."
          onClick={onAI}
        />

        <ServiceCard
          icon={<CalendarDays size={26} />}
          title="Easy Appointments"
          description="Find doctors and book your appointment quickly without waiting in queues."
          onClick={onAppointments}
        />

        <ServiceCard
          icon={<Stethoscope size={26} />}
          title="Expert Doctors"
          description="Connect with experienced specialists across multiple departments."
          onClick={onDoctors}
        />

      </div>
    </section>
  );
};

function ServiceCard({
  icon,
  title,
  description,
  onClick,
}) {
  return (
    <div className="group rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-100">

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition duration-300 group-hover:bg-blue-600 group-hover:text-white">
        {icon}
      </div>

      <h3 className="mt-6 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-slate-500">
        {description}
      </p>

      <button
        type="button"
        onClick={onClick}
        className="mt-5 flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-800"
      >
        Learn more
        <ArrowRight
          size={16}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </button>

    </div>
  );
}

export default Services;