console.log("JS");

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
var body;
document.addEventListener("DOMContentLoaded", () => {
  body = document.getElementsByTagName("body")[0];
  fetch(
    "https://newsapi.org/v2/top-headlines?country=in&apiKey=fce72268d4594baf8615c93ed057a2c4"
  )
    .then((response) => {
      return response.json();
    })
    .then((allNews) => {
      showNews(allNews);
    });
});

function showNews(allNews) {
  let articles = allNews.articles;
  for (let article of articles) {
    var newsCardElem = document.createElement("div");
    createNewsCard(article, newsCardElem);

    createImage(article, newsCardElem);
  }
}

function createNewsCard(article, newsCardElem) {
  let att = document.createAttribute("class");
  att.value = "news-card";
  newsCardElem.setAttributeNode(att);
  let textNod = document.createTextNode(JSON.stringify(article));
  newsCardElem.appendChild(textNod);

  body.appendChild(newsCardElem);
}

function createImage(article, newsCardElem) {
  console.log(article);
  let image = document.createElement("div");
  let classAtt = document.createAttribute("class");
  let style = document.createAttribute("style");
  classAtt.value = "news-card-image";
  style.value = `background-image:url(${article["urlToImage"]})`;
  image.setAttributeNode(classAtt);
  image.setAttributeNode(style);

  newsCardElem.appendChild(image);
}
