// Scripts start here...

// Select DOM from web

// Sign Up form
var $signUpForm = $("#signUpForm"),
    $signUpEmail = $("#signUpEmail"),
    $signUpPassword = $("#signUpPassword");

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
            else if(email == 'user@gmail.com') {
                window.location = "index.html";
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

