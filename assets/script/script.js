$(document).ready(function() {
    const cityInput = $('#city-input');
    const submitBtn = $('#submit-button'); // Correctly select the submit button
    const cityFormEl = $("#city-form");
    const modalMarvelEl = $('#marvel-info');
    const faveBtn = $('.fave');
    const faveList = $('#favorites-list');

    const APIKey = '89c2d10cea5bf468636c45b15924d79d';
    let city;

    // Marvel API keys
    const marvelPublicKey = "95b5ea0a1e7686337cf92c09f3af77c9";
    const marvelPrivateKey = "86ea395eda010d8a803d9f684434090bc936618f";

    // Character IDs
    const characterID = [
        '1009189', // Black Widow
        '1009220', // Captain America
        '1010338', // Captain Marvel
        '1010735', // Drax 
        '1009268', // Deadpool
        '1009282', // Doctor Strange
        '1010743', // Groot
        '1009351', // Hulk
        '1009368', // Iron Man
        '1010744', // Rocket
        '1009610', // Spider-Man
        '1009619', // Star-Lord
        '1009664', // Thor
        '1010784'  // Wanda Vision
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
    // -----

    // functions for storing and retrieving favorites
    function storeResultFaves(array) {
        localStorage.setItem('faveResults', JSON.stringify(array));
    }
    function getResultFaves() {
        if (localStorage.getItem('faveResults') != null) {
            return JSON.parse(localStorage.getItem('faveResults'));
        } else {
            return [];
        }
    }
    // -----

    // function to make hero cards
    function printHeroCard(hero, includeDeleteButton = false) {
        const name = hero[0].name;
        const pic = `${hero[0].thumbnail.path}.${hero[0].thumbnail.extension}`;
        const desc = hero[0].description;

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

        if (includeDeleteButton) {
            const deleteButton = $('<button>')
                .addClass('button is-danger delete-hero')
                .text('Delete')
                .attr('data-hero', name);
            heroCard.append(deleteButton);
        }

        return heroCard;
    }

    // function to handle favorite button
    function handleFave(event) {
        event.preventDefault();
        const target = $(event.target);

        // if the class is 'unfave' check the fave results array for a matching object and remove it
        if (target.hasClass('unfave')) {
            // handle toggling the fave class of the favorite button
            target.removeClass('unfave');
            target.addClass('fave');

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
            localStorage.setItem('curResult', JSON.stringify(curResult));

            // pull in favorites from local storage, add lastResult to them, then put the array back into local storage
            const faveResults = getResultFaves();
            faveResults.push(curResult);
            storeResultFaves(faveResults);

            displayFavorites(); // Update the displayed favorites list

        } else {
            // handle the fave class toggle when the user clicks it.
            target.removeClass('fave');
            target.addClass('unfave');

            // pull the array from local storage, as well as the rand hero
            let faves = getResultFaves();
            const randHero = JSON.parse(localStorage.getItem('randHero'));

            // loop through to find the matching result, if a match, splice the result out of the array
            for (let i = 0; i < faves.length; ++i) {
                if (randHero.name === faves[i].hero[0].name) {
                    faves.splice(i, 1);
                }
            }

            // put the array back into local storage
            storeResultFaves(faves);

            displayFavorites(); // Update the displayed favorites list
        }
    }

    // function to handle delete button
    function handleDeleteHero(event) {
        const target = $(event.target);
        const heroName = target.attr('data-hero');

        // pull the array from local storage
        let faves = getResultFaves();

        // loop through to find the matching result, if a match, splice the result out of the array
        for (let i = 0; i < faves.length; ++i) {
            if (heroName === faves[i].hero[0].name) {
                faves.splice(i, 1);
            }
        }

        // put the array back into local storage
        storeResultFaves(faves);

        displayFavorites(); // Update the displayed favorites list
    }

    // function to display favorites
    function displayFavorites() {
        const favorites = getResultFaves();
        faveList.empty();

        if (favorites.length === 0) {
            faveList.append("<p>No favorites added yet.</p>");
        } else {
            favorites.forEach(favorite => {
                const heroCard = printHeroCard(favorite.hero, true);
                faveList.append(heroCard);
            });
        }
    }

    // function to set a random hero from the array in local storage
    function setRandHero() {
        const heroes = getStoredHeroes();
        let randInt = Math.floor(Math.random() * heroes.length);
        localStorage.setItem('randHero', JSON.stringify(heroes[randInt]));
    }

    // function to get the current randHero from local storage
    function getRandHero() {
        if(localStorage.getItem('randHero') != null){
            return JSON.parse(localStorage.getItem('randHero'));
        }
    }

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
                $('#weather-info').html(
                    `<p><strong>City:</strong> ${city}</p>
                    <p><strong>Weather:</strong> ${data.list[0].weather[0].description}</p>
                    <p><strong>Temperature:</strong> ${data.list[0].main.temp}</p>`
                );

                openModal();
            })
            .catch(function (error) {
                console.error("Error fetching data:", error);
            });

        cityInput.val("");

        // function to pull random hero from array and put in localStorage
        setRandHero();
        modalMarvelEl.empty();
        modalMarvelEl.append(printHeroCard(getRandHero()));
    };

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

            fetch(url)
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error(`Marvel API response status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(function (data) {
                    const hero = data.data.results;

                    heroes.push(hero);
                    storeHeroes(heroes);
                })
                .catch(function (error) {
                    console.error("Error fetching Marvel API data:", error);
                });

        }
    }

    // function to open and close the modal
    function openModal() {
        document.querySelector("#result-modal").classList.add("is-active");
    }
    function closeModal() {
        document.querySelector("#result-modal").classList.remove("is-active");
    }

    // Event listeners
    submitBtn.on("click", formSubmitHandler);
    faveBtn.on("click", handleFave);
    faveList.on("click", ".delete-hero", handleDeleteHero);
    document.querySelector(".modal-close").addEventListener("click", closeModal);

    // initialize
    fetchMarvelAPI();
    displayFavorites(); // Display favorites on page load

    // Export functions for testing
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = {
            formSubmitHandler,
            fetchMarvelAPI,
            storeHeroes,
            getStoredHeroes,
            setRandHero,
            getRandHero,
            printHeroCard,
            storeLocation,
            getLat,
            getLon,
            storeResultFaves,
            getResultFaves,
            handleFave,
            handleDeleteHero,
            openModal,
            closeModal,
            displayFavorites
        };
    }
});
