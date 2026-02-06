import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-6">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-gray-600 mb-8">
        This page doesn’t exist… or maybe it moved.
      </p>

      <button
        onClick={() => navigate("/home")}
        className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-900 transition"
      >
        Back to home
      </button>
    </div>
  );
}
