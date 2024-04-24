var year = []
var term = []
var allData = []
var currentYear = null;
var currentTerm = null;
$(document).ready(function () {
    $(document).on("scroll", function () {
        secondPage = $("nav li:nth-child(2) a").attr("href")

        if ($("body").scrollTop() >= $("nav").height()) {
            $("nav").addClass("fixed")
        } else {
            $("nav").removeClass("fixed")
        }
    })

    d3.text("data.csv", function (data) {
        var parsedCSV = d3.csv.parseRows(data)

        var current_year = ""
        var _term = ""
        for (var i = 0; i < parsedCSV.length; i++) {
            if (parsedCSV[i][0] == "year") {
                current_year = parsedCSV[i][1]
                _term = parsedCSV[i][2]
                year.push(current_year);
                term.push(_term);
                continue
            }

            var data = {
                year: current_year,
                yearterm: _term,
                title: parsedCSV[i][0],
                video: parsedCSV[i][1],
                pdf: parsedCSV[i][2],
                desc: parsedCSV[i][3],
            }

            allData.push(data)
        }

        SetDropDown()
        ShowYearDemo(year[year.length - 1], _term)
    })
})

function randomColor() {
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += Math.floor(Math.random() * 10);
    }
    return color;
}

function SetDropDown() {
    for (var i = year.length - 1; i >= 0; i--) {
        var dropDownHtml =
            `<button onclick="UpdateYearDropDown(` + year[i] + `,'` + term[i] + `')" data-offset="-140">` + year[i] + `學年度`
        dropDownHtml = term[i] == "mid" ? dropDownHtml + `（期中）</button>` : dropDownHtml + `</button>`
        $("#yearDropdown").append(dropDownHtml)
    }
}

function HideDropDown() {
    if (IsPC()) {
        $(".dropdown-content").hide(0, function () {
            setTimeout(function () {
                $(".dropdown-content").css("display", "");
            }, 100)
        })
    }
}

function UpdateYearDropDown(year, _term) {
    HideDropDown()
    scrolltoID("about", 0)
    ShowYearDemo(year, _term)
    scrolltoID("portfolio", 500)
}

function UpdateGroupDropDown(group) {
    HideDropDown()
    scrolltoID(group, 500, -$("#nav").outerHeight())
}

function ShowYearDemo(current_year, _term) {
    currentYear = current_year
    currentTerm = _term
    $("#demo").html(current_year + "學年度 " + `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
    class="bi bi-caret-down-fill" viewBox="0 0 16 16">
    <path
        d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
</svg>`)
    $("#title").html("作業DEMO - " + current_year + "學年度" + (_term == "mid" ? "（期中）" : ""))
    $("#portfolioContainer").empty()
    $("#groupDropdown").empty()
    for (var i = 0; i < allData.length; i++) {
        if (allData[i].year == current_year && allData[i].yearterm == _term) {
            var sectionHtml = `
                <div id="` + i + `" class="overlay reveal " style="border-radius: 30px;background-color:` + randomColor() + `">
                    <h4 class="heading">` + allData[i].title + `</h4>
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

                    <div class="col-md-2"></div>
                    
                    <div class="col-md-8">
                        <br>
                        <a href="#modal-10`+ allData[i].pdf + `" class="link" style="color:#26ccc1">` + isPDF(allData[i].pdf, allData[i].title) + `</a>
                        <div data-ml-modal id="modal-10`+ allData[i].pdf + `">
                            <a href="#!" class="modal-overlay"></a>
                            <div class="modal-dialog modal-dialog-lg">
                                <a href="#!" class="modal-close">&times;</a>
                                <h3>` + allData[i].title + `</h3>
                                <div class="modal-content newspaper">
                                    <iframe src="https://medialab1422.github.io/iOS/`+ allData[i].pdf + `.pdf" width="100%" height="95%"></iframe>
                                </div>
                            </div>
                        </div>
                        
                        <p id="desc" style="font-family:none">` + allData[i].desc + `</p>
                    

                    </div>
                </div><br>`

            $("#portfolioContainer").append(sectionHtml)

            $("#groupDropdown").append(`<button onclick="UpdateGroupDropDown(` + i + `)" data-offset="-140">` + allData[i].title + `</button>`)
        }
    }
}

function isPDF(name, title) {
    return name == "" ? "" : "view pdf： " + title + ".pdf"
}

function scrolltoID(id, speed = 800, offset = 0) {
    $('html, body').animate({
        scrollTop: $('#' + id).offset().top + offset
    }, speed);
}

function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"
    ];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

document.body.onscroll = function () {
    let isIngroup = false;
    let icon = ` <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
    fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16">
    <path
        d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
</svg> `

    for (var i = allData.length - 1; i >= 0; i--) {
        if (allData[i].year == currentYear && allData[i].term == currentTerm) {
            if (document.documentElement.scrollTop > $("#" + i).offset().top - 250) {
                $("#group").html(allData[i].title + icon)
                isIngroup = true;
                break;
            }
        }
    }

    if (!isIngroup) {
        $("#group").html("各組別" + icon)
    }

    reveal()
};

function reveal() {
    var reveals = document.querySelectorAll(".reveal");

    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        } else {
            reveals[i].classList.remove("active");
        }
    }
}