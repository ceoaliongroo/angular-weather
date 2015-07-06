#Angular Weather

Is an Angular module to get and display the actual weather in somewhere. The module uses the openweathermap.org API.
Visit http://openweathermap.org for a license key to use this directive.

##How do I add angular-weather to my project?

- Install the module `bower install angular-weather --save`

- Add the library to your project
```html
<script type="text/javascript" src="bower_components/angular-weather/angular-weather.js"></script>
```

- Declare the module in your application
```javascript
angular.module('myApp', ['angular-weather']);
```

- User the directive to display the current weather in somewhere
```html
<ng-weather-temperature city="Houston"></ng-weather-temperature>
```

##License

angular-weather is licensed under the MIT license. See the [LICENSE](LICENSE) file for more details.