import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDn1kfjlH_N4Z2PeTpSBiM8X13JXuPiPsA",
  authDomain: "blog-50e51.firebaseapp.com",
  projectId: "blog-50e51",
  storageBucket: "blog-50e51.appspot.com",
  messagingSenderId: "681976565210",
  appId: "1:681976565210:web:db988338091542233b84e3",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
