$(document).ready(function () {
    var allData = []
    d3.text("data.csv", function (data) {
        var parsedCSV = d3.csv.parseRows(data)
        for (var i = 0; i < parsedCSV.length; i++) {
            var data = {
                studentID: parsedCSV[i][0],
                name: parsedCSV[i][1],
                page: parsedCSV[i][2],
                readme: parsedCSV[i][3],
                video: parsedCSV[i][4],
                urlpage: parsedCSV[i][5],
            }
            allData.push(data)
        }

        ShowCard();
    })

    function ShowCard() {

        for (let i = 0; i < allData.length; i++) {
            let isSubmitColor = (allData[i].page == "-") ? `style="background-color:#DBA4A4"` : ``;
            let isSubmit = (allData[i].page == "-") ? ` **未繳交作業**` : ``;
            let page = allData[i].urlpage == 0 ? `./resource/${allData[i].studentID}_final/${allData[i].page}` : `${allData[i].page}`;

            let card = `
            <div class="card col-md-6 col-sm-12 mt-1" id="${allData[i].studentID}${allData[i].name}" ` + isSubmitColor + `>
                <div class="card-body col-md-12">
                  <h5 class="card-title">${allData[i].studentID} ${allData[i].name}` + isSubmit + `</h5>
                    <a href="`+ page + `" class="btn btn-primary m-2" target="_blank">webpage</a>
                    <a href="./resource/${allData[i].studentID}_final/${allData[i].readme}" class="btn btn-primary m-2" target="_blank">documentation</a>
                 
                    <iframe id="ytplayer" type="text/html" width="100%" height="640"
                    src="https://www.youtube.com/embed/` + allData[i].video + `?autoplay=1"
                    frameborder="0"></iframe>
              </div>
                </div>

            </div>
            `

            $("#card-group").append(card)
            // if (allData[i + 1].page == "") { break; }
        }

        function isInt(value) {
            return !isNaN(value) && (function (x) { return (x | 0) === x; })(parseFloat(value))
        }

        $(".score").change(function (e) {
            let feature = e.target.value;

            let type = e.target.placeholder;
            let max = (type == "Feature" || type == "Difficulty") ? 10 : 5;
            if (!isInt(feature)) {
                alert("please input an integer between 0 - " + max);
                $(this).val(0)
                return;
            }
            else {
                if (feature < 0 || feature > 10) {
                    alert("please input an integer between 0 - " + max);
                    $(this).val(0)
                    return;
                }

                let inputGroup = $(this).parent(".input-group")

                let input = inputGroup.parent(".input")
                let totalElem = input.find('.total');

                calTotal(inputGroup, totalElem)
            }
        });

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
            data = data + allData[i].studentID;
            data = data + ",";
            data = data + $("#Feature_" + allData[i].studentID).val();
            data = data + ",";
            data = data + $("#Design_" + allData[i].studentID).val();
            data = data + ",";
            data = data + $("#Creativity_" + allData[i].studentID).val();
            data = data + ",";
            data = data + $("#Difficulty_" + allData[i].studentID).val();
            data = data + ",";
            data = data + $("#Total_" + allData[i].studentID).attr("value")


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