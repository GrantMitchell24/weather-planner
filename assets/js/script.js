var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={a578ab4f26c2e05e73c69c0d6adc6341}'
var searchFormEl = document.querySelector('#search-form');
var cityName = document.querySelector("city-name");

function handleSearchFormSubmit(event) {
  event.preventDefault();

  var searchInputVal = document.querySelector('#search-input').value;
  var formatInputVal = document.querySelector('#format-input').value;

  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }

  var queryString = './search-results.html?q=' + searchInputVal + '&format=' + formatInputVal;

  location.assign(queryString);
}

searchFormEl.addEventListener('submit', handleSearchFormSubmit);

searchInputVal.addEventListener("click", function () {
  let cityName = searchInputVal.value.trim();
  console.log("city-name = ", cityName);

  let cityName = JSON.parse(localStorage.getItem("city-name")) || [];
  console.log("city-name = ", cityName);
  }
  cityName.push(cityName);
  localStorage.setItem("city-name", JSON.stringify(cityName));
});
