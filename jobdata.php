<?php
header('Content-Type: application/json');
error_reporting(0);
define('BASE_URL', "https://shayda.cartodb.com/api/v2/sql?format=JSON&api_key=f816e999bf9b5e7d7a5352138f2f23007fc184d4");

function getJobs($types, $exclude_experience_levels,$concentrations, $lat, $long){
  $sql = "SELECT * FROM pennjobsdatatable20160418";
  $wheres = [];

  if (is_numeric($lat) && is_numeric($long)){
    $wheres[]= "ST_Distance_Sphere(the_geom, ST_MakePoint($lat,$long)) <= 10 * 1609.34";
  }
  //
  if (!empty($concentrations) && $concentrations !== "All") {
    $wheres[] = "category ='$concentrations'";
  }

  // exclude based on job_type field
  if(!empty($types)){
    $wheres[] = "job_type NOT IN('".implode($types, "','")."')";
  }

  // exclude based on the experience field
  if(!empty($exclude_experience_levels)){
    $wheres[] = "experience NOT IN('".implode($exclude_experience_levels, "','")."')";
  }

  // put together where clauses to make full query
  if(!empty($wheres)){
    $sql .= " WHERE ".implode(" AND ", $wheres);
  }

  $url = BASE_URL."&q=".urlencode($sql);
  error_log("cartodb url: $url");

  return file_get_contents($url);
}

$job_json = getJobs($_GET["not_types"], $_GET["not_experience"], $_GET["concz"], $_GET["lat"], $_GET["long"]);
print($job_json);
