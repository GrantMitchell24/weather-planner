var currentWeatherDiv = $("#currentWeatherDiv")
var fiveDayMainDiv = $("#fiveDayMainDiv")
var searchBtn = $("#searchBtn")
var searchField = $("#searchField")
var searchHistoryDiv = $("#searchHistoryDiv")
var dateToday = dayjs();
var startUpLoaded = false;
var searchedCities = [];



function loadSearchHistory() {
  searchHistoryDiv.empty();
  searchedCities = JSON.parse(localStorage.getItem("Weather-Dashboard-Cities"));
  if (searchedCities === null) {
    searchedCities = [];
  }
  for (var i = 0; i < searchedCities.length; i++) {
    $(searchHistoryDiv).append(
      $("<button></button>").attr("value", searchedCities[i]).addClass("btn btn-primary cityBtn").text(searchedCities[i])
    )
  }
  $(searchHistoryDiv).append(
    $("<button></button>").addClass("btn btn-primary clearHistoryBtn").text("Clear Search History")
  )

  if (startUpLoaded === false && searchedCities.length > 0) {
    startUpLoaded = true;
    getCityInfo(searchedCities[0])
  }
}
loadSearchHistory();

function search() {
  getCityInfo(searchField.val().trim());
}

function getCityInfo(city) {
  let requestCity = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=a578ab4f26c2e05e73c69c0d6adc6341`

  fetch(requestCity)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data)
      if (data.cod === 200) {
        currentWeatherDiv.empty();
        fiveDayMainDiv.empty();

        currentWeather(data.name, Math.round(data.main.temp), Math.round(data.main.feels_like), Math.round(data.wind.speed), data.main.humidity, data.weather[0].icon)

        generateFiveDayForecast(data.coord.lat, data.coord.lon);

        $(searchField).val("");

        if (searchedCities.indexOf(data.name) > -1) {
          var removedCity = searchedCities.splice(searchedCities.indexOf(data.name), 1);
          removedCity = [];
        }

        searchedCities.unshift(data.name)

        while (searchedCities.length > 5) {
          searchedCities.pop();
        }

        localStorageStorage.setItem("Weather-Dashboard-Cities", JSON.stringify(searchedCities));

        loadSearchHistory();

      } else {
        alert("Invalid City, Search Again")
      }
    })
}

function currentWeather(cityName, temp, feelsLike, wind, humidity, icon) {
  $(currentWeatherDiv).append(
    $("<h2></h2>").text(`${cityName} ${dateToday.format("(dddd, MMM, Do)")}`).append(
      $("<img></img>").attr("src", `https://openweathermap.org/img/wn/${icon}@2x.png`).addClass("todayIcon").attr("alt", "Icon showing weather")
    ),
    $("<p></p>").text(`Temp: ${temp}\x80F`),
    $("<p></p>").text(`feels Like: ${feelsLike}\x80F`),
    $("<p></p>").text(`Wind: ${wind}mph`),
    $("<p></p>").text(`Humidity: ${humidity}%`).addClass("last-p")
  )
}

function generateFiveDayForecast(lat, lon) {

  let requestFiveDayForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=a578ab4f26c2e05e73c69c0d6adc6341`

  fetch(requestFiveDayForecast)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

      let subDiv = $("<div></div>").attr("id", "fiveDaySubDiv").addClass("row")
      let sectionHead = $("<h2></h2>").text("5-day Forecast")

      for (i = 5; i < 40; i += 8) {
        let dayCard = $("<div></div>");
        $(dayCard).append(
          $("<p></p>").text(`${dateToday.add(i, "day").format("dddd, MMM Do")}`),
          $("<img></img>").attr("src", `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`).attr("alt", "Icon showing weather"),
          $("<p></p>").text(`Temp: ${Math.round(data.list[i].main.temp_max)}\x80F`),
          $("<p></p>").text(`Wind: ${Math.round(data.list[i].wind.speed)}mph`),
          $("<p></p>").text(`Humidity: ${data.list[i].main.humidity}%`)
        )
        $(dayCard).addClass("singleCard col-12 col-sm-2");
        $(subDiv).append(dayCard);
        $(fiveDayMainDiv).append(sectionHead, subDiv);
      }
    })
}


searchBtn.on("click", search)

$("#searchHistoryDiv").on("click", ".clearHistoryBtn", function(){
  searchHistoryDiv.empty()
  searchedCities = []
  localStorage.removeItem("Weather-Dashboard-Cities")
})

$("#searchHistoryDiv").on("click", ".cityBtn", function(){
  getCityInfo(this.value)
}
)

