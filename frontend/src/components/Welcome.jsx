import {
  ArrowRight,
  BrainCircuit,
  CalendarCheck,
  CheckCircle2,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";

function Welcome({ onLogin, onRegister}) {
  return (
    <div className="relative min-h-screen bg-[#f7fbff] overflow-x-hidden">

      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="absolute bottom-0 right-0 w-125 h-125 bg-cyan-200/20 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-4 sm:px-6 md:px-12 py-4 md:py-6">

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            <HeartPulse className="text-white" size={25} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-900">
              MediCare <span className="text-blue-600">AI</span>
            </h1>

            <p className="text-[10px] tracking-widest text-gray-400 uppercase">
              Intelligent Healthcare
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3">
         
          <button
            onClick={onLogin}
            className="px-5 py-2.5 text-gray-700 font-medium hover:text-blue-600 transition"
          >
            Login
          </button>

          <button
            onClick={onRegister}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 md:px-12 pt-6 md:pt-14 pb-10 md:pb-16">

        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* LEFT */}
          <div className="animate-fade-in">

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
              <Sparkles size={16} />
              AI-powered healthcare platform
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.08] tracking-tight">
              Healthcare
              <span className="block text-blue-600">
                made smarter.
              </span>
              Care made
              <span className="block">
                simpler.
              </span>
            </h2>

            <p className="mt-5 md:mt-7 text-base md:text-lg text-gray-600 max-w-xl leading-relaxed">
              Connect with trusted doctors, manage appointments,
              and get personalized general health guidance with
              your intelligent healthcare companion.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-7 md:mt-9">

              <button
                onClick={onRegister}
                className="group w-full sm:w-auto flex items-center justify-center gap-3 px-5 sm:px-7 py-3.5 sm:py-4 bg-blue-600 text-white rounded-2xl font-semibold shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all"
              >
                Create your account

                <ArrowRight
                  size={19}
                  className="group-hover:translate-x-1 transition"
                />
              </button>

              <button
                onClick={onLogin}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-7 py-3.5 sm:py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-semibold hover:border-blue-300 hover:text-blue-600 transition shadow-sm"
              >
                Sign in
              </button>

            </div>

            {/* Trust */}
            <div className="flex flex-wrap gap-x-4 gap-y-3 md:mt-10">

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 size={18} className="text-green-500" />
                Trusted healthcare
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ShieldCheck size={18} className="text-blue-500" />
                Secure & private
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BrainCircuit size={18} className="text-purple-500" />
                AI assistance
              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div className="relative animate-scale-in mt-6 lg:mt-0">

            {/* Main image */}
            <div className="relative  w-full max-w-lg mx-auto">

              <div className="absolute inset-0 bg-blue-500/10 rounded-[3rem] rotate-3 scale-105" />

              <div className="relative bg-white p-3 rounded-[3rem] shadow-2xl">

                <img
                  src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1000&q=85"
                  alt="Doctor providing healthcare"
                  className="w-full h-64 sm:h-80 md:h-142.5 object-cover rounded-[4xl] md:rounded-[2.5rem]"
                />

                {/* Image overlay */}
                <div className="absolute inset-3 rounded-[2.5rem] bg-linear-to-t from-blue-950/50 via-transparent to-transparent pointer-events-none" />

                {/* AI badge */}
                <div className="absolute top-9 right-8 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl animate-float">

                  <div className="flex items-center gap-3">

                    <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center">
                      <BrainCircuit
                        className="text-blue-600"
                        size={23}
                      />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        AI Assistant
                      </p>

                      <p className="text-xs text-green-600">
                        ● Available 24/7
                      </p>
                    </div>

                  </div>

                </div>

                {/* Doctor card */}
                <div className="absolute bottom-9 left-8 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl animate-float-slow">

                  <div className="flex items-center gap-3">

                    <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center">
                      <Stethoscope
                        className="text-green-600"
                        size={22}
                      />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Expert Doctors
                      </p>

                      <p className="text-xs text-gray-500">
                        Quality care you can trust
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Feature cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mt-12 md:mt-20">

          <FeatureCard
            icon={<Stethoscope size={23} />}
            title="Find Doctors"
            description="Discover doctors by specialty and availability."
          />

          <FeatureCard
            icon={<CalendarCheck size={23} />}
            title="Easy Appointments"
            description="Book and manage your appointments easily."
          />

          <FeatureCard
            icon={<BrainCircuit size={23} />}
            title="AI Health Assistant"
            description="Get instant general health guidance anytime."
          />

        </div>

      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="group bg-white border border-gray-100 rounded-2xl p-5 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100/50 transition-all">

      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
        {icon}
      </div>

      <h3 className="font-bold text-gray-900">
        {title}
      </h3>

      <p className="text-sm text-gray-500 mt-2 leading-relaxed">
        {description}
      </p>

    </div>
  );
}

export default Welcome;