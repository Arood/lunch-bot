function isNullOrWhitespace( input ) {
  return !input || input.trim().length < 1;
}
var dayName = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"];
var entry = document.querySelector('.entry-content').textContent;
var lines = entry.split("\n").filter(function(l) { return !isNullOrWhitespace(l) }).map(function(l) { return l.trim(); });

var today = dayName[(new Date).getDay()-1];
var tomorrow = dayName[(new Date).getDay() == 7 ? 0 : (new Date).getDay()];
var foundDay = false;
var lunches = [];
for (var i=0; i<lines.length; i++) {
  if (foundDay) {
    if (lines[i].match(new RegExp(tomorrow+"\\s([\\d\\/]+)", 'g' ))) {
      break;
    } else {
      lunches.push(lines[i]);
    }
  } else if (lines[i].match(new RegExp(today+"\\s([\\d\\/]+)", 'g' ))) {
    foundDay = true;
  }
}

if (lunches.length > 0) {
  window.scrapedField = {
    title: "Tre Rum",
    value: lunches.join("\n"),
    short: true
  };  
}
