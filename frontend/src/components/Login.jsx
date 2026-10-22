import { useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  HeartPulse,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

function Login({ onLogin, onRegister, onForgotPassword}) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/auth/login",
        formData
      );

      localStorage.setItem(
        "access_token",
        response.data.access_token
      );

      setMessage("Login successful!");

      setTimeout(() => {
        onLogin();
      }, 500);

    } catch (error) {
      setMessage(
        error.response?.data?.detail ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7fbff] flex items-center justify-center p-5">

      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-4xl shadow-2xl overflow-hidden">

        {/* Left image */}
        <div className="hidden lg:block relative">

          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=85"
            alt="Healthcare"
            className="w-full h-full object-cover" 
          />

          <div className="absolute inset-0 bg-blue-950/60" />

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
                Your health,
                <br />
                our priority.
              </h2>

              <p className="mt-5 text-blue-100 leading-relaxed max-w-sm">
                Access healthcare services, trusted doctors,
                appointments and intelligent AI assistance in one place.
              </p>

            </div>

            <div className="flex items-center gap-2 text-sm text-blue-100">
              <ShieldCheck size={18} />
              Your information is protected
            </div>

          </div>
        </div>

        {/* Right Form */}
        <div className="p-7 sm:p-10 lg:p-12">

          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition mb-8"
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <div className="mb-8">

            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-5">
              <LockKeyhole
                className="text-blue-600"
                size={24}
              />
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back
            </h1>

            <p className="text-gray-500 mt-2">
              Sign in to continue to your healthcare dashboard.
            </p>

          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

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

            {/* Password */}
            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">

                <LockKeyhole
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
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

           {/* Forgot Password */}
           <div className="flex justify-end">
            <button 
              type="button"
              onClick={() => {
                if(onForgotPassword) {
                  onForgotPassword(formData.email);
                }
              }}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition">
                Forgot password?
            </button>
           </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60 shadow-lg shadow-blue-100 transition"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

          </form>

          {message && (
            <div className="mt-5 p-3 rounded-xl bg-blue-50 text-blue-700 text-sm text-center">
              {message}
            </div>
          )}

          <p className="text-center text-sm text-gray-500 mt-7">
            Don't have an account?{" "}

            <button
              onClick={onRegister}
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Create one
            </button>

          </p>
        </div>
      </div>
    </div>
  );
}
export default Login;