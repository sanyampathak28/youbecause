import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6 text-center text-xs text-gray-500 space-x-4">
        <Link to="/privacy-policy" className="hover:text-black">
          Privacy Policy
        </Link>
        <Link to="/terms" className="hover:text-black">
          Terms
        </Link>
        <Link to="/refund-policy" className="hover:text-black">
          Refund Policy
        </Link>
        <Link to="/contact" className="hover:text-black">
          Contact
        </Link>
      </div>
    </footer>
  );
}
