
const cityInput = document.getElementById("city-input");
const submitBtn = document.getElementById("submit-button");
const cityFormEl = document.getElementById("city-form");
const APIKey; 
const queryURL; 
let city; 

const formSubmitHandler = function (event) {
    event.preventDefault();
     city = cityInput.value.trim();
    console.log(city);


    let queryURL= `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIKey}`;

fetch(queryURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        console.log("lat " + data[0].lat);
        console.log("lon " + data[0].lon);
    
    });
};

function getAPIs () {
// Location API URL: 
// Weather API URL: 
// Marvel API URL: 

}

