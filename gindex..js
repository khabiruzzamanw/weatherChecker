const city = document.querySelector("#search");
const go = document.querySelector("#go");
const time = document.querySelector("#time");
const date = document.querySelector("#date");
const greetingText = document.querySelector("#greetingText");

let dateInfo = new Date();

date.innerHTML = `${dateInfo.toLocaleDateString('en-Gb').replace(/\//g, ".")}`;
setInterval(() => {
  let dateInfo = new Date();
  time.innerHTML = `${dateInfo.toLocaleTimeString()}`;
}, 1000);

let hourCheck = dateInfo.getHours();

if (hourCheck < 17 && hourCheck >= 12) {
  greetingText.innerHTML = 'Good afternoon';
} else if (hourCheck > 5 && hourCheck < 12) {
  greetingText.innerHTML = 'Good morning';
} else {
  greetingText.innerHTML = 'Good evening';
}

go.addEventListener("click", function (e) {
  e.preventDefault();
  let cityName = city.value.trim();
  if (cityName) {
    request(cityName);
  }
});

city.addEventListener("keydown", function (e) {
  let cityName = city.value.trim();
  if (e.key === "Enter") {
    request(cityName);
  }
});

async function request(value) {
  const dCity = document.querySelector("#city");
  const temp = document.querySelector("#temp");
  const windSpeed = document.querySelector("#windSpeed");
  const humidity = document.querySelector("#humidity");
  const sky = document.querySelector("#sky");
  const weatherSky = document.querySelector("#weatherSky");
  const forcastPreview = document.querySelector("#forcastPreview");

  try {
    if (value === '') {
      // Fixed: 'error' to 'Error'
      throw new Error("Empty value");
    } else {
      let data = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${value}&units=metric&appid=baf121166603d8940559c2dfd69ff368`);
      
      // Check if city is valid before parsing
      if (!data.ok) {
        throw new Error("City not found");
      }

      let weatherData = await data.json();
      console.log(weatherData);

      sky.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
      weatherSky.innerHTML = `${weatherData.weather[0].description}`;
      dCity.innerHTML = weatherData.name;
      temp.innerHTML = Math.round(weatherData.main.temp) + `°C`;

      // JS injects HTML here. We need the CSS to handle the <p> and <img> tags it creates.
      windSpeed.innerHTML = `<img id="windSpeedImg" src="images/windSpeedDark.svg" alt="">
                <p>${(weatherData.wind.speed * 3.6).toFixed(2)} km/h</p>`;

      humidity.innerHTML = `<img id="humidityImg" src="images/humidityDark.svg" alt="">
                            <p>${weatherData.main.humidity} %</p>`;

      getForecastData(weatherData);
    }
  } catch (error) {
    console.log(error);
    dCity.innerHTML = 'City not found';
    temp.innerHTML = '--';
  }
}

async function getForecastData(value) {
  const lon = value.coord.lon;
  const lat = value.coord.lat;
  const forecastData = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=baf121166603d8940559c2dfd69ff368`);
  const forecastWeatherData = await forecastData.json();

  let forecastWeatherDataInfoArr = [];

  for (let index = 0; index < forecastWeatherData.list.length; index += 8) {
    let forecastWeatherDataInfo = forecastWeatherData.list[index];
    let dateTime = forecastWeatherDataInfo.dt;
    let dayInfo = new Date(dateTime * 1000);
    let dateInfo = dayInfo.getDate();
    let monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let monthI = dayInfo.getMonth();
    let month = monthNames[monthI];

    let info = {
      dateInfo,
      month,
      hourlyData: []
    };

    // Ensure we don't go out of bounds
    for (let i = 0; i < 8; i++) {
        if (forecastWeatherData.list[index + i]) {
            let forecastWeatherDataHourlyInfo = forecastWeatherData.list[index + i];
            let timeInfo = new Date((forecastWeatherDataHourlyInfo.dt) * 1000);
            let time = timeInfo.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            let forecastWeatherDataInfoList = forecastWeatherDataHourlyInfo.main;
            let averageTemp = Math.round(forecastWeatherDataInfoList.temp); // Round temp
            let tempMax = Math.round(forecastWeatherDataInfoList.temp_max);
            let tempMin = Math.round(forecastWeatherDataInfoList.temp_min);

            let forecastSkyInfo = forecastWeatherDataHourlyInfo.weather;
            let forecastSkyInfoSituation = forecastSkyInfo[0].description;

            let infoDetails = { time, averageTemp, tempMax, tempMin, forecastSkyInfoSituation };
            info.hourlyData.push(infoDetails);
        }
    }
    forecastWeatherDataInfoArr.push(info);
  }
  getUi(forecastWeatherDataInfoArr);
}

function getUi(arr) {
  const forcastPreview = document.querySelector("#forcastPreview");
  forcastPreview.innerHTML = '';

  arr.forEach((substance, index) => {
    let dayParent = document.createElement('div');
    // Added class for styling
    dayParent.innerHTML = `<h4 class="day-header">${substance.dateInfo} ${substance.month}</h4>`; 
    dayParent.setAttribute('class', 'dayParent');
    dayParent.classList.add(`dayParent${index + 1}`);
    
    // Make first day active by default
    if(index === 0) dayParent.classList.add('active');

    let dayChild = document.createElement('div');
    dayChild.setAttribute('class', 'day');
    dayChild.classList.add(`day${index + 1}`);

    forcastPreview.appendChild(dayParent);
    dayParent.appendChild(dayChild);

    substance.hourlyData.forEach((e) => {
      let dayGrandChild = document.createElement('div');
      dayGrandChild.setAttribute('class', 'dayGrandChild');
      dayGrandChild.innerHTML =
        `<p class="hourlyTime">${e.time}</p>
         <p class="avg-temp">${e.averageTemp}°C</p>
         <div class="forecastWeatherInfoTemp">
             <span>H:${e.tempMax}°</span> <span>L:${e.tempMin}°</span>
         </div>
         <p class="sky-desc">${e.forecastSkyInfoSituation}</p>`;

      dayChild.appendChild(dayGrandChild);
    });
  });

  const liDay = document.querySelectorAll('.liDay');
  liDay.forEach((element, index) => {
    element.addEventListener('click', () => {
      // Remove active class from all tabs
      liDay.forEach(el => el.classList.remove('active-tab'));
      element.classList.add('active-tab');

      const dayDiv = document.querySelectorAll('.dayParent');
      dayDiv.forEach((div, i) => {
        // We control visibility manually with 'active' class now
        div.classList.remove("active");
        if (index === i) {
          div.classList.add('active');
        }
      });
    });
  });
}

// THEME CHANGER FIXED
const theme = document.getElementById("theme");

theme.addEventListener("mouseover", () => {
  theme.style.cursor = "pointer";
});

theme.addEventListener("click", () => {
  let themeData = document.body.classList;
  // Select images dynamically
  const windSpeedImg = document.querySelector("#windSpeedImg");
  const humidityImg = document.querySelector("#humidityImg");

  if (themeData.contains('dark')) {
    themeData.replace('dark', 'light');
    go.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>'; // Update SVG color via CSS
    theme.src = "images/lightMode.svg";
    
    // CRASH FIX: Check if elements exist before setting src
    if (humidityImg) humidityImg.src = 'images/humidityDark.svg';
    if (windSpeedImg) windSpeedImg.src = 'images/windSpeedDark.svg';

  } else {
    themeData.replace('light', 'dark');
    go.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>';
    theme.src = "images/darkMode.svg";
    
    // CRASH FIX
    if (humidityImg) humidityImg.src = 'images/humidityLight.svg';
    if (windSpeedImg) windSpeedImg.src = 'images/windSpeedLight.svg';
  }
});