// Your web app's Firebase configuration


var s = 0;
var g = 0;

const ratyOptions = {
    starHalf: "https://cdnjs.cloudflare.com/ajax/libs/raty/3.1.1/images/star-half.png",
    starOff: "https://cdnjs.cloudflare.com/ajax/libs/raty/3.1.1/images/star-off.png",
    starOn: "https://cdnjs.cloudflare.com/ajax/libs/raty/3.1.1/images/star-on.png",
}

const ratyOptions2 = {
    starHalf: "https://cdnjs.cloudflare.com/ajax/libs/raty/3.1.1/images/star-half.png",
    starOff: "https://cdnjs.cloudflare.com/ajax/libs/raty/3.1.1/images/star-off.png",
    starOn: "https://cdnjs.cloudflare.com/ajax/libs/raty/3.1.1/images/star-on.png",
    click: function(score) {
        var input = document.getElementById("r"+this.parentElement.id).textContent;
        db
            .collection("日本動漫")
                .doc(input).update({
                    raty : score
                })
        
      }

}

set();

function set(){
    db
    .collection("日本動漫")
    .get()
    .then(docList => {
        docList.forEach(doc => {
            
            const product = doc.data();
            const col = `
            <tbody class="container">
                <tr>
                    <th id="rr${g}">${product.Name}</th>
                    <th id="r${g}">
                        <img src="${product.Img}" width="300" heigh="100">
                        <div class="my2-rating" data-score="${product.raty}"></div>
                        <p>${product.Introduction}</p>
                    </th>
                </tr>
            </tbody>`;
            if(s == 0){
                $("#tt").append(col)
            }
            g += 1;
        })
        if(s == 0){
            $(".my2-rating").raty(ratyOptions2);
            
        }
        s = 1;
    })
    .catch(err => {
        console.log("[err]", err);
    });
    
}
function clear(){
    col = "";
}
function home(){
    location.href = 'index_admin.html';
}
