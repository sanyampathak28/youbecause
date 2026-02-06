import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";

export default function Home({ notes, loading }) {
  const [selectedNote, setSelectedNote] = useState(null);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [unlockedNote, setUnlockedNote] = useState(null);

  const navigate = useNavigate();

  const handleVerify = () => {
    if (!selectedNote) return;

    const userAnswer = answer.trim().toLowerCase();
    const correctAnswer = selectedNote.answer.trim().toLowerCase();

    if (userAnswer === correctAnswer) {
      setUnlockedNote(selectedNote);
      setSelectedNote(null);
      setAnswer("");
      setError("");
      navigate(`unlock/${selectedNote.id}`);
    } else {
      setError("Wrong answer. Try again.");
    }
  };

  // 🔄 Loader while notes are loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading notes…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 relative">
      {/* Renders UnlockNote when route matches */}
      <Outlet context={{ unlockedNote }} />

      <h1 className="text-3xl font-semibold mb-8 text-center">
        meant for someone ✨
      </h1>

      {/* Notes grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => {
              setSelectedNote(note);
              setAnswer("");
              setError("");
            }}
            className="cursor-pointer bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition"
          >
            <p className="text-gray-700 font-medium">
              From{" "}
              <span className="font-semibold">
                {note.from || "Someone"}
              </span>
            </p>
            <p className="text-gray-500 mt-1">
              To <span className="font-semibold">{note.to}</span>
            </p>
          </div>
        ))}
      </div>

      {/* 🔐 Answer Modal */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-2">
              Answer this to unlock 💭
            </h2>

            <p className="text-gray-600 mb-4">
              {selectedNote.question}
            </p>

            <input
              type="text"
              placeholder="Your answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-black"
            />

            {error && (
              <p className="text-red-500 text-sm mb-3">{error}</p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedNote(null)}
                className="px-4 py-2 text-sm border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleVerify}
                className="px-4 py-2 text-sm bg-black text-white rounded-md"
              >
                Unlock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
