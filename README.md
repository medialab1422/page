<!-- 
This document is written in Traditional Chinese (zh-Hant).
It describes the repository for the NTUT CSIE Interactive Media Laboratory website. 
-->

# 國立臺北科技大學 資訊工程系 互動媒體實驗室 網站

本儲存庫（Repository）包含 **國立臺北科技大學（NTUT）資訊工程系（CSIE）互動媒體實驗室** 的官方網站原始碼。

## 🎯 專案目的

本網站作為實驗室的資訊中心，主要目的如下：

- **研究成果展示**：呈現實驗室的研究計畫、論文及產學合作成果。
- **成員介紹**：介紹指導教授與實驗室的歷屆研究生。
- **課程資訊提供**：提供實驗室專業領域相關課程的教學大綱與補充教材。
- **知識庫與文件歸檔**：記錄讀書會、內部會議及分享學習資源。
- **學術交流與招生**：作為對外交流與吸引新生成員的平台。

## 🔬 主要研究領域

本實驗室專注於以下研究領域：

- **計算機圖學** (Computer Graphics)，包含 OpenGL、Unity 等技術。
- **人機互動** (Human-Computer Interaction, HCI)。
- **擴增實境 (Augmented Reality, AR) / 虛擬實境 (Virtual Reality, VR)**。
- **網頁程式設計** (Web Programming)。
- **行動應用程式開發** (Mobile Application Development)，特別是 iOS。

## 📂 專案結構 (階層式)

為了讓其他開發者或 AI 能快速理解專案的組成，以下是專案的關鍵檔案與目錄結構：

```
/
├── .gitattributes
├── README.md
│
├── index.html         (網站首頁)
├── about_us.html      (關於我們)
├── course.html        (相關課程)
├── project.html       (研究計畫)
└── Freshman.html      (新生專區)
|
├── css/               (主要的 CSS 樣式表)
│   ├── main.css
│   └── ...
│
├── data/              (存放簡報、論文、資料集等)
│   ├── 20140717OpenGL.pptx
│   └── ezhouse.pdf
│
├── design/            (存放 Logo、背景圖等視覺素材)
│   ├── lablogo1.png
│   └── background.jpg
│
├── graphicClass/      (「計算機圖學」課程專區)
│   ├── index.html
│   └── ...
│
├── HCI_2016/          (「人機互動」課程專區)
│   ├── index.html
│   └── ...
│
├── iosWeb/            (「iOS 程式開發」課程專區)
│   ├── index.html
│   └── ...
│
└── webprogramming/    (「網頁程式設計」課程專區)
    ├── index.html
    └── ...
```

## 🔗 主要區塊快速連結

以下為網站各主要部分的直接連結：

- **網站首頁**: [https://medialab1422.github.io/page/](https://medialab1422.github.io/page/)
- **iOS 應用程式開發**: [https://medialab1422.github.io/page/iosWeb/](https://medialab1422.github.io/page/iosWeb/)
- **計算機圖學課程**: [https://medialab1422.github.io/page/graphicClass/](https://medialab1422.github.io/page/graphicClass/)
- **網頁程式設計課程**: [https://medialab1422.github.io/page/webprogramming/](https://medialab1422.github.io/page/webprogramming/)
- **人機互動 (HCI)**: [https://medialab1422.github.io/page/HCI_2016/](https://medialab1422.github.io/page/HCI_2016/)