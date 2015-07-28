/*global angular */

var weatherControllers = (function () {
    var weatherControllers = angular.module('weatherControllers', []);
    
    // Declare the application controller and inject the scope reference.
    weatherControllers.controller('AppCtrl', ['$scope', 'weatherService',
                                  function ($scope, weatherService) {
        // Define the title model.
        $scope.title = "Aeris";
        $scope.date = new Date().getTime();
        $scope.cities = weatherService.getCities($scope);
        $scope.unitOfTemp = "fahrenheight";
                                      
        $scope.toCelsius = function () {
            alert("c");
            if ($scope.unitOfTemp != "celsius") {
                $scope.unitOfTemp = "celsius";
                weatherService.getWeatherFC($scope);
            }
        }
        $scope.toFahrenheight = function () {
            alert("f");
            if ($scope.unitOfTemp != "fahrenheight") {
                weatherService.getWeatherFC($scope);
            }
        }


    }]);

    // Inject the scope and new weatherService reference into the controller.
    weatherControllers.controller('ListCtrl', ['$scope', 'weatherService',
    function ($scope, weatherService) {
        weatherService.doSomething($scope);
    }]);

    // Inject the scope and new weatherService reference into the controller.
    weatherControllers.controller('WeatherCtrl', ['$scope', 'weatherService',
    function ($scope, weatherService) {
        weatherService.getWeatherFC($scope);                                
    }]);

    weatherControllers.controller('CityWeatherCtrl', ['$scope', '$routeParams', 'weatherService',
    function ($scope, $routeParams, weatherService) {
        weatherService.getFiveDayFC($scope, $routeParams.cityID, $routeParams.cityName);
    }]);
    return weatherControllers;
}());
