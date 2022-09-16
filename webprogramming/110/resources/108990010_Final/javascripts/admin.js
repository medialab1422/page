// Scripts start here...
// Product
var $productTableBody = $("#productTableBody");
// create product
var $createProductForm = $("#createProductForm");
var $createProductTitle = $("#createProductTitle");
var $createProductName = $("#createProductName");
var $createProductCaptions = $("#createProductCaptions");
var $createProductTags = $("#createProductTags");
const $createPostForm = $("#createPostForm");
const $createPostTitle = $("#createPostTitle");
const $createPostImage = $("#createPostImage");
const $createPostImageURL = $("#createPostImageURL");
const $imagePreview = $("#imagePreview");
const $createPostBtn = $("#createPostBtn");
const $galleryPostList = $("#galleryPostList");

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
                    $imagePreview.html(`<img src=${image}></img>`);
                    $createProductForm.submit(function (e) {
                        e.preventDefault();
                        console.log("New Product Form Submitted ! ");
                        const Product = {
                            image: `${image}`,
                            title: $("#createProductTitle").val(),
                            name: $("#createProductName").val(),
                            captions: $("#createProductCaptions").val(),
                            tags: $("#createProductTags").val()
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
            const tagId = doc.id;
            const tag = doc.data();
            tagMap[tagId] = tag;
        });
        console.log("[tagMap in the func]", tagMap);
        console.log("[productMap in the function]", productMap);
        // render product list
        renderProductList();
    })
    .catch(err => console.log("err", err))

function renderProductList() {
    console.log("tagMap", tagMap);
    console.log("productList", productList);
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

                const col = `   <tr>
                        <td><img height="50px" src="${product.image}"></td>
                        <td>${product.title}</td>
                        <td>${product.name}</td>
                        <td>${product.captions}</td>
                        <td>${badges}</td>
                        <td>
                            <button data-id="${doc.id}" class="btn btn-warning update-product-btn">
                                Update
                            </button>
                            <button data-id="${doc.id}" class="btn btn-danger delete-product-btn">
                                Delete
                            </button>
                        </td>
                    </tr>`;

                $("#productTableBody").append(col)
            })
        })
        .catch(err => {
            console.log("[err]", err);
        });
}

$("body").delegate(".delete-product-btn", "click", function () {
    console.log(this);
    const productId = $(this).attr("data-id");
    db
        .doc(`productList/${productId}`).delete()
        .then(() => {
            alert("Product Deleted !");
            window.location.reload();
        })
        .catch(err => console.log(err));
});

$("body").delegate(".update-product-btn", "click", function () {
    // Get tag Id from button element
    const productId = $(this).attr("data-id");
    const product = productList.find(p => {
        return p.id == productId
    })
    console.log("productId", productId);
    console.log("product", product);
    // Fill tag value in our UI
    $("#updateProductId").val(productId);
    $("#updateProductTitle").val(product.title);
    $("#updateProductName").val(product.name);
    $("#updateProductTags").val(product.tags);
    $("#updateProductCaptions").val(product.captions);
    $("#updateProductModal").modal();
});

$("#updateProductForm").submit(function (e) {
    e.preventDefault();
    // Get tag ID
    const productId = $("#updateProductId").val();
    // Create new tag obj
    const product = {
        title: $("#updateProductTitle").val(),
        name: $("#updateProductName").val(),
        tags: $("#updateProductTags").val(),
        captions: $("#updateProductCaptions").val()
    };
    db.doc(`productList/${productId}`)
        .update(product)
        .then(() => {
            alert("Updated Successfully!");
            window.location.reload();
        })
        .catch(err => console.log(err));
});

// Tag
// Select an element with id="tagTableBody"
var $tagTableBody = $("#tagTableBody");
// create tag
var $createTagForm = $("#createTagForm");
var $createTagName = $("#createTagName");
var $createTagColor = $("#createTagColor");

// Binding the event that user submitted $createTagForm
$createTagForm.submit(function (e) {
    // Prevent default behavior of browser which refreshes after submitting form that might make the web to not work
    e.preventDefault();
    console.log("New Tag Form Submitted ! ");
    const tag = {
        name: $createTagName.val(),
        color: $createTagColor.val()
    };
    // Add tag to tagList collection in Firebase server
    db.collection("tagList").add(tag)
        .then(() => {
            // Refresh the current page
            window.location.reload();
        })
        .catch(err => console.log(err));
});

const tagList = [];

db.collection("tagList").get()
    .then(docList => {
        docList.forEach(doc => {
            const tag = doc.data();
            const tagId = doc.id;
            tag['id'] = tagId;
            // Add tag data to tagList
            tagList.push(tag);
        })
        renderTagList();
    })
    .catch(err => console.log("err", err));

function renderTagList() {
    tagList.forEach(tag => {
        // Append option to create & update select UI
        $("#createProductTags, #updateProductTags").append(
            ` <option value="${tag.id}"> ${tag.name} </option>`
        );

        // Creates HTML table row for each tag
        const tableRow = `<tr>
        <td>${tag.name}</td>
        <td>
            <div class="color-box bg-${tag.color}"></div>
        </td>
        <td>
            <button data-id="${tag.id}" class="btn btn-warning update-tag-btn">
                Update
            </button>
            <button data-id="${tag.id}" class="btn btn-danger delete-tag-btn">
                Delete
            </button>
        </td>
    </tr>`;
        $tagTableBody.append(tableRow);
    });
    // Bootstrap selectpicker
    $("#createProductTags, #updateProductTags").selectpicker();
}

$("body").delegate(".delete-tag-btn", "click", function () {
    console.log(this);
    const tagId = $(this).attr("data-id");
    db
        .doc(`tagList/${tagId}`).delete()
        .then(() => {
            alert("This tag is removed ! ");
            window.location.reload();
        })
        .catch(err => console.log(err));
});

// Binding click for .update-tag-btn
$("body").delegate(".update-tag-btn", "click", function () {
    // Get tag Id from button element
    const tagId = $(this).attr("data-id");
    // Find that object with the same ID in the tagList
    const tag = tagList.find(t => {
        return t.id == tagId
    })
    console.log("tagId", tagId);
    console.log("tag", tag);
    // Fill tag value in our UI
    $("#updateTagId").val(tagId);
    $("#updateTagName").val(tag.name);
    $("#updateTagColor").val(tag.color);
    $("#updateTagModal").modal();
});

$("#updateTagForm").submit(function (e) {
    // Prevent browser from refreshing
    e.preventDefault();
    // Get tag ID
    const tagId = $("#updateTagId").val();
    // Create new tag obj
    const tag = {
        name: $("#updateTagName").val(),
        color: $("#updateTagColor").val()

    };
    console.log(tagId, tag);
    // Update data to Firestore
    // .doc("COLLECTION/DOC_ID")")
    db.doc(`tagList/${tagId}`)
        .update(tag)
        .then(() => {
            alert("Updated Successfully!");
            window.location.reload();
        })
        .catch(err => console.log(err));
});

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        // Sign In
        console.log("sign in user", user);
        if (user.email == "admin@gmail.com") {
            $("#loader" || "#loaderNo" || "#loaderTitleChild").fadeOut();
        } else {

        }
    } else {
        // Sign Out
        console.log("sign out", user);
    }
})