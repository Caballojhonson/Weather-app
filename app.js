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
			console.log(weather);
		});
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
	const forecast = object.daily;
	const current = object.current;
	const processedAlerts = [];
	const processedForecast = [
		{
			day: formatTimestamp(current.dt, 'wd'),
			date: current.dt,
			weather: current.weather[0].description,
			icon: current.weather[0].icon,
			clouds: current.clouds,
			temp: Math.round(current.temp),
			feelsLike: Math.round(current.feels_like),
			humidity: current.humidity,
			windDeg: current.wind_deg,
			windSpeed: current.wind_speed,
			pressure: current.pressure,
			uvi: current.uvi,
			sunrise: formatTimestamp(current.sunrise, 't'),
			sunset: formatTimestamp(current.sunset, 't'),
		},
	];

	for (let i = 0; i < alerts.length; i++) {
		const alert = alerts[i];
		processedAlerts.push({
			start: formatTimestamp(alert.start, 'dt'),
			end: formatTimestamp(alert.end, 'dt'),
			agency: alert.sender_name,
			warning: alert.event,
			description: alert.description,
		});
	}

	for (let i = 0; i < forecast.length; i++) {
		const day = forecast[i];
		processedForecast.push({
			day: formatTimestamp(day.dt, 'wd'),
			date: day.dt,
			weather: day.weather[0].description,
			icon: day.weather[0].icon,
			clouds: day.clouds,
			minTemp: Math.round(day.temp.min),
			maxTemp: Math.round(day.temp.max),
			feelsLike: Math.round(day.feels_like.day),
			humidity: day.humidity,
			windDeg: day.wind_deg,
			windSpeed: day.wind_speed,
			pressure: day.pressure,
			uvi: day.uvi,
			sunrise: formatTimestamp(day.sunrise, 't'),
			sunset: formatTimestamp(day.sunset, 't'),
		});
	}
	return {
		place: place,
		alerts: processedAlerts,
		weather: processedForecast,
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

function formatTimestamp(timestamp, format) {
	const input = new Date(timestamp * 1000);
	const year = input.getFullYear();
	const month = input.getMonth();
	const day = input.getDate();
	const weekDay = input.getDay();
	const hours = input.getHours();
	const minutes = '0' + input.getMinutes();
	const weekDays = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	];
	if (format == 'wd') return weekDays[weekDay];
	if (format == 'dt')
		return `${hours}:${minutes.substr(-2)} ${day}/${month}/${year}`;
	if (format == 'd') return `${day}/${month}/${year}`;

	if (format == 't') return `${hours}:${minutes.substr(-2)}`;
}

getCoords('madrid');
