import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import LoadingScreen from './components/LoadingScreen';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKNKctamC8eMf1elwHdaTgpngZasmD5DM",
  authDomain: "wedding-bells-16e08.firebaseapp.com",
  projectId: "wedding-bells-16e08",
  storageBucket: "wedding-bells-16e08.firebasestorage.app",
  messagingSenderId: "992705052160",
  appId: "1:992705052160:web:4bef06e2942f12c64c22e5",
  measurementId: "G-CZQGYD572M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen">
      {user ? <Dashboard user={user} /> : <AuthScreen />}
    </div>
  );
}

export default App;
