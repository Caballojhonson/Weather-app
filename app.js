const key = '8552967c1e78f7a3f945ef7cbd1121e0';
let weather = undefined;

async function getWeather(cityName) {
	fetch(
		`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${key}&units=Metric`,
		{ mode: 'cors' }
	)
		.then((result) => result.json())
		.then((parsed) => processWeather(parsed))
		.then((result) => weather = result);
}

function processWeather(object) {
	return {
		city: object.name,
		countryCode: object.sys.country,
		weather: object.weather[0].description,
        cloudiness: object.clouds.all,
        temp: object.main.temp,
        feelsLike: object.main.feels_like,
        minTemp: object.main.temp_min,
        maxTemp: object.main.temp_max,
        pressure: object.main.pressure,
        sunrise: formatTimestamp(object.sys.sunrise),
        sunset: formatTimestamp(object.sys.sunset)
	};
}

function formatTimestamp(timestamp) {
    date = new Date(timestamp * 1000);
    hours = date.getHours();
    minutes = '0' + date.getMinutes();
    
    return `${hours}:${minutes.substr(-2)}`
}

getWeather('madrid');

