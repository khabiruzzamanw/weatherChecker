const city = document.querySelector("#search");

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
  const weatherInfo = document.querySelector(".weatherInfo");
  const info = document.querySelector(".info");
  const windSpeed = document.querySelector("#windSpeed");
  const humidity = document.querySelector("#humidity");
  const sky = document.querySelector("#sky");

  let data = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${value}&units=metric&appid=baf121166603d8940559c2dfd69ff368`
  );

  let weatherData = await data.json();

  try {
    weatherInfo.style.display = "block";
    // console.log(weatherData.weather[0].icon);
    sky.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
    dCity.innerHTML = weatherData.name;
    temp.innerHTML = Math.round(weatherData.main.temp) + ` ℃`;
    windSpeed.innerHTML = (weatherData.wind.speed * 3.6).toFixed(2) + ` km/h`;
    humidity.innerHTML = weatherData.main.humidity + ` %`;
    invalidInput.style.display = "none";

    // console.log(typeof data);
    // console.log(typeof weatherData);
    // console.log(weatherData);
    // console.log((temp.innerHTML = weatherData.main.temp));
  } catch (error) {
    const invalidInput = document.querySelector("#invalidInput");
    invalidInput.style.display = "block";
    weatherInfo.style.display = "none";
    invalidInput.innerHTML = `Input a valid CITY`;
  }
}
