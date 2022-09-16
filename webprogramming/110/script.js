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
                score: parsedCSV[i][6],
            }
            allData.push(data)
        }

        ShowCard();
    })

    function ShowCard() {

        for (let i = 0; i < allData.length; i++) {
            let page = allData[i].urlpage == 0 ? `./resources/${allData[i].studentID}_final/${allData[i].page}` : `${allData[i].page}`;
            let disablePageBtn = (allData[i].page == "-") ? `disabled` : ``;
            let disableDocBtn = allData[i].readme == 1 ? `` : `disabled`;
            let isSubmit = (allData[i].page == "-") ? `disabled` : ``;

            let card = `
            <div class="card col-md-6 col-sm-12 mt-1 `+ isSubmit + `" id="${allData[i].studentID}${allData[i].name}>
                <div class="card-body col-md-12">
                  <p class="card-title" style="font-size:large;font-weight:bold;">${i + 1 + ". " + allData[i].studentID} ${allData[i].name[0] + "O" + allData[i].name[2]} ${" ..."+allData[i].score}</p>
                    <a href="`+ page + `" class="btn btn-primary m-2 ` + disablePageBtn + `" target="_blank" >webpage</a>
                    <a href="https://media.githubusercontent.com/media/medialab1422/page/main/webprogramming/resources/${allData[i].studentID}_final/${allData[i].studentID}_final.pdf" class="btn btn-success m-2 ` + disableDocBtn + `" target="_blank">documentation</a>
                    
                    <iframe 
                    style=" top: 0; left:0; width: 100%; height: 640px; border: 0;"
                    loading="lazy";
                    srcdoc="<style>
                      * {
                      padding: 0;
                      margin: 0;
                      overflow: hidden;
                      }
                      
                      body, html {
                        height: 100%;
                        background-color:black;
                      }
                      
                      img, svg {
                        position: absolute;
                        width: 100%;
                        top: 0;
                        bottom: 0;
                        margin: auto;
                      }
                      
                      svg {
                        filter: drop-shadow(1px 1px 10px hsl(206.5, 70.7%, 8%));
                        transition: all 250ms ease-in-out;
                      }
                      
                      body:hover svg {
                        filter: drop-shadow(1px 1px 10px hsl(206.5, 0%, 10%));
                        transform: scale(1.2);
                      }
                    </style>
                    <a href='https://www.youtube.com/embed/${allData[i].video}?autoplay=1'>
                      <img src='https://img.youtube.com/vi/${allData[i].video}/hqdefault.jpg' alt='Coffee Recipe Javascript Project' >
                      <svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24' fill='none' stroke='#ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-play-circle'><circle cx='12' cy='12' r='10'></circle><polygon points='10 8 16 12 10 16 10 8'></polygon></svg>
                    </a>
                    "
                    src="https://www.youtube.com/embed/${allData[i].video}" 
                    title="Coffee Recipe Javascript Project"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                  </iframe>


              </div>
                </div>

            </div>
            `

            $("#card-group").append(card)
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