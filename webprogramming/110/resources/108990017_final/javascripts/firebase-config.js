// Add your Firebase Project Config here...
  const firebaseConfig = {
    apiKey: "AIzaSyDvo4EushjjPZTf9QIBFLlcjsmAZVsGahw",
    authDomain: "finalexam-d44e1.firebaseapp.com",
    projectId: "finalexam-d44e1",
    storageBucket: "finalexam-d44e1.appspot.com",
    messagingSenderId: "100284566471",
    appId: "1:100284566471:web:d2741362001f513c5667e2",
    measurementId: "G-R0HHH5LNCR"
  };

  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  //const analytics = getAnalytics(app);
  const db = firebase.firestore();

