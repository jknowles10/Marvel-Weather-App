const cityInput = $('#city-input');
const submitBtn = $('.search');
const cityFormEl = $("#city-form");
const modalMarvelEl = $('#marvel-info');

const APIKey = '89c2d10cea5bf468636c45b15924d79d';
let city;

// Marvel API keys
const marvelPublicKey = "7dd64902fdfe2b8d64b865f83142c32f";
const marvelPrivateKey = "b7319c3da56a792ec88538764bbec49a744ce31f";

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

// functions to get and store fave results
function storeResultFaves(faveLocation) {
    localStorage.setItem('faveResults', JSON.stringify(faveLocation));
}
function getResultFaves() {
    const faves = [];
    if (localStorage.getItem('faveReults') != null) {
        faves = JSON.parse(localStorage.getItem('faveReults'));
        return faves;
    } else {
        return faves;
    }
}

// functions to get and store the random hero
function storeRandHero (hero) {
    localStorage.setItem('randHero', hero);
}
function getRandHero () {
    return JSON.parse(localStorage.getItem('randHero'));
}

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

            //fetchMarvelAPI();

            pickRandHero();

            modalMarvelEl.empty();

            modalMarvelEl.append(printHeroCard(JSON.parse(localStorage.getItem('randHero'))));

            openModal();
        })
        .catch(function (error) {
            console.error("Error fetching data:", error);
        });

    cityInput.val("");
};

function fetchMarvelAPI() {
    const ts = Date.now().toString();
    const toHash = ts + marvelPrivateKey + marvelPublicKey;
    const hash = md5(toHash);
    const baseUrl = "https://gateway.marvel.com/v1/public/characters";
    const url = `${baseUrl}?ts=${ts}&apikey=${marvelPublicKey}&hash=${hash}`;
    const hulkUrl = `${baseUrl}?name=hulk&ts=${ts}&apikey=${marvelPublicKey}&hash=${hash}`;
    const thorUrl = `${baseUrl}?name=thor&ts=${ts}&apikey=${marvelPublicKey}&hash=${hash}`;
    const spiderManUrl = `${baseUrl}?name=spider-man (peter parker)&ts=${ts}&apikey=${marvelPublicKey}&hash=${hash}`;
    const ironManUrl = `${baseUrl}?name=iron man&ts=${ts}&apikey=${marvelPublicKey}&hash=${hash}`;
    const cptAmericaUrl = `${baseUrl}?name=captain america&ts=${ts}&apikey=${marvelPublicKey}&hash=${hash}`;

    console.log(url);

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

    // -------------------------------------------------------------------------------------------- hulk
    fetch(hulkUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // need to grab the name, pic, and desc of the marvel hero
            /*
            data.data.results[0].name
            data.data.results[0].thumbnail.path
            data.data.results[0].thumbnail.extension
            data.data.results[0].description
            */
            const heroes = getStoredHeroes();

            const picURL = data.data.results[0].thumbnail.path;
            const picExt = data.data.results[0].thumbnail.extension;

            const hero = {
                nameHero: data.data.results[0].name,
                picHero: `${picURL}.${picExt}`,
                descHero: data.data.results[0].description
            }

            //heroArrayCleanup(hero.nameHero);

            //heroes.push(hero);

            //storeHeroes(heroes);

            //modalMarvelEl.append(printHeroCard(hero.nameHero, hero.picHero, hero.descHero));

        })
        .catch(function (error) {
            console.error("Error fetching Marvel API data:", error);
        });

    // -------------------------------------------------------------------------------------------- thor
    fetch(thorUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // need to grab the name, pic, and desc of the marvel hero
            /*
            data.data.results[0].name
            data.data.results[0].thumbnail.path
            data.data.results[0].thumbnail.extension
            data.data.results[0].description
            */

            const heroes = getStoredHeroes();

            const picURL = data.data.results[0].thumbnail.path;
            const picExt = data.data.results[0].thumbnail.extension;

            const hero = {
                nameHero: data.data.results[0].name,
                picHero: `${picURL}.${picExt}`,
                descHero: data.data.results[0].description
            }

            //heroArrayCleanup(hero.nameHero);

            //heroes.push(hero);

            //storeHeroes(heroes);

            //modalMarvelEl.append(printHeroCard(hero.nameHero, hero.picHero, hero.descHero));

        })
        .catch(function (error) {
            console.error("Error fetching Marvel API data:", error);
        });

    // -------------------------------------------------------------------------------------------- spider-man
    fetch(spiderManUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // need to grab the name, pic, and desc of the marvel hero
            /*
            data.data.results[0].name
            data.data.results[0].thumbnail.path
            data.data.results[0].thumbnail.extension
            data.data.results[0].description
            */
            const heroes = getStoredHeroes();

            const picURL = data.data.results[0].thumbnail.path;
            const picExt = data.data.results[0].thumbnail.extension;

            const hero = {
                nameHero: data.data.results[0].name,
                picHero: `${picURL}.${picExt}`,
                descHero: data.data.results[0].description
            }

            //heroArrayCleanup(hero.nameHero);

            //heroes.push(hero);

            //storeHeroes(heroes);

            //modalMarvelEl.append(printHeroCard(hero.nameHero, hero.picHero, hero.descHero));

        })
        .catch(function (error) {
            console.error("Error fetching Marvel API data:", error);
        });

    // -------------------------------------------------------------------------------------------- iron man
    fetch(ironManUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // need to grab the name, pic, and desc of the marvel hero
            /*
            data.data.results[0].name
            data.data.results[0].thumbnail.path
            data.data.results[0].thumbnail.extension
            data.data.results[0].description
            */
            const heroes = getStoredHeroes();

            const picURL = data.data.results[0].thumbnail.path;
            const picExt = data.data.results[0].thumbnail.extension;

            const hero = {
                nameHero: data.data.results[0].name,
                picHero: `${picURL}.${picExt}`,
                descHero: data.data.results[0].description
            }

            //heroArrayCleanup(hero.nameHero);

            //heroes.push(hero);

            //storeHeroes(heroes);

            //modalMarvelEl.append(printHeroCard(hero.nameHero, hero.picHero, hero.descHero));

        })
        .catch(function (error) {
            console.error("Error fetching Marvel API data:", error);
        });

    // -------------------------------------------------------------------------------------------- captain america
    fetch(cptAmericaUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // need to grab the name, pic, and desc of the marvel hero
            /*
            data.data.results[0].name
            data.data.results[0].thumbnail.path
            data.data.results[0].thumbnail.extension
            data.data.results[0].description
            */
            const heroes = getStoredHeroes();

            const picURL = data.data.results[0].thumbnail.path;
            const picExt = data.data.results[0].thumbnail.extension;

            const hero = {
                nameHero: data.data.results[0].name,
                picHero: `${picURL}.${picExt}`,
                descHero: data.data.results[0].description
            }

            //heroArrayCleanup(hero.nameHero);

            //heroes.push(hero);

            //storeHeroes(heroes);

            //modalMarvelEl.append(printHeroCard(hero.nameHero, hero.picHero, hero.descHero));

        })
        .catch(function (error) {
            console.error("Error fetching Marvel API data:", error);
        });
}

function openModal() {
    console.log("Opening modal");
    $('#result-modal').addClass('is-active');
}

function closeModal() {
    console.log("Closing modal");
    $('#result-modal').removeClass('is-active');
}

$(document).on('click', '.modal-background, .delete, #modal-close', closeModal);

submitBtn.on('click', formSubmitHandler);

cityInput.on('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        submitBtn.click();
    }
});

// function to pick a random hero from the heroes array
function pickRandHero() {
    const heroes = getStoredHeroes();
    localStorage.setItem('randHero', JSON.stringify(heroes[Math.floor(Math.random() * 6)]));
}

$(window).on('load', function () {
    const ts = Date.now().toString();
    const toHash = ts + marvelPrivateKey + marvelPublicKey;
    const hash = md5(toHash);
    const baseUrl = "https://gateway.marvel.com/v1/public/characters";
    const url = `${baseUrl}?ts=${ts}&apikey=${marvelPublicKey}&hash=${hash}`;
    const hulkUrl = `${baseUrl}?name=hulk&ts=${ts}&apikey=${marvelPublicKey}&hash=${hash}`;
    const thorUrl = `${baseUrl}?name=thor&ts=${ts}&apikey=${marvelPublicKey}&hash=${hash}`;
    const spiderManUrl = `${baseUrl}?name=spider-man (peter parker)&ts=${ts}&apikey=${marvelPublicKey}&hash=${hash}`;
    const ironManUrl = `${baseUrl}?name=iron man&ts=${ts}&apikey=${marvelPublicKey}&hash=${hash}`;
    const cptAmericaUrl = `${baseUrl}?name=captain america&ts=${ts}&apikey=${marvelPublicKey}&hash=${hash}`;



    if (localStorage.getItem('heroes') === null) {
        // ------------------------------------------------------------------------- hulk
        fetch(hulkUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                // need to grab the name, pic, and desc of the marvel hero
                /*
                data.data.results[0].name
                data.data.results[0].thumbnail.path
                data.data.results[0].thumbnail.extension
                data.data.results[0].description
                */
                const heroes = getStoredHeroes();

                const picURL = data.data.results[0].thumbnail.path;
                const picExt = data.data.results[0].thumbnail.extension;

                const hero = {
                    nameHero: data.data.results[0].name,
                    picHero: `${picURL}.${picExt}`,
                    descHero: data.data.results[0].description
                }

                //heroArrayCleanup(hero.nameHero);

                heroes.push(hero);

                storeHeroes(heroes);

                //modalMarvelEl.append(printHeroCard(hero.nameHero, hero.picHero, hero.descHero));

            })
            .catch(function (error) {
                console.error("Error fetching Marvel API data:", error);
            });

        // ------------------------------------------------------------------------ thor
        fetch(thorUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                // need to grab the name, pic, and desc of the marvel hero
                /*
                data.data.results[0].name
                data.data.results[0].thumbnail.path
                data.data.results[0].thumbnail.extension
                data.data.results[0].description
                */

                const heroes = getStoredHeroes();

                const picURL = data.data.results[0].thumbnail.path;
                const picExt = data.data.results[0].thumbnail.extension;

                const hero = {
                    nameHero: data.data.results[0].name,
                    picHero: `${picURL}.${picExt}`,
                    descHero: data.data.results[0].description
                }

                //heroArrayCleanup(hero.nameHero);

                heroes.push(hero);

                storeHeroes(heroes);

                //modalMarvelEl.append(printHeroCard(hero.nameHero, hero.picHero, hero.descHero));

            })
            .catch(function (error) {
                console.error("Error fetching Marvel API data:", error);
            });

        // ----------------------------------------------------------------------- spider-man
        fetch(spiderManUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                // need to grab the name, pic, and desc of the marvel hero
                /*
                data.data.results[0].name
                data.data.results[0].thumbnail.path
                data.data.results[0].thumbnail.extension
                data.data.results[0].description
                */
                const heroes = getStoredHeroes();

                const picURL = data.data.results[0].thumbnail.path;
                const picExt = data.data.results[0].thumbnail.extension;

                const hero = {
                    nameHero: data.data.results[0].name,
                    picHero: `${picURL}.${picExt}`,
                    descHero: data.data.results[0].description
                }

                //heroArrayCleanup(hero.nameHero);

                heroes.push(hero);

                storeHeroes(heroes);

                //modalMarvelEl.append(printHeroCard(hero.nameHero, hero.picHero, hero.descHero));

            })
            .catch(function (error) {
                console.error("Error fetching Marvel API data:", error);
            });

        // ----------------------------------------------------------------------- iron man
        fetch(ironManUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                // need to grab the name, pic, and desc of the marvel hero
                /*
                data.data.results[0].name
                data.data.results[0].thumbnail.path
                data.data.results[0].thumbnail.extension
                data.data.results[0].description
                */
                const heroes = getStoredHeroes();

                const picURL = data.data.results[0].thumbnail.path;
                const picExt = data.data.results[0].thumbnail.extension;

                const hero = {
                    nameHero: data.data.results[0].name,
                    picHero: `${picURL}.${picExt}`,
                    descHero: data.data.results[0].description
                }

                //heroArrayCleanup(hero.nameHero);

                heroes.push(hero);

                storeHeroes(heroes);

                //modalMarvelEl.append(printHeroCard(hero.nameHero, hero.picHero, hero.descHero));

            })
            .catch(function (error) {
                console.error("Error fetching Marvel API data:", error);
            });

        // ------------------------------------------------------------------------ captain america
        fetch(cptAmericaUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                // need to grab the name, pic, and desc of the marvel hero
                /*
                data.data.results[0].name
                data.data.results[0].thumbnail.path
                data.data.results[0].thumbnail.extension
                data.data.results[0].description
                */
                const heroes = getStoredHeroes();

                const picURL = data.data.results[0].thumbnail.path;
                const picExt = data.data.results[0].thumbnail.extension;

                const hero = {
                    nameHero: data.data.results[0].name,
                    picHero: `${picURL}.${picExt}`,
                    descHero: data.data.results[0].description
                }

                //heroArrayCleanup(hero.nameHero);

                heroes.push(hero);

                storeHeroes(heroes);

                //modalMarvelEl.append(printHeroCard(hero.nameHero, hero.picHero, hero.descHero));

            })
            .catch(function (error) {
                console.error("Error fetching Marvel API data:", error);
            });

    }

});