<?php
header('Content-Type: application/json');
error_reporting(0);
define('BASE_URL', "https://shayda.cartodb.com/api/v2/sql?format=JSON&api_key=f816e999bf9b5e7d7a5352138f2f23007fc184d4");

function getJobs($types, $exclude_experience_levels,$concentrations, $city, $state, $salary){
  $sql = "SELECT * FROM pennjobsdatatable";
  $wheres = [];

  //
  if ($city && $state){
    $wheres[]= "city1 = '$city' AND state1= '$state'";
  }
  if ($salary){
    $wheres[]= "losal >= '$salary'";
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

$job_json = getJobs($_GET["not_types"], $_GET["not_experience"], $_GET["concz"], $_GET["city"], $_GET["state"], $_GET["salary"]);
print($job_json);
