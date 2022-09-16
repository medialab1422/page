var rollV, nameV, genderV, addressV;
var nameVrate,genderVrate,addressVrate;
var nameVrate1,genderVrate1,addressVrate1;
var nameVrate2,genderVrate2,addressVrate2;
function readFom() {
  rollV = document.getElementById("roll").value;     //日期
  nameV = document.getElementById("name").value;     //熱量
  genderV = document.getElementById("gender").value;  //水分
  addressV = document.getElementById("address").value; //運動時間
  nameVrate =nameV /2000 *314;
  genderVrate =genderV /2000 *314;
  addressVrate =addressV /100 *314;
  nameVrate1 = 314- nameVrate;
  genderVrate1 = 314- genderVrate;
  addressVrate1 = 314- addressVrate;
  nameVrate2 = nameVrate/314*100;
  genderVrate2 = genderVrate/314*100;
  addressVrate2 = addressVrate/314*100;
  console.log(rollV, nameV, addressV, genderV,nameVrate,genderVrate,addressVrate,nameVrate1,genderVrate1,addressVrate1);
}

document.getElementById("insert").onclick = function () {
  readFom();

  firebase
    .database()
    .ref("health/" + rollV)
    .set({
      Date: rollV,
      Calories: nameV,
      Water: genderV,
      ExcerciseTime: addressV,
      CaloriesRate:nameVrate,
      WaterRate:genderVrate,
      ExcerciseTimeRate:addressVrate,
      Rate1: nameVrate1,
      Rate2: genderVrate1,
      Rate3: addressVrate1,
      Rate4: nameVrate2,
      Rate5: genderVrate2,
      Rate6: addressVrate2,
    });
  alert("Data Inserted");
  document.getElementById("roll").value = "";
  document.getElementById("name").value = "";
  document.getElementById("gender").value = "";
  document.getElementById("address").value = "";
};

document.getElementById("read").onclick = function () {
  readFom();

  firebase
    .database()
    .ref("health/" + rollV)
    .on("value", function (snap) {
      document.getElementById("roll").value = snap.val().rollNo;
      document.getElementById("name").value = snap.val().name;
      document.getElementById("gender").value = snap.val().gender;
      document.getElementById("address").value = snap.val().address;
    });
};

document.getElementById("update").onclick = function () {
  readFom();

  firebase
    .database()
    .ref("health/" + rollV)
    .update({
      //   rollNo: rollV,
      Calories: nameV,
      Water: genderV,
      ExcerciseTime: addressV,
      CaloriesRate:nameVrate,
      WaterRate:genderVrate,
      ExcerciseTimeRate:addressVrate,
      Rate1: nameVrate1,
      Rate2: genderVrate1,
      Rate3: addressVrate1,
      Rate4: nameVrate2,
      Rate5: genderVrate2,
      Rate6: addressVrate2,
    });
  alert("Data Update");
  document.getElementById("roll").value = "";
  document.getElementById("name").value = "";
  document.getElementById("gender").value = "";
  document.getElementById("address").value = "";
};
document.getElementById("delete").onclick = function () {
  readFom();

  firebase
    .database()
    .ref("health/" + rollV)
    .remove();
  alert("Data Deleted");
  document.getElementById("roll").value = "";
  document.getElementById("name").value = "";
  document.getElementById("gender").value = "";
  document.getElementById("address").value = "";
};

// 在網頁即時顯示firebase資料
var ref = firebase.database().ref("health");
ref.on('value', function (snapshot) {
  var val = snapshot.val();
  let list = '';
  $.each(val,function(i,item){
    console.log(i,item);
    list = `${list} <h2>Date:${item.Date}</h2>
                    <li class = "li">Calories:${item.Calories}(kcal)</li>
                    <li class = "li">Water${item.Water}(ml)</li>
                    <li class = "li">Excercise Time:${item.ExcerciseTime}(min)</li>
                    <h1></h1>
                    <svg width="200" height="120">
      <circle cx="55" cy="55" r="50" stroke="rgb(255,0,0)" stroke-width="10" fill="none" stroke-dasharray="${item.CaloriesRate},${item.Rate1}" stroke-dashoffset="78">
      </circle>
      <text x="28" y="45" fill="white">Calories</text>
      <text x="38" y="70" fill="white">${item.Rate4}%</text>
      </svg>
      <svg width="200" height="120">
      <circle cx="55" cy="55" r="50" stroke="rgb(10,200,255)" stroke-width="10" fill="none" stroke-dasharray="${item.WaterRate},${item.Rate2}" stroke-dashoffset="78">
      </circle>
      <text x="38" y="45" fill="white">water</text>
      <text x="38" y="70" fill="white">${item.Rate5}%</text>
      </svg>
      <svg width="200" height="120">
      <circle cx="55" cy="55" r="50" stroke="rgb(0,247,132)" stroke-width="10" fill="none" stroke-dasharray="${item.ExcerciseTimeRate},${item.Rate3}" stroke-dashoffset="78">
      </circle>
      <text x="8" y="45" fill="white">ExcerciseTime</text>
      <text x="38" y="70" fill="white">${item.Rate6}%</text>
      </svg>`
                    
  });
  $('#ul').html(list)
  console.log(val);
})

