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

    historyArr.push(cityInput);
    showHistory();


    localStorage.setItem("history", JSON.stringify(historyArr));

    var queryToday = 'http://api.openweathermap.org/data/2.5/weather?q=' + cityInput + "&units=imperial" + "&appid=" + apiKey;
    fetch(queryToday)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const resultHTML = `
            <h3>
                ${data.name} (${new Date().toLocaleDateString()}) 
                <img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png">
            </h3>
            <p><strong>Temp: </strong> ${data.main.temp}</p>
            <p><strong>Wind: </strong> ${data.wind.speed}</p>
            <p><strong>Humidity: </strong> ${data.main.humidity}</p>
            `
            resultTodayEl.innerHTML = resultHTML;
        })



    var queryForecast = 'http://api.openweathermap.org/data/2.5/forecast?q=' + cityInput + "&units=imperial" + "&appid=" + apiKey;

    fetch(queryForecast)
        .then(response => response.json())
        .then(data => {
            for (var i = 0; i < data.list.length; i += 8) {
                console.log(data.list[i]);
                const listItem = data.list[i]
                const resultDiv = document.createElement("div");
                const resultHTML = `
            <h3 class="h3html">
                ${new Date(listItem.dt_txt).toLocaleDateString()} 
                <img src="http://openweathermap.org/img/w/${listItem.weather[0].icon}.png">
            </h3>
            <p><strong>Temp: </strong> ${listItem.main.temp}</p>
            <p><strong>Wind: </strong> ${listItem.wind.speed}</p>
            <p><strong>Humidity: </strong> ${listItem.main.humidity}</p>
            `
                resultDiv.classList.add("class")
                resultDiv.innerHTML = resultHTML;
                resultForecastEl.appendChild(resultDiv);
            }
        });
    console.log(historyArr);

}


function showHistory() {
    for (var i = 0; i < historyArr.length; i++) {
        const historyBtn = document.createElement("button")
        historyBtn.textContent = historyArr[i];
        historyBtn.addEventListener("click", function () {
            document.querySelector("#city").value = historyBtn.textContent;
            searchFormSubmit(event);
        })

        searchHistoryCont.appendChild(historyBtn);
    }
}

searchForm.addEventListener('submit', searchFormSubmit);