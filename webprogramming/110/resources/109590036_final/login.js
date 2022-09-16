const firebaseConfig = {
    apiKey: "AIzaSyBOqo9sKNwmeBfPx4xE02fqvzTFdms9BUY",
    authDomain: "finproject-37cdf.firebaseapp.com",
    projectId: "finproject-37cdf",
    storageBucket: "finproject-37cdf.appspot.com",
    messagingSenderId: "227341899812",
    appId: "1:227341899812:web:692ff454744bd8b1eb60b1",
    measurementId: "G-P34X4N5T63"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function login(){
    
    var user = "NoUser";
    db.collection("account")
        .get()
        .then(docList =>{
            console.log(docList);
            docList.forEach(doc =>{
                const data = doc.data();

                var In_account = document.getElementById("text").value;
                var In_password = document.getElementById("pass").value;
                console.log(data.Account);
                console.log(data.Password);
                console.log(In_account);
                console.log(In_password);

                if(data.Account == In_account){
                    if(data.Password == In_password){
                        user = data.Account;

                    }
                }
            })

            if(user == "user"){
                location.href = 'index_user.html';
            }
            else if(user == "admin"){
                location.href = 'index_admin.html';
            }
            else{
                alert("This account is not exist or wrong password.");
            }
        })
    
}
