const key = '8552967c1e78f7a3f945ef7cbd1121e0';
let weather = undefined;

async function getWeather(lat, lon, place) {
	fetch(
		`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&cnt=7&appid=${key}&units=Metric`,
		{ mode: 'cors' }
	)
		.then((response) => response.json())
		.then((parsed) => {
			console.log(parsed);
			weather = processWeather(parsed, place);
            console.log(weather)
		})
}
async function getCoords(cityName) {
	const request = fetch(
		`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${key}`,
		{ mode: 'cors' }
	);

	const response = await (await request).json();
	const lat = response[0].lat;
	const lon = response[0].lon;
	const place = `${response[0].name}, ${response[0].country}`;
	getWeather(lat, lon, place);
	console.log(response);
}

function processWeather(object, place) {
	const alerts = object.alerts;
	const processedAlerts = [];

	for (let i = 0; i < alerts.length; i++) {
		const alert = alerts[i];
		processedAlerts.push({
			start: formatTimestamp(alert.start),
			end: formatTimestamp(alert.end),
			agency: alert.sender_name,
			warning: alert.event,
			description: alert.description,
		});
	}
	return {
		place: place,
		alerts: processedAlerts,
		// weather: object.weather[0].description,
		// cloudiness: object.clouds.all,
		// temp: object.main.temp,
		// feelsLike: object.main.feels_like,
		// minTemp: object.main.temp_min,
		// maxTemp: object.main.temp_max,
		// pressure: object.main.pressure,
		// sunrise: formatTimestamp(object.city.sunrise),
		// sunset: formatTimestamp(object.city.sunset),
	};
}

function formatTimestamp(timestamp) {
	date = new Date(timestamp * 1000);
	hours = date.getHours();
	minutes = '0' + date.getMinutes();

	return `${hours}:${minutes.substr(-2)}`;
}

getCoords('madrid');
