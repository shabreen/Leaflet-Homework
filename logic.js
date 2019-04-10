// Create the map object
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });

// Add street layer 
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-basic",
  accessToken: API_KEY
}).addTo(myMap);

// Store API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

d3.json(queryUrl, function(response) {

  // set up marker colors based on earthquake magnitude
  for (var i = 0; i < response.features.length; i++) {
    var markerColor = "green";
    if (response.features[i].properties.mag < 1) {
      markerColor = "green"
    } else if (response.features[i].properties.mag < 2) {
      markerColor = "#adff2f"
    } else if (response.features[i].properties.mag < 3) {
      markerColor = "yellow"
    } else if (response.features[i].properties.mag < 4) {
      markerColor = "orange"
    } else if (response.features[i].properties.mag < 5) {
      markerColor = "orangered"
    } else markerColor = "red"

    // create markers on map where the size of the marker is dependent on the magnitude of the earthquake
    L.circle([response.features[i].geometry.coordinates[1], response.features[i].geometry.coordinates[0]], {
       fillOpacity: 0.75,
        color: markerColor,
        fillColor: markerColor,
        radius: response.features[i].properties.mag*10000 
    }).bindPopup("<h2>" + response.features[i].properties.place + "</h2> <hr> <h3>Magnitude: " + response.features[i].properties.mag + "</h3>")
    .addTo(myMap)
  }

  // set up legend colors
  function getColor(d) {
    return d > 5 ? "red" :
           d > 4 ? "orangered" :
           d > 3 ? "orange" :
           d > 2 ? "yellow" :
           d > 1 ? "#adff2f" :
                   "green";
  }

  // create the legend
  var legend = L.control({position: 'bottomright'});
  legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend'),
      magnitudes = [0, 1, 2, 3, 4, 5],
      labels = [];

    for (var i = 0; i < magnitudes.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(magnitudes[i] + 1) + '"></i> ' +
        magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(myMap);

});