export default function NoteCard({ note }) {
  return (
    <div className="group bg-white rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-all duration-200 p-6">
      <p className="text-xs text-gray-500 mb-2">
        From {note.from || "Someone"}
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        To {note.to} <span className="ml-1">❤️</span>
      </h3>

      <p className="mt-4 text-sm text-gray-800 italic">
        {note.message}
      </p>
    </div>
  );
}
