/**
 * =================================================================
 * 優化理由：
 * 1. 現代化資料載入：使用原生的 fetch API 取代過時的 d3.text。
 * 2. 移除冗餘的 nav 固定邏輯：此功能已在 HTML 中透過 Bootstrap 的 sticky-top 實現。
 * 3. Bootstrap 5 結構：下拉選單 (Dropdown) 結構使用 li/a.dropdown-item。
 * 4. 滾動偵測優化：使用更可靠的 Intersection Observer API (針對 reveal) 和現代化的滾動計算。
 * 5. 使用 const/let 取代 var，提升變數作用域管理。
 * =================================================================
 */

// 全域變數 - 使用 let
let year = [];
let term = [];
let allData = [];
let currentYear = null;
let currentTerm = null;

// --- 核心工具函數 ---

// 簡單的 CSV 解析器（取代 d3.csv.parseRows）
// 假設 data.csv 格式簡單且沒有複雜的逗號或換行符號
const parseCSV = (csv) => {
    const lines = csv.split('\n').filter(line => line.trim() !== '');
    let current_year = "";
    let _term = "";

    for (const line of lines) {
        const parsedCSV = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // 簡易解析，處理引號內的逗號

        if (parsedCSV[0] === "year") {
            current_year = parsedCSV[1]?.trim() || "";
            _term = parsedCSV[2]?.trim() || "";
            if (current_year && !year.includes(current_year)) {
                year.push(current_year);
                term.push(_term);
            }
            continue;
        }

        if (parsedCSV.length >= 4) {
            const data = {
                year: current_year,
                yearterm: _term,
                title: parsedCSV[0]?.trim() || "",
                video: parsedCSV[1]?.trim() || "", // YouTube Video ID
                pdf: parsedCSV[2]?.trim() || "", // PDF file name
                desc: parsedCSV[3]?.trim() || "",
            };
            allData.push(data);
        }
    }
};

// 產生隨機顏色
const randomColor = () => {
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += Math.floor(Math.random() * 10);
    }
    return color;
};

// 滾動到指定 ID
const scrolltoID = (id, speed = 800, offset = 0) => {
    const element = $('#' + id);
    if (element.length) {
        $('html, body').animate({
            scrollTop: element.offset().top + offset
        }, speed);
    }
};

// 檢查是否有 PDF
const isPDF = (name, title) => {
    return name === "" ? "" : `檢視 PDF 文件：${title}.pdf`;
};

// --- 下拉選單/UI 邏輯 ---

/**
 * 載入資料後，填充年份下拉選單（Bootstrap 5 結構）
 */
const SetDropDown = () => {
    const yearDropdown = $("#yearDropdown");
    yearDropdown.empty();

    // 由最新學年 (年) 往舊 (0) 建立選單
    for (let i = year.length - 1; i >= 0; i--) {
        const yearValue = year[i];
        const termValue = term[i];
        const termLabel = termValue === "mid" ? "（期中）" : "";
        
        // 使用 Bootstrap 5 的 li/a.dropdown-item 結構
        const dropDownHtml = `
            <li>
                <a class="dropdown-item" href="#" data-year="${yearValue}" data-term="${termValue}">
                    ${yearValue}學年度 ${termLabel}
                </a>
            </li>
        `;
        yearDropdown.append(dropDownHtml);
    }

    // 處理下拉選單點擊事件
    yearDropdown.on('click', 'a.dropdown-item', function(e) {
        e.preventDefault();
        const y = $(this).data('year');
        const t = $(this).data('term');
        UpdateYearDropDown(y, t);
    });

    // 預設顯示最新的 DEMO
    ShowYearDemo(year[year.length - 1], term[term.length - 1]);
};

// 更新年份 DEMO 內容
const UpdateYearDropDown = (year, _term) => {
    // Bootstrap 5 會自動處理下拉選單的隱藏，不需要 HideDropDown
    ShowYearDemo(year, _term);
    scrolltoID("portfolio", 500);
};

// 更新組別 DEMO 滾動
const UpdateGroupDropDown = (id) => {
    // Bootstrap 5 會自動處理下拉選單的隱藏，不需要 HideDropDown
    // 計算導覽列的高度作為 Offset
    const navHeight = $('#about').offset().top - 20; // 滾動到 ID 所在區塊
    scrolltoID(id, 500, -navHeight);
};

/**
 * 主要渲染函式
 */
const ShowYearDemo = (current_year, _term) => {
    currentYear = current_year;
    currentTerm = _term;

    // 1. 更新導覽列顯示的年份
    const termLabel = _term === "mid" ? "（期中）" : "";
    $("#yearDropdownLink").html(`${current_year}學年度 ${termLabel}`);
    
    // 2. 更新作品集標題
    $("#title").html(`作業DEMO - ${current_year}學年度${termLabel}`);
    
    // 3. 清空並初始化容器
    $("#portfolioContainer").empty();
    $("#groupDropdown").empty();

    let groups = [];
    const container = $("#portfolioContainer");
    const groupDropdown = $("#groupDropdown");

    // 4. 渲染作品集
    allData
        .filter(data => data.year === current_year && data.yearterm === _term)
        .forEach((data, index) => {
            const elementId = `demo-${current_year}-${_term}-${index}`; // 建立唯一 ID
            groups.push({ id: elementId, title: data.title });

            // 渲染組別下拉選單
            const groupDropdownHtml = `
                <li>
                    <a class="dropdown-item" href="#" data-id="${elementId}">${data.title}</a>
                </li>
            `;
            groupDropdown.append(groupDropdownHtml);

            // 渲染作品 HTML (使用 Bootstrap 5 的 Col-12 結構)
            const videoId = data.video;
            const pdfUrl = data.pdf;
            const sectionHtml = `
                <div id="${elementId}" class="col-12 mb-5 portfolio-item reveal">
                    <div class="card shadow-lg" style="border-radius: 15px; overflow: hidden; background-color: ${randomColor()};">
                        <div class="card-header bg-dark text-white">
                            <h4 class="card-title mb-0">${data.title}</h4>
                        </div>
                        <div class="card-body p-0">
                            <iframe
                                style="width: 100%; height: 500px; border: 0;"
                                loading="lazy"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen
                                title="${data.title} - 影片展示"
                                srcdoc="${getEmbedHtml(videoId)}"
                                src="https://www.youtube.com/embed/${videoId}">
                            </iframe>
                        </div>

                        <div class="card-footer bg-white p-4">
                            <p class="card-text">${data.desc}</p>
                            ${pdfUrl ? 
                                `<a href="#modal-${elementId}" class="link" style="color:#0d6efd;" data-bs-toggle="modal" data-bs-target="#modal-${elementId}">
                                    ${isPDF(pdfUrl, data.title)}
                                </a>` 
                                : ''}
                        </div>
                    </div>

                    ${pdfUrl ? `
                        <div class="modal fade" id="modal-${elementId}" tabindex="-1" aria-labelledby="modalLabel-${elementId}" aria-hidden="true">
                            <div class="modal-dialog modal-xl">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="modalLabel-${elementId}">${data.title} - 文件</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body" style="height: 80vh;">
                                        <iframe src="./pdf/${pdfUrl}.pdf" width="100%" height="100%" frameborder="0"></iframe>
                                    </div>
                                </div>
                            </div>
                        </div>` 
                        : ''}
                </div>
            `;
            container.append(sectionHtml);
        });
    
    // 5. 處理組別選單點擊事件
    groupDropdown.on('click', 'a.dropdown-item', function(e) {
        e.preventDefault();
        const id = $(this).data('id');
        UpdateGroupDropDown(id);
    });

    // 確保 Reveal 偵測器初始化/更新
    initIntersectionObserver(groups.map(g => g.id));
};

// 內嵌 YouTube 播放器預覽 HTML (用於 srcdoc)
const getEmbedHtml = (videoId) => {
    return `
    <style>
        * { padding: 0; margin: 0; overflow: hidden; }
        body, html { height: 100%; background-color: black; }
        img, svg { position: absolute; width: 100%; top: 0; bottom: 0; margin: auto; cursor: pointer; }
        svg { filter: drop-shadow(1px 1px 10px rgba(0,0,0,0.5)); transition: all 250ms ease-in-out; }
        body:hover svg { filter: drop-shadow(1px 1px 10px rgba(0,0,0,0.8)); transform: scale(1.2); }
    </style>
    <a href='https://www.youtube.com/embed/${videoId}?autoplay=1' target="_top">
        <img src='https://img.youtube.com/vi/${videoId}/hqdefault.jpg' alt='Video Preview' >
        <svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24' fill='none' stroke='#ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-play-circle'><circle cx='12' cy='12' r='10'></circle><polygon points='10 8 16 12 10 16 10 8'></polygon></svg>
    </a>
    `;
};


// --- 滾動與動畫邏輯 ---

/**
 * 使用 Intersection Observer 替代舊的 reveal() 函數。
 * 這是現代網頁實現滾動偵測和動畫的最佳實踐，效能更好。
 */
const initIntersectionObserver = (elementIds) => {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                // observer.unobserve(entry.target); // 選擇是否只執行一次
            } else {
                 entry.target.classList.remove("active");
            }
        });
    }, {
        rootMargin: "0px",
        threshold: 0.15 // 15% 進入視窗即觸發
    });

    document.querySelectorAll(".reveal").forEach(el => {
        observer.observe(el);
    });

    // 啟動 Group Title Scroll Tracking
    initGroupScrollTracking(elementIds);
};

/**
 * 替換 document.body.onscroll 中的 Group 標題追蹤邏輯。
 */
const initGroupScrollTracking = (elementIds) => {
    // 移除舊的 onscroll 綁定
    $(document).off('scroll.groupTracking');

    const iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16"> <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" /> </svg>`;
    
    // 滾動事件處理器
    $(document).on('scroll.groupTracking', function() {
        let isIngroup = false;
        let foundTitle = "各組別"; // 預設值
        
        // 從底部開始往上檢查，以確保顯示最接近視窗頂部的項目
        for (let i = elementIds.length - 1; i >= 0; i--) {
            const id = elementIds[i];
            const element = $('#' + id);
            
            if (element.length) {
                // 檢查項目是否進入了視窗的「有效區塊」（例如導覽列下方）
                const topOfElement = element.offset().top;
                const scrollTop = $(document).scrollTop();
                const threshold = 100; // 調整這個值以決定多靠近頂部時切換

                if (scrollTop >= topOfElement - threshold) {
                    const data = allData.find(d => d.title === element.find('.card-header h4').text().trim());
                    if (data) {
                        foundTitle = data.title;
                        isIngroup = true;
                        break;
                    }
                }
            }
        }
        
        // 更新導覽列中的組別標題
        $("#groupDropdownLink").html(foundTitle + iconHtml);
    });
};


// --- 初始化 ---

$(document).ready(function () {
    // 1. 載入資料
    fetch('data.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error('無法載入 data.csv');
            }
            return response.text();
        })
        .then(csvText => {
            parseCSV(csvText); // 解析資料
            SetDropDown(); // 建立下拉選單
        })
        .catch(error => {
            console.error('資料載入失敗:', error);
            // 可以在此處顯示錯誤訊息給使用者
        });
    
    // 2. 初始觸發 reveal 顯示動畫 (第一次載入)
    document.querySelectorAll(".reveal").forEach(el => {
        el.classList.add("active");
    });
});
