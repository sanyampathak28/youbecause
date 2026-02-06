import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function Admin() {
  const [price, setPrice] = useState(4900);
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  const ref = doc(db, "config", "payments");

  useEffect(() => {
    const load = async () => {
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setPrice(snap.data().price);
        setEnabled(snap.data().paymentsEnabled);
      }
      setLoading(false);
    };
    load();
  }, []);

  const save = async () => {
    console.log(enabled);
    
    await updateDoc(ref, {
      price: Number(price),
      enabled: enabled,
      updatedAt: serverTimestamp(),
    });
    alert("Updated successfully ✅");
  };

  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow max-w-sm w-full">
        <h1 className="text-xl font-semibold mb-6">Admin – Payments</h1>

        <label className="text-sm">Price (₹)</label>
        <input
          type="number"
          value={price / 100}
          onChange={(e) => setPrice(e.target.value * 100)}
          className="w-full border rounded p-2 mb-4"
        />

        <label className="flex items-center gap-2 mb-6">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
          Payments enabled
        </label>

        <button
          onClick={save}
          className="w-full bg-black text-white py-2 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
}
