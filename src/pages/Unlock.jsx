import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Unlock() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [answer, setAnswer] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadNote = async () => {
      const snap = await getDoc(doc(db, "notes", id));
      if (snap.exists()) setNote(snap.data());
    };
    loadNote();
  }, [id]);

  const checkAnswer = () => {
    if (answer.toLowerCase().trim() === note.answer) {
      setUnlocked(true);
      setError("");
    } else {
      setError("That doesn’t feel right 💔");
    }
  };

  if (!note) return null;

  return (
    <div className="min-h-screen bg-blush flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-sm">
        {!unlocked ? (
          <>
            <h2 className="text-xl font-medium mb-2">
              A question for you 💭
            </h2>
            <p className="text-gray-600 mb-4">{note.question}</p>

            <input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Your answer…"
              className="w-full border rounded-lg p-2 mb-3"
            />

            {error && (
              <p className="text-sm text-red-400 mb-2">{error}</p>
            )}

            <button
              onClick={checkAnswer}
              className="w-full bg-roseSoft text-white py-2 rounded-xl"
            >
              Unlock
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-medium mb-3">
              This was meant for you
            </h2>
            <p className="text-gray-700 whitespace-pre-line">
              {note.note}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
