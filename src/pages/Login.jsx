import { useState } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blush flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-rose-100 p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
          Welcome back
        </h1>
        <p className="text-sm text-gray-600 text-center mb-8">
          Login to manage your notes
        </p>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full mb-6 flex items-center justify-center gap-2 border border-gray-300 rounded-full py-2.5 text-sm font-medium hover:bg-gray-50 transition"
        >
          Continue with Google
        </button>

        <div className="flex items-center gap-4 my-6">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-xs text-gray-400">or</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        {/* Email Login */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white rounded-full py-2.5 text-sm hover:bg-gray-800 transition"
          >
            Login
          </button>
        </form>

        {error && (
          <p className="text-sm text-red-500 mt-4 text-center">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
