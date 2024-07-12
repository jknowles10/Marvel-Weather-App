$(document).ready(function() {
    const cityInput = $('#city-input'); // Input field for city name
    const submitBtn = $('#submit-button'); // Submit button for the city search form
    const cityFormEl = $("#city-form"); // Form element for the city search
    const modalMarvelEl = $('#marvel-info'); // Element to display Marvel hero information
    const faveBtn = $('.fave'); // Button for adding/removing favorites
    const faveList = $('#favorites-list'); // List element to display favorite heroes

    const APIKey = '89c2d10cea5bf468636c45b15924d79d'; // OpenWeatherMap API key
    let city; // Variable to store the city name

    // Marvel API keys
    const marvelPublicKey = "7dd64902fdfe2b8d64b865f83142c32f";
    const marvelPrivateKey = "b7319c3da56a792ec88538764bbec49a744ce31f";

    // Character IDs for Marvel heroes
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
        '1009562', // Scarlet Witch
        '1009610', // Spider-Man
        '1010733', // Star-Lord
        '1009664', // Thor
        '1009697'  // Vision
    ];

    // Functions to store and retrieve the latitude and longitude from local storage
    function storeLocation(lat, lon) {
        localStorage.setItem('lat', JSON.stringify(lat)); // Store latitude in local storage
        localStorage.setItem('lon', JSON.stringify(lon)); // Store longitude in local storage
    }

    function getLat() {
        const lat = localStorage.getItem('lat'); // Retrieve latitude from local storage
        return lat ? JSON.parse(lat) : null;
    }

    function getLon() {
        const lon = localStorage.getItem('lon'); // Retrieve longitude from local storage
        return lon ? JSON.parse(lon) : null;
    }
    // -----

    // Function to save heroes to local storage
    function storeHeroes(heroArray) {
        localStorage.setItem('heroes', JSON.stringify(heroArray)); // Store heroes array in local storage
    }

    function getStoredHeroes() {
        const heroes = localStorage.getItem('heroes'); // Retrieve heroes from local storage
        return heroes ? JSON.parse(heroes) : [];
    }
    // -----

    // Functions for storing and retrieving favorites
    function storeResultFaves(array) {
        localStorage.setItem('faveResults', JSON.stringify(array)); // Store favorite results in local storage
    }

    function getResultFaves() {
        const faveResults = localStorage.getItem('faveResults'); // Retrieve favorite results from local storage
        return faveResults ? JSON.parse(faveResults) : [];
    }
    // -----

    // Function to make hero cards
    function printHeroCard(hero, includeDeleteButton = false) {
        const name = hero[0].name; // Hero name
        const pic = `${hero[0].thumbnail.path}.${hero[0].thumbnail.extension}`; // Hero picture URL
        const desc = hero[0].description; // Hero description

        // Create card elements
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
            heroCard.append(deleteButton); // Add delete button if includeDeleteButton is true
        }

        return heroCard;
    }

    // Function to handle favorite button
    function handleFave(event) {
        event.preventDefault();
        const target = $(event.target);

        // If the class is 'unfave', check the fave results array for a matching object and remove it
        if (target.hasClass('unfave')) {
            
            // Handle toggling the fave class of the favorite button
            target.removeClass('unfave');
            target.addClass('fave');

            // Setup variables for the lastResult object
            const randHero = JSON.parse(localStorage.getItem('randHero'));
            const curLat = getLat();
            const curLon = getLon();
            const curResult = {
                hero: randHero,
                lat: curLat,
                lon: curLon
            }

            // Change what the lastResult was in local storage
            localStorage.setItem('curResult', JSON.stringify(curResult));

            // Pull in favorites from local storage, add lastResult to them, then put the array back into local storage
            const faveResults = getResultFaves();
            faveResults.push(curResult);
            storeResultFaves(faveResults);

            displayFavorites();

        } else {
            // Handle the fave class toggle when the user clicks it.
            target.removeClass('fave');
            target.addClass('unfave');

            // Pull the array from local storage, as well as the rand hero
            let faves = getResultFaves();
            const randHero = JSON.parse(localStorage.getItem('randHero'));

            // Loop through to find the matching result, if a match, splice the result out of the array
            for (let i = 0; i < faves.length; ++i) {
                if (randHero.name === faves[i].hero[0].name) {
                    faves.splice(i, 1);
                }
            }

            // Put the array back into local storage
            storeResultFaves(faves);

            displayFavorites();
        }
    }

    // Function to handle delete button
    function handleDeleteHero(event) {
        const target = $(event.target);
        const heroName = target.attr('data-hero');

        // Pull the array from local storage
        let faves = getResultFaves();

        // Loop through to find the matching result, if a match, splice the result out of the array
        for (let i = 0; i < faves.length; ++i) {
            if (heroName === faves[i].hero[0].name) {
                faves.splice(i, 1);
            }
        }

        // Put the array back into local storage
        storeResultFaves(faves);

        displayFavorites();
    }

    // Function to display favorites
    function displayFavorites() {
        const favorites = getResultFaves();
        faveList.empty(); // Clear the favorites list

        if (favorites.length === 0) {
            faveList.append("<p>No favorites added yet.</p>");
        } else {
            favorites.forEach(favorite => {
                const heroCard = printHeroCard(favorite.hero, true);
                faveList.append(heroCard); // Display each favorite hero card
            });
        }
    }

    // Function to set a random hero from the array in local storage
    function setRandHero() {
        const heroes = getStoredHeroes();
        if (heroes.length > 0) {
            let randInt = Math.floor(Math.random() * heroes.length);
            localStorage.setItem('randHero', JSON.stringify(heroes[randInt])); // Store random hero in local storage
        }
    }

    // Function to get the current randHero from local storage
    function getRandHero() {
        const randHero = localStorage.getItem('randHero');
        return randHero ? JSON.parse(randHero) : null;
    }

    // Function to handle when the search is submitted
    const formSubmitHandler = function (event) {
        event.preventDefault();
        city = cityInput.val(); // Get the city name from the input field

        let queryLocationURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIKey}`; // URL to fetch location data

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

                    let queryWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=1&units=imperial&appid=${APIKey}`; // URL to fetch weather data

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
                    <p><strong>Temperature:</strong> ${data.list[0].main.temp}</p>` // Display weather information
                );

                openModal();
            })
            .catch(function (error) {
                console.error("Error fetching data:", error);
            });

        cityInput.val(""); // Clear the input field

        // Function to pull random hero from array and put in localStorage
        setRandHero();
        modalMarvelEl.empty();
        const randHero = getRandHero();
        if (randHero) {
            modalMarvelEl.append(printHeroCard(randHero)); // Display the random hero in the modal
        }
    };

    // Marvel fetch function
    function fetchMarvelAPI() {
        const ts = Date.now().toString(); // Timestamp for the API call
        const toHash = ts + marvelPrivateKey + marvelPublicKey; // String to hash for API authentication
        const hash = md5(toHash); // Hashed string
        const baseUrl = "https://gateway.marvel.com/v1/public/characters";
        let heroes = getStoredHeroes();

        // Function to fetch and store each hero
        const fetchHero = (characterID) => {
            const url = `${baseUrl}/${characterID}?ts=${ts}&apikey=${marvelPublicKey}&hash=${hash}`;
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Marvel API response status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    const hero = data.data.results;
                    console.log(`Fetched hero: ${hero[0].name}`);
                    heroes.push(hero);
                    storeHeroes(heroes); // Store the hero in local storage
                })
                .catch(error => {
                    console.error("Error fetching Marvel API data:", error);
                });
        };

        // Fetch all heroes and store them
        for (let i = 0; i < characterID.length; ++i) {
            fetchHero(characterID[i]);
        }
    }

    // Function to open and close the modal
    function openModal() {
        document.querySelector("#result-modal").classList.add("is-active"); // Open the modal
    }
    function closeModal() {
        document.querySelector("#result-modal").classList.remove("is-active"); // Close the modal
    }

    // Event listeners
    submitBtn.on("click", formSubmitHandler); // Handle submit button click
    faveBtn.on("click", handleFave); // Handle favorite button click
    faveList.on("click", ".delete-hero", handleDeleteHero); // Handle delete hero button click
    cityFormEl.on("submit", formSubmitHandler); // Handle form submit
    document.querySelector(".modal-close").addEventListener("click", closeModal); // Handle modal close button click

    // Initialize
    fetchMarvelAPI(); // Fetch Marvel heroes on page load
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
