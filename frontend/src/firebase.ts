import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBrJYDRk_nNbtJAHpcmUgFQR0KhFel_o98",
  authDomain: "mast-calendar-81f38.firebaseapp.com",
  projectId: "mast-calendar-81f38",
  storageBucket: "mast-calendar-81f38.firebasestorage.app",
  messagingSenderId: "667674215638",
  appId: "1:667674215638:web:a06c8e3dfcaf0645c77577",
  measurementId: "G-43TCT5CLPK"
};

const app = initializeApp(firebaseConfig)

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {auth,provider}