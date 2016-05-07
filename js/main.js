
window.onload = function() {

  /*=====================

  DATA RETRIEVAL AND SETUP

  ===================== */

  var jobs = null;

  var cartoDBUsername = "shayda";

  // Write SQL Selection Query to be Used on CartoDB Table
  // Name of table is 'data_collector'


  /*=====================

  LOAD MAP WITH ALL JOBS

  ===================== */


  function showJobs(){

    $.get("jobs.php", filterOptions, function(data) {

      if (jobs !== null) {
        jobs.clearLayers();
      }
      jobs = L.geoJson(data,{
        pointToLayer: function(feature,loc){
          var marker = L.circleMarker(loc, cityMarkerOptions);
          marker.on('click', function(e) {
                console.log(feature.properties.city1, feature.properties.state1);
                nearJobsInfo({city: feature.properties.city1, state: feature.properties.state1});

            });
            return marker;
        },
        onEachFeature: onEachFeature
      }).addTo(map);

    }
  );

}

$(showJobs);

var filterOptions = {
  not_types: [],
  not_experience: [],
  concz: []
};

/*=====================
MARKER STUFF
===================== */
function nearJobsInfo(location){
  var opts = {
    not_types: filterOptions.types,
    not_experience: filterOptions.not_experience,
    concz: filterOptions.concz,
    city: location.city,
    state: location.state
  };

  $.get("jobdata.php", opts, function(data) {
    console.log("name", data);

    // jobs = L.geoJson(data,{
    //   pointToLayer: function(feature,loc){
    //     return L.circleMarker(loc, cityMarkerOptions).bindPopup('<p><b>' + feature.properties.name + '</b><br /><em>' + feature.properties.address + '</em></p>');
    //   },
    //   onEachFeature: onEachFeature
    // }).addTo(map);
  });
}

/*=====================
CHECKBOX STUFF
===================== */

$('input.filter-job_type:checkbox').click(function(){
  var val = $(this).attr("value");
  console.log("poop");
  if($(this).is(":checked")){
    filterOptions.not_types.push(val);
  }else{
    filterOptions.not_types = filterOptions.not_types.filter(function(name) {
      return name !== val;
    });
  }
  showJobs();
});

$('input.filter-experience:checkbox').click(function(){
  var val = $(this).attr("value");
  console.log("pee");
  if($(this).is(":checked")){
    filterOptions.not_experience.push(val);
  }else{
    filterOptions.not_experience = filterOptions.not_experience.filter(function(name) {
      return name !== val;
    });
  }
  showJobs();
});

/*=====================
DROPDOWN STUFF
===================== */

$('#concentrationz .dropdown-menu a').click(function(e){
  e.preventDefault();
  var selection = $(this);
  var selectedCategory = selection.attr('value');
  console.log("BLOB", selectedCategory);
  filterOptions.concz = selectedCategory;
  showJobs();
});



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







/* =====================
Leaflet Configuration
===================== */

var map = L.map('map', {
  center: [30.566174, -60.867132],
  zoom: 3
});


/*=====================

Infowindow

===================== */
//
// map.on('click', function(e) {
//       var popLocation= e.latlng;
//       console.log(popLocation);
//
//   });

  // .setLatLng(popLocation)
  // .setContent('<p>Hello world!<br />This is a nice popup.</p>')
  // .openOn(map);

// cartodb.createLayer(map, '"https://shayda.cartodb.com/api/v2/sql?format=GeoJSON&q=', {
//     query: 'SELECT * FROM pennjobsdatatable20160418 ORDER BY post_date DESC'
//
//   })
//     .on('done', function(layer) {
//
//       map.overlayMapTypes.setAt(1, layer);
//       var sublayer = layer.getSubLayer(0);
//       sublayer.setCartoCSS(systemcartoCSS);
//
//       layers.SystemLyr = sublayer;
//       var infowindow = sublayer.infowindow;
//
//       infowindow.set('template', function(data) {
//
//         var clickPosLatLng = this.model.get('latlng');
//         var fields = this.model.get('content').fields;
//
//         if (fields && fields[0].type !== 'loading') {
//
//           var obj = _.find(fields, function(obj) {
//             return obj.title == 'kml_key';
//           }).value;
//
//           callinfowindow(clickPosLatLng, obj);
//
//         }
//       }); // end infowindow set
//
//     }); // end on.done for the water systems
// // for storing sublayer outside of createlayer
// var sublayers;
//
// // // Add data layer to your map
// // cartodb.createLayer(map,layerSource)
// //     .addTo(map)
// //     .done(function(layer) {
// //         sublayer = layer.getSubLayer(0);
// //         createSelector(sublayer);
// //     })
// //     .error(function(err) {
// //         console.log("error: " + err);
// //     });

var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <State`="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);
};
