// Add your Firebase Project Config here...
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUajTJztVnMGZOWAy8NZJkOejuM8of8iE",
  authDomain: "final-webprogramming.firebaseapp.com",
  projectId: "final-webprogramming",
  storageBucket: "final-webprogramming.appspot.com",
  messagingSenderId: "618369185385",
  appId: "1:618369185385:web:f9ac02d0f501bdc5dbd4f8",
  measurementId: "G-VLMPWLPFDX"
};

  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  //const analytics = getAnalytics(app);
  const db = firebase.firestore();