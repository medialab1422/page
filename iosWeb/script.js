// 全域變數 - 使用 let/const 提升作用域管理
const year = [];
const term = [];
let allData = [];
let currentYear = null;
let currentTerm = null;

// 用於滾動追蹤的元素 ID 列表
let activeDemoIds = [];

// --- 初始化與資料載入 (保留 D3.js v3 邏輯) ---

$(document).ready(function () {
    // 移除舊的 custom nav fixed 滾動偵測，因為我們在 HTML 中使用了 Bootstrap 的 sticky-top
    // 舊的：$(document).on("scroll", function () { ... }) 邏輯已移除

    // 保留 D3.js 資料載入邏輯
    d3.text("data.csv", function (data) {
        // 核心資料解析邏輯保持不變
        const parsedCSV = d3.csv.parseRows(data);
        let current_year = "";
        let _term = "";

        for (let i = 0; i < parsedCSV.length; i++) {
            if (parsedCSV[i][0] === "year") {
                current_year = parsedCSV[i][1];
                _term = parsedCSV[i][2];
                year.push(current_year);
                term.push(_term);
                continue;
            }

            const itemData = {
                year: current_year,
                yearterm: _term,
                title: parsedCSV[i][0],
                video: parsedCSV[i][1],
                pdf: parsedCSV[i][2],
                desc: parsedCSV[i][3],
                // 為了滾動追蹤，這裡使用 allData 中的索引作為唯一識別，保持與舊邏輯兼容
                index: i
            };

            allData.push(itemData);
        }

        SetDropDown();
        // 預設顯示最新的 DEMO
        if (year.length > 0) {
            ShowYearDemo(year[year.length - 1], term[term.length - 1]);
        }
    });
});


// --- 輔助工具函數 ---

function randomColor() {
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += Math.floor(Math.random() * 10);
    }
    return color;
}

function isPDF(name, title) {
    return name === "" ? "" : "檢視 PDF 文件：" + title + ".pdf";
}

function scrolltoID(id, speed = 800, offset = 0) {
    // 為了兼容滾動到元素 ID 'i' (數字) 的情況
    $('html, body').animate({
        scrollTop: $('#' + id).offset().top + offset
    }, speed);
}

// 移除 IsPC() 函數，因為它只用於舊的 HideDropDown()，而該函數已被移除。


// --- 滾動動畫與追蹤 (優化為 Intersection Observer) ---

// 實作 reveal 滾動偵測動畫 (使用 Intersection Observer 提升效能)
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
        } else {
             entry.target.classList.remove("active");
        }
    });
}, {
    rootMargin: "0px",
    threshold: 0.15 // 15% 進入視窗即觸發
});

function initRevealAnimation() {
    document.querySelectorAll(".reveal").forEach(el => {
        revealObserver.observe(el);
    });
}

// Group 標題滾動追蹤
const initGroupScrollTracking = (elementIds) => {
    const iconHtml = ` <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16"> <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" /> </svg>`;
    const $groupLink = $("#groupDropdownLink"); // 目標元素
    const defaultTitle = "各組別";

    // 移除舊的 onscroll 綁定
    $(document).off('scroll.groupTracking');

    // 重新綁定滾動事件處理器
    $(document).on('scroll.groupTracking', function() {
        let foundTitle = defaultTitle;
        const scrollTop = $(document).scrollTop();
        const threshold = 100; 

        // 從底部開始往上檢查，以確保顯示最接近視窗頂部的項目
        for (let i = elementIds.length - 1; i >= 0; i--) {
            const id = elementIds[i];
            const element = $('#' + id);
            
            if (element.length) {
                const topOfElement = element.offset().top;
                
                if (scrollTop >= topOfElement - threshold) {
                    // 根據元素 ID 查找對應的標題 (這裡假設 ID 儲存在 data 屬性或 class 中，但我們直接從 DOM 讀取)
                    const titleText = element.find('.card-header h4').text().trim();
                    if (titleText) {
                        foundTitle = titleText;
                        break;
                    }
                }
            }
        }
        
        // 更新導覽列中的組別標題
        $groupLink.html(foundTitle + iconHtml);
    });

    // 確保初始狀態正確
    $groupLink.html(defaultTitle + iconHtml);
};


// --- 導覽列與內容更新 ---

function SetDropDown() {
    const yearDropdown = $("#yearDropdown");
    yearDropdown.empty();

    // 填充年份下拉選單 (Bootstrap 5 結構: <li><a>)
    for (let i = year.length - 1; i >= 0; i--) {
        const yearValue = year[i];
        const termValue = term[i];
        const termLabel = termValue === "mid" ? "（期中）" : "";
        
        // 注意：這裡使用 data 屬性存儲值，而不是 onclick
        const dropDownHtml = `
            <li>
                <a class="dropdown-item" href="#" data-year="${yearValue}" data-term="${termValue}">
                    ${yearValue}學年度 ${termLabel}
                </a>
            </li>
        `;
        yearDropdown.append(dropDownHtml);
    }
    
    // 綁定點擊事件
    yearDropdown.on('click', 'a.dropdown-item', function(e) {
        e.preventDefault();
        const y = $(this).data('year');
        const t = $(this).data('term');
        UpdateYearDropDown(y, t);
    });
}

function UpdateYearDropDown(year, _term) {
    // 舊的 HideDropDown() 已移除
    // scrolltoID("about", 0) // 導覽列固定，不需要滾到 about
    ShowYearDemo(year, _term);
    scrolltoID("portfolio", 500);
}

function UpdateGroupDropDown(id) {
    // 舊的 HideDropDown() 已移除
    const navHeight = 56; // 根據新的 BS5 Navbar 高度調整 offset
    scrolltoID(id, 500, -navHeight);
}

/**
 * 主要渲染函式 (與 Bootstrap 5 結構整合)
 */
function ShowYearDemo(current_year, _term) {
    currentYear = current_year;
    currentTerm = _term;
    $("#demo").html(""); // 清空舊的 <button id="demo"> 內容
    
    // 1. 更新導覽列顯示的年份 (target: #yearDropdownLink)
    const termLabel = _term === "mid" ? "（期中）" : "";
    const iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16"><path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" /></svg>`;
    $("#yearDropdownLink").html(`DEMO 年份: ${current_year}學年度 ${termLabel}`);
    
    // 2. 更新作品集標題
    $("#title").html(`作業DEMO - ${current_year}學年度${termLabel}`);
    
    // 3. 清空容器
    $("#portfolioContainer").empty();
    const groupDropdown = $("#groupDropdown").empty(); // 清空組別下拉選單
    activeDemoIds = [];

    // 4. 渲染作品集
    allData.forEach((data, i) => {
        if (data.year === current_year && data.yearterm === _term) {
            // 使用 allData 的索引 i 作為 ID，確保與 UpdateGroupDropDown 兼容
            const elementId = `demo-${i}`; 
            activeDemoIds.push(elementId);

            // 渲染組別下拉選單
            groupDropdown.append(`
                <li>
                    <a class="dropdown-item" href="#${elementId}" onclick="UpdateGroupDropDown('${elementId}')">${data.title}</a>
                </li>
            `);

            // PDF 模態視窗 ID (使用更安全的 ID)
            const modalId = `modal-${data.pdf}-${i}`;

            // 渲染作品 HTML (使用 Bootstrap 5 Card 和 Grid 結構)
            const sectionHtml = `
                <div id="${elementId}" class="col-12 mb-5 portfolio-item reveal">
                    <div class="card shadow-lg" style="border-radius: 15px; overflow: hidden; background-color: ${randomColor()};">
                        <div class="card-header bg-dark text-white p-3">
                            <h4 class="card-title mb-0">${data.title}</h4>
                        </div>
                        <div class="card-body p-0">
                            <iframe
                                style="width: 100%; height: 500px; border: 0;"
                                loading="lazy"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen
                                title="${data.title} - 影片展示"
                                srcdoc="${getEmbedHtml(data.video)}"
                                src="https://www.youtube.com/embed/${data.video}">
                            </iframe>
                        </div>

                        <div class="card-footer bg-white p-4">
                            <p class="card-text mb-3">${data.desc}</p>
                            ${data.pdf ? 
                                `<a href="#" class="link" style="color:#0d6efd;" data-bs-toggle="modal" data-bs-target="#${modalId}">
                                    ${isPDF(data.pdf, data.title)}
                                </a>` 
                                : ''}
                        </div>
                    </div>
                </div>
                
                ${data.pdf ? `
                    <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="modalLabel-${modalId}" aria-hidden="true">
                        <div class="modal-dialog modal-xl">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="modalLabel-${modalId}">${data.title} - 文件</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body" style="height: 80vh;">
                                    <iframe src="./pdf/${data.pdf}.pdf" width="100%" height="100%" frameborder="0"></iframe>
                                </div>
                            </div>
                        </div>
                    </div>` 
                    : ''}
            `;
            $("#portfolioContainer").append(sectionHtml);
        }
    });
    
    // 5. 初始化滾動偵測和追蹤
    initRevealAnimation();
    initGroupScrollTracking(activeDemoIds);
}

// 內嵌 YouTube 播放器預覽 HTML (用於 srcdoc)
const getEmbedHtml = (videoId) => {
    // 您的 srcdoc 內容幾乎不需要修改，因為它只涉及 CSS 和 HTML
    return `
    <style>
        * { padding: 0; margin: 0; overflow: hidden; }
        body, html { height: 100%; background-color: black; }
        img, svg { position: absolute; width: 100%; top: 0; bottom: 0; margin: auto; cursor: pointer; }
        svg { 
            filter: drop-shadow(1px 1px 10px hsl(206.5, 70.7%, 8%));
            transition: all 250ms ease-in-out; 
        }
        body:hover svg { 
            filter: drop-shadow(1px 1px 10px hsl(206.5, 0%, 10%)); 
            transform: scale(1.2); 
        }
    </style>
    <a href='https://www.youtube.com/embed/${videoId}?autoplay=1' target="_top">
        <img src='https://img.youtube.com/vi/${videoId}/hqdefault.jpg' alt='Video Preview' >
        <svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24' fill='none' stroke='#ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-play-circle'><circle cx='12' cy='12' r='10'></circle><polygon points='10 8 16 12 10 16 10 8'></polygon></svg>
    </a>
    `;
};
