import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAorbpgQ25tfGW_4EOCXY28nLH2BvmkYUY",
  authDomain: "test-logowanie-ca2a2.firebaseapp.com",
  projectId: "test-logowanie-ca2a2",
  storageBucket: "test-logowanie-ca2a2.firebasestorage.app",
  messagingSenderId: "331245632254",
  appId: "1:331245632254:web:b20c2cf74f2f2b82ea43af",
  measurementId: "G-DLD4KQSCMG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);