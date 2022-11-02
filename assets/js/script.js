var apiKey = '9f0fa21c098e025f392e2473240f4b33';
var searchForm = document.querySelector('#search-form');

var resultTextEl = document.querySelector('#result-text');
var resultContentEl = document.querySelector('#result-content');

function searchFormSubmit(event) {
    event.preventDefault();

    var cityInput = document.querySelector('#city').value;

    if (!cityInput) {
        console.error('You need a search input value!');
        return;
    }

    var queryURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + cityInput + "&appid=" + apiKey;

    fetch(queryURL)
        .then(response => {
            if (!response.ok) {
                console.log('Error:' + response.status)
            } else {
                return response.json()
            }
        })
        .then(data => console.log(data))

}


searchForm.addEventListener('submit', searchFormSubmit);