$(document).ready(function () {
    var allData = []
    d3.text("data.csv", function (data) {
        var parsedCSV = d3.csv.parseRows(data)
        for (var i = 0; i < parsedCSV.length; i++) {
            var data = {
                GroupID: parsedCSV[i][0],
            }
            allData.push(data)
        }

        ShowCard();
    })

    function ShowCard() {

        for (let i = 0; i < allData.length; i++) {

            let card = `
            <div class="card col-md-6 col-sm-12 mt-1" id="${allData[i].GroupID}">
                <div class="card-body col-md-12">
                  <p class="card-title" style="font-size:large;font-weight:bold;">${i + 1 + ". " + allData[i].GroupID}</p>
                    <a href="./113/resources/${allData[i].GroupID}/proposal.pdf" class="btn btn-success m-2" target="_blank">Proposal PDF</a>
                    
					
					<iframe 
					style=" top: 0; left:0; width: 100%; height: 640px; border: 0;"
					loading="lazy";
					src="./113/resources/${allData[i].GroupID}/proposal.pdf" 
					title="Embedded PDF Viewer"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
					>
						<p>
							Your browser does not support PDFs.
						</p>
					</iframe>


				</div>
            </div>
            `

            $("#card-group").append(card)
        }

        function isInt(value) {
            return !isNaN(value) && (function (x) { return (x | 0) === x; })(parseFloat(value))
        }


        function calTotal(input, elem) {
            let feature = parseInt(input.find('.Feature').val());
            let design = parseInt(input.find('.Design').val());
            let creativity = parseInt(input.find('.Creativity').val());
            let difficulty = parseInt(input.find('.Difficulty').val());

            let total = 0;
            total = feature + design + creativity + difficulty;

            elem.attr("value", total);
            elem.html("Total: " + total + " %")
        }

    }

    $("#download").click(function () {

        var fileName = $("#fileName").val();

        var data = getCSVdata();
        var blob = new Blob([data], {
            type: "application/octet-stream"
        });

        var href = URL.createObjectURL(blob);
        var link = document.createElement("a");
        document.body.appendChild(link);

        link.href = href;
        link.download = fileName + "_final.csv";
        link.click();
    });

    function getCSVdata() {
        var data = "";
        for (var i = 0; i < allData.length; i++) {
            data = data + allData[i].GroupID;
            data = data + ",";
            data = data + $("#Feature_" + allData[i].GroupID).val();
            data = data + ",";
            data = data + $("#Design_" + allData[i].GroupID).val();
            data = data + ",";
            data = data + $("#Creativity_" + allData[i].GroupID).val();
            data = data + ",";
            data = data + $("#Difficulty_" + allData[i].GroupID).val();
            data = data + ",";
            data = data + $("#Total_" + allData[i].GroupID).attr("value")


            data = data + "\n";
        }
        return data;
    }

    $("#search").on('input', function (e) {
        let searchVal = e.target.value;

        var idArray = [];
        $('.card').each(function () {
            idArray.push(this.id);
        });

        for (let i = 0; i < idArray.length; i++) {
            if (idArray[i].includes(searchVal)) {
                $("#" + idArray[i]).show();
                // $('html, body').animate({
                //     scrollTop: $("#" + idArray[i]).offset().top-70
                // }, 100);
                // break;
            }
            else {
                $("#" + idArray[i]).hide();
            }
        }
    });

})