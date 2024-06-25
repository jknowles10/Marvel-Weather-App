const cityInput = $('#city-input');
const submitBtn = $('#submit-button');
const cityFormEl = $("#city-form");
const APIKey = `89c2d10cea5bf468636c45b15924d79d`;
let city;

// functions to store and retrieve the lat and lon from the location API in local storage so we can pull it out in the weather API.
function storeLocation(lat, lon) {
    localStorage.setItem('lat', JSON.stringify(lat));
    localStorage.setItem('lon', JSON.stringify(lon));
}
function getLat() {
    let lat = JSON.parse(localStorage.getItem('lat'));
    return lat;
}
function getLon() {
    let lon = JSON.parse(localStorage.getItem('lon'));
    return lon;
}

const formSubmitHandler = function (event) {
    event.preventDefault();
    city = cityInput.val();
    console.log(city);

    let userSearchLat;
    let userSearchLon;


    let queryLocationURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIKey}`;

    console.log(queryLocationURL);

    fetch(queryLocationURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            
            console.log("lat " + data[0].lat);
            console.log("lon " + data[0].lon);

            userSearchLat = data[0].lat;
            userSearchLon = data[0].lon;

            storeLocation(userSearchLat, userSearchLon);
        });

    let lat = getLat();
    let lon = getLon();

    let queryWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=1&appid=${APIKey}`;

    fetch(queryWeatherURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            console.log("^^^ weather data ^^^");
        })
};

submitBtn.on('click', formSubmitHandler);

function getAPIs() {
    // Location API URL: 

    // Weather API URL: 

    // Marvel API URL: 

}