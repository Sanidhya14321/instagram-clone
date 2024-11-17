import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBohK5o0dtObxbiwW_4qUXcdLP45hSzaeQ",
  authDomain: "instagram-clone-ed924.firebaseapp.com",
  projectId: "instagram-clone-ed924",
  storageBucket: "instagram-clone-ed924.firebasestorage.app",
  messagingSenderId: "317156633849",
  appId: "1:317156633849:web:55973854a3b0c678b08628",
  measurementId: "G-B0751QD1YV"
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
