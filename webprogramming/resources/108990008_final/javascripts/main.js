// Scripts start here...
// Create tagMap
const tagMap = {};
// Get all tags data from db
db.collection("tagList")
    .get()
    .then(docList => {
        docList.forEach(doc => {
            // doc.id => to get the id of document
            // doc.data => to get the object of data of the document (name of tag, color of tag)
            // console.log("[tag id]", doc.id);
            // console.log("[tag data]", doc.data());
            const tagId = doc.id;
            const tag = doc.data();
            // Save tagId as a property of tagMap
            tagMap[tagId] = tag;
        });
        console.log("[tagMap in then func]", tagMap);
        // render product list
        renderProductList();
    })
    .catch(err => console.log("err", err))

console.log("[tagMap outside the then func]", tagMap);

const $createPostForm = $("#createPostForm");
const $createPostTitle = $("#createPostTitle");
const $createPostAuthor = $("#createPostAuthor");
const $createPostImage = $("#createPostImage");
const $createPostImageURL = $("#createPostImageURL");
const $imagePreview = $("#imagePreview");
const $createPostBtn = $("#createPostBtn");
const $createCaption = $("#createCaption");
const $galleryPostList = $("#galleryPostList");

// Binding change event for createPostImage
$createPostImage.change(function (e) {
    // Get the file object when user choose any files
    const file = this.files[0];
    const fileName = file.name;
    // Setup folder path for firebase storage
    const storagePath = `galleryImages/${fileName}`;
    const ref = firebase.storage().ref(storagePath);
    // Upload file to firebase storage
    console.log(`Start Upload image to: ${storagePath}`);
    $createPostImageURL.text(`Start Upload image to: ${storagePath}`);
    ref.put(file)
        .then(snapshot => {
            // If file is uploaded successfully
            console.log(snapshot);
            // Get image URL
            ref.getDownloadURL()
                .then(imageURL => {
                    console.log("imageURL", imageURL);
                    $createPostImageURL.text(`Wow really delicious Food!`);
                    $imagePreview.html(`<img src=${imageURL} width="600" height="400"></img>`);
                    $createPostBtn.prop("disabled", false);
                    $createPostBtn.click(function (e) {
                        e.preventDefault();
                        console.log("NICE");
                        const post = {
                            title: $createPostTitle.val(),
                            author: $createPostAuthor.val(),
                            tags: [],
                            caption: $createCaption.val(),
                            image: `${imageURL}`
                        };

                        db.collection("postList").add(post)
                            .then(() => {
                                window.location.reload();
                            })
                            .catch(err => console.log(err));
                    });
                })
                .catch(err => {
                    $createPostImageURL.text(`Error: ${err}`);
                    console.log(err)
                });
        })
        .catch(err => {
            $createPostImageURL.text(`Error: ${err}`);
            console.log(err)
        });
});

const postMap = {};

db.collection("postList")
    .get()
    .then(docList => {
        docList.forEach(doc => {
            const post = doc.data();
            const postId = doc.id;
            postMap[postId] = post;
        });
        renderPostList();
    })
    .catch(err => console.log("err", err))

function renderPostList() {
    db
        .collection("postList")
        .get()
        .then(postList => {
            postList.forEach(doc => {
                const post = doc.data();
                let badges = "";
                post.tags.forEach(tagId => {
                    const tag = tagMap[tagId];
                    badges += `<span class="badge badge-${tag.color}"> 
                    ${tag.name}
                    </span> `;
                });
                const card = `                <div class="col-md-4 col-6">
                <div class="card my-3">
                    <img class="card-img-top" src="${post.image}" alt="">
                    <div class="card-body">
                        <h4 class="card-title mb-0">
                            ${post.title}
                         </h4>
                        <p class="caption">
                            ${post.caption}
                            </p>
                        <p class="author">by:
                            <b>${post.author}</b>
                        <div class="category-list my-2">
                            ${badges}
                        </div>
                        </p>
                    </div>  
                </div>
            </div>`;

                $("#productList").append(card)
            })
        })
        .catch(err => {
            console.log("[err]", err);
        });
}