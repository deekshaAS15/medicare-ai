import {
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  ArrowUpRight,
} from "lucide-react";

const Footer = ({ onAdminLogin }) => {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-slate-950 text-white"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-14">

        {/* Main Footer */}
        <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-3 md:gap-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20">
                <HeartPulse size={26} />
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  MediCare<span className="text-blue-400">AI</span>
                </h2>
                <p className="text-xs tracking-widest text-slate-500">
                  SMARTER HEALTHCARE
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              Your health, our priority. Discover trusted doctors,
              book appointments, and get general health guidance
              with intelligent healthcare technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-widest text-white">
              Quick Links
            </h3>

            <div className="flex flex-col items-start gap-4 text-sm text-slate-400">
              <a
                href="#"
                className="transition hover:translate-x-1 hover:text-blue-400"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Home
              </a>

              <a
                href="#doctors"
                className="transition hover:translate-x-1 hover:text-blue-400"
              >
                Find Doctors
              </a>

              <a
                href="#ai-assistant"
                className="transition hover:translate-x-1 hover:text-blue-400"
              >
                AI Health Assistant
              </a>

              <a
                href="#contact"
                className="transition hover:translate-x-1 hover:text-blue-400"
              >
                Contact
              </a>
            </div>
          </div>

          {/* Healthcare + Admin */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-widest text-white">
              Your Care Matters
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={20}
                  className="mt-0.5 shrink-0 text-blue-400"
                />
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    Secure Experience
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Your healthcare journey deserves care and privacy.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Stethoscope
                  size={20}
                  className="mt-0.5 shrink-0 text-blue-400"
                />
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    Trusted Care
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Find doctors and manage your appointments easily.
                  </p>
                </div>
              </div>
            </div>

            {/* Admin Login */}
            {onAdminLogin && (
            <button
              type="button"
              onClick={onAdminLogin}
              className="mt-7 inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2.5 text-sm text-slate-400 transition hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-400"
            >
              Admin Login
              <ArrowUpRight size={15} />
            </button>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col gap-3 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} MediCare AI. All rights reserved.
          </p>

          <p className="flex items-center gap-2">
            Made for better healthcare
            <HeartPulse size={14} className="text-blue-400" />
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;