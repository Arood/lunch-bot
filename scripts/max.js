var obj = document.querySelectorAll('#main article ul.price li');
var today = (new Date()).getDay() - 1;

window.scrapedField = {
  title: "Max",
  value: obj[today].textContent.replace(/^.+dag - /, ''),
  short: true
};