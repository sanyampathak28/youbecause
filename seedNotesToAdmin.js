/**
 * 🔥 Firestore Notes Seeder (Admin SDK)
 * Run: node scripts/seedNotesAdmin.js
 */

import admin from "firebase-admin";
import fs from "fs";

// 🔐 Load service account key
const serviceAccount = JSON.parse(
  fs.readFileSync("./project-01-db-a3f53-firebase-adminsdk-fbsvc-ec59454e5c.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const notes = [
  {
    from: "Ansh",
    to: "Mahi",
    question: "What do I always call you when I'm annoyed?",
    answer: "Mota",
    note:
      "I know I tease you a lot, but it’s only because you make me comfortable enough to be silly. You’ve seen my worst moods and still stayed. That means more than you know.",
    paid: true,
  },
  {
    from: "Rohit",
    to: "Sneha",
    question: "Where did we first properly talk?",
    answer: "Library",
    note:
      "That conversation in the library changed everything for me. I still remember how calm you made me feel. You don’t even realize how grounding your presence is.",
    paid: true,
  },
  {
    from: "Aman",
    to: "Neha",
    question: "What do you always order when we go out?",
    answer: "Cold coffee",
    note:
      "You pretend you don’t care, but I see how thoughtfully you listen. I notice the small things you do, even when no one else does.",
    paid: true,
  },
  {
    from: "Kunal",
    to: "Riya",
    question: "What song reminds me of you?",
    answer: "Perfect",
    note:
      "Every time this song plays, I think about how effortlessly you walked into my life. You made ordinary days feel special.",
    paid: true,
  },
  {
    from: "Sarthak",
    to: "Pooja",
    question: "What is my favorite thing about you?",
    answer: "Smile",
    note:
      "Your smile has this way of making everything feel okay. Even on my worst days, just seeing you lifts something heavy off my chest.",
    paid: true,
  },
];

// 🔁 Duplicate & vary to reach 50 entries
const names = [
  ["Rahul", "Isha"],
  ["Aditya", "Kavya"],
  ["Vikas", "Ananya"],
  ["Nikhil", "Shreya"],
  ["Arjun", "Simran"],
  ["Siddharth", "Megha"],
  ["Abhishek", "Tanya"],
  ["Varun", "Aditi"],
  ["Rohan", "Priya"],
  ["Manav", "Sakshi"],
];

while (notes.length < 50) {
  const [from, to] = names[notes.length % names.length];

  notes.push({
    from,
    to,
    question: "What is the one thing that always makes me think of you?",
    answer: "Your laugh",
    note:
      "There’s something incredibly comforting about you. I don’t always say it out loud, but you matter to me more than you probably realize. I hope someday you read this and smile.",
    paid: notes.length % 2 === 0,
  });
}

// 🚀 Seed Firestore
async function seedNotes() {
  const batch = db.batch();
  const notesRef = db.collection("notes");

  notes.forEach((note) => {
    const docRef = notesRef.doc();
    batch.set(docRef, {
      ...note,
      uid: "seed-script",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  await batch.commit();
  console.log("✅ 50 meaningful notes successfully seeded.");
  process.exit(0);
}

seedNotes();
