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

                let priceHTML = `<span>$ ${product.price}</span>`;
                if (product.useSalePrice){
                    // If product.price is true
                    priceHTML = `$
                    <span class="text-danger">${product.salePrice}</span>
                    <s>${product.price}</s> NTD`;
                }

                const col = `                <div class="col-md-4 col-6">
                <div class="card my-3">
                    <img class="card-img-top" src="${product.image}" alt="">
                    <div class="card-body">
                        <h4 class="card-title mb-0">${product.name}</h4>
                        <div class="category-list my-2">
                            ${badges}
                        </div>
                        <p class="price">
                        ${priceHTML}
                        </p>
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