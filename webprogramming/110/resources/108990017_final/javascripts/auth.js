// Scripts start here...

// Select DOM from web
const auth = firebase.auth();

// Sign Up form
var $signUpForm = $("#signUpForm"),
    $signUpEmail = $("#signUpEmail"),
    $signUpPassword = $("#signUpPassword");

    // signup
const signupForm = document.querySelector('#signUpForm');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    //get user info
    const email = signupForm['signUpEmail'].value;
    const password = signupForm['signUpPassword'].value;

    // sign up the user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        console.log(cred)
        const modal = document.querySelectorAll('#signUpModal');
        M.modal.getInstance(modal).close();
        signupForm.reset();
    });
});

// Sign in form
var $signInForm = $("#signInForm"),
    $signInEmail = $("#signInEmail"),
    $signInPassword = $("#signInPassword");

// Sign out button
var $signOutBtn = $("#signOutBtn");

$signUpForm.submit(function (e) {
    e.preventDefault();
    // When sign up form submitted
    console.log("Ready for sign up");
});

$signInForm.submit(function (e) {
    e.preventDefault();
    // When sign in form submitted
    console.log("Ready for sign in");
    const email = $signInEmail.val();
    const password = $signInPassword.val();
    // console.log(email, password);
    // Firebase sign in method
    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(res => {
            console.log("Sign In Successful!", res);
            alert("Sign In");
            if (email == 'admin@gmail.com') {
                window.location = "admin.html";
            }
        })
        .catch(err => {
            console.log(err);
            if (err.code == 'auth/wrong-password') {
                alert("Wrong Password!")
            } else if (err.code == 'auth/user-not-found') {
                alert("User not Found!");
            }
        });
});

$signOutBtn.click(function () {
    // When click sign out button
    console.log("Ready for sign out");
    firebase.auth().signOut()
        .then(() => {
            window.location = "index.html";
        })
        .catch(err => console.log(err))
});

const signUpEmail = document.querySelector('#signup-form');
signUpEmail.addEventListener('submit', (e) => {
    e.preventDefault();
    
    //get user info
    const email = signUpEmail['signup-email'].value;
    const password = signUpEmail['signup-password'].value;

    // sign up the user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        console.log(cred)
        const modal = document.querySelectorAll('#modal-signup');
        M.modal.getInstance(modal).close();
        signUpEmail.reset();
    });
});

