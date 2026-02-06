import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { useState, useEffect } from "react";

export default function Note() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getDoc(doc(db, "notes", id)).then((d) => setNote(d.data()));
  }, []);

  if (!note) return null;

  if (!open)
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl mb-4">
          From {note.from}  To {note.to}
        </h2>
        <p className="mb-3">{note.question}</p>
        <input
          className="border p-2 mb-3"
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={() =>
            input.toLowerCase() === note.answer && setOpen(true)
          }
          className="block mx-auto bg-roseSoft text-white px-4 py-2 rounded"
        >
          Unlock 💗
        </button>
      </div>
    );

  return (
    <div className="p-6 text-center">
      <p className="text-lg italic">{note.note}</p>
    </div>
  );
}
