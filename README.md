## Marvel-Weather-App

## Description
We created a web application that uses the OpenWeather API and the Marvel API to pull real-time weather data and Marvel Superhero character data based on a location entered by the user.

When the user enters a city in the input field, a modal will populate the city's current temperature and weather condition and will assign a random Marvel superhero with a short description to show the user which superhero would be assigned to that city.

Based on current functionality, we are pulling from an array of characters that will be chosen at random when the user submits a city input. An array of superheros will be stored in local storage. When the user submits city input, the result (latitude, longitude, random superhero) will be stored to local storage, with the option for the user to save results to favorites which will be stored as an array of objects in local storage. 

## User Story
As a civilian without superpowers, I would like an app that shows me which Marvel superhero will be available to help in my location based on the current weather conditions. I would also like the ability to save a result to favorites. 

## Acceptance Criteria
-Use a CSS framework other than Bootstrap.

-Be deployed to GitHub Pages.

-Be interactive (i.e: accept and respond to user input).

-Use at least two server-side APIs.

-Include at least one modal, and does not use native browser alert, confirm, or prompt functionality.

-Use client-side storage to store persistent data.

-Be responsive.

-Have a polished UI.

-Have a clean repository that meets quality coding standards (file structure, naming conventions, follows best practices for class/id-naming conventions, indentation, quality comments, etc.).

-Have a quality README (with unique name, description, technologies used, screenshot, and link to deployed application).

## Usage
Link to live application: https://jknowles10.github.io/Marvel-Weather-App/

Desktop Screenshot:

![Screenshot to site](./assets/images/Screenshots/Desktop%20Screenshot.PNG)

Mobile Screenshot 1:

![Screenshot to mobile site](./assets/images/Screenshots/Mobile%20Screenshot%201.png)

Mobile Screenshot 2:

![Screenshot to mobile site](./assets/images/Screenshots/Mobile%20Screenshot%202.png)
## License
MIT License

## Contributors
- Julienne Knowles
- Ken Wagner
- Neil Hernandez


## Credits
- CSS Framework:https://bulma.io/ 
- Fonts: Google Fonts (Libre Franklin, Bangers) 
- Marvel API:
    - Developer Portal: https://developer.marvel.com/
    - Interactive API Tester: https://developer.marvel.com/docs
- MD5 string
    - Geeks for Geeks: https://www.geeksforgeeks.org/how-to-create-hash-from-string-in-javascript/
    - Stack Overflow: https://stackoverflow.com/questions/74290294/how-to-create-fast-and-small-hash-on-javascript-typescript-in-the-browser-and
    - Tech Target : https://www.techtarget.com/searchsecurity/definition/MD5
- OpenWeather Weather API: https://openweathermap.org/api


