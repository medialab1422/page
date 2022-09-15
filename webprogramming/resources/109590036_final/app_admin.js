const firebaseConfig = {
  apiKey: "AIzaSyBOqo9sKNwmeBfPx4xE02fqvzTFdms9BUY",
  authDomain: "finproject-37cdf.firebaseapp.com",
  projectId: "finproject-37cdf",
  storageBucket: "finproject-37cdf.appspot.com",
  messagingSenderId: "227341899812",
  appId: "1:227341899812:web:692ff454744bd8b1eb60b1",
  measurementId: "G-P34X4N5T63"
};
function show(){
const arrows = document.querySelectorAll(".arrow");
const movieLists = document.querySelectorAll(".movie-list");

arrows.forEach((arrow, i) => {
  const itemNumber = movieLists[i].querySelectorAll("img").length;
  let clickCounter = 0;
  arrow.addEventListener("click", () => {
    const ratio = Math.floor(window.innerWidth / 270);
    clickCounter++;
    if (itemNumber - (4 + clickCounter) + (4 - ratio) >= 0) {
      movieLists[i].style.transform = `translateX(${
        movieLists[i].computedStyleMap().get("transform")[0].x.value - 300
      }px)`;
    } else {
      movieLists[i].style.transform = "translateX(0)";
      clickCounter = 0;
    }
  });

  console.log(Math.floor(window.innerWidth / 270));
});

//TOGGLE

const ball = document.querySelector(".toggle-ball");
const items = document.querySelectorAll(
  ".container,.movie-list-title,.navbar-container,.sidebar,.left-menu-icon,.toggle"
);

ball.addEventListener("click", () => {
  items.forEach((item) => {
    item.classList.toggle("active");
  });
  ball.classList.toggle("active");
});
}
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
var sum = 0;
db.collection("日本動漫")
	.get()
	.then(docList =>{
		docList.forEach(doc => {
			const anime = doc.data();

			sum = sum + 1;
			const col = `
			<div class="movie-list-item">
				<img class="movie-list-item-img" src="${anime.Img}" alt="">
				<span id="tt${sum}" class="movie-list-item-title">${anime.Name}</span>
				<p class="movie-list-item-desc">${anime.Introduction}</p>
				<button id="t${sum}" class="movie-list-item-delete-button" onclick="Delete(this.id)">Delete</button>
				<button class="movie-list-item-button" onclick="review()" >Reviews</button>
			</div>`;
			
			$("#addList1").append(col)
		})
		cartoon()
	})
function cartoon(){
	db.collection("美式卡通")
	.get()
	.then(docList =>{
		docList.forEach(doc => {
			const anime = doc.data();

			sum = sum + 1;
			const col = `
			<div class="movie-list-item">
				<img class="movie-list-item-img" src="${anime.Img}" alt="">
				<span id="cc${sum}" class="movie-list-item-title">${anime.Name}</span>
				<p class="movie-list-item-desc">${anime.Introduction}</p>
				<button id="c${sum}" class="movie-list-item-delete-button" onclick="Delete(this.id)">Delete</button>
				<button class="movie-list-item-button" onclick="review()">Reviews</button>
			</div>`;
			
			$("#addList2").append(col)
		})
		show();
	})
}
function logout(){
    if(confirm('確定要登出嗎?') == true){
        location.href = './index.html';
    }
}

function Delete(x){
	var title;
	var type;
	if(x[0] == 't'){
		title = document.getElementById("t"+x).textContent;
		type = "日本動漫";
	}
	else{
		title = document.getElementById("c"+x).textContent;
		type = "美式卡通";
	}
	console.log(type);
	console.log(title);
	if(confirm('確定要刪除嗎?') == true){
        db.collection(type).doc(title).delete().then(function(){
			location.href = './index_admin.html';
		})
		
    }
}
function Add(){
	location.href = "./update_video.html";

}
function review(){
	location.href = "./reviews.html";
}