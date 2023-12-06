const API_KEY = "7ded80d91f2b280ec979100cc8bbba94";
const LANG = "pl";
const API_URL_BASE = "https://api.openweathermap.org/data/2.5/";
const ICON_URL_BASE = "https://openweathermap.org/img/wn/{iconName}@2x.png";
const DEBUG = true;

const WeatherApp = class {
    constructor() {
        this.currentWeather = undefined;
        this.forecast = undefined;
    }

    getCurrentWeather(query) {
        let url = `${API_URL_BASE}weather?q=${query}&appid=${API_KEY}&units=metric&lang=${LANG}`;

        let request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.addEventListener("load", () => {
           this.currentWeather = JSON.parse(request.responseText);
           print(this.currentWeather);
           this.draw();
        });

        request.send();
    }

    getForecast(query) {
        let url = `${API_URL_BASE}forecast?q=${query}&appid=${API_KEY}&units=metric&lang=${LANG}`;
        fetch(url).then((response) => {
           return response.json();
        }).then((data) => {
            this.forecast = data.list;
            print(data);
            this.draw();
        });
    }

    get(query) {
        this.currentWeather = undefined;
        this.forecast = undefined;

        this.getCurrentWeather(query);
        this.getForecast(query);
    }

    draw() {
        let weathers = document.querySelector("#weathers");
        weathers.innerHTML = "";

        if (this.currentWeather) {
            const block = this.createWeatherBlock(this.currentWeather);
            weathers.appendChild(block);
        }

        if (this.forecast) {
            const len = this.forecast.length;
            if (len <= 0) {
                return;
            }

            for(let i = 0; i < len; i++) {
                const block = this.createWeatherBlock(this.forecast[i]);
                weathers.appendChild(block);
            }
        }
    }

    createWeatherBlock(data) {
        let weatherBlock = document.createElement("div");
        weatherBlock.className = "weather-block";

        let dateBlock = document.createElement("div");
        let date = new Date(data.dt * 1000);
        dateBlock.innerText = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        weatherBlock.appendChild(dateBlock);

        let temperatureBlock = document.createElement("div");
        temperatureBlock.innerHTML = `${data.main.temp} &deg;C`;
        weatherBlock.appendChild(temperatureBlock);

        let feelsLikeBlock = document.createElement("div");
        feelsLikeBlock.innerHTML = `Odczuwalna: ${data.main.feels_like} &deg;C`;
        weatherBlock.appendChild(feelsLikeBlock);

        let weatherIcon = document.createElement("img");
        weatherIcon.src = ICON_URL_BASE.replace("{iconName}", data.weather[0].icon);
        weatherBlock.appendChild(weatherIcon);

        let weatherDescription = document.createElement("div");
        weatherDescription.innerText = data.weather[0].description;
        weatherBlock.appendChild(weatherDescription);

        return weatherBlock;
    }
}

app = new WeatherApp();

function onSearch() {
    let input = document.querySelector("#search-input");
    let query = input.value;
    if (query === null || query === "") {
        return;
    }

    app.get(query);
}

function print(text) {
    if (!DEBUG) {
        return;
    }

    console.log(text);
}

