/*
http://www.chartjs.org/

===================== */
/*=====================

DATA

===================== */
var citymarkers = "https://shayda.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM pennjobsdatatable20160220";




var allFeatureGroups=[];

legend = null;
var addLayer= function(url, options){
  $.ajax(url).done(function(data){
    console.log(url, data);
    var geoJson = L.geoJson(data, options).addTo(map);
    allFeatureGroups.push(geoJson);
  });

};

var removeAllLayers = function(){
  $.each(allFeatureGroups, function(i, geoJson){
    geoJson.clearLayers();
  });
  allFeatureGroups = [];
  if(legend){
    legend.removeFrom(map);
    legend = null;
  }
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



var phlZCstyle = function(feature) {
  return {fillColor: "grey",
  color: "grey",
  opacity:0};
};


var bikeStyle = function(feature) {
  switch(feature.properties.type_) {
    case "Conventional":
    color = "red";
    break;
    case "Sharrow":
    color = "yellow";
    break;
    case "Buffered":
    color = "orange";
    break;
    case "Buffered w Conventional":
    color = "green";
    break;
    case "Conventional w Sharrows":
    color = "blue";
    break;
    case "Contraflow w Conventional, same":
    color = "purple";
    break;
    default:
    color = "black";
    break;
  }
  return {color: color,
    weight: 2};
  };

  // Choropleth
  function getDemColor(d) {
    return d > 248  ? '#800026' :
    d > 122 ? '#BD0026' :
    d > 64  ? '#E31A1C' :
    d > 23  ? '#FC4E2A' :
    d > 1   ? '#FD8D3C' :
              '#FEB24C' ;
  }


  function demandStyle(feature) {
    return {
      fillColor: getDemColor(feature.properties.ttrips),
      weight: 3,
      opacity: 1,
      color: getDemColor(feature.properties.ttrips),

      fillOpacity: 1
    };
  }


  var densestZCstyle = function(feature) {
    return {fillColor: "blue",
    color: "blue",
    opacity:0
  };
  };



  var safetyMarkerOptions = {
    radius: 8,
    fillColor: "orange",
    color: "orange",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
  };

  var two0style = function(feature) {
    return {fillColor: "black",
    color: "black",
    opacity:1};
  };

  /* =====================

  SLIDES

  ===================== */
  addLayer(citymarkers,{
    pointToLayer: function (feature, loc){
      return L.circleMarker(loc, cityMarkerOptions);
    },
    onEachFeature: onEachFeature
  });

  $('#dropdown').on('show.bs.dropdown', function () {
    $('.dropdown-toggle').dropdown();
  });





  var showSlide1 = function() {

    removeAllLayers();
    addLayer(citymarkers,{
      pointToLayer: function (feature, loc){
        return L.circleMarker(loc, cityMarkerOptions);
      },
      onEachFeature: onEachFeature
    });

    $('#content2').hide();
    $('#content1').show();
    $('#content3').hide();
    $('#content4').hide();
    $('#content5').hide();
    $('#content6').hide();
    map.setView([39.840463, -81.475359],5);
  };

  var showSlide2 = function(){
    removeAllLayers();
    addLayer(phlzipcodes,{style: phlZCstyle});
    addLayer(biketypes,{style: bikeStyle});
    legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend'),
      types = ["Buff", "BuffC", "Sharrow", "Conv", "ConSh", "Cont"],
      labels = ["Buffered", "Conventional Buffered", "Sharrow", "Conventional","Conventional w Sharrows","Contraflow" ];
      div.innerHTML +='<h4> Bike Lane Typology <h4>';

      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < types.length; i++) {
        div.innerHTML += '<div> <i class = "legendbox ' + types[i] + '"></i> ' + labels[i] +'</div>';
      }

      return div;
    };

    legend.addTo(map);
    $('#content1').hide();
    $('#content2').show();
    $('#content3').hide();
    $('#content4').hide();
    $('#content5').hide();
    $('#content6').hide();
    map.setView([40.010305, -75.125318],11);
  };

  var showSlide3 = function(){
    removeAllLayers();
    addLayer(phlzipcodes,{style: phlZCstyle});
    addLayer(sixtypes, {style: bikeStyle});
    addLayer(densestZC,{style: densestZCstyle});

    legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend'),
      types = ["Buff", "BuffC", "Sharrow", "Conv", "ConSh", "Cont"],
      labels = ["Buffered", "Conventional Buffered", "Sharrow", "Conventional","Conventional w Sharrows","Contraflow" ];

      div.innerHTML +='<h4> Bike Lane Typology <h4>';
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < types.length; i++) {
        div.innerHTML += '<div> <i class = "legendbox ' + types[i] + '"></i> ' + labels[i] +'</div>';
      }

      return div;
    };

    legend.addTo(map);
    $('#content1').hide();
    $('#content2').hide();
    $('#content3').show();
    $('#content4').hide();
    $('#content5').hide();
    $('#content6').hide();
    map.setView([39.955720, -75.182261],13);
  };

  var showSlide4 = function(){
    removeAllLayers();
    addLayer(phlzipcodes,{style: phlZCstyle});
    addLayer(cyclephilly, {style: demandStyle});
    legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend'),
      types = ["one", "twenty3", "sixty4", "one22", "two48"],
      labels = ["1-22", "23-63", "64-121", "122-247","248-451"];

      div.innerHTML +='<h4> Number of Trips<h4>';
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < types.length; i++) {
        div.innerHTML += '<div> <i class = "legendbox ' + types[i] + '"></i> ' + labels[i] +'</div>';
      }

      return div;
    };

    legend.addTo(map);
    $('#content1').hide();
    $('#content2').hide();
    $('#content3').hide();
    $('#content4').show();
    $('#content5').hide();
    $('#content6').hide();
    map.setView([39.958286, -75.170902],13);
  };

  var showSlide5 = function(){
    removeAllLayers();
    addLayer(phlzipcodes,{style: phlZCstyle});
    addLayer(crash,{
      pointToLayer: function (feature, loc){
        var popupContent = "Number of injuries: " + feature.properties.tot_inj_co.toString() + "<br> Year: "+feature.properties.crash_year.toString();
        console.log(popupContent);
        return L.circleMarker(loc, safetyMarkerOptions).bindPopup(popupContent);
      },
    });

    $('#content1').hide();
    $('#content2').hide();
    $('#content3').hide();
    $('#content4').hide();
    $('#content5').show();
    $('#content6').hide();
    legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend'),
      types = ["bikeax"],
      labels = ["Traffic Accidents"];


      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < types.length; i++) {
        div.innerHTML += '<div> <i class = "legendbox ' + types[i] + '"></i> ' + labels[i] +'</div>';
      }

      return div;
    };

    legend.addTo(map);
    map.setView([39.952056, -75.164076],14);
  };

  var showSlide6 = function(){
    removeAllLayers();
    addLayer(phlzipcodes,{style: phlZCstyle});
    addLayer(two0street,{style: two0style});
    $('#content1').hide();
    $('#content2').hide();
    $('#content3').hide();
    $('#content4').hide();
    $('#content5').hide();
    $('#content6').show();
    legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend'),
      types = ["st"],
      labels = ["20th Street"];


      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < types.length; i++) {
        div.innerHTML += '<div> <i class = "legendbox ' + types[i] + '"></i> ' + labels[i] +'</div>';
      }

      return div;
    };

    legend.addTo(map);
    map.setView([39.951230, -75.173984],15);
  };



  /* =====================
  CHART
  ===================== */
  $(function(){
    var ctx = $("#myChart1").get(0).getContext("2d");
    // This will get the first returned node in the jQuery collection.
    var data = {
      labels: ["New York", "Boston", "Chicago", "Pittsburgh", "Baltimore", "Philadelphia", "Washington D.C."],
      datasets: [
        {
          label: "Annual Average Miles of Bike Lanes Added",
          fillColor: "rgba(220,220,220,0.75)",
          strokeColor: "rgba(220,220,220,0.75)",
          highlightFill: "#16174f",
          highlightStroke: "#16174f",
          data: [34.4, 13.7, 12.3, 8.2, 6.6,6,5.2]
        },
      ]
    };

    var options1= {
      //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
      scaleBeginAtZero : true,

      //Boolean - Whether grid lines are shown across the chart
      scaleShowGridLines : false,

      //String - Colour of the grid lines
      scaleGridLineColor : "rgba(0,0,0,.05)",

      //Number - Width of the grid lines
      scaleGridLineWidth : 1,

      //Boolean - Whether to show horizontal lines (except X axis)
      scaleShowHorizontalLines: true,

      //Boolean - Whether to show vertical lines (except Y axis)
      scaleShowVerticalLines: true,

      //Boolean - If there is a stroke on each bar
      barShowStroke : true,

      //Number - Pixel width of the bar stroke
      barStrokeWidth : 2,

      //Number - Spacing between each of the X value sets
      barValueSpacing : 5,

      //Number - Spacing between data sets within X values
      barDatasetSpacing : 1,

      //String - A legend template
      legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

    };

    var myBarChart = new Chart(ctx).Bar(data,options1);

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
