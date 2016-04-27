
window.onload = function() {

/*=====================

DATA

===================== */
// var citymarkers = "https://shayda.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM pennjobsdatatable20160418";



var cartoDBUsername = "shayda";

// Write SQL Selection Query to be Used on CartoDB Table
// Name of table is 'data_collector'
var sqlQuery = "SELECT * FROM pennjobsdatatable20160418";
// Get CartoDB selection as GeoJSON and Add to Map
function getGeoJSON(){
  $.getJSON("https://"+cartoDBUsername+".cartodb.com/api/v2/sql?format=GeoJSON&q="+sqlQuery, function(data) {
    cartoDBPoints = L.geoJson(data,{
      pointToLayer: function(feature,loc){
        return L.circleMarker(loc, cityMarkerOptions).bindPopup('<p>' + feature.properties.description + '<br /><em>Submitted by </em>' + feature.properties.name + '</p>');
      },
      onEachFeature: onEachFeature
    }).addTo(map);
  });
}

$( document ).ready(function() {
  getGeoJSON();
});

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
  if (feature.properties && feature.properties.city1 && feature.properties.miles) {
    layer.bindPopup("From 2008 to 2013 " + feature.properties.city1+" added an average of " +feature.properties.miles + " miles of bike lanes per year");

  }

}


/*=====================
LAYER STUFF
===================== */
var addLayer= function(url, options){
  $.ajax(url).done(function(data){
    console.log(url, data);
    var geoJson = L.geoJson(data, options).addTo(map);

  });

};

// addLayer(cityMa,{
//   pointToLayer: function (feature, loc){
//     return L.circleMarker(loc, cityMarkerOptions);
//   },
//   onEachFeature: onEachFeature
// });


// Create layer selector
function createSelector(layer) {
    var condition = "";
    var $options = $(".layer_selector").find("li");
    $options.click(function(e) {
        var $li = $(e.target);
        var selected = $li.attr('data');
        var type = $li.data('type');

        if (type === "cartocss") {
            $options.removeClass('cartocss_selected');
            if (selected !== "simple") {
                $li.addClass('cartocss_selected');
            }
            condition = $('#'+selected).text();
            layer.setCartoCSS(condition);
        } else {
            $options.removeClass('sql_selected');
            if (selected !== "") {
                $li.addClass('sql_selected');
            }
            if (selected.indexOf('guinea') !== -1) {
                map_object.setView(L.latLng([-9.5, 147.116667]),6);
            } else {
                map_object.setView(L.latLng([37.7741154,-122.4437914]),2);
            }
            layer.setSQL("SELECT * FROM " + tableName + selected);
        }
    });
}

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
// for storing sublayer outside of createlayer
var sublayers;

// Add data layer to your map
cartodb.createLayer(map,layerSource)
    .addTo(map)
    .done(function(layer) {
        sublayer = layer.getSubLayer(0);
        createSelector(sublayer);
    })
    .error(function(err) {
        console.log("error: " + err);
    });

var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <State`="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);
};
