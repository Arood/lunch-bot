var obj = document.getElementsByClassName("primary")[0].getElementsByTagName("h3");
var today = (new Date()).getDay();

if (today == 1 || today == 4) {
  window.scrapedField = {
    title: "McDonalds",
    value: obj[0].textContent,
    short: true
  };
} else if (today == 3 || today === 5) {
  window.scrapedField = {
    title: "McDonalds",
    value: obj[2].textContent,
    short: true
  };
} else if (today == 2) {
  window.scrapedField = {
    title: "McDonalds",
    value: obj[1].textContent,
    short: true
  };
}
