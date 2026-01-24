const city = document.querySelector("#search");
const go = document.querySelector("#go");

go.addEventListener("click", function (e) {
  e.preventDefault();
  let cityName = city.value;
  request(cityName);
});

city.addEventListener("keydown", function (e) {
  // e.preventDefault();
  //console.log("hello");
  let cityName = city.value;
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

  let data = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${value}&units=metric&appid=baf121166603d8940559c2dfd69ff368`
  );

  let weatherData = await data.json();

  try {
    // console.log(weatherData.weather[0].icon);
    sky.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
    weatherSky.innerHTML = `${weatherData.weather[0].description}`;
    dCity.innerHTML = weatherData.name;
    temp.innerHTML = Math.round(weatherData.main.temp) + ` ℃`;
    windSpeed.innerHTML = (weatherData.wind.speed * 3.6).toFixed(2) + ` km/h`;
    humidity.innerHTML = weatherData.main.humidity + ` %`;
    // invalidInput.style.display = "none";

    // console.log(typeof data);
    // console.log(typeof weatherData);
    console.log(weatherData);
    // console.log((temp.innerHTML = weatherData.main.temp));
  } catch (error) {
    // const invalidInput = document.querySelector("#invalidInput");
    // invalidInput.innerHTML = `Input a valid CITY`;
    console.log(error);
    
  }
}









//this section is for the theme changer

const theme = document.getElementById("theme");

theme.addEventListener("mouseover", () => {
  theme.style.cursor = "pointer";
});

theme.addEventListener("click", () => {
  let themeData = document.body.classList;

  if (themeData.contains('dark')) {
    themeData.replace('dark', 'light');
    theme.src = "images/lightMode.svg";

  } else {
    themeData.replace('light', 'dark');
    theme.src = "images/darkMode.svg";
  }

  console.log(document.body.classList);
});


//-----------------------------------------------------------//---------------------------------------------------------------//


