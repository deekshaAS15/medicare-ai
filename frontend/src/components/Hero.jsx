import {
  MessageCircle,
  ArrowRight,
  CalendarDays,
  ShieldCheck,
  Clock3,
  Stethoscope,
} from "lucide-react";

const Hero = ({ onTalkToAI, onBookAppointment }) => {
  return (
    <div>
      <section
        id="home"
        className="relative overflow-hidden bg-linear-to-br from-blue-50 via-white to-cyan-50 pt-32"
      >
        {/* Background circles */}
        <div className="absolute -left-40 top-40 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />

        <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-cyan-200/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 lg:grid-cols-2">

          {/* Left */}
          <div className="animate-fade-in">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 shadow-sm">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500" />

              <span className="text-sm font-medium text-slate-600">
                AI-powered healthcare
              </span>
            </div>

            <h2 className="max-w-2xl text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              Healthcare that

              <span className="block text-blue-600">
                understands you.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Get personalized health guidance, find the right specialist,
              and book your hospital appointment with the help of our
              AI assistant.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">

              {/* AI Button */}
              <button
                type="button"
                onClick={onTalkToAI}
                className="group flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-4 font-semibold text-white shadow-xl shadow-blue-200 transition duration-300 hover:-translate-y-1 hover:bg-blue-700"
              >
                <MessageCircle size={20} />

                Talk to AI Assistant

                <ArrowRight
                  size={18}
                  className="transition duration-300 group-hover:translate-x-1"
                />
              </button>

              {/* Appointment Button */}
              <button
                type="button"
                onClick={onBookAppointment}
                className="flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-4 font-semibold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:text-blue-600"
              >
                <CalendarDays size={20} />

                Book Appointment
              </button>

            </div>

            {/* Trust */}
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-500">

              <div className="flex items-center gap-2">
                <ShieldCheck
                  size={20}
                  className="text-green-500"
                />
                Trusted Healthcare
              </div>

              <div className="flex items-center gap-2">
                <Clock3
                  size={20}
                  className="text-blue-500"
                />
                24/7 AI Assistance
              </div>

            </div>
          </div>

          {/* Right Image */}
          <div className="relative animate-scale-in">

            <div className="overflow-hidden rounded-[2.5rem] shadow-2xl shadow-blue-200">

              <img
                src="https://images.unsplash.com/photo-1706799191377-96a80beaee24?q=80&w=1977&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaGdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Doctor"
                className="h-137.5 w-full object-cover transition duration-700 hover:scale-105"
              />

              <div className="absolute inset-0 rounded-[2.5rem] bg-linear-to-t from-blue-950/40 via-transparent to-transparent" />

            </div>

            {/* AI Card */}
            <div className="animate-float absolute -bottom-6 -left-5 rounded-3xl border border-white/60 bg-white/90 p-5 shadow-2xl backdrop-blur-xl sm:left-7.5">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                  <MessageCircle size={24} />
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-400">
                    AI Assistant
                  </p>

                  <p className="font-bold text-slate-800">
                    How can I help you?
                  </p>
                </div>

              </div>
            </div>

            {/* Doctor Card */}
            <div className="animate-float-slow absolute -right-5 top-10 hidden rounded-2xl bg-white p-4 shadow-xl sm:block">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                  <Stethoscope size={20} />
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Available
                  </p>

                  <p className="font-semibold">
                    120+ Doctors
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;