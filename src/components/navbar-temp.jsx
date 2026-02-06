import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function NavBar({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/home");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-rose-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/home" className="text-lg font-semibold text-gray-800">
          You, Because
        </Link>

        <div className="flex items-center gap-4">
            <Link
            to="/create"
            className="text-sm px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
            Create
            </Link>
          {user ? (
            <>
              <Link
                to="/mynotes"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                My Notes
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm px-4 py-2 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-sm px-4 py-2 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
