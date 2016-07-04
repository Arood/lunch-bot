var el = document.getElementById("u221-84");
el.innerHTML = el.innerHTML.replace(/<\/p>/g, "</p>\n");

var texten = el.textContent;
texten = texten.replace("VECKANS LUNCHMENY", "").split("~~");

var days = ["MÅNDAG", "TISDAG", "ONSDAG", "TORSDAG", "FREDAG"];

var last = texten.pop().replace(/^\s\s*/, '').replace(/\s\s*$/, '').replace(/[\s\n]{2,}/g, "\n");
last = last.split("\n");
last.splice(0,1);
last = last.join("\n");

var result = "";

texten.forEach(function(text) {
  text = text.replace(/^\s\s*/, '').replace(/\s\s*$/, '').replace(/[\s\n]{2,}/g, "\n");
  if (text.indexOf(days[(new Date()).getDay()-1]) !== -1) {
    text = text.split("\n");
    text.splice(0,1);
    text = text.join("\n");
    result += text;
  }
});

result += "\n"+last;

window.scrapedField = {
  title: "Hos Andreas",
  value: result,
  short: true
};
