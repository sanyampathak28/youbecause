import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  orderBy,
  query,
  limit,
  startAfter,
} from "firebase/firestore";

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

const PAGE_SIZE = 20;

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // 🔐 Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setIsAdmin(false);
        setAuthLoading(false);
        return;
      }

      const tokenResult = await firebaseUser.getIdTokenResult();
      setUser(firebaseUser);
      setIsAdmin(!!tokenResult.claims.admin);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 📦 Initial notes fetch (first page)
  useEffect(() => {
    const fetchInitialNotes = async () => {
      try {
        const q = query(
          collection(db, "notes"),
          orderBy("createdAt", "desc"),
          limit(PAGE_SIZE)
        );

        const snapshot = await getDocs(q);

        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setNotes(docs);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
        setHasMore(snapshot.docs.length === PAGE_SIZE);
      } catch (error) {
        console.error("Failed to fetch notes:", error);
      } finally {
        setNotesLoading(false);
      }
    };

    fetchInitialNotes();
  }, []);

  // ➕ Load more notes (pagination)
  const loadMoreNotes = async () => {
    if (!hasMore || loadingMore || !lastDoc) return;

    setLoadingMore(true);

    try {
      const q = query(
        collection(db, "notes"),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(PAGE_SIZE)
      );

      const snapshot = await getDocs(q);

      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNotes((prev) => [...prev, ...docs]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || lastDoc);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (error) {
      console.error("Failed to load more notes:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  // 🔄 Global auth loader
  if (authLoading) {
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

        <Route
          path="/home"
          element={
            <Home
              notes={notes}
              loading={notesLoading}
              loadMore={loadMoreNotes}
              hasMore={hasMore}
              loadingMore={loadingMore}
            />
          }
        >
          <Route path="unlock/:id" element={<UnlockNote />} />
        </Route>

        <Route
          path="/login"
          element={user ? <Navigate to="/home" /> : <Login />}
        />

        <Route path="/create" element={<Create user={user} />} />

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
