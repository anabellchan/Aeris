weatherApp.factory("weatherService", function ($http) {
    'use strict';
    var cities = [{ name: "Vancouver", code: 'CAXX0518' },
              { name: "Honolulu", code: 'USHI0026' },
              { name: "San Diego", code: 'USCA0982' },
              { name: "Havana Cuba", code: 'CUXX0003' }];
    var weatherFC = [];  // weather for all cities
    var childView = "";
    var unitOfTemp = "fahrenheight";
    var cityBeingViewed = "";

    var toDegreeCelsius = function (f) {
        return (f - 32) * 5 / 9;
    };

    var toDegreeFahrenheight = function (c) {
        return (c * 9 / 5) + 32;
    };

    // sets all temperature to degree celsius
    var getCelsius = function () {
        // do not calculate if already in celsius
        unitOfTemp = "celsius";
        var len = weatherFC.length; // weatherFC <-- contains weather report for all cities
        for (var i = 0; i < len; i++) {
            // update weather forecast for all cities
            weatherFC[i].high = Math.round(toDegreeCelsius(weatherFC[i].high));
            weatherFC[i].low = Math.round(toDegreeCelsius(weatherFC[i].low));

            // update 5-day weather forecast for each city
            var fiveDayFC = {};
            var numOfDays = cities[i].fiveDayFC.length;
            for (var j = 0; j < numOfDays; j++) {
                fiveDayFC = cities[i].fiveDayFC[j];
                fiveDayFC.high = Math.round(toDegreeCelsius(fiveDayFC.high));
                fiveDayFC.low = Math.round(toDegreeCelsius(fiveDayFC.low));
            }
        }
    };

    var getData = function ($scope, url, city) {

        // fetch data from yahoo
        $http.get(url).success(function (data) {
            try {

                // JSON to Object
                var stringified = JSON.stringify(data);          // Convert to a string.
                stringified = stringified.split("\\n").join(""); // Remove new line '/n'.
                var listing = JSON.parse(stringified);           // Convert to object.

                // current weather
                var FC = listing.query.results.item.forecast[0];
                FC.name = city.name;
                FC.href = "#/city-weather/city/" + city.code + "/name/" + city.name;
                weatherFC.push(FC);


                // copy 5-day forecast
                for (var i = 0; i < cities.length; i++) {
                    if (cities[i].name == city.name) {

                        cities[i].fiveDayFC = listing.query.results.item.forecast;
                        cities[i].href = "#/city-weather/city/" + cities[i].code + "/name/" + city.name;

                        var fiveDayFC = {};
                        var numOfDays = cities[i].fiveDayFC.length;
                        for (var j = 0; j < numOfDays; j++) {
                            fiveDayFC = cities[i].fiveDayFC[j];
                            fiveDayFC.weatherIcon = "http://l.yimg.com/a/i/us/we/52/" + cities[i].fiveDayFC[j].code + ".gif";
                        }
                        break;
                    }
                }
            }
            catch (error) {
                alert("Weather reading error:" + error.name + ": "
                + error.message);
            }

        }); // $http.get(url)
    };

    return {
        
        doSomething: function ($scope) { },

        getCities: function ($scope) {
            return cities;
        },
        getFiveDayFC: function ($scope, cityID, cityName) {
            childView = "fiveDayFC";
            cityBeingViewed = cityName;
            for (var i = 0; i < cities.length; i++) {
                if (cities[i].name == cityName) {
                    // sets the $scope with 5 day forecast for Sthis city
                    $scope.name = cityName;
                    $scope.fiveDayFC = cities[i].fiveDayFC;
                }
            }

        },

        getWeatherFC: function ($scope) {
            // url to get data from yahoo
            childView = "weatherFC";
            weatherFC = [];  // init all city weather forecast
            var yahooAPI = "'http://weather.yahooapis.com/forecastrss?p=";
            var format = "'&format=json&diagnostics=true&callback=";
            var yql = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%3D";

            // Call and wait for each data set to return before going to next city.
            angular.forEach(cities, function (city) {
                var url = yql + yahooAPI + city.code + format;
                getData($scope, url, city);
            });
            
            // set unit of temperature
            if ($scope.unitOfTemp == "celsius") {
                getCelsius();
            }

            $scope.weatherFC = weatherFC;
        },


        //getCityWeather: function ($scope, cityID, cityName) {
        //    $scope.name = cityName;
        //    var forecast = [];       //init forecast
        //    var yahooAPI = "'http://weather.yahooapis.com/forecastrss?p=";
        //    var format = "'&format=json&diagnostics=true&callback=";
        //    var yql = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%3D";
        //    var url = yql + yahooAPI + cityID + format;

        //    $http.get(url).success(function (data) {
        //        try {
        //            var stringified = JSON.stringify(data);          // Convert to a string.
        //            stringified = stringified.split("\\n").join(""); // Remove new line '/n'.
        //            var listing = JSON.parse(stringified);           // Convert to object.

        //            $scope.forecast = listing.query.results.item.forecast;  // 5 day forecast for this city
                    

        //            for (var i = 0; i < $scope.forecast.length ; i++) {
        //                $scope.forecast[i].weatherIcon = "http://l.yimg.com/a/i/us/we/52/" + $scope.forecast[i].code + ".gif";
        //            }

        //        }
        //        catch (error) {
        //            alert("Weather reading error:" + error.name + ": "
        //            + error.message);
        //        }
        //    });
        //},


        //getWeather: function ($scope) {

        //    var forecast = [];       //init forecast
        //    var yahooAPI = "'http://weather.yahooapis.com/forecastrss?p=";
        //    var format = "'&format=json&diagnostics=true&callback=";
        //    var yql = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%3D";

        //    // Call and wait for each data set to return before going to next city.
        //    angular.forEach($scope.cities, function (city) {
        //        var url = yql + yahooAPI + city.code + format;

        //        $http.get(url).success(function (data) {
        //            try {
        //                var stringified = JSON.stringify(data);          // Convert to a string.
        //                stringified = stringified.split("\\n").join(""); // Remove new line '/n'.
        //                var listing = JSON.parse(stringified);           // Convert to object.

        //                var currentWeather = listing.query.results.item.forecast[0];  // current weather forecast
        //                currentWeather.cityCode = city.code;
        //                currentWeather.cityName = city.name;
        //                currentWeather.weatherIcon = "http://l.yimg.com/a/i/us/we/52/" + currentWeather.code + ".gif";
        //                currentWeather.href = "#/city-weather/city/" + city.code + "/name/" + city.name;
        //                forecast.push(currentWeather);      

        //            }
        //            catch (error) {
        //                alert("Weather reading error:" + error.name + ": "
        //                + error.message);
        //            }
        //        });
        //    });
        //    $scope.forecast = forecast;
        //},
    }
});
