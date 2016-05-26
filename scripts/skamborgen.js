var el = document.querySelectorAll(".markdown-body.entry-content > p"),
  ett = Math.ceil(Math.random() * (el.length - 1)),
  tvo = Math.ceil(Math.random() * (el.length - 1));

if (ett === tvo) {
  tvo = Math.ceil(Math.random() * (el.length - 1));
}

if (ett === tvo) {
  tvo = Math.ceil(Math.random() * (el.length - 1));
}

var texten = el[ett].textContent.replace("\n", " ") + "\n" + el[tvo].textContent.replace("\n", " ");

window.scrapedField = {
  title: "Adeprimo (Skamborgen)",
  value: texten,
  short: true
};
