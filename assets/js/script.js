var apiKey = '9f0fa21c098e025f392e2473240f4b33';
var searchForm = document.querySelector('#search-form');
var clearHistory = document.querySelector("#clear-history")

var resultTodayEl = document.querySelector('#today-content');
var resultForecastEl = document.querySelector('#forecast-content');
var searchHistoryCont = document.querySelector("#search-history")
var historyArr = localStorage.getItem("history")
if (historyArr) {
    historyArr = JSON.parse(historyArr);
    showHistory();
} else {
    historyArr = [];
}
clearHistory.addEventListener("click", function () {
    historyArr = [];
    localStorage.removeItem("history");
    window.location.reload();
})

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

    let cityName = historyArr.filter((element) => element === cityInput)
    if (cityName.length === 0) {
        historyArr.push(cityInput);
    }

    console.log(historyArr);
    showHistory();


    localStorage.setItem("history", JSON.stringify(historyArr));

    var queryToday = 'http://api.openweathermap.org/data/2.5/weather?q=' + cityInput + "&units=imperial" + "&appid=" + apiKey;
    fetch(queryToday)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const resultHTML = `
            <h2>
                ${data.name} (${new Date().toLocaleDateString()}) 
                <img class="img-icon" src="http://openweathermap.org/img/w/${data.weather[0].icon}.png">
            </h2>
            <p class="sub-title">Temp: ${data.main.temp} &#8457</p>
            <p class="sub-title">Wind: ${data.wind.speed} MPH</p>
            <p class="sub-title">Humidity: ${data.main.humidity} &#37;</p>
            `
            resultTodayEl.innerHTML = resultHTML;
            resultTodayEl.style.marginTop = "15px"
        })


    var queryForecast = 'http://api.openweathermap.org/data/2.5/forecast?q=' + cityInput + "&units=imperial" + "&appid=" + apiKey;

    fetch(queryForecast)
        .then(response => response.json())
        .then(data => {
            for (var i = 0; i < data.list.length; i += 8) {
                // i += 8 => i = i + 8
                console.log(data.list[i]);
                const listItem = data.list[i]
                const resultDiv = document.createElement("div");
                const resultHTML = `
            <h2>
                ${new Date(listItem.dt_txt).toLocaleDateString()} 
                <img class="img-icon" src="http://openweathermap.org/img/w/${listItem.weather[0].icon}.png">
            </h2>
            <p class="sub-title">Temp: ${listItem.main.temp} &#8457</p>
            <p class="sub-title">Wind: ${listItem.wind.speed} MPH</p>
            <p class="sub-title">Humidity: ${listItem.main.humidity} &#37;</p>
            `

                resultDiv.innerHTML = resultHTML;
                resultForecastEl.style.display = "flex";
                resultForecastEl.style.flexWrap = "wrap";
                resultForecastEl.appendChild(resultDiv);
                resultDiv.style.justifyContent = "space-between";
                resultDiv.style.flexBasis = "calc(20% - 5px)";
            }
        });
    console.log(historyArr);

}

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

searchForm.addEventListener('submit', searchFormSubmit);