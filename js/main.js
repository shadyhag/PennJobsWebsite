
window.onload = function() {

  /*=====================

  DATA RETRIEVAL AND SETUP

  ===================== */

  var jobs = null;

  var cartoDBUsername = "shayda";

  // Write SQL Selection Query to be Used on CartoDB Table


  var filterOptions = {
    not_types: [],
    not_experience: [],
    concz: [],
    salary: []
  };
  var location= {};


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
        $.each(data.rows, function(){$('.drawer-body').append(
          "<div class=jobtitle>"+this.job_title+"</div>"+
          "<div class=company>"+this.firm_name+"</div>"+
          "<p class=salary>"+this.paid+" "+this.job_type+" "+this.salary+" "+"</p>"+
          "<div><p class = main>"+this.description+"</p></div>"+
          "<div><p class=mainlabel>US Citizenship required: </p><p class=maintext>"+this.us_citizen_required+"</p></div>"+
          "<div><p class=mainlabel>Website: <a href="+this.link+">"+this.link+"</a></p></div>"+
          "<div><p class=mainlabel>Contact Information: </p><p class=maintext>"+this.contact_name+" <a href="+this.contact_email+">"+this.contact_email+" "+this.contact_phone+"</a></p></div>"+
          "<div><p class=mainlabel>Source: </p><p class=maintext>"+this.sourcea3+" - "+this.sourcea2+"</p></div>"+
          "<div><p class=mainlabel>Posted: </p><p class=maintext>"+this.post_date+"</p></div>"+
          
          "<hr>"






        );});
    });
  }


  /*=====================
"<div><p class=mainlabel>Job Type: </p><p class = maintext>"+
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
            var lat = e.latlng.lat;
            var lng = (e.latlng.lng);
            var leftlong = lng+3;
            var botlat = lat-2;
            console.log(leftlong);
            var newLatLng = new L.LatLng(botlat,leftlong);
            map.setView(newLatLng,6);
            nearJobsInfo();
            $("#drawerExample").drawer("show");
            $(".drawer-title").empty();
            $(".drawer-title").text("Opportunities in "+feature.properties.city1+", "+ feature.properties.state1+ " "+feature.properties.country1);

          }).bindPopup(feature.properties.city1+", " +feature.properties.state1);
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
  $(".drawer-title").text("Job Opportunities");
  $(".drawer-body").html("<p>Click on a marker in the map to view job opportunities in that area.</p>");
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

$('#salariez .dropdown-menu a').click(function(e){
  e.preventDefault();
  var selection = $(this);
  var selectedCategory = selection.attr('value');
  console.log("BLObbbbbB", selectedCategory);
  filterOptions.salary = selectedCategory;
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
