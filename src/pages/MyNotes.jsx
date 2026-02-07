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
    const url = `https://www.youbecause.in/note/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold mb-6">My Notes 💌</h1>

      {notes.length === 0 && (
        <p className="text-gray-500">You haven’t created any notes yet.</p>
      )}

      {notes.map((note) => {
        const shareUrl = `https://www.youbecause.in/note/${note.id}`;

        return (
          <div
            key={note.id}
            className="bg-white border rounded-xl p-5 mb-5 shadow-sm"
          >
            {/* HEADER */}
            <p className="font-medium text-gray-800 mb-1">
              From <span className="font-semibold">{note.from}</span> →{" "}
              <span className="font-semibold">{note.to}</span>
            </p>

            
            {/* <p className="text-sm text-gray-600 italic">
              “{note.question}”
            </p>

            <div className="mt-4">
              <p className="text-xs text-gray-400 mb-1">
                Answer (only visible to you)
              </p>
              <div className="text-sm text-gray-700 bg-gray-50 border rounded p-2">
                {note.answer}
              </div>
            </div> */}

            {/* NOTE CONTENT */}
            <div className="mt-4">
              <p className="text-xs text-gray-400 mb-1">
                Your note
              </p>
              <div className="text-sm text-gray-800 whitespace-pre-wrap bg-pink-50 border border-pink-100 rounded p-3">
                {note.note}
              </div>
            </div>

            {/* SHARE LINK */}
            <div className="mt-4 flex items-center gap-2 text-sm">
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

            {/* ACTIONS */}
            <div className="flex justify-end mt-4">
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
