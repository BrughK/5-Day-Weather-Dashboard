// Query Selectors
var cityInput = document.querySelector("input");
var citySelected = document.getElementById("city-name")
var cityInfoBox = document.getElementById("city-info"); 
var searchButton = document.getElementById("btn1");
var searchedCityBox = document.getElementById("cityList");
var day1 = document.getElementById("card-one");
var day2 = document.getElementById("card-two");
var day3 = document.getElementById("card-three");
var day4 = document.getElementById("card-four");
var day5 = document.getElementById("card-five");
var today = moment().format("MM/DD/YYYY");

var key = "40bcaaa35107714c20e64a354fa90a20";

// Main function to search city
function searchCity (event) {

}

// Event listener for search button
searchButton.addEventListener('click', searchCity);