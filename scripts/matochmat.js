var scripts = window.document.getElementsByTagName("script");

var center = {
  lat: 63.1820609,
  lng: 14.6178259
};

var json = [];


window.scrapedFields = [];

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

for (var i=0; i<scripts.length; i++) {
  if (scripts[i].innerHTML.indexOf("window\.ssrGlobals") !== -1) {
    window.eval(scripts[i].innerHTML); // I feel dirty
    break;
  }
}

var restaurants = window.ssrGlobals.restaurantData.filter(function(rest) {
  return getDistanceFromLatLonInKm(center.lat, center.lng, parseFloat(rest.geodata.latitude), parseFloat(rest.geodata.longitude)) < 1.8;
});

var dayName = ["mandag", "tisdag", "onsdag", "torsdag", "fredag", "lordag", "sondag"];

restaurants = restaurants.map(function(rest) {

  var restaurant = {
    title: rest.name + (rest.nameSubtext ? " " + rest.nameSubtext : ""),
    short: true
  };

  for (var i=0; i<window.ssrGlobals.lunchMenuData.length; i++) {
    var lunch = window.ssrGlobals.lunchMenuData[i];
    if (lunch.restaurantId == rest.id) {
      lunch.content = JSON.parse(lunch.content);
      var day = dayName[(new Date).getDay()-1];
      if (lunch.content[day]) {
        restaurant.value = lunch.content[day].map(function(d) {
          return d.name + (d.description ? " " + d.description : "");
        }).join("\n");
        if (restaurant.value == 'Dagens rätt kommer snart') {
          delete restaurant.value;
        }
      }
      break;
    }
  }

  return restaurant
}).filter(function(rest) {
  return !!rest.value;
});

window.scrapedFields = restaurants;