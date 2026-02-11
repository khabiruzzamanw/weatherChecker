const search = document.querySelector("#search");
const go = document.querySelector("#go");
const time = document.querySelector("#time");
const date = document.querySelector("#date");
const greetingText = document.querySelector("#greetingText");
const theme = document.getElementById("theme");
const forcastPreview = document.querySelector('.forcastPreview');

themeChanger();



let dateInfo = new Date

date.innerHTML = `${dateInfo.toLocaleDateString('en-Gb').replace(/\//g, ".")}`;
setInterval(() => {
  let dateInfo = new Date;
  time.innerHTML = `${dateInfo.toLocaleTimeString()}`;

}, 1000);

let hourCheck = dateInfo.getHours();


if (hourCheck < 17 && hourCheck >= 12) {
  greetingText.innerHTML = 'Good afternoon'

} else if (hourCheck > 5 && hourCheck < 12) {
  greetingText.innerHTML = 'Good morning'

} else {

  greetingText.innerHTML = 'Good evening'
}

go.addEventListener("click", function (e) {
  e.preventDefault();
  let cityName = search.value.toLowerCase().trim();

  if (cityName) {
    request(cityName);
  }
});

search.addEventListener("keydown", function (e) {

  let cityName = search.value.toLowerCase().trim();

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

      throw new Error();

    }
    else {


      let data = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${value}&units=metric&appid=baf121166603d8940559c2dfd69ff368`);

      let weatherData = await data.json();

      console.log(weatherData);

      sky.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
      weatherSky.innerHTML = `${weatherData.weather[0].description}`;
      dCity.innerHTML = weatherData.name;
      temp.innerHTML = Math.round(weatherData.main.temp) + ` ℃`;

      let getWindImg;
      let getHumidityImg;

      let userThemeName = localStorage.getItem("userTheme") || "light";


      if (userThemeName === "dark") {
        getWindImg = "images/windSpeedLight.svg";
        getHumidityImg = "images/humidityLight.svg";
      }
      else if (userThemeName === "light") {
        getWindImg = "images/windSpeedDark.svg";
        getHumidityImg = "images/humidityDark.svg";
      }


      windSpeed.innerHTML = `<img id="windSpeedImg" src=${getWindImg} alt="">
                <p >${(weatherData.wind.speed * 3.6).toFixed(2)}  km/h</p>`;


      humidity.innerHTML = `<img id="humidityImg" src=${getHumidityImg} alt="">
                            <p >${weatherData.main.humidity}   %</p>`;

      getForecastData(weatherData);
    }


  }

  catch (error) {

    // console.log(error);

    sky.src = '';
    weatherSky.innerHTML = '';
    dCity.innerHTML = 'Invalid city name';
    temp.innerHTML = '-_-';
    windSpeed.innerHTML = '';
    humidity.innerHTML = '';

    forcastPreview.innerHTML = '';

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



    for (let i = 0; i < 8; i++) {
      let forecastWeatherDataHourlyInfo = forecastWeatherData.list[index + i];

      let timeInfo = new Date((forecastWeatherDataHourlyInfo.dt) * 1000);
      let time = timeInfo.toLocaleTimeString();


      let forecastWeatherDataInfoList = forecastWeatherDataHourlyInfo.main;

      let averageTemp = forecastWeatherDataInfoList.temp;
      let tempMax = forecastWeatherDataInfoList.temp_max;
      let tempMin = forecastWeatherDataInfoList.temp_min;

      let forecastSkyInfo = forecastWeatherDataHourlyInfo.weather;

      let forecastSkyInfoSituation = forecastSkyInfo[0].description;

      let infoDetails = { time, averageTemp, tempMax, tempMin, forecastSkyInfoSituation };

      info.hourlyData.push(infoDetails);

    }

    forecastWeatherDataInfoArr.push(info);

  }

  getUi(forecastWeatherDataInfoArr);

}



function getUi(arr) {

  forcastPreview.innerHTML = '';

  arr.forEach((substance, index) => {

    let dayParent = document.createElement('div');

    dayParent.setAttribute('class', 'dayParent');

    dayParent.innerHTML = `<p class="daytext">${substance.dateInfo}  ${substance.month}</p>`


    dayParent.classList.add(`dayParent${index + 1}`);

    let dayChild = document.createElement('div');
    dayChild.setAttribute('class', 'day');

    dayChild.classList.add(`day${index + 1}`);


    forcastPreview.appendChild(dayParent);
    dayParent.appendChild(dayChild);

    substance.hourlyData.forEach((e) => {
      let dayGrandChild = document.createElement('div');
      dayGrandChild.setAttribute('class', 'dayGrandChild');

      dayGrandChild.innerHTML =
        `<p class="hourlyTime">At ${e.time}</p>
                                <p>Average Temp : ${e.averageTemp} ℃</p>
                                <div class="forecastWeatherInfoTemp">
                                <p>Max-Temp : ${e.tempMax} ℃</p>
                                <p>Min-Temp : ${e.tempMin} ℃</p>
                                </div>
                                <p>Sky : ${e.forecastSkyInfoSituation}</p>`

      dayChild.appendChild(dayGrandChild);

    });

  });


  const liDay = document.querySelectorAll('.liDay');


  liDay.forEach((element, index) => {
    element.addEventListener('click', (clickbutton) => {
      const dayDiv = document.querySelectorAll('.dayParent');

      dayDiv.forEach((div, i) => {

        div.classList.remove("dayParent1");

        if (index === i) {

          div.classList.add('active');
        }

        else {
          div.classList.remove('active');
        }

      });

    });
  });

}





//this section is for the theme changer



function themeChanger() {

  theme.addEventListener("mouseover", () => {
    theme.style.cursor = "pointer";
  });

  theme.addEventListener("click", () => {
    let themeData = document.body.classList;
    const windSpeedImg = document.querySelector("#windSpeedImg");
    const humidityImg = document.querySelector("#humidityImg");

    if (themeData.contains('dark')) {

      themeData.replace('dark', 'light');
      theme.src = "images/lightMode.svg";

      localStorage.setItem("userTheme", "light");
      localStorage.setItem("themeImg", "images/lightMode.svg");

    } else {

      themeData.replace('light', 'dark');
      theme.src = "images/darkMode.svg";

      localStorage.setItem("userTheme", "dark");
      localStorage.setItem("themeImg", "images/darkMode.svg");

    };

    let getClassName = localStorage.getItem("userTheme") || "light";

    if (windSpeedImg && humidityImg) {
      if (getClassName === "dark") {
        windSpeedImg.src = "images/windSpeedLight.svg";
        humidityImg.src = "images/humidityLight.svg";
      }
      else if (getClassName === "light") {
        windSpeedImg.src = "images/windSpeedDark.svg";
        humidityImg.src = "images/humidityDark.svg";
      }
    }

  });

  let getClassName = localStorage.getItem("userTheme") || "light";
  let getThemeImg = localStorage.getItem("themeImg") || "images/lightMode.svg";


  document.body.classList.add(getClassName);
  theme.src = getThemeImg;

};


