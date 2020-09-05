console.log("JS");

const routes = [
  "#/headlines",
  "#/business",
  "#/general",
  "#/health",
  "#/science",
  "#/sports",
  "#/technology",
];

if (!routes.includes(window.location.hash)) {
  window.location.hash = routes[0];
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/bnews-sw.js")
    .then(() => {
      console.log("B NEWS service worker registered");
    })
    .catch((err) => {
      console.log("B NEWS service worker not registered");
    });
}

var url;

var category;
var body;
window.addEventListener("hashchange", () => {
  console.log("HASHCHANGE");
  if (!routes.includes(window.location.hash)) {
    window.location.hash = routes[0];
  }
  loadContent();
});

function loadContent() {
  loadMoreClickCount = 1;
  category = window.location.hash.substr(2);

  if (document.getElementsByClassName("loadmore-wrapper")[0]) {
    let elem = document.getElementsByClassName("loadmore-wrapper")[0];
    elem.parentNode.removeChild(elem);
  }

  if (document.getElementsByClassName("main-content")[0]) {
    let elem = document.getElementsByClassName("main-content")[0];
    elem.parentNode.removeChild(elem);
  }

  body = document.getElementById("app");
  const mainContentAttr = { class: "main-content", style: "display:none" };
  mainContent = createElement("div", null, mainContentAttr);
  console.log(mainContent);
  body.appendChild(mainContent);

  getData(category);

  console.log(window.location.hash);
}

var loadMoreClickCount = 1;

var maxRecord;
var maxPageSize;
function getData(category, page = 1) {
  url = `https://newsapi.org/v2/top-headlines?country=in&page=${page}&apiKey=fce72268d4594baf8615c93ed057a2c4`;
  if (category !== "headlines") {
    url = `https://newsapi.org/v2/top-headlines?country=in&category=${category}&page=${page}&apiKey=fce72268d4594baf8615c93ed057a2c4`;
  }
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((allNews) => {
      maxRecord = allNews.totalResults;
      maxPageSize = Math.floor(maxRecord / 20);
      console.log(maxRecord, maxPageSize);
      showNews(allNews);

      if (
        !document.getElementById("loadMore") &&
        maxPageSize > loadMoreClickCount
      ) {
        createLoadMoreButton();
        document.getElementById("loadMore").addEventListener("click", () => {
          loadMoreClickCount++;
          getData(category, loadMoreClickCount);
        });
      } else if (
        document.getElementById("loadMore") &&
        maxPageSize < loadMoreClickCount
      ) {
        document.getElementById("loadMore").style.display = "none";
      }
    })
    .catch((err) => {
      console.log("ERRORRRRRRRRRR", err);
      loadErrorMessage();
    });
}

function loadErrorMessage() {
  const errorAttr = {
    class: "errorMessage",
  };
  let elem = document.getElementsByClassName("main-content")[0];
  let errorDiv = createElement(
    "div",
    "No Data . Please Check Internet Connection",
    errorAttr
  );

  elem.appendChild(errorDiv);
  elem.style.display = "block";
}

function openNav() {
  document.getElementById("mySidebar").style.width = "200px";
  //   document.getElementById("main").style.marginLeft = "200px";
  document.getElementById("menu").classList.add("menu-open");
  document.getElementById("hamburger-icon").classList.add("no-display");
  document.getElementById("cross-icon").classList.remove("no-display");
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  //   document.getElementById("main").style.marginLeft = "0";
  document.getElementById("menu").classList.remove("menu-open");
  document.getElementById("hamburger-icon").classList.remove("no-display");
  document.getElementById("cross-icon").classList.add("no-display");
}
var mainContent;
document.addEventListener("DOMContentLoaded", () => {
  loadContent();
  const currentRoute = window.location.hash.substr(2);
  console.log("current Route", currentRoute);
  console.log("HASH", window.location.hash);

  document.getElementById(currentRoute).classList.add("active");

  console.log("DOMLoaded");
  document.getElementById("mySidebar").addEventListener("click", (e) => {
    console.log(e.target.id);
    let sidebar = document.getElementById("mySidebar");
    let allChild = sidebar.children;

    for (let child of allChild) {
      if (child.classList[0] === "active") {
        child.classList.remove("active");
      }
    }
    document.getElementById(e.target.id).classList.add("active");

    console.log(allChild);
  });
});

function showNews(allNews) {
  let articles = allNews.articles;
  for (let article of articles) {
    createNewsCard(article);
  }
  mainContent.style.display = "block";
}

