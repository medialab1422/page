
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyA0qTBPSDIMt6P-klZGgR9dPQ489GNdHpE",
    authDomain: "my-website-ad18d.firebaseapp.com",
    projectId: "my-website-ad18d",
    storageBucket: "my-website-ad18d.appspot.com",
    messagingSenderId: "749717654435",
    appId: "1:749717654435:web:b5cf558672d27b747a6816"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const auth =  firebase.auth();

  //signup function
  function signUp(){
    var email = document.getElementById("email");
    var password = document.getElementById("password");

    const promise = auth.createUserWithEmailAndPassword(email.value,password.value);
    //
    promise.catch(e=>alert(e.message));
    alert("SignUp Successfully");
  }

  //signIN function
  function  signIn(){
    var email = document.getElementById("email");
    var password  = document.getElementById("password");
    const promise = auth.signInWithEmailAndPassword(email.value,password.value);
    promise.catch(e=>alert(e.message));
    
  }


  //signOut

  function signOut(){
    auth.signOut();
    alert("SignOut Successfully from System");
   
  }

  //active user to homepage
  firebase.auth().onAuthStateChanged((user)=>{
    if(user){
      var email = user.email;
      alert("Active user "+email);
      setTimeout("javascript:location.href='../logedWebsite.html'", 2000);     //跳轉畫面
    }else{
      alert("No Active user Found")
    }
  })