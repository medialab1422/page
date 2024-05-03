var year = []
var term = []
var allData = []
var currentYear = null;
var currentTerm = null;
$(document).ready(function () {

  $(window).resize(function () {
    let windowWidth = $(window).width()

    if (windowWidth <= 576) {
      console.log("!")
    }
  }).resize();

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

    ShowYearSection()
  })
})

function ShowYearSection() {
  let currentYear = allData.slice(-1)[0].year

  let sectionHTML = `
  <div class="section center" id=${currentYear}>
    <h1>作業DEMO -${currentYear}學年度` + isMid(allData.slice(-1)[0].yearterm) + `</h1>
  </div>
  `
  $("#fullpage").append(sectionHTML).ready(ShowDemoSlidePC);
}

function ShowDemoSlideMobile() {
  let currentYear = allData.slice(-1)[0].year

  for (var i = 0; i < allData.length; i++) {
    if (allData[i].year != currentYear) {
      continue;
    }
    console.log(i)
    //每個人的作品
    let slideHTML =
      `
      <div class="slide container-sm" style="background-color: `+ randomColor() + `;border-radius: 25px;">
        <h2>${allData[i].title}</h2>
        <div class="row vh-70">
        
        <div class="col-sm-2"></div>
          <div class="col-sm-5 d-flex align-items-center">
            <iframe class="mx-auto" allowfullscreen="" frameborder="0"
              style="width: 80%; height: 80%; border-radius: 25px;"
              src="http://www.youtube.com/embed/${allData[i].video}"></iframe>
          </div>

          <div class=" col-sm-3">
            <div class="col-12" style="text-align:left;padding-top: 10% ;">
              <p>${allData[i].desc} </p>
            </div>
            <div class="col-12" style="text-align: left;">
              <button id="pdfButton" value="${allData[i].pdf}+${allData[i].title}" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#pdfModal">
              `+ isPDF(allData[i].pdf, allData[i].title) + `
              </button>
            </div>
          </div>
          
        </div>
      </div>
    `

    // $('#' + allData[i].year).empty()
    $("#" + allData[i].year).append(slideHTML)
  }
}

function ShowDemoSlidePC() {
  let currentYear = allData.slice(-1)[0].year
  
  for (var i = 0; i < allData.length; i++) {
    
    if (allData[i].year == currentYear) {
      currentYear = i;
      break;
    }
  }
  for (var i = currentYear; i < allData.length; i+=3) {
    let slideHTML = `
    <div class="slide container-fluid">
          <div class="row mx-0 px-5" id="cardDeck${i}">
          </div>
    </div>
    `
    $("#" + allData[i].year).append(slideHTML)
    for (var j = 0; j < 3; j++) {
      let cardHTML = `
          <div class="col-md d-flex align-items-stretch">
            <div class="card" style = "background-color: `+ randomColor() + `;">
              <iframe class="mx-auto" allowfullscreen="" frameborder="0"
              style="width: auto; height: 50vh"; border-radius: 25px;"
              src="http://www.youtube.com/embed/${allData[i + j].video}"></iframe>
              <div class="card-body">
                <h5 class="card-title">${allData[i + j].title}</h5>
                <p class="card-text">${allData[i + j].desc}</p>
                <button id="pdfButton" value="${allData[i + j].pdf}+${allData[i + j].title}" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#pdfModal">
              `+ isPDF(allData[i + j].pdf, allData[i + j].title) + `
              </button>
              </div>
            </div>
          </div>`
      $("#cardDeck" + i).append(cardHTML)
    }
  }
}

new fullpage('#fullpage', {
  autoScrolling: true,
  scrollHorizontally: true,
  sectionsColor: ["#fcd9ba", "#ffc8c1"],
  navigation: true,
  slidesNavigation: true,
  anchors: ['1', '2'],
  navigationTooltips: ['介紹', 'DEMO'],
});

$(document).on('click', '#pdfButton', function (event) {
  event.preventDefault();
  loadpdf(event)
});

function loadpdf(event) {
  let loc = event.target.value.split('+')[0]
  let title = event.target.value.split('+')[1]

  $('#pdf').empty()
  $('#pdfLabel').html(title)
  let pdfContainer = `
  <iframe src="https://medialab1422.github.io/iOS/${loc}.pdf" width="100%" height="95%"></iframe>
  `
  $('#pdf').append(pdfContainer)
}

//General function
function isMid(term) {
  return term == "mid" ? "（期中）" : ""
}

function isPDF(name, title) {
  return name == "" ? "" : "view pdf： " + title + ".pdf"
}

function randomColor() {
  const colors = [
    "#c1cbd7", "#9ca8b8", "#8696a7",
    "#e0e5df", "#b5c4b1", "#96a48b",
    "#ececea", "#d3d4cc", "#dadad8", "#bfbfbf", "#afb0b2", "#a6a6a8",
    "#ead0d1", "#e0cdcf", "#a27e7e", "#c9c0d3", "#dfd7d7", "#eee5f8",
    "#fffaf4", "#fdf9ee", "#f8ebd8", "#faead3", "#d8caaf", "#c7b8a1", "#c5b8a5", "#a29988", "#b7b1a5", "#cac3bb", "#f0ebe5"
  ];

  const randomIndex = Math.floor(Math.random() * colors.length);

  return colors[randomIndex];
}
