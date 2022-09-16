// Add your Firebase Project Config here... 
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_zHT9c8lTyTOnjHicL7PLnrJcXPzNMGA",
  authDomain: "final-project-ac560.firebaseapp.com",
  projectId: "final-project-ac560",
  storageBucket: "final-project-ac560.appspot.com",
  messagingSenderId: "860419398016",
  appId: "1:860419398016:web:999f9f8ea2d8d5b1928965",
  measurementId: "G-Z0CNMZXM75"
};

  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();