import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

import { auth, db } from "./firebase";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Create from "./pages/Create";
import MyNotes from "./pages/MyNotes";
import ViewNote from "./pages/ViewNote";
import UnlockNote from "./pages/UnlockNote";
import Footer from "./components/Footer";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import RefundPolicy from "./pages/RefundPolicy";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import NavBar from "./components/NavBar";
import NotFound from "./pages/NotFound";

//work
export default function App() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notesLoading, setNotesLoading] = useState(true);


  // 🔐 Auth listener
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      setUser(null);
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const tokenResult = await firebaseUser.getIdTokenResult();

    setUser(firebaseUser);
    setIsAdmin(!!tokenResult.claims.admin);
    console.log(tokenResult);
    
    setLoading(false);
  });

  return () => unsubscribe();
}, []);


  // 📦 Fetch all notes
  useEffect(() => {
  const fetchNotes = async () => {
    try {
      const q = query(
        collection(db, "notes"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      setNotes(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setNotesLoading(false); // ✅ ALWAYS runs
    }
  };

  fetchNotes();
}, []);



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading…
      </div>
    );
  }

  return (
    <>
      <NavBar user={user} />

      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />

        {/* 👇 HOME AS LAYOUT */}
        <Route
          path="/home"
          element={<Home notes={notes} loading={notesLoading} />}
        >

          <Route path="unlock/:id" element={<UnlockNote />} />
        </Route>

        <Route
          path="/login"
          element={user ? <Navigate to="/home" /> : <Login />}
        />

        <Route
          path="/create"
          element={<Create user={user} />}
        />

        <Route
          path="/mynotes"
          element={user ? <MyNotes user={user} /> : <Navigate to="/login" />}
        />

        <Route path="/note/:id" element={<ViewNote />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/admin"
          element={isAdmin ? <Admin /> : <Navigate to="/home" />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}
