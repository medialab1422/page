// Scripts start here...


// Your web app's Firebase configuration


const $createPostForm = $("#createPostForm");

const $createPostImage = $("#createPostImage");
const $createPostImageURL = $("#createPostImageURL");
const $imagePreview = $("#imagePreview");
const $createPostBtn = $("#createPostBtn");
const $galleryPostList = $("#galleryPostList");

// Binding change event for createPostImage
$createPostImage.change(function (e) {
    // Get the file object when user choose any files
    const file = this.files[0];
    const fileName = file.name;
    // Setup folder path for firebase storage
    const storagePath = `Img/${fileName}`;
    
    const ref = firebase.storage().ref(storagePath);
    console.log(ref);
    // Upload file to firebase storage

    $createPostImageURL.text(`Start Upload image to: ${storagePath}`);
    ref.put(file)
        .then(snapshot => {
            // If file is uploaded successfully
            console.log(snapshot);
            // Get image URL

            var input1 = document.getElementById("createPostTitle1").value;
            var input2 = document.getElementById("createPostTitle2").value;
            var input3 = document.getElementById("selectElem").value;
            if(input3 == 1){
                input3 = "日本動漫";
            }
            else{
                input3 = "美式卡通";
            }
            ref.getDownloadURL()
                .then(imageURL => {
                    console.log("imageURL", imageURL);
                    
                    $imagePreview.append(`<img src="${imageURL}" width="300" heigh="100">`);
                    db
                        .collection(input3)
                            .doc(input1)
                                .set({
                                    Name : input1,
                                    Introduction : input2,
                                    Img : imageURL
                                })
                    $('#createPostBtn').prop("disabled", false);
                   
                })
        })
        
});
function home(){
    location.href = 'index_admin.html';
}