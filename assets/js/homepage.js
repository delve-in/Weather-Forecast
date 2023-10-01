var userFormEl = document.querySelector('#user-form');
var languageButtonsEl = document.querySelector('#language-buttons');
var nameInputEl = document.querySelector('#username');
var repoContainerEl = document.querySelector('#repos-container');
var repoSearchTerm = document.querySelector('#repo-search-term');
var searchHistory = document.querySelector('#search-history');
var lat;
var lon;
var cityList =[];
function init() {
  cityList = localStorage.getItem("cityList")||"";
  if (cityList){
    cityList = JSON.parse(cityList);
    for(var i = 0; i<cityList.length;i++) {
        var button = document.createElement("button")
        button.classList = "btn text-uppercase";
        button.textContent = cityList[i];
        searchHistory.appendChild(button);
      };
  };
}

var addToList = function (cityName){
  var storedData = localStorage.getItem("cityList")||"";
        if (storedData)
        {
          for(var i = 0; i<cityList.length;i++){
            if(cityName === cityList[i]){
              return;
            }
          }
          cityList = cityList.concat(JSON.parse(storedData));
          cityList.push(cityName);
          console.log(cityList)
          localStorage.setItem("cityList",JSON.stringify(cityList));
        }else{
          cityList.push(cityName);
          localStorage.setItem("cityList",JSON.stringify(cityList));
          var button = document.createElement("button")
          button.classList = "btn text-uppercase";
          button.textContent = cityList;
          searchHistory.appendChild(button);
          
        }
}

var formSubmitHandler = function (event) {
  event.preventDefault();

  var cityName = nameInputEl.value.trim();

  if (cityName) {
    getWeather(cityName);

    repoContainerEl.textContent = '';
    nameInputEl.value = '';
    
    addToList(cityName);

  } else {
    alert('Please enter a City name');
  }
};

// var buttonClickHandler = function (event) {
//   // `event.target` is a reference to the DOM element of what programming language button was clicked on the page
//   var language = event.target.getAttribute('data-language');

//   // If there is no language read from the button, don't attempt to fetch repos
//   if (language) {
//     getFeaturedRepos(language);

//     repoContainerEl.textContent = '';
//   }
// };

var getWeather = function (city) {
  var apiUrl = 'https://geocode.maps.co/search?q={' + city + '}';

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          getCordinates(data, city);
          // getForecast(lat, lon);
          
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to GitHub');
    });
};

var getCordinates = function (cordinate, cityName){
  if (cordinate.length === 0) {
    repoContainerEl.textContent = 'No repositories found.';
    // Without a `return` statement, the rest of this function will continue to run and perhaps throw an error if `city name` is empty
    return;
  }
  
  repoSearchTerm.textContent = cityName;

  lat = cordinate[0].lat;
  lon = cordinate[0].lon;
  console.log(lat);   
  console.log(lon);
}

var getForecast = function (latitude, longitude){
  var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?lat={' +latitude+'}&lon={'+longitude+'}&appid={c23d5384851a46b2915c6c39db239ce8}';
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to GitHub');
    });
};
// var getFeaturedRepos = function (language) {
//   // The `q` parameter is what language we want to query, the `+is:featured` flag adds a filter to return only featured repositories
//   // The `sort` parameter will instruct GitHub to respond with all of the repositories in order by the number of issues needing help
//   var apiUrl = 'https://api.github.com/search/repositories?q=' + language + '+is:featured&sort=help-wanted-issues';

//   fetch(apiUrl).then(function (response) {
//     if (response.ok) {
//       response.json().then(function (data) {
//         displayRepos(data.items, language);
//       });
//     } else {
//       alert('Error: ' + response.statusText);
//     }
//   });
// };


init();
userFormEl.addEventListener('submit', formSubmitHandler);
// languageButtonsEl.addEventListener('click', buttonClickHandler);

var displayRepos = function (repos, searchTerm) {

    var repoEl = document.createElement('div');
    repoEl.classList = 'list-item flex-row justify-space-between align-center';

    var titleEl = document.createElement('span');
    titleEl.textContent = repoName;

    repoEl.appendChild(titleEl);

    var statusEl = document.createElement('span');
    statusEl.classList = 'flex-row align-center';

    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + ' issue(s)';
    } else {
      statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    repoEl.appendChild(statusEl);

    repoContainerEl.appendChild(repoEl);
  };