function createElement(tagName, textNode = null, allAttr = null) {
  var element = document.createElement(tagName);

  for (let attribute in allAttr) {
    const attr = document.createAttribute(attribute);
    attr.value = allAttr[attribute];
    element.setAttributeNode(attr);
  }

  if (textNode) {
    const textNod = document.createTextNode(textNode);
    element.appendChild(textNod);
  }

  return element;
}

function createNewsCard(article) {
  newsCardAttr = { class: "news-card" };
  const newsCardElem = createElement("div", null, newsCardAttr);

  mainContent.appendChild(newsCardElem);

  newsCardElem.appendChild(createImage(article));

  var rightBox = createRightBox();

  newsCardElem.appendChild(rightBox);

  rightBox.appendChild(createTitle(article));

  rightBox.appendChild(createContent(article));

  rightBox.appendChild(createFooter(article));

  return newsCardElem;
}

function createRightBox() {
  var rightBox = createElement("div", null, { class: "rightBox" });
  return rightBox;
}

function createLoadMoreButton() {
  const buttonWrapperAttr = { class: "loadmore-wrapper" };
  const buttonWrapper = createElement("div", null, buttonWrapperAttr);
  body.appendChild(buttonWrapper);

  const buttonAttr = { class: "load-more clickable", id: "loadMore" };
  const button = createElement("button", "Load More", buttonAttr);
  buttonWrapper.appendChild(button);
}

function createImage(article) {
  const imageAttr = {
    class: "news-card-image",
    style: `background-image:url(${article["urlToImage"]})`,
  };
  return createElement("div", null, imageAttr);
}

function createTitle(article) {
  const titleAttr = {
    class: "news-card-title news-right-box",
  };

  const title = createElement("div", article.title, titleAttr);
  const titleDetail = createTitleDetail(article);
  title.appendChild(titleDetail);

  return title;
}

function createContent(article) {
  contentAttr = { class: "news-card-content news-right-box" };

  return createElement("div", article.description, contentAttr);
}

function createTitleDetail(article) {
  const [time, onlyDate, weekName] = manipulateDateAndTime(article.publishedAt);

  const author = article.author ? article.author : " - ";

  const detail = `by ${author} / ${time} on ${onlyDate} , ${weekName}`;

  titleDetailAttr = { class: "news-card-author-time" };

  return createElement("div", detail, titleDetailAttr);
}

function manipulateDateAndTime(publishedAt) {
  let time;
  const date = new Date(publishedAt);
  const dateString = String(date);
  const onlyDate = dateString.slice(3, 15);
  const shortWeekName = dateString.slice(0, 3);
  const weekName = getWeekName(shortWeekName);
  if (publishedAt) {
    time = formatDate(date);
  }

  return [time, onlyDate, weekName];
}

function createLink(url, sourceName) {
  const linkAttr = { class: "source", href: url, target: "_blank" };

  return createElement("a", sourceName, linkAttr);
}

function createFooter(article) {
  const footerAttr = { class: "news-card-footer news-right-box" };
  const footer = createElement("div", null, footerAttr);

  const readmoreAttr = { class: "read-more" };
  const readmore = createElement("div", "Read more at ", readmoreAttr);

  const link = createLink(article.url, article.source.name);

  readmore.appendChild(link);

  footer.appendChild(readmore);

  return footer;
}

function getWeekName(shortWeekName) {
  switch (shortWeekName) {
    case "Mon":
      return "Monday";
    case "Tue":
      return "Tuesday";
    case "Wed":
      return "Wednesday";
    case "Thu":
      return "Thursday";
    case "Fri":
      return "Friday";
    case "Sat":
      return "Saturday";
    case "Sun":
      return "Sunday";
  }
}

function formatDate(d) {
  var date = String(d);
  var hh = d.getHours();
  var m = d.getMinutes();
  var s = d.getSeconds();
  var dd = "AM";
  var h = hh;
  if (h >= 12) {
    h = hh - 12;
    dd = "PM";
  }
  if (h == 0) {
    h = 12;
  }
  m = m < 10 ? "0" + m : m;

  s = s < 10 ? "0" + s : s;

  /* if you want 2 digit hours:
  h = h<10?"0"+h:h; */

  var pattern = new RegExp("0?" + hh + ":" + m + ":" + s);

  var replacement = h + ":" + m;
  /* if you want to add seconds
  replacement += ":"+s;  */
  replacement += " " + dd;

  console.log("replacement", replacement);

  return replacement;
}
