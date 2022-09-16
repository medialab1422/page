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

db.collection("productList")
    .get()
    .then(docList => {
        docList.forEach(doc => {
            const productId = doc.id;
            const product = doc.data();
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
                let yesOrNo = "";
                if (product.useSalePrice) {
                    yesOrNo = "Yes";
                } else {
                    yesOrNo = "No";
                }

                const col = `   <tr>
                        <td><img height="50px" src="${product.image}"></td>
                        <td>${product.name}</td>
                        <td>$${product.price}</td>
                        <td>$${product.salePrice}</td>
                        <td>${yesOrNo}</td>
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
    console.log("[productId] =", productId);
    console.log("product", product);
    // Fill tag value in our UI
    $("#updateProductId").val(productId);
    $("#updateProductName").val(product.name);
    $("#updateProductTags").val(product.tags);
    $("#updateProductPrice").val(product.price);
    $("#updateProductSalePrice").val(product.salePrice);
    $("#updateProductUseSalePrice").val(product.useSalePrice);
    $("#updateProductModal").modal();
});

$("#updateProductForm").submit(function (e) {
    e.preventDefault();
    // Get tag ID
    const productId = $("#updateProductId").val();
    // Create new tag obj
    const product = {
        name: $("#updateProductName").val(),
        tags: $("#updateProductTags").val(),
        price: $("#updateProductPrice").val(),
        salePrice: $("#updateProductSalePrice").val(),
        useSalePrice: $("#updateProductUseSalePrice").val()
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
            $("#loader").fadeOut();
        } else {

        }
    } else {
        // Sign Out
        console.log("sign out", user);
    }
})