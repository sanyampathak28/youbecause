import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";

export default function MyNotes() {
  const [notes, setNotes] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "notes"),
      where("uid", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      setNotes(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });

    return () => unsub();
  }, []);

  const deleteNote = async (id) => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    await deleteDoc(doc(db, "notes", id));
  };

  const copyLink = (id) => {
    const url = `www.youbecause.in/note/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold mb-6">My Notes 💌</h1>

      {notes.map((note) => {
        const shareUrl = `www.youbecause.in/note/${note.id}`;

        return (
          <div
            key={note.id}
            className="bg-white border rounded-xl p-4 mb-4 shadow-sm"
          >
            <p className="font-medium text-gray-800">
              From {note.from} → To {note.to}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              {note.question}
            </p>

            {/* 🔗 SHARE LINK */}
            <div className="mt-3 flex items-center gap-2 text-sm">
              <input
                readOnly
                value={shareUrl}
                className="flex-1 border rounded px-2 py-1 text-gray-600 bg-gray-50"
              />

              <button
                onClick={() => copyLink(note.id)}
                className="px-3 py-1 border rounded hover:bg-gray-100 transition"
              >
                {copiedId === note.id ? "Copied ✓" : "Copy"}
              </button>
            </div>

            <div className="flex justify-end mt-3">
              <button
                onClick={() => deleteNote(note.id)}
                className="text-sm text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
