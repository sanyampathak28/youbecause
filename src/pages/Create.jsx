import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  getDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

const DRAFT_KEY = "youbecause_draft";

// 🔗 Cloud Run URLs
const CREATE_ORDER_URL =
  "https://createrazorpayorder-xybiunrkbq-uc.a.run.app";

const VERIFY_PAYMENT_URL =
  "https://verifyrazorpaypayment-xybiunrkbq-uc.a.run.app";

export default function Create() {
  const navigate = useNavigate();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);
  const [paymentEnabled, setPaymentEnabled] = useState(false);
  const [price, setPrice] = useState(0);

  // 🔁 Restore draft
  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      const d = JSON.parse(saved);
      setFrom(d.from || "");
      setTo(d.to || "");
      setQuestion(d.question || "");
      setAnswer(d.answer || "");
      setNote(d.note || "");
    }
  }, []);

  // 🔥 Fetch payment toggle + price
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const paymentSnap = await getDoc(doc(db, "config", "payments"));

        setPaymentEnabled(
          paymentSnap.exists() ? paymentSnap.data().enabled : false
        );

        setPrice(paymentSnap.exists() ? paymentSnap.data().price : 0);
      } catch (err) {
        console.error("Config fetch failed", err);
      }
    };

    fetchConfig();
  }, []);

  const saveDraftAndLogin = () => {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ from, to, question, answer, note })
    );
    navigate("/login");
  };

  // 🧾 Save note (free OR paid)
  const createNote = async (paid) => {
    const user = auth.currentUser;
    if (!user) return;

    await addDoc(collection(db, "notes"), {
      from,
      to,
      question,
      answer,
      note,
      uid: user.uid,
      paid,
      createdAt: serverTimestamp(),
    });

    localStorage.removeItem(DRAFT_KEY);
    navigate("/mynotes");
  };

  // 💳 Create / Skip payment
  const startPayment = async () => {
    if (!from || !to || !question || !answer || !note) {
      alert("Please fill all fields.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      saveDraftAndLogin();
      return;
    }

    try {
      setLoading(true);

      // 🟢 FREE MODE
      if (!paymentEnabled || price === 0) {
        await createNote(false);
        return;
      }

      // 🔴 PAID MODE
      const res = await fetch(CREATE_ORDER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: price }),
      });

      const data = await res.json();
      if (!data.orderId) throw new Error("Order creation failed");

      const options = {
        key: "rzp_live_jocMwh5pGKZiue",
        order_id: data.orderId,
        amount: price,
        currency: "INR",

        name: "You, Because",
        description: "Create a private note",

        prefill: {
          name: user.displayName || "Anonymous",
          email: user.email || "",
        },

        handler: async (response) => {
          const verifyRes = await fetch(VERIFY_PAYMENT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            await createNote(true);
          } else {
            alert("Payment verification failed.");
          }
        },

        theme: { color: "#000000" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-6">
      <div className="bg-white max-w-xl w-full rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-semibold mb-2">Create a private note</h1>

        {paymentEnabled && price > 0 && (
          <p className="text-sm text-gray-500 mb-4">
            Price: ₹{price / 100}
          </p>
        )}

        <Field label="From" value={from} setValue={setFrom} hint="Your name" />
        <Field label="To" value={to} setValue={setTo} hint="Who is this for?" />
        <Field
        label="Question"
        value={question}
        setValue={setQuestion}
        hint="A question only they can answer"
      />
      <p className="text-xs text-gray-500 mt-1 mb-3">
        This question will be asked before the note is revealed.
      </p>

      <Field
        label="Answer"
        value={answer}
        setValue={setAnswer}
        hint="Correct answer to unlock"
      />
      <p className="text-xs text-gray-500 mt-1 mb-4">
        The note unlocks only if this answer matches exactly.
      </p>


        <div className="mb-4">
          <label className="text-sm text-gray-600">Note</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full mt-1 border rounded-md p-2 h-28 focus:ring-2 focus:ring-black outline-none"
            placeholder="Write something meaningful..."
          />
        </div>

        <button
          onClick={startPayment}
          disabled={loading}
          className="w-full mt-4 bg-black text-white py-3 rounded-md hover:bg-gray-900 transition"
        >
          {loading
            ? "Processing..."
            : "Create"}
        </button>

        {!auth.currentUser && (
          <p className="text-xs text-gray-500 mt-3 text-center">
            You’ll be asked to login before continuing.
          </p>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, setValue, hint }) {
  return (
    <div className="mb-4">
      <label className="text-sm text-gray-600">{label}</label>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full mt-1 border rounded-md p-2 focus:ring-2 focus:ring-black outline-none"
        placeholder={hint}
      />
    </div>
  );
}
