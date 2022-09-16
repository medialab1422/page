const firebaseConfig = {
    apiKey: "AIzaSyD81LkN_kDul9bZhhUOHiPgR0nauWazKKw",
    authDomain: "final-assignment-109590001.firebaseapp.com",
    projectId: "final-assignment-109590001",
    storageBucket: "final-assignment-109590001.appspot.com",
    messagingSenderId: "364233562687",
    appId: "1:364233562687:web:cf650192c20879abba368a",
    measurementId: "G-FXNZ492Z2Y"
};
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const account = db.collection('Account');
//signUp
const signUpEmail = document.querySelector('#signUpEmail');
const signUpPassword = document.querySelector('#signUpPassword');
const signUpType = document.querySelector('#signUpType');
const signUpSubmit = document.querySelector('#signUpSubmit');
//signIn
const signInEmail = document.querySelector('#signInEmail');
const signInPassword = document.querySelector('#signInPassword');
const signInType = document.querySelector('#signInType');
const signInSubmit = document.querySelector('#signInSubmit');
const displayIn = document.getElementById('displayIn')
//signOut
const signOutBtn = document.getElementById('signOutBtn');

async function addAccount(event) {
    event.preventDefault();
    const Email = signUpEmail.value;
    const Password = signUpPassword.value;
    const Type = signUpType.value;
    await account.add({
        Email,
        Password,
        Type
        });
    window.location.reload(); 
}
async function checkAccount(event) {
    event.preventDefault();
    const Email = signInEmail.value;
    const Password = signInPassword.value;
    const Type = signInType.value;
    var ref = db.collection('Account')
    ref.where('Email','==',Email).where('Password','==',Password).where('Type','==',Type).get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            displayIn.textContent="已登入 帳號：" + Email
        });
    });
    displayIn.textContent="未登入"
}

async function Out() {
    displayIn.textContent="未登入"
}
signUpSubmit.addEventListener('click', addAccount);
signInSubmit.addEventListener('click', checkAccount);
signOutBtn.addEventListener('click', Out);

