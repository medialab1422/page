// Add your Firebase Project Config here...
  const firebaseConfig = {
    apiKey: "AIzaSyBIuRjtnro-eBityWgTff8GmbSqrGe8cp0",
    authDomain: "webprog-ntut-project.firebaseapp.com",
    projectId: "webprog-ntut-project",
    storageBucket: "webprog-ntut-project.appspot.com",
    messagingSenderId: "498796979633",
    appId: "1:498796979633:web:9cc5c3b10573fc283d0990",
    measurementId: "G-WS6P7LD69P"
  };

  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  //const analytics = getAnalytics(app);
  const db = firebase.firestore();