var fetchButton = document.getElementById('fetch-button') //search button 
var APIKey= "40bcaaa35107714c20e64a354fa90a20";
var city;
let previousCities = JSON.parse(localStorage.getItem("search"));
var currentCity = document.getElementById("current-city");
var todaysDate = moment().format("MMMM Do, YYYY");
var temp = document.getElementById("tempEl");
var currentHumidity= $("#humidity");
var windSpeed = $("windSpeed");
var cityList = document.getElementById("history");
var historyButton = document.getElementById("history");
var cardDeck = document.querySelector(".card-deck");
if (!previousCities) {
    previousCities = [];
} 

//Get current date from Moment
var dateElement = document.getElementById("current-date");
dateElement.innerHTML = `Today is ${todaysDate}`;

// event listener
fetchButton.addEventListener("click", function(event)   {
    event.preventDefault();
    city = document.getElementById('city').value;
    displayWeather();
    cityCoordinates();
    document.getElementById('city').value = "";
})

// See city history
function historyCallback(event) {
    var individualCity = event.target;
    city = individualCity.textContent;
    displayWeather();
    cityCoordinates();
}
      
function getCitiesFromStorage() {
    for (var i = 0; i < previousCities.length; i++) {
        var btn = document.createElement("button");
        btn.setAttribute
        var t = document.createTextNode(previousCities[i]);
        console.log("Past Cities", previousCities[i]);
        btn.appendChild(t);
        cityList.appendChild(btn);
    }
}
cityList.addEventListener("click", historyCallback);
getCitiesFromStorage();

//change temp from Kelvin to Farhenheit
function kelvinConverter(valNum){
    valNum = parseFloat(valNum);
    temp.innerHTML= 'Temperature: '+ (Math.floor((valNum-273.15)*1.8)+32)+'\u00B0F';
}

//Function for today's weather display
function displayWeather() { 
    var requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;

    fetch(requestURL)
        .then(function (response) {
            return response.json();   
        })
        .then(function (data) {
            if(data.cod == '200') {
                // ONLY save city when one is valid
                if (!previousCities.includes(city)) {
                previousCities.push(city);       
                localStorage.setItem("search", JSON.stringify(previousCities));
              
                var btn = document.createElement("button");
                var t = document.createTextNode(city);
                btn.appendChild(t);
                var cityList = document.getElementById("history");
                cityList.appendChild(btn);
                };
    
                let citySearched = data.name;
                currentCity.innerHTML = citySearched;
                kelvinConverter(data.main.temp);
                $('.humidity').text("Humidity: " + data.main.humidity + "%");
                $('#windSpeed').text("Wind Speed: " + Math.floor(data.wind.speed*2.237) + "MPH");
                $('.weather-icon').html(`<img src='https://openweathermap.org/img/w/${data.weather[0].icon}.png' />`);
                return data;
            }

        })
        .catch(function(error) {
            console.error("map API error: ", error);
        })
}

//Function for five day forecast
function cityCoordinates()  {
    console.log(city, "Coords");

    var fiveDay = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${APIKey}`;

    fetch(fiveDay)
        .then(function (response)   {
        return response.json();
    })
    .then(function (data)  {
        extendedForecast(data[0].lat, data[0].lon);
    })
    .catch(function(error)  {
        console.error("map API error: ", error);
    })
}

function extendedForecast(lat,lon) {
    var fiveDays = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${APIKey}`;

    let five = [];
    fetch(fiveDays)
        .then(function (response)   {
            return response.json();
        })
        .then(function (data)   {            
                five.push(data.list[3]);
                five.push(data.list[11]);
                five.push(data.list[19]);
                five.push(data.list[27]);
                five.push(data.list[35]);
        })
        .then(function ()   {
            cardDeck.innerHTML = "";
            for (let i = 0; i < five.length; i++) {
                var card = document.createElement("div")
                card.classList.add("card");
                card.classList.add("bg-primary", "border", "border-dark", "rounded");
                cardDeck.appendChild(card);

                var date = five[i].dt;
                var dt = new Date(date * 1000);
                var datec = document.createElement("p");
                datec.textContent = (moment(dt).format("MM/DD/YYYY"));
                card.append(datec);

                var icon = document.createElement("img");     
                icon.src = ("src","http://openweathermap.org/img/w/" + five[i].weather[0].icon + ".png"); 
              
                card.appendChild(icon);
                // Create temp
                var temp = document.createElement("h6");
                temp.textContent = "Temp: " + five[i].main.temp + "°F";
                card.append(temp);
                // Create wind speed
                var wind = document.createElement("h6");
                wind.textContent = "Wind: " + five[i].wind.speed + "MPH";
                card.appendChild(wind);
                // Create humidity
                var hum = document.createElement("h6");
                hum.textContent = "Humidity: " + five[i].main.humidity + "%";
                card.appendChild(hum);
            }
        }) 
}