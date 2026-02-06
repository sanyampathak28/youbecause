import { signInAnonymously, signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase";

export const anonLogin = () => signInAnonymously(auth);
export const googleLogin = () => signInWithPopup(auth, provider);
