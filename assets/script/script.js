const cityInput = $('#city-input');
const submitBtn = $('#submit-button');
const cityFormEl = $("#city-form");
const APIKey = `89c2d10cea5bf468636c45b15924d79d`;
let city;

// Marvel API keys - Neil
const marvelPublicKey = "7dd64902fdfe2b8d64b865f83142c32f";
const marvelPrivateKey = "b7319c3da56a792ec88538764bbec49a744ce31f";

// Functions to store and retrieve the lat and lon from the location API in local storage so we can pull it out in the weather API.
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
    
    let queryLocationURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIKey}`;
    
    console.log(queryLocationURL);
    
    fetch(queryLocationURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.length > 0) {
                console.log("lat " + data[0].lat);
                console.log("lon " + data[0].lon);
                let userSearchLat = data[0].lat;
                let userSearchLon = data[0].lon;
                storeLocation(userSearchLat, userSearchLon);
                let lat = getLat();
                let lon = getLon();
                let queryWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=1&appid=${APIKey}`;
                return fetch(queryWeatherURL);
            } else {
                throw new Error('Location not found');
            }
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            console.log("^^^ weather data ^^^");

            // Display weather data inside the modal
            $('#weather-info').html(`
                <p><strong>City:</strong> ${city}</p>
                <p><strong>Weather:</strong> ${data.list[0].weather[0].description}</p>
                <p><strong>Temperature:</strong> ${(data.list[0].main.temp - 273.15).toFixed(2)} °C</p>
            `);

            // Marvel API fetch
            fetchMarvelAPI();
        })
        .catch(function (error) {
            console.error("Error fetching data:", error);
        });
};

function fetchMarvelAPI() {
   
    const ts = Date.now().toString();
    const toHash = ts + marvelPrivateKey + marvelPublicKey;
    const hash = md5(toHash);
    const baseUrl = "http://gateway.marvel.com/v1/public/comics";
    const url = `${baseUrl}?ts=${ts}&apikey=${marvelPublicKey}&hash=${hash}`;
    
    console.log(url);
    
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            console.log("^^^ Marvel data ^^^");

            // Display Marvel data in the modal
            const comic = data.data.results[0];
            $('#marvel-info').html(`
                <p><strong>Title:</strong> ${comic.title}</p>
                <p><strong>Description:</strong> ${comic.description || 'No description available'}</p>
                <figure class="image is-4by3">
                    <img src="${comic.thumbnail.path}.${comic.thumbnail.extension}" alt="${comic.title}">
                </figure>
            `);
        })

        .catch(function (error) {
            console.error("Error fetching Marvel API data:", error);
        });
}

submitBtn.on('click', formSubmitHandler);