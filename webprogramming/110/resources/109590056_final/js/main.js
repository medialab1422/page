
const firebaseConfig = {
    apiKey: "AIzaSyDhlABy6MfBlI4cY0GNBpjmscRi0FEeH5M",
    authDomain: "panda-f71d2.firebaseapp.com",
    projectId: "panda-f71d2",
    storageBucket: "panda-f71d2.appspot.com",
    messagingSenderId: "757341888754",
    appId: "1:757341888754:web:f5f7076dbe249c26a4b06b",
    measurementId: "G-H41RVEW972"
  };

(function ($) {
    "use strict";


    /*==================================================================
    [ Focus input ]*/
    $('.input100').each(function(){
        $(this).on('blur', function(){
            if($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })    
    })
  
  
    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(){
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }

        return check;
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }
    
    /*==================================================================
    [ Show pass ]*/
    var showPass = 0;
    $('.btn-show-pass').on('click', function(){
        if(showPass == 0) {
            $(this).next('input').attr('type','text');
            $(this).find('i').removeClass('zmdi-eye');
            $(this).find('i').addClass('zmdi-eye-off');
            showPass = 1;
        }
        else {
            $(this).next('input').attr('type','password');
            $(this).find('i').addClass('zmdi-eye');
            $(this).find('i').removeClass('zmdi-eye-off');
            showPass = 0;
        }
        
    });


})(jQuery);

var app = firebase.initializeApp(firebaseConfig);

$("#Login").click(function(event) {
    event.preventDefault();
})

function AddUser(email,password){
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        var user = userCredential.user;
        console.log(user.uid);
    })
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        var email = user.email;
        var uid = user.uid;
        console.log(email, uid);
        window.location.replace('index1.html');
    } else {
    }
});

function signIn(){
    var email = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert("Success")
            window.location.replace('index1.html');
        })
        .catch((error) => {
            console.log(error);
            alert("Incorrect Password");
            window.location.reload();
        });
}

function auth(){
    var email = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            
        })
        .catch((error) => {
            console.log(error);
            alert("Invailed Account or Password");
            window.location.reload();
        });
}

function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "index.html";
        // Sign-out successful.
    }).catch((error) => {
        // An error happened.
    });
}