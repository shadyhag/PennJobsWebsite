
window.onload = function() {

/*=====================

DATA RETRIEVAL AND SETUP

===================== */
var all = "https://shayda.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM pennjobsdatatable20160418";


// cartodb.createVis(map, vizjson_url)
//   .done(function(vis, layers) {
//     // do stuff
//     alert("Layers has " + layers.length + " layers.");
//   })
//   .error(function(err) {
//     // report error
//     console.log("An error occurred: " + err);
//   });



var jobs = null;


var cartoDBUsername = "shayda";

// Write SQL Selection Query to be Used on CartoDB Table
// Name of table is 'data_collector'
var sqlQuery = "SELECT * FROM pennjobsdatatable20160418";
var sqlQueryArchitecture = "SELECT * FROM pennjobsdatatable20160418 WHERE category LIKE 'Architecture'";




function showAll(){
  $.getJSON("https://"+cartoDBUsername+".cartodb.com/api/v2/sql?format=GeoJSON&q="+sqlQuery, function(data) {
    jobs = L.geoJson(data,{
      pointToLayer: function(feature,loc){
        return L.circleMarker(loc, cityMarkerOptions).bindPopup('<p><b>' + feature.properties.name + '</b><br /><em>' + feature.properties.address + '</em></p>');
      },
      onEachFeature: onEachFeature
    }).addTo(map);
  });
}


showAll();


// Event Listeners
$('li[value=arch]').click(function(){
  showArch();
});

$('li[value=all]').click(function(){
  showAll();
});

function showArch(){
      if(map.hasLayer(jobs)){
        map.removeLayer(jobs);
      }
      $.getJSON("https://"+cartoDBUserName+".cartodb.com/api/v2/sql?format=GeoJSON&q="+sqlQueryArchitecture, function(data) {
        jobs = L.geoJson(data,{
          pointToLayer: function(feature,loc){
            return L.circleMarker(loc, cityMarkerOptions).bindPopup('<p><b>' + feature.properties.name + '</b><br /><em>' + feature.properties.address + '</em></p>');
          },
          onEachFeature: onEachFeature
        }).addTo(map);
      });
    }



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




/*=====================

MARKER INTERACTIVITY

===================== */


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


}






/*=====================
LAYER STUFF
===================== */






/*=====================
DROPDOWN STUFF
===================== */



/* =====================
Leaflet Configuration
===================== */

var map = L.map('map', {
  center: [30.566174, -60.867132],
  zoom: 3
});
// for storing sublayer outside of createlayer
var sublayers;

// // Add data layer to your map
// cartodb.createLayer(map,layerSource)
//     .addTo(map)
//     .done(function(layer) {
//         sublayer = layer.getSubLayer(0);
//         createSelector(sublayer);
//     })
//     .error(function(err) {
//         console.log("error: " + err);
//     });

var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <State`="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);
};
