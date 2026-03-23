weatherCherker();
function weatherCherker() {
  themeChanger();
  greeting();

  const search = document.querySelector("#search");
  const go = document.querySelector("#go");
  const theme = document.getElementById("theme");
  const forcastPreview = document.querySelector('.forcastPreview');
  const imageIcons = {
    dark: {
      themeIcon: "svgs/darkMode.svg",
      windSpeedIcon: "svgs/windSpeedLight.svg",
      humidityIcon: "svgs/humidityLight.svg",
      searchIcon: "svgs/searchLight.svg",
      temperatureIcon: "svgs/tempLight.svg",

    }, light: {
      themeIcon: "svgs/lightMode.svg",
      windSpeedIcon: "svgs/windSpeedDark.svg",
      humidityIcon: "svgs/humidityDark.svg",
      searchIcon: "svgs/searchDark.svg",
      temperatureIcon: "svgs/tempDark.svg",

    }

  };


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
        // console.log(weatherData);

        sky.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
        weatherSky.textContent = weatherData.weather[0].description;
        dCity.textContent = weatherData.name;
        temp.textContent = Math.round(weatherData.main.temp) + ` ℃`;


        let userThemeName = localStorage.getItem("userTheme") || "light";

        let getWindImg = imageIcons[userThemeName].windSpeedIcon;
        let getHumidityImg = imageIcons[userThemeName].humidityIcon;

        const windSpeedImage = document.createElement("img");
        windSpeedImage.setAttribute("class", "windSpeedImg");
        const windSpeedPara = document.createElement("p");

        const humidityImage = document.createElement("img");
        humidityImage.setAttribute("class", "humidityImg");
        const humidityPara = document.createElement("p");

        windSpeedImage.src = getWindImg;
        windSpeedPara.textContent = (weatherData.wind.speed * 3.6).toFixed(2);
        humidityImage.src = getHumidityImg;
        humidityPara.textContent = weatherData.main.humidity;

        windSpeed.appendChild(windSpeedImage);
        windSpeed.appendChild(windSpeedPara);
        humidity.appendChild(humidityImage);
        humidity.appendChild(humidityPara);

        getForecastData(weatherData);
      }


    }

    catch (error) {

      // console.log(error);

      sky.src = '';
      weatherSky.textContent = '';
      dCity.textContent = 'Invalid city name';
      temp.textContent = '-_-';
      windSpeed.textContent = '';
      humidity.textContent = '';

      forcastPreview.textContent = '';

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

    forcastPreview.textContent = '';

    arr.forEach((substance, index) => {

      let dayParent = document.createElement('div');
      dayParent.setAttribute('class', 'dayParent');

      let dayText = document.createElement('div');
      dayText.setAttribute('class', 'dayText');

      dayText.textContent = substance.dateInfo + " " + substance.month;
      dayParent.appendChild(dayText);

      dayParent.classList.add(`dayParent${index + 1}`);

      let dayChild = document.createElement('div');
      dayChild.setAttribute('class', 'day');

      dayChild.classList.add(`day${index + 1}`);


      forcastPreview.appendChild(dayParent);
      dayParent.appendChild(dayChild);

      substance.hourlyData.forEach((e) => {
        let dayGrandChild = document.createElement('div');
        dayGrandChild.setAttribute('class', 'dayGrandChild');

        const forecastWeatherInfoTemp = document.createElement('div');
        forecastWeatherInfoTemp.setAttribute('class', 'forecastWeatherInfoTemp');

        const hourlyTime = document.createElement('p');
        hourlyTime.setAttribute('class', 'hourlyTime');

        const maxTemp = document.createElement('p');
        maxTemp.setAttribute('class', 'maxTemp');

        const minTemp = document.createElement('p');
        minTemp.setAttribute('class', 'minTemp');

        const skyCondition = document.createElement('p');
        skyCondition.setAttribute('class', 'skyCondition');

        const averageTemp = document.createElement('p');
        averageTemp.setAttribute('class', 'averageTemp');

        hourlyTime.textContent = e.time;
        maxTemp.textContent = `Max-Temp : ${e.tempMax} ℃`;
        minTemp.textContent = `Min-Temp : ${e.tempMin} ℃`;
        skyCondition.textContent = `Sky : ${e.forecastSkyInfoSituation}`;
        averageTemp.textContent = `Average Temp : ${e.averageTemp} ℃`;


        forecastWeatherInfoTemp.appendChild(maxTemp);
        forecastWeatherInfoTemp.appendChild(minTemp);
        dayGrandChild.appendChild(forecastWeatherInfoTemp);
        dayGrandChild.appendChild(hourlyTime);
        dayGrandChild.appendChild(skyCondition);
        dayGrandChild.appendChild(averageTemp);
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


  function greeting() {
    const time = document.querySelector("#time");
    const date = document.querySelector("#date");
    const greetingText = document.querySelector("#greetingText");

    let dateInfo = new Date;
    date.textContent = `${dateInfo.toLocaleDateString('en-Gb').replace(/\//g, ".")}`;
    setInterval(() => {
      let dateInfo = new Date;
      time.textContent = `${dateInfo.toLocaleTimeString()}`;
    }, 1000);

    let hourCheck = dateInfo.getHours();

    if (hourCheck < 17 && hourCheck >= 12) {
      greetingText.textContent = 'Good afternoon'

    } else if (hourCheck > 5 && hourCheck < 12) {
      greetingText.textContent = 'Good morning'

    } else {

      greetingText.textContent = 'Good evening'
    }

  };



  function themeChanger() {
    const theme = document.getElementById("theme");

    document.body.classList.add(localStorage.getItem("userTheme") || "light");

    theme.addEventListener("click", () => {
      const themeData = localStorage.getItem("userTheme") || "light";
      if (themeData === "dark") {
        setIcons("light");
      } else {
        setIcons("dark");
      }
    });

    function setIcons(themeName) {
      const windSpeedImg = document.querySelector("#windSpeedImg");
      const humidityImg = document.querySelector("#humidityImg");

      document.body.classList.remove("dark", "light");
      document.body.classList.add(themeName);
      localStorage.setItem("userTheme", themeName);
      theme.src = imageIcons[themeName].themeIcon;

      if (windSpeedImg && humidityImg) {
        windSpeedImg.src = imageIcons[themeName].windSpeedIcon;
        humidityImg.src = imageIcons[themeName].humidityIcon;
      }

    }
  };

};



