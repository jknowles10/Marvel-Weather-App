const cityInput = $('#city-input');
const submitBtn = $('.search');
const cityFormEl = $("#city-form");
const modalMarvelEl = $('#marvel-info');
const faveBtn = $('#fave');

const APIKey = '89c2d10cea5bf468636c45b15924d79d';
let city;

// Marvel API keys
const marvelPublicKey = "7dd64902fdfe2b8d64b865f83142c32f";
const marvelPrivateKey = "b7319c3da56a792ec88538764bbec49a744ce31f";
// -----

// Functions to store and retrieve the latitude and longitude from local storage
function storeLocation(lat, lon) {
    localStorage.setItem('lat', JSON.stringify(lat));
    localStorage.setItem('lon', JSON.stringify(lon));
}
function getLat() {
    return JSON.parse(localStorage.getItem('lat'));
}
function getLon() {
    return JSON.parse(localStorage.getItem('lon'));
}
// -----

// function to save heros to local storage
function storeHeroes(heroArray) {
    localStorage.setItem('heroes', JSON.stringify(heroArray));
}
function getStoredHeroes() {
    let heroes = [];

    if (localStorage.getItem('heroes') != null) {
        heroes = JSON.parse(localStorage.getItem('heroes'));
        return heroes;
    } else {
        return heroes;
    }
}
// -----

// functions for storing and retrieving heroes
function storeHeroes(heroArray) {
    localStorage.setItem('heroes', JSON.stringify(heroArray));
}
function getStoredHeroes() {
    let heroes = [];

    if (localStorage.getItem('heroes') != null) {
        heroes = JSON.parse(localStorage.getItem('heroes'));
        return heroes;
    } else {
        return heroes;
    }
}
// -----

// functions for storing and retrieving favorites
function storeLocationFaves(faveResult) {
    localStorage.setItem('faveResults', faveResult);
}
function getResultFaves() {
    const faves = [];
    if (localStorage.getItem('faveResults') != null) {
        faves = JSON.parse(localStorage.getItem('faveReults'));
        return faves;
    } else {
        return faves;
    }
}
// -----

// function to make hero cards
function printHeroCard(hero) {

    const name = hero.nameHero;
    const pic = hero.picHero;
    const desc = hero.descHero;

    // create card elements
    const heroCard = $('<div>')
        .addClass('card')
        .attr('data-hero', name);

    const heroName = $('<h4>')
        .addClass(`card-header-title`)
        .text(name);

    const div1 = $('<div>')
        .addClass('card-image');

    const figure1 = $('<figure>')
        .addClass('image is-4by3');

    const heroDesc = $('<p>')
        .addClass('card-content')
        .text(desc);

    figure1.append(`<img src="${pic}" />`);

    div1.append(figure1);

    heroCard.append([heroName, div1, heroDesc]);

    return heroCard;

}
// -----

// function to handle favorite button
function handleFave() {
    // if the fave button is click, change it's class.
    // if the class is 'fave', save the lat, lon and randHero from local storage to fave results
    // if the class is 'unfave' check the fave results array for a matching object and remove it
    if (faveBtn.hasClass('unfave')) {
        faveBtn.removeClass('unfave');
        faveBtn.addClass('fave');

        // grab lat, lon, and randhero from localstorage and put into fave array

        
    } else {
        faveBtn.removeClass('fave');
        faveBtn.addClass('unfave');

        // search for hero in fave array by name and remove from array.
    }
}

faveBtn.on('click', handleFave);

// function to handle when the search is submitted
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

                let queryWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=1&units=imperial&appid=${APIKey}`;

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
                <p><strong>Temperature:</strong> ${(data.list[0].main.temp)}</p>
            `);

            openModal();
        })
        .catch(function (error) {
            console.error("Error fetching data:", error);
        });

    cityInput.val("");

    //fetchMarvelAPI();
};
// -----

// Marvel fetch function
function fetchMarvelAPI() {
    const ts = Date.now().toString();
    const toHash = ts + marvelPrivateKey + marvelPublicKey;
    const hash = md5(toHash);
    const baseUrl = "https://gateway.marvel.com/v1/public/characters";
    
    // hulkID = '/1009351';
    // thorID = '/1009664';
    // spiderID = '/1009610';
    // ironID = '/1009368';
    // capt = '/1009220';

    let url = `${baseUrl}?ts=${ts}&apikey=${marvelPublicKey}&hash=${hash}`;

    const idArray = [
        {
            hero: 'hulk',
            id: '/1009351'
        },
        {
            hero: 'thor',
            id: '/1009664'

        },
        {
            hero: 'spider',
            id: '/1009610'

        },
        {
            hero: 'iron',
            id: '/1009368'

        },
        {
            hero: 'capt',
            id: '/1009220'

        }
    ];

    for(let i = 0; i < idArray.length; ++i) {
        
    url = `${baseUrl}${idArray[i].id}?ts=${ts}&apikey=${marvelPublicKey}&hash=${hash}`
    fetch(url)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        console.log("^^^ Marvel data ^^^");
    })
    .catch(function (error) {
        console.error("Error fetching Marvel API data:", error);
    });
    }


}
// -----

// functions to open and close the modal
function openModal() {
    console.log("Opening modal");
    $('#result-modal').addClass('is-active');
}
function closeModal() {
    console.log("Closing modal");
    $('#result-modal').removeClass('is-active');
}
// -----

// event listener for closing the modal
$(document).on('click', '.modal-background, .delete, #modal-close', closeModal);


// event listener for the search button being clicked
submitBtn.on('click', formSubmitHandler);

cityInput.on('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        submitBtn.click();
    }
});

$(window).on('load', function() {
    console.log('loaded');
    
})

$(document).ready(function () {
    console.log('ready');
    fetchMarvelAPI();
})