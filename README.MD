#Angular Weather

Is an Angular module to get and display the actual weather in somewhere. The module uses the openweathermap.org API.
Visit http://openweathermap.org for a license key to use this directive.

##WIP - Disclosure

This generator is Work in Progess, defining his archicture and also his implementation. It's not ready to use in `live/production` enviroments but if you want can try, test and contribute.

##How do I add angular-weather to my project?

- Install the module `bower install angular-weather --save`

- Add the library to your project
```html
<script type="text/javascript" src="bower_components/angular-weather/src/angular-weather.js"></script>
```

- Declare the module in your application
```javascript
angular.module('myApp', ['angular-weather']);
```

- User the directive to display the current weather in somewhere
```html
<angular-weather city="Houston"></angular-weather>
```

##License

angular-weather is licensed under the MIT license. See the [LICENSE](LICENSE) file for more details.