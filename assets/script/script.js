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

// Character IDs
const characterID = [
    '1009610', // Spider-Man
    '1009368', // Iron Man
    '1009220', // Captain America
    '1009351', // Hulk
    '1009189', // Black Widow
    '1009664', // Thor
    '1009268', // Deadpool
    '1009282'  // Doctor Strange

];

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

// function to save heroes to local storage
function storeHeroes(heroArray) {
    localStorage.setItem('heroes', JSON.stringify(heroArray));
}
function getStoredHeroes() {
    if (localStorage.getItem('heroes') != null) {
        return JSON.parse(localStorage.getItem('heroes'));
    } else {
        return [];
    }
}

function storeResultFaves(array) {
    localStorage.setItem('faveResults', JSON.stringify(array));
}
function getResultFaves() {
    if (localStorage.getItem('faveResults') != null) {
        return JSON.parse(localStorage.getItem('faveReults'));
    } else {
        return [];
    }
}
// -----

// function to make hero cards
function printHeroCard(hero) {
    const name = hero.name;
    const pic = `${hero.thumbnail.path}.${hero.thumbnail.extension}`;
    const desc = hero.description;

    // create card elements
    const heroCard = $('<div>')
        .addClass('card')
        .attr('data-hero', name);

    const heroName = $('<h4>')
        .addClass('card-header-title')
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

    // if the class is 'unfave' check the fave results array for a matching object and remove it
    if (faveBtn.hasClass('unfave')) {
        // handle toggling the fave class of the favorite button
        faveBtn.removeClass('unfave');
        faveBtn.addClass('fave');

        // setup variables for the lastResult object
        const randHero = JSON.parse(localStorage.getItem('randHero'));
        const curLat = JSON.parse(localStorage.getItem('lat'));
        const curLon = JSON.parse(localStorage.getItem('lon'));
        const curResult = {
            hero: randHero,
            lat: curLat,
            lon: curLon
        }

        // change what the lastResult was in local storage
        localStorage.setItem('curResult', curResult);

        // pull in favorites from local storage, add lastResult to them, then put the array back into local storage
        const faveResults = getResultFaves();
        faveResults.push(curResult);
        storeResultFaves(faveResults);

    } else {
        // handle the fave class toggle when the user clicks it.
        faveBtn.removeClass('fave');
        faveBtn.addClass('unfave');

        // pull the array from local storage, as well as the rand hero
        let faves = getResultFaves();
        const randHero = JSON.parse(localStorage.getItem('randHero'));

        // loop through to find the matching result, if a match, splice the result out of the array
        for (let i = 0; i < faves.length; ++i) {
            if (randHero.name === faves[i].name) {
                faves.splice(i, 1);
            }
        }

        // put the array back into local storage
        storeResultFaves(faves);
    }
}

faveBtn.on('click', handleFave);

// function to handle when the search is submitted
const formSubmitHandler = function (event) {
    event.preventDefault();
    city = cityInput.val();

    let queryLocationURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIKey}`;

    fetch(queryLocationURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.length > 0) {
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
            $('#weather-info').html(`
                <p><strong>City:</strong> ${city}</p>
                <p><strong>Weather:</strong> ${data.list[0].weather[0].description}</p>
                <p><strong>Temperature:</strong> ${data.list[0].main.temp}</p>
            `);

            openModal();
        })
        .catch(function (error) {
            console.error("Error fetching data:", error);
        });

    cityInput.val("");

    fetchMarvelAPI();

    //function to pull random hero from array and put in localStorage

    function randHero() {
        const heroes = getStoredHeroes();
        console.log(heroes);
        let randInt = Math.floor(Math.random() * (heroes.length + 1));
        heroes[randInt];
        localStorage.setItem('randHero', JSON.stringify(heroes[randInt]));
    }
};
// -----

// Marvel fetch function
function fetchMarvelAPI() {
    const ts = Date.now().toString();
    const toHash = ts + marvelPrivateKey + marvelPublicKey;
    const hash = md5(toHash);
    const baseUrl = "https://gateway.marvel.com/v1/public/characters";
    let url = `${baseUrl}/1009610?ts=${ts}&apikey=${marvelPublicKey}&hash=${hash}`;

    // we'll declare the 
    let heroes = getStoredHeroes();

    for (let i = 0; i < characterID.length; ++i) {

        url = `${baseUrl}/${characterID[i]}?ts=${ts}&apikey=${marvelPublicKey}&hash=${hash}`;

        console.log(`Fetching Marvel API with URL: ${url}`);

        fetch(url)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error(`Marvel API response status: ${response.status}`);
                }
                return response.json();
            })
            .then(function (data) {
                //console.log("Full API response:", JSON.stringify(data, null, 2)); // Log the full response to inspect it
                const heroes = data.data.results;
                modalMarvelEl.empty(); // Clear previous results
                // we'll fill the modal with the random hero

                /*
                heroes.forEach(hero => {
                    const heroCard = printHeroCard(hero);
                    modalMarvelEl.append(heroCard);
                });
                */

                // we'll save the heroes array after the for loop
                storeHeroes(heroes);
            })
            .catch(function (error) {
                console.error("Error fetching Marvel API data:", error);
            });

    }


}
// -----

// functions to open and close the modal
function openModal() {
    $('#result-modal').addClass('is-active');
}
function closeModal() {
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
