var scripts = window.document.getElementsByTagName("script");
var json = [];

for (var i=0; i<scripts.length; i++) {
  if (scripts[i].innerHTML.indexOf("var restaurants") !== -1) {
    var match = scripts[i].innerHTML.match(/var\srestaurants\s\=(.*?)\;\n/);
    if (match.length > 0) {
      json = JSON.parse(match[1]);
      break;
    }
  }
}

var dayName = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"];
var lunchBlacklist = [
  "Badhusparken Cafè","Eastern Palace","Via Grande Pizzeria & Restaura", "Via Grande Pizzeria & Restaurang", "Torvalla Wärdshus", "Svenssons Kafé", "Restaurang Frösö Strand", "Hos Andreas", "BBQ Garden", "Bilbolagets Cafe", "Mat -& grillbaren", "Quality Hotel & resort", "Restaurang Hov","Arctura", "Arenarestaurangen",
  "Bowlinghallen Polaris", "Carlslunds Krog", "OSD", "Scandic Syd", "Tages", "ZIL Restaurang", "Restaurang Cultum", "Matbiten", "Torsta Gårdsrestaurang",
  "Kvarterskrogen Oden", "LITauen Mat & Kaffe ", "Spiltas Krog", "Restaurang Källan", "Eurest", "2 Kockar", "Köket", "Kungsgården"];

window.scrapedFields = [];

for (var i=0; i<json.length; i++) {
  if (lunchBlacklist.indexOf(json[i].name) !== -1) continue;

  window.scrapedFields.push({
    title: json[i].name,
    value: json[i].food[dayName[(new Date).getDay()-1]].replace(/<\/p><p>/g, "\n").replace(/<p>/g,"").replace(/<\/p>/g,""),
    short: true
  });
}
