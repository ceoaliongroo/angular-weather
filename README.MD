#Angular Weather

Component to add weather information to your project

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
	<angular-weather city="Houston"></angular-weather>
```

##License

angular-weather is licensed under the MIT license. See the [LICENSE](LICENSE) file for more details.