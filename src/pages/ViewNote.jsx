import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";import UnlockNote from "./UnlockNote";

export default function ViewNote() {
  const { id } = useParams();

  const [note, setNote] = useState(null);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      const ref = doc(db, "notes", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setNote({ id: snap.id, ...snap.data() });
      } else {
        setError("This note does not exist.");
      }
      setLoading(false);
    };

    fetchNote();
  }, [id]);

  const handleVerify = () => {
    const userAnswer = answer.trim().toLowerCase();
    const correctAnswer = note.answer.trim().toLowerCase();

    if (userAnswer === correctAnswer) {
      setUnlocked(true);
    } else {
      setError("Wrong answer. Try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading…
      </div>
    );
  }

  if (unlocked) {
    return <UnlockNote noteFromLink={note} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-sm p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-2 text-center">
          Someone left you a note 💌
        </h2>

        <p className="text-gray-800 mb-4 text-center font-medium">
          {note.question}
        </p>

        <input
          type="text"
          placeholder="Your answer…"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-black"
        />

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        <button
          onClick={handleVerify}
          className="w-full py-2 bg-black text-white rounded-md"
        >
          Unlock
        </button>
      </div>
    </div>
  );
}
