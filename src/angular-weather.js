'use strict';

var extend = angular.extend;

angular.module('angular-weather', [])
  .constant('openweatherEndpoint', 'http://api.openweathermap.org/data/2.5/weather')
  .constant('Config', {
    openweather: {
      apikey: ''
    }
  })
  .directive('angularWeather', function () {
    return {
      restrict: 'EA',
      template: '<div> {{ctrlWeather.data.temperature | number:0 }}&deg; <i class="wi {{ctrlWeather.data.iconClass}}"></i></div>',
      controller: function TemperatureController(weather, weatherIcons) {
        var vm = this;

        // Request the weather data.
        weather.get(vm.city).then(function(response) {
          vm.data = response;
          vm.data.iconClass = weatherIcons[response.icon];
        });
      },
      controllerAs: 'ctrlWeather',
      bindToController: true,
      // Isolate scope.
      scope: {
        city: '@'
      }
    };
  })
  .service('weather', function ($q, $http, $interval, openweatherEndpoint, weatherIcons, Config) {
    var weather = this;

    // interval id, keep it to handle the auto refresh
    var interval;
    // Promise in progress of Weather.
    var getWeather;
    // Service options
    var options = {
      refresh: true,
      delay: 3600000 // An hour.
    };

    // Public service API
    weather.get = get;

    /**
     * Return the promise with the category list, from cache or the server.
     *
     * @param city - string
     *   The city name. Ex: Houston
     * @param _options - object
     *   The options to handle.
     *    refresh: activate to get new weather information in interval
     *    of delay time.
     *    delay: interval of time in miliseconds.
     *
     * @returns {Promise}
     */
    function get(city, _options) {
      extend(options, _options, {city: city});

      getWeather = $q.when(getWeather || angular.copy(getCache()) || getWeatherFromServer(city));

      // Clear the promise cached, after resolve or reject the promise. Permit access to the cache data, when
      // the promise excecution is done (finally).
      getWeather.finally(function getWeatherFinally() {
        getWeather = undefined;
      });

      return getWeather;
    }

    /**
     * Return Weather array from the server.
     *
     * @returns {$q.promise}
     */
    function getWeatherFromServer(city) {
      var deferred = $q.defer();
      var url = openweatherEndpoint;
      var params = {
        q: city,
        units: 'metric',
        APPID: Config.openweather.apikey || ''
      };
      $http({
        method: 'GET',
        url: url,
        params: params,
        withoutToken: true,
        cache: true
      }).success(function(data) {
        // Prepare the Weather object.
        var weatherData = prepareWeather(data);
        setCache(weatherData);

        // Start refresh automatic the weather, according the interval of time.
        options.refresh && startRefreshWeather();

        deferred.resolve(weatherData);
      });

      return deferred.promise;
    }

    /**
     * Save Weather in cache, and emit en event to inform that the Weather data changed.
     *
     * @param data
     *    Collection resulted from the request.
     */
    function setCache(data) {
      // Save cache Weather data directly to localStorage.
      localforage.setItem('aw.cache', data);
      localforage.setItem('aw.updatedAt', new Date());
    }

    /**
     * Return a promise with the weather data cached.
     */
    function getCache() {
      return localforage('aw.cache');
    }

    /**
     * Start an interval to refresh the weather cache data with new server data.
     */
    function startRefreshWeather() {
      interval = $interval(getWeatherFromServer(options.city), options.delay);
      localforage.setItem('aw.refreshing', true);
    }

    /**
     * Stop interval to refresh the weather cache data.
     */
    function stopRefreshWeather() {
      $interval(interval);
      interval = undefined;
      localforage.setItem('aw.refreshing', false);
    }

    /**
     * Prepare Weather object with order by list, tree and collection indexed by id.
     *
     * Return the Weather object into a promises.
     *
     * @param weatherData - {$q.promise)
     *  Promise of list of Weather, comming from cache or the server.
     *
     */
    function prepareWeather(weatherData) {
      return {
        temperature: weatherData.main.temp,
        icon: (angular.isDefined(weatherIcons[weatherData.weather[0].icon])) ? weatherData.weather[0].icon : weatherData.weather[0].id,
        description: weatherData.weather[0].description
      }
    }

  })
  .factory('weatherIcons', function() {
    // * All the codes by are based in the openweather API
    //  http://openweathermap.org/wiki/API/Weather_Condition_Codes
    // * Icon based:
    //  in http://erikflowers.github.io/weather-icons/cheatsheet/index.html
    return {
      '200': 'wi-storm-showers ',
      '201': 'wi-storm-showers ',
      '202': 'wi-storm-showers ',
      '210': 'wi-thunderstorm ',
      '211': 'wi-thunderstorm ',
      '212': 'wi-thunderstorm ',
      '221': 'wi-lightning',
      '230': 'wi-storm-showers',
      '231': 'wi-storm-showers',
      '232': 'wi-storm-showers',
      '300': 'wi-sprinkle',
      '301': 'wi-sprinkle',
      '302': 'wi-rain-mix',
      '310': 'wi-rain-mix',
      '311': 'wi-rain',
      '312': 'wi-rain',
      '321': 'wi-rain-wind',
      '500': 'wi-sprinkle',
      '501': 'wi-showers',
      '502': 'wi-rain-mix',
      '503': 'wi-rain',
      '504': 'wi-rain-wind',
      '511': 'wi-snow',
      '520': 'wi-rain-mix',
      '521': 'wi-rain',
      '522': 'wi-rain-wind',
      '600': 'wi-snow',
      '601': 'wi-snow',
      '602': 'wi-snow',
      '611': 'wi-hail',
      '621': 'wi-snow',
      '701': 'wi-fog',
      '711': 'wi-fog',
      '721': 'wi-fog',
      '731': 'wi-fog',
      '741': 'wi-fog',
      '01d': 'wi-day-sunny',
      '01n': 'wi-night-clear',
      '02d': 'wi-day-cloudy',
      '02n': 'wi-night-cloudy',
      '03d': 'wi-cloudy',
      '04d': 'wi-cloudy',
      '900': 'wi-tornado',
      '901': 'wi-thunderstorm',
      '902': 'wi-lightning',
      '903': 'wi-thermometer-exterior',
      '904': 'wi-thermometer',
      '905': 'wi-strong-wind',
      '906': 'wi-hail'
    };
  });
