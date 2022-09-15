// Scripts start here...
// Create tagMap
var $productTableBody = $("#productTableBody");
// create product
var $createProductForm = $("#createProductForm");
var $createProductTitle = $("#createProductTitle");
var $createProductName = $("#createProductName");
var $createProductCaptions = $("#createProductCaptions")
var $createProductTags= $("#createProductTags")
const $createPostForm = $("#createPostForm");
const $createPostTitle = $("#createPostTitle");
const $createPostImage = $("#createPostImage");
const $createPostImageURL = $("#createPostImageURL");
const $imagePreview = $("#imagePreview");
const $createPostBtn = $("#createPostBtn");

const tagMap = {};
const productMap = {};
const productList = [];

// Binding change event for createPostImage
$createPostImage.change(function (e) {
    // Get the file object when user choose any files
    const file = this.files[0];
    const fileName = file.name;
    // Setup folder path for firebase storage
    const storagePath = `product_image/${fileName}`;
    const ref = firebase.storage().ref(storagePath);
    // Upload file to firebase storage
    console.log(`Start Upload image to: ${storagePath}`);
    ref.put(file)
        .then(snapshot => {
            // If file is uploaded successfully
            console.log(snapshot);
            // Get image URL
            ref.getDownloadURL()
                .then(image => {
                    console.log("image", image);
                    $createPostImageURL.text("Image successfully uploaded!");
                    $imagePreview.html(`<img src=${image} width="600" height="400"></img>`);
                    $createPostBtn.prop("disabled", false);
                    $createPostBtn.click(function (e) {
                        e.preventDefault();
                        console.log("New Product Form Submitted ! ");
                        const Product = {
                            image: `${image}`,
                            title: $("#createProductTitle").val(),
                            name: $("#createProductName").val(),
                            captions: $("#createProductCaptions").val(),
                            tags: []
                        };
                        db.collection("productList").add(Product)
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

db.collection("productList")
    .get()
    .then(docList => {
        docList.forEach(doc => {
            const productId = doc.id;
            const product = doc.data();
            productMap[productId] = product;
            product['id'] = productId;
            productList.push(product);
        })
    })
    .catch(err => console.log(err));

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

function renderProductList(){
    console.log("tagMap", tagMap);
    // Get all the documents from productList collection
    db
        .collection("productList")
        .get()
        // Successfully get the data
        .then(docList => {
            console.log("[docList]", docList);
            // loop all the doc from the docList
            docList.forEach(doc => {
                //console.log("[doc]", doc);
                // Get the data object from the doc
                const product = doc.data();
                console.log("[product]", product);
                // Badges HTML
                let badges = "";
                product.tags.forEach(tagId => {
                    const tag = tagMap[tagId];
                    badges += `<span class="badge badge-${tag.color}"> 
                    ${tag.name}
                    </span> `;
                });

                const col = `                <div class="col-md-4 col-6">
                <div class="card my-3">
                    <img class="card-img-top" src="${product.image}" alt="">
                    <div class="card-body">
                        <h1 class="card-title mb-0">${product.title}</h1>
                        <p class="card-title mb-0">by ${product.name}</p>
                        <div>
                            ${badges}
                        </div>
                        <div class="category-list my-2">
                        Captions: 
                            ${product.captions}
                        </div>
                    </div>
                    <div class="card-footer">
                        Updated at 2021.11.04 <i class="far fa-calendar-alt"></i>
                    </div>
                </div>
            </div>`;
    
                $("#productList").append(col) // Select an Element from the web page with an ID
            })
        }) 
        // or we can use .then(function(docList){})
        // If some error happened
        .catch( err => {
            console.log("[err]", err);
        });

}

console.log("[tagMap outside the then func]", tagMap);

