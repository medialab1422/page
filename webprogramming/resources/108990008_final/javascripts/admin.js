// Scripts start here...
// Product
var $productTableBody = $("#productTableBody");
// create product
var $createProductForm = $("#createProductForm");
var $createProductName = $("#createProductName");
var $createProductPrice = $("#createProductPrice");
var $createProductSalePrice = $("#createProductSalePrice");
var $createProductUseSalePrice = $("#createProductUseSalePrice");

const tagMap = {};
const productMap = {};
const productList = [];
const postList = [];

$createProductForm.submit(function (e) {
    // Prevent default behavior of browser which refreshes after submitting form that might make the web to not work
    e.preventDefault();
    console.log("New Tag Form Submitted ! ");
    const product = {
        name: $("#createProductName").val(),
        tags: $("#createProductTags").val(),
        price: $("#createProductPrice").val(),
        salePrice: $("#createProductSalePrice").val(),
        useSalePrice: $("#createProductSalePrice").val()
    };
    // Add tag to tagList collection in Firebase server
    db.collection("productList").add(product)
        .then(() => {
            // Refresh the current page
            window.location.reload();
        })
        .catch(err => console.log(err));
});


db.collection("postList")
    .get()
    .then(docList => {
        docList.forEach(doc => {
            const postId = doc.id;
            const post = doc.data();
            post['id'] = postId;
            postList.push(post);
        })
    })
    .catch(err => console.log(err));

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
        renderPostList();
    })
    .catch(err => console.log("err", err))

function renderPostList() {
    console.log("tagMap", tagMap);
    console.log("postList", postList);
    // Get all the documents from productList collection
    db
        .collection("postList")
        .get()
        // Successfully get the data
        .then(docList => {
            console.log("[docList]", docList);
            // loop all the doc from the docList
            docList.forEach(doc => {
                //console.log("[doc]", doc);
                // Get the data object from the doc
                const post = doc.data();
                console.log("[post]", post);
                // Badges HTML
                let badges = "";
                post.tags.forEach(tagId => {
                    const tag = tagMap[tagId];
                    badges += `<span class="badge badge-${tag.color}"> 
                    ${tag.name}
                    </span> `;
                });

                const pos = `   <tr>
                        <td><img height="50px" src="${post.image}"></td>
                        <td>${post.title}</td>
                        <td>${post.author}</td>
                        <td>${post.caption}</td>
                        <td>${badges}</td>
                        <td>
                            <button data-id="${doc.id}" class="btn btn-warning update-post-btn">
                                Update
                            </button>
                            <button data-id="${doc.id}" class="btn btn-danger delete-post-btn">
                                Delete
                            </button>
                        </td>
                    </tr>`;

                $("#productTableBody").append(pos)
            })
        })
        .catch(err => {
            console.log("[err]", err);
        });
}

$("body").delegate(".delete-post-btn", "click", function () {
    console.log(this);
    const postId = $(this).attr("data-id");
    db
        .doc(`postList/${postId}`).delete()
        .then(() => {
            alert("Post Deleted !");
            window.location.reload();
        })
        .catch(err => console.log(err));
});

$("body").delegate(".update-post-btn", "click", function () {
    // Get tag Id from button element
    const postId = $(this).attr("data-id");
    const post = postList.find(p => {
        return p.id == postId
    })
    console.log("[postId] =", postId);
    console.log("post", post);
    // Fill tag value in our UI
    $("#updatePostId").val(postId);
    $("#updatePostTitle").val(post.title);
    $("#updateProductTags").val(post.tags);
    $("#updatePostAuthor").val(post.author);
    $("#updatePostCaption").val(post.caption);
    $("#updateProductModal").modal();
});

$("#updatePostForm").submit(function (e) {
    e.preventDefault();
    // Get tag ID
    const postId = $("#updatePostId").val();
    // Create new tag obj
    const post = {
        title: $("#updatePostTitle").val(),
        tags: $("#updateProductTags").val(),
        author: $("#updatePostAuthor").val(),
        caption: $("#updatePostCaption").val(),
    };
    db.doc(`postList/${postId}`)
        .update(post)
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
            $("#notAdmin").fadeOut(0);
            $("#loader").fadeOut(1500);
        } else if (user.email != "admin@gmail.com") {
            $("#loader").fadeOut(1000);
            $("#notAdmin").fadeIn(1, fast);
        }
    } else {
        // Sign Out
        console.log("sign out", user);
    }
})