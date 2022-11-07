// declared variables
var apiKey = '9f0fa21c098e025f392e2473240f4b33';
var searchForm = document.querySelector('#search-form');
var clearHistory = document.querySelector("#clear-history")

var resultTodayEl = document.querySelector('#today-content');
var resultForecastEl = document.querySelector('#forecast-content');
var searchHistoryCont = document.querySelector("#search-history")

// local storage for historyArr
var historyArr = localStorage.getItem("history")

if (historyArr) {
    historyArr = JSON.parse(historyArr);
    showHistory();
} else {
    historyArr = [];
}
// clear history code
clearHistory.addEventListener("click", function () {
    historyArr = [];
    localStorage.removeItem("history");
    window.location.reload();
})

// search by city form
function searchFormSubmit(event) {
    event.preventDefault();
    resultForecastEl.innerHTML = "";
    resultTodayEl.innerHTML = "";
    searchHistoryCont.innerHTML = "";

    var cityInput = document.querySelector('#city').value;

    if (!cityInput) {
        console.error('Enter Valid City Name!');
        return;
    }

    // filter duplicate cities from historyArr
    let cityName = historyArr.filter((element) => element === cityInput)
    if (cityName.length === 0) {
        historyArr.push(cityInput);
    }

    console.log(historyArr);
    showHistory();

    // saving history to local storage
    localStorage.setItem("history", JSON.stringify(historyArr));

    // fetch API for current weather - using parameter 'weather' according to the API doc and converting to imperial UOM
    var queryToday = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityInput + "&units=imperial" + "&appid=" + apiKey;
    fetch(queryToday)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // use template literals to build current weather content
            const resultHTML = `
            <h3>
                ${data.name} (${new Date().toLocaleDateString()}) 
                <img class="img-icon" src="http://openweathermap.org/img/w/${data.weather[0].icon}.png">
            </h3>
            <p class="today-p">Temp: ${data.main.temp} &#8457</p>
            <p class="today-p">Wind: ${data.wind.speed} MPH</p>
            <p class="today-p">Humidity: ${data.main.humidity} &#37;</p>
            `
            // apply style to data content
            resultTodayEl.innerHTML = resultHTML;
            resultTodayEl.style.marginTop = "15px"
            resultTodayEl.style.border = "solid 0.5px #eaeaea"
            resultTodayEl.style.padding = "15px"
        })

    // fetch API for daily forecast - using 'parameter' forecast according to the API doc and converting to imperial UOM
    var queryForecast = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityInput + "&units=imperial" + "&appid=" + apiKey;

    fetch(queryForecast)
        .then(response => response.json())
        .then(data => {
            for (var i = 0; i < data.list.length; i += 8) {
                console.log(data.list[i]);
                const listItem = data.list[i]
                const resultDiv = document.createElement("div");
                // use template literals to build daily forecast content
                const resultHTML = `
            <h3>
                ${new Date(listItem.dt_txt).toLocaleDateString()} 
                <img class="img-icon" src="http://openweathermap.org/img/w/${listItem.weather[0].icon}.png">
            </h3>
            <p class="forecast-p">Temp: ${listItem.main.temp} &#8457</p>
            <p class="forecast-p">Wind: ${listItem.wind.speed} MPH</p>
            <p class="forecast-p">Humidity: ${listItem.main.humidity} &#37;</p>
            `
                // apply style to daily forecast content
                resultDiv.innerHTML = resultHTML;
                resultForecastEl.style.display = "flex";
                resultForecastEl.style.flexWrap = "wrap";
                resultForecastEl.appendChild(resultDiv);
                resultDiv.style.justifyContent = "space-between";
                resultDiv.style.flex = "1 1 150px";
                resultDiv.style.marginBottom = "20px";
                resultDiv.style.backgroundColor = "#202A44";
                resultDiv.style.padding = "15px"
            }
        });
    console.log(historyArr);

}
// create buttons for searched cities
function showHistory() {
    for (var i = 0; i < historyArr.length; i++) {
        const historyBtn = document.createElement("button")
        historyBtn.textContent = historyArr[i];
        historyBtn.addEventListener("click", function (e) {
            document.querySelector("#city").value = historyBtn.textContent;
            searchFormSubmit(e);
        })

        searchHistoryCont.appendChild(historyBtn);
    }
}

// run search function
searchForm.addEventListener('submit', searchFormSubmit);