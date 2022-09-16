const firebaseConfig = {
    apiKey: "AIzaSyDhlABy6MfBlI4cY0GNBpjmscRi0FEeH5M",
    authDomain: "panda-f71d2.firebaseapp.com",
    projectId: "panda-f71d2",
    storageBucket: "panda-f71d2.appspot.com",
    messagingSenderId: "757341888754",
    appId: "1:757341888754:web:f5f7076dbe249c26a4b06b",
    measurementId: "G-H41RVEW972"
  };

  var app = firebase.initializeApp(firebaseConfig);


function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "index.html";
        // Sign-out successful.
    }).catch((error) => {
        // An error happened.
    });
}