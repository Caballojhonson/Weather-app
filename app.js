const key = '8552967c1e78f7a3f945ef7cbd1121e0';
let weather = 'No data received';
let unit = 'ºC';

async function getWeather(lat, lon, place) {
	fetch(
		`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&cnt=7&appid=${key}&units=Metric`,
		{ mode: 'cors' }
	)
		.then((response) => response.json())
		.then((parsed) => {
			weather = processWeather(parsed, place);
		})
		.then(() => {
			console.log(weather);
			populateBoxes();
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
	// renderDOM()
	console.log(response);
}

function processWeather(object, place) {
	const alerts = object.alerts;
	const forecast = object.daily;
	const current = object.current;
	const processedAlerts = [];
	const processedForecast = [];
	const processedCurrent = {
		day: formatTimestamp(current.dt, 'wd'),
		date: formatTimestamp(current.dt, 'd'),
		weather: capitalize(current.weather[0].description),
		icon: current.weather[0].icon,
		clouds: current.clouds + '%',
		temp: Math.round(current.temp) + `${unit}`,
		feelsLike: Math.round(current.feels_like) + `${unit}`,
		humidity: current.humidity + '%',
		windDeg: `${current.wind_deg}º, ${formatWind(current.wind_deg)}`,
		windSpeed: `${current.wind_speed} m/s`,
		pressure: current.pressure + ' mbar',
		uvi: current.uvi,
		sunrise: formatTimestamp(current.sunrise, 't'),
		sunset: formatTimestamp(current.sunset, 't'),
	};

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
			date: formatTimestamp(day.dt, 'd'),
			weather: capitalize(day.weather[0].description),
			icon: day.weather[0].icon,
			clouds: day.clouds + '%',
			minTemp: Math.round(day.temp.min) + `${unit}`,
			maxTemp: Math.round(day.temp.max) + `${unit}`,
			feelsLike: Math.round(day.feels_like.day) + `${unit}`,
			humidity: day.humidity + '%',
			windDeg: `${day.wind_deg}º, ${formatWind(day.wind_deg)}`,
			windSpeed: `${day.wind_speed} m/s`,
			pressure: day.pressure + ' mbar',
			uvi: day.uvi,
			sunrise: formatTimestamp(day.sunrise, 't'),
			sunset: formatTimestamp(day.sunset, 't'),
		});
	}
	return {
		place: place,
		alerts: processedAlerts,
		current: processedCurrent,
		weather: processedForecast,
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

function formatWind(deg) {
	if ((deg > 349 && deg <= 360) || (deg >= 0 && deg < 11)) return 'N';
	if (deg > 11 && deg < 34) return 'NNE';
	if (deg > 34 && deg < 56) return 'NE';
	if (deg > 56 && deg < 79) return 'ENE';
	if (deg > 79 && deg < 101) return 'E';
	if (deg > 101 && deg < 124) return 'ESE';
	if (deg > 124 && deg < 146) return 'SE';
	if (deg > 146 && deg < 169) return 'SSE';
	if (deg > 169 && deg < 191) return 'S';
	if (deg > 191 && deg < 214) return 'SSW';
	if (deg > 214 && deg < 236) return 'SW';
	if (deg > 236 && deg < 259) return 'WSW';
	if (deg > 259 && deg < 281) return 'W';
	if (deg > 281 && deg < 304) return 'WNW';
	if (deg > 304 && deg < 326) return 'NW';
	if (deg > 326 && deg < 349) return 'NNW';
	else 'Invalid degree number';
}

function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function getForecastDays() {
	let days = [];

	weather.weather.forEach((day) => {
		const trimmed = day.day.substring(0, 3);
		days.push(trimmed);
	});

	days[0] = 'Today';

	return days;
}

// ---------------------------- DOM ---------------------------------

function populateBoxes() {
	const cells = document.querySelectorAll('.day-box');
	const days = getForecastDays();

	cells.forEach((cell, i) => {
		const text = cell.firstElementChild;
		const icon = cell.lastElementChild;

		text.textContent = days[i];
		icon.src = `http://openweathermap.org/img/wn/${weather.weather[i].icon}@4x.png`;
	});
}

getCoords('madrid');
