export default function LegalLayout({ title, children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-sm text-center">
        <h1 className="text-2xl font-semibold mb-6">{title}</h1>

        <div className="text-sm text-gray-700 space-y-4 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
