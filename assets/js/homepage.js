var cityInputEl = document.querySelector('#city-input');
var nameInputEl = document.querySelector('#city-name');
var weatherPresentEl = document.querySelector('#weather-container-present');
var weatherFutureEl = document.querySelector('#weather-container-future');

var citySearchTerm = document.querySelector('#city-search-term');
var searchHistory = document.querySelector('#search-history');
var lat;
var lon;
var count = 1;

function getSearch() {
  searchHistory.textContent = "";
  var cityList = [];
  cityList = localStorage.getItem("cityList") || "";
  if (cityList) {
    cityList = JSON.parse(cityList);
    for (var i = 0; i < cityList.length; i++) {
      var button = document.createElement("button");
      button.classList = "btn text-uppercase select";
      const buttonId = 'button-' + count;
      button.setAttribute('id', buttonId);
      count++;
      button.textContent = cityList[i];
      searchHistory.appendChild(button);
      button.addEventListener('click', function() {
        var clickEl = document.getElementById(buttonId);
        var clickedName = clickEl.textContent;
        getWeather(clickedName);
        addToList(clickedName);
        getSearch();
    });
     
    };
  };
}

function init() {
  getSearch();

}

function checkList(string, array) {
  var index = array.indexOf(string);
  if (index !== -1) {
    array.splice(index, 1);
  }
  array.unshift(string);
  return array;
}

var addToList = function (cityName) {
  var storedData = localStorage.getItem("cityList") || "";
  var cityList = [];
  if (storedData) {
    cityList = cityList.concat(JSON.parse(storedData));
    console.log(cityList);
    console.log(cityList.length);

    for (var i = 0; i < cityList.length; i++) {
      if (cityName === cityList[i]) {
        cityList = checkList(cityName, cityList);
        localStorage.setItem("cityList", JSON.stringify(cityList));
        searchButtonsEl = document.querySelectorAll('.select');
        getSearch();
        return;
      }
    }
    cityList.push(cityName);
    console.log(cityList)
    localStorage.setItem("cityList", JSON.stringify(cityList));
  } else {
    cityList.push(cityName);
    console.log(cityList)
    localStorage.setItem("cityList", JSON.stringify(cityList));
    var button = document.createElement("button");
      button.classList = "btn text-uppercase select";
      const buttonId = 'button-' + count;
      button.setAttribute('id', buttonId);
      count++;
      button.textContent = cityList[i];
      searchHistory.appendChild(button);

      button.addEventListener('click', function() {
        var clickEl = document.getElementById(buttonId);
        var clickedName = clickEl.val();

        getWeather(clickedName);
        addToList(clickedName);
        getSearch();
    });
  }
  getSearch();
}

var formSubmitHandler = function (event) {
  event.preventDefault();
  weatherPresentEl.textContent = '';
  weatherFutureEl.textContent = '';
  var cityName = nameInputEl.value.trim();

  if (cityName) {
    getWeather(cityName);

    // weatherContainerEl.textContent = '';
    nameInputEl.value = '';

    addToList(cityName);

  } else {
    alert('Please enter a city name');
  }
};

var buttonClickHandler = function (event) {
  // `event.target` is a reference to the DOM element of what programming language button was clicked on the page
  var searchName = event.target.val();

  // If there is no language read from the button, don't attempt to fetch repos
  if (searchName) {
    getWeather(searchName);

    // repoContainerEl.textContent = '';
  }
};

var getWeather = function (city) {
  weatherPresentEl.textContent = '';
  weatherFutureEl.textContent = '';
  var apiUrl = 'https://geocode.maps.co/search?q={' + city + '}';

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          getCordinates(data, city);
          getForecast(lat, lon);

        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to OpenWeather');
    });
};

var getCordinates = function (cordinate, cityName) {
  if (cordinate.length === 0) {
    weatherPresentEl.textContent = 'No weather info found.';
    // Without a `return` statement, the rest of this function will continue to run and perhaps throw an error if `city name` is empty
    return;
  }

  citySearchTerm.textContent = cityName;

  lat = cordinate[0].lat;
  lon = cordinate[0].lon;
  console.log(lat);
  console.log(lon);
}

var getForecast = function (latitude, longitude) {
  var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&appid=bb1d771d7b823d782c4bd1624f7d63a5&units=metric';
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          for (var i = 0; i < 40; i += 7) {
            var container = document.createElement("div");
            var date = document.createElement("h3");
            var temp = document.createElement("p");
            var wind = document.createElement("p");
            var humidity = document.createElement("p");
            var icon = document.createElement("img");
            var dateCode = data.list[i].dt;
            if (i == 0) {
              container.classList.add("container", "col-12", "col-md-12", 'width');
              weatherPresentEl.appendChild(container);
            } else {
              container.classList.add("container", "col-md-5");
              weatherFutureEl.appendChild(container);
              console.log(i);
            }
            dateCode = dateCode * 1000;
            var dateFormat = dayjs(dateCode).format('MMM D, YYYY');
            var iconCode = data.list[i].weather[0].icon;
            iconCode = iconCode.replace('n', 'd');
            icon.src = "https://openweathermap.org/img/w/" + iconCode + ".png";
            date.textContent = "Date : " + dateFormat;
            temp.textContent = "Temp : " + data.list[i].main.temp + "°C";
            wind.textContent = "Wind : " + data.list[i].wind.speed + " KM/H";
            humidity.textContent = "Humidity : " + data.list[i].main.humidity + "%";
            
            container.appendChild(date);
            container.appendChild(icon);
            container.appendChild(temp);
            container.appendChild(wind);
            container.appendChild(humidity);
          }
          document.getElementById('five-day').style.visibility = 'visible';
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to Open Weather');
    });
};
init();
cityInputEl.addEventListener('submit', formSubmitHandler);