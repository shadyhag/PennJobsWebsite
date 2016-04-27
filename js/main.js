/*
http://www.chartjs.org/

===================== */

window.onload = function() {
/*=====================

DATA

===================== */
var citymarkers = "https://shayda.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM pennjobsdatatable20160418";

var tableName = "pennjobsdatatable20160418";

var layerSource = {
  user_name: 'shayda',
  type: 'cartodb',
  sublayers: [{
    sql: "SELECT * FROM " + tableName, // Earthquakes from the past 30 days
    cartocss: cityMarkerOptions
  }]
};


/*=====================

STYLES

===================== */



var cityMarkerOptions = {
  radius: 8,
  fillColor: "grey",
  color: "grey",
  weight: 1,
  opacity: 0.5,
  fillOpacity: 0.8,
  onEachFeature: onEachFeature

};



var simpleStyle = '#pennjobsdatatable20160418 {' +
'marker-fill-opacity: 0.9;' +
'marker-line-color: #FFF;' +
'marker-line-width: 1.5;' +
'marker-line-opacity: 1;' +
'marker-placement: point;' +
'marker-type: ellipse;' +
'marker-width: 10;' +
'marker-fill: #FF6600;' +
'marker-allow-overlap: true;' +
'}';

/*=====================

MARKER INTERACTIVITY

===================== */

simpleStyle =  $("#simple").text();
sublayer.setCartoCSS(simpleStyle);

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    radius: 8,
    weight: 1,
    fillColor: "#16174f",
    color: "#16174f",
    dashArray: '',
    fillOpacity: 1

  });

  if (!L.Browser.ie && !L.Browser.opera) {
    layer.bringToFront();
  }
}



function resetHighlight(e) {
  var layer = e.target;

  layer.setStyle(cityMarkerOptions);

  if (!L.Browser.ie && !L.Browser.opera) {
    layer.bringToFront();
  }
}


function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,

  });
  if (feature.properties && feature.properties.city1 && feature.properties.miles) {
    layer.bindPopup("From 2008 to 2013 " + feature.properties.city1+" added an average of " +feature.properties.miles + " miles of bike lanes per year");

  }

}


/*=====================
LAYER STUFF
===================== */

addLayer(citymarkers,{
  pointToLayer: function (feature, loc){
    return L.circleMarker(loc, cityMarkerOptions);
  },
  onEachFeature: onEachFeature
});

/*=====================
DROPDOWN STUFF
===================== */

$('#dropdown').on('show.bs.dropdown', function () {
  $('.dropdown-toggle').dropdown();
});







/* =====================
Leaflet Configuration
===================== */

var map = L.map('map', {
  center: [30.566174, -60.867132],
  zoom: 3
});
var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <State`="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);


};
