
window.onload = function() {

  /*=====================

  DATA RETRIEVAL AND SETUP

  ===================== */

  var jobs = null;

  var cartoDBUsername = "shayda";

  // Write SQL Selection Query to be Used on CartoDB Table
  // Name of table is 'data_collector'


  var filterOptions = {
    not_types: [],
    not_experience: [],
    concz: []
  };
  var location= {};

  /*=====================
  MARKER STUFF
  ===================== */

  /*=====================

  Infowindow

  ===================== */

  function nearJobsInfo(){
    var opts = {
      not_types: filterOptions.not_types,
      not_experience: filterOptions.not_experience,
      concz: filterOptions.concz,
      city: location.city,
      state: location.state
    };
    $(".drawer-body").empty();

    $.get("jobdata.php", opts, function(data) {
      console.log(data.rows);
        $.each(data.rows, function(){$('.drawer-body').append("<div>"+this.job_title+"<div>");});
    });
  }



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
            location = {city: feature.properties.city1, state: feature.properties.state1};
            nearJobsInfo();
            $("#drawerExample").drawer("show");
            $(".drawer-title").empty();
            $(".drawer-title").text("Opportunities in "+feature.properties.city1+", "+ feature.properties.state1);

          });
          return marker;
        },
        onEachFeature: onEachFeature
      }).addTo(map);
    }
  );
  if (location.city && location.state)  {
    nearJobsInfo();

  }
}

$(showJobs);


/*=====================
CHECKBOX STUFF
===================== */

$('input.filter-job_type:checkbox').change(function(){
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

$('input.filter-experience:checkbox').change(function(){
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
RESET CHECKBOXES STUFF
===================== */

$('input.resetboxes').click(function(){
  filterOptions = {
    not_types: [],
    not_experience: [],
    concz: []
  };
  location= {};
  showJobs();
  $('input:checkbox').prop('checked',false);

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


var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <State`="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);
};
