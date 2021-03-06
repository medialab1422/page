var year = []
var allData = []
var currentYear = null;
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
        for (var i = 0; i < parsedCSV.length; i++) {
            if (parsedCSV[i][0] == "year") {
                current_year = parsedCSV[i][1]
                year.push(current_year);
                continue
            }

            var data = {
                year: current_year,
                title: parsedCSV[i][0],
                video: parsedCSV[i][1],
                pdf: parsedCSV[i][2],
                desc: parsedCSV[i][3],
            }

            allData.push(data)
        }

        SetDropDown()
        ShowYearDemo(year[year.length - 1])
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
    for (var i = 0; i < year.length; i++) {
        var dropDownHtml =
            `<button onclick="UpdateYearDropDown(` + year[i] + `)" data-offset="-140">` + year[i] + `學年度</button>`
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

function UpdateYearDropDown(year) {
    HideDropDown()
    scrolltoID("about", 0)
    ShowYearDemo(year)
    scrolltoID("portfolio", 500)
}

function UpdateGroupDropDown(group) {
    HideDropDown()
    scrolltoID(group, 500, -$("#nav").outerHeight())
}

function ShowYearDemo(current_year) {
    currentYear = current_year
    $("#demo").html(current_year + "學年度 " + `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
    class="bi bi-caret-down-fill" viewBox="0 0 16 16">
    <path
        d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
</svg>`)
    $("#title").html("作業DEMO - " + current_year + "學年度")
    $("#portfolioContainer").empty()
    $("#groupDropdown").empty()
    for (var i = 0; i < allData.length; i++) {
        var index = 0;
        if (allData[i].year == current_year) {
            var sectionHtml = `
                <div id="` + i + `" class="overlay reveal " style="background-color:` + randomColor() + `">
                    <h4 class="heading">` + allData[i].title + `</h4>
                   
                    <iframe id="ytplayer" type="text/html" width="100%" height="640"
                    src="https://www.youtube.com/embed/` + allData[i].video + `?autoplay=1"
                    frameborder="0"></iframe>
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
    return name == "" ? "" :"view pdf： " + title + ".pdf"
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
        if (allData[i].year == currentYear) {
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