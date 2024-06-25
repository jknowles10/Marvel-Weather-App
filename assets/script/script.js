const cityInput = $('#city-input');
const submitBtn = $('#submit-button');
const cityFormEl = $("#city-form");
const APIKey = `89c2d10cea5bf468636c45b15924d79d`;
const queryURL = ``;
let city;

const formSubmitHandler = function (event) {
    event.preventDefault();
    city = cityInput.val();
    console.log(city);


    let queryURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIKey}`;

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

submitBtn.on('click', formSubmitHandler);

function getAPIs() {
    // Location API URL: 

    // Weather API URL: 

    // Marvel API URL: 

}