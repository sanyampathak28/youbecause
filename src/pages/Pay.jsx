import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Pay() {
  const nav = useNavigate();
  const data = JSON.parse(localStorage.getItem("draft"));

  const pay = () => {
    const options = {
      key: "RAZORPAY_KEY",
      amount: 9900,
      currency: "INR",
      name: "YouBecause",
      handler: async (res) => {
        const doc = await addDoc(collection(db, "notes"), {
          ...data,
          answer: data.answer.toLowerCase(),
          ownerId: auth.currentUser.uid,
          published: true,
          paymentId: res.razorpay_payment_id,
          createdAt: serverTimestamp(),
        });
        nav(`/note/${doc.id}`);
      },
    };

    new window.Razorpay(options).open();
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <button
        onClick={pay}
        className="bg-roseSoft text-white px-8 py-4 rounded-full text-xl"
      >
        Pay & Lock Love 🔒💖
      </button>
    </div>
  );
}
