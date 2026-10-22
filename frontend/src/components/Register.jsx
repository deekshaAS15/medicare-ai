import { useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  HeartPulse,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";

function Register({ onRegister, onLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmPassword,setConfirmPassword] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setMessage("");

  // Strong password validation
  const password = formData.password;

  const strongPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

  if (!strongPassword.test(password)) {
    setMessage(
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
    );
    return;
  }

  // Confirm password validation
  if (password !== confirmPassword) {
    setMessage("Passwords do not match!");
    return;
  }

  setLoading(true);

  try {
    await axios.post(
      "http://127.0.0.1:8000/auth/register",
      formData
    );

    setMessage("Account created successfully!");

    setTimeout(() => {
      onRegister();
    }, 700);

  } catch (error) {
    setMessage(
      error.response?.data?.detail ||
        "Registration failed."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#f7fbff] flex items-center justify-center p-5">

      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-4xl shadow-2xl overflow-hidden">

        {/* LEFT */}
        <div className="hidden lg:block relative order-2">

          <img
            src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1000&q=85"
            alt="Doctor and patient"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-cyan-950/60" />

          <div className="absolute inset-0 p-12 flex flex-col justify-between text-white">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                <HeartPulse size={24} />
              </div>

              <span className="font-bold text-xl">
                MediCare AI
              </span>

            </div>

            <div>

              <h2 className="text-4xl font-bold leading-tight">
                Start your
                <br />
                healthier journey.
              </h2>

              <p className="mt-5 text-cyan-100 leading-relaxed max-w-sm">
                Create your account and get access to doctors,
                appointments and AI-powered healthcare support.
              </p>

            </div>

            <div className="flex items-center gap-2 text-sm text-cyan-100">
              <ShieldCheck size={18} />
              Safe, secure and private
            </div>

          </div>

        </div>

        {/* RIGHT */}
        <div className="p-7 sm:p-10 lg:p-12 order-1">

          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition mb-7"
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <div className="mb-7">

            <div className="w-12 h-12 bg-cyan-100 rounded-2xl flex items-center justify-center mb-5">
              <User
                className="text-cyan-600"
                size={24}
              />
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              Create your account
            </h1>

            <p className="text-gray-500 mt-2">
              Join MediCare AI and simplify your healthcare journey.
            </p>

          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full name
              </label>

              <div className="relative">

                <User
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition"
                />

              </div>
            </div>

            {/* Email */}
            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email address
              </label>

              <div className="relative">

                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition"
                />

              </div>
            </div>

            {/* Phone */}
            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone number
              </label>

              <div className="relative">

                <Phone
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition"
                />

              </div>
            </div>

            {/* Password */}
            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">

                <LockKeyhole
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 align-middle"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={8}
                  placeholder="Create a password"
                  required
                  className="w-full pl-11 pr-12 py-3.5 mb-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition"
                />

                </div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                 Confirm Password
                </label>

              <div className="relative">

                <LockKeyhole
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input 
                 type="password"
                 placeholder="Confirm Password"
                 value={confirmPassword}
                 onChange={(e) => 
                  setConfirmPassword(e.target.value)}
                 required
                  className="w-full pl-11 pr-12 py-3.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                >
                </button>

              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60 shadow-lg shadow-blue-100 transition"
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>

          </form>

          {message && (
            <div className="mt-5 p-3 rounded-xl bg-blue-50 text-blue-700 text-sm text-center">
              {message}
            </div>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}

            <button
              onClick={onLogin}
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Sign in
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Register;