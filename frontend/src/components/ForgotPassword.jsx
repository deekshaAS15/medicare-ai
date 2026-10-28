import { useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  HeartPulse,
  Mail,
  LockKeyhole,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
        null,
        {
          params: { email },
        }
      );

      if (response.data.development_reset_token) {
        setToken(response.data.development_reset_token);
        setMessage(
          "Development reset token generated. You can now set a new password."
        );
        setStep(2);
      } else {
        setMessage(response.data.message);
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to request password reset."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/reset-password`,
        null,
        {
          params: {
            token,
            new_password: newPassword,
          },
        }
      );

      setMessage(response.data.message);
      setStep(3);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7fbff] p-5">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">

        {/* Left panel */}
        <div className="relative hidden min-h-150 lg:block">
          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=85"
            alt="Healthcare"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-blue-950/70" />

          <div className="relative flex h-full flex-col justify-between p-12 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
                <HeartPulse size={24} />
              </div>

              <span className="text-xl font-bold">
                MediCare AI
              </span>
            </div>

            <div>
              <h2 className="text-4xl font-bold leading-tight">
                A fresh start
                <br />
                for your account.
              </h2>

              <p className="mt-5 leading-relaxed text-blue-100">
                Reset your password securely and continue your
                healthcare journey with MediCare AI.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-blue-100">
              <ShieldCheck size={18} />
              Your information is protected
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex items-center p-7 sm:p-10 lg:p-12">
          <div className="w-full">

            <button
              type="button"
              onClick={onBack}
              className="mb-8 flex items-center gap-2 text-sm text-gray-500 transition hover:text-blue-600"
            >
              <ArrowLeft size={17} />
              Back to login
            </button>

            {step === 1 && (
              <>
                <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                  <Mail size={24} className="text-blue-600" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900">
                  Forgot password?
                </h1>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Enter your registered email address to begin
                  the password reset process.
                </p>

                <form
                  onSubmit={handleForgotPassword}
                  className="mt-8 space-y-5"
                >
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Email address
                    </label>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full rounded-xl border border-gray-200 px-4 py-3.5 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700 disabled:opacity-60"
                  >
                    {loading ? "Please wait..." : "Continue"}
                  </button>
                </form>
              </>
            )}

            {step === 2 && (
              <>
                <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                  <LockKeyhole size={24} className="text-blue-600" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900">
                  Reset password
                </h1>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Enter your reset token and choose a strong new password.
                </p>

                <form
                  onSubmit={handleResetPassword}
                  className="mt-8 space-y-5"
                >
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      New password
                    </label>

                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Create a strong password"
                      required
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                    />

                    <p className="mt-2 text-xs leading-5 text-gray-500">
                      Use at least 8 characters with uppercase,
                      lowercase, a number, and a special character.
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Confirm new password
                    </label>

                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Enter your password again"
                      required
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </form>
              </>
            )}

            {step === 3 && (
              <div className="py-8 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle size={34} className="text-green-600" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900">
                  Password updated!
                </h1>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Your password has been reset successfully.
                  You can now sign in using your new password.
                </p>

                <button
                  type="button"
                  onClick={onBack}
                  className="mt-7 w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white transition hover:bg-blue-700"
                >
                  Return to login
                </button>
              </div>
            )}

            {message && step !== 3 && (
              <div
                role="status"
                className="mt-5 rounded-xl bg-blue-50 p-3 text-sm text-blue-700 wrap-break-word"
              >
                {message}
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;