// Importer les fonctions nécessaires de Firebase SDK
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'; // Pour l'authentification
import AsyncStorage from '@react-native-async-storage/async-storage'; // Pour la persistance des sessions

// Configuration de Firebase (c'est ta configuration)
const firebaseConfig = {
  apiKey: "AIzaSyBEMy5piHLU9i9XHK2cV-VUQKFFawiAsuc",
  authDomain: "karaoker-9cf73.firebaseapp.com",
  projectId: "karaoker-9cf73",
  storageBucket: "karaoker-9cf73.appspot.com",
  messagingSenderId: "1074368294381",
  appId: "1:1074368294381:web:5a5167c252929799f6cbe4",
  measurementId: "G-M4HLXFM92D"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser le service d'authentification avec persistance via AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
