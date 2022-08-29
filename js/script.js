const time = document.querySelector('.time')
const date = document.querySelector('.date')
const greeting = document.querySelector('.greeting')
const name = document.querySelector('input.name')
const body = document.querySelector('body')
const next = document.querySelector('.slide-next')
const prev = document.querySelector('.slide-prev')
let randomNum
let quoteNum
const weatherIcon = document.querySelector('.weather-icon')
const temperature = document.querySelector('.temperature')
const weatherDescription = document.querySelector('.weather-description')
const city = document.querySelector('.city')
const quote = document.querySelector('.quote')
const author = document.querySelector('.author')
const changeQuote = document.querySelector('.change-quote')


function showTime () {
  const cuttentTime = new Date()
  time.textContent = cuttentTime.toLocaleTimeString()
  showDate()
  showGreeting()

  setTimeout(showTime, 1000)
}

function changeRandomNum () {
  getRandomNum(1, 20)
  setTimeout(changeRandomNum, 10000)
}

function showDate () {
  const currentDate = new Date()
  const options = { weekday: 'long', month: 'long', day: 'numeric' }
  const dateText = currentDate.toLocaleDateString('en-US', options)
  date.textContent = dateText
}

function showGreeting () {
  const timeOfDay = getTimeOfDay()
  greeting.textContent = textContent(timeOfDay)
}

function getTimeOfDay () {
  const date = new Date()
  const hours = date.getHours()

  if (hours >= 6 && hours < 12) {
    return 'morning'
  } else if (hours >= 12 && hours < 18) {
    return 'day'
  } else if (hours >= 18 && hours < 24) {
    return 'evening'
  } else {
    return 'night'
  }
}

function textContent (timeOfDay) {
  return `Good ${timeOfDay}, `
}

function setLocalStorage () {
  localStorage.setItem('name', name.value)
  localStorage.setItem('city', city.value)
}

window.addEventListener('beforeunload', setLocalStorage)

function getLocalStorage () {
  if (localStorage.getItem('name')) {
    name.value = localStorage.getItem('name')
  }

  if (localStorage.getItem('city')) {
    city.value = localStorage.getItem('city')
  }
}

window.addEventListener('load', getLocalStorage)

function getRandomNum (min, max) {
  randomNum = Math.floor(Math.random() * (max - min) + min)
}
getRandomNum(1, 20)

function setBg () {
  const timeOfDay = getTimeOfDay()
  const bgNum = randomNum.toString().padStart(2, '0')
  const img = new Image()
  img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`
  img.onload = () => {
    body.style.backgroundImage = `url(${img.src})`
  }
}
setBg()

function getSlideNext () {
  randomNum++
  if (randomNum > 20) randomNum = 1
  setBg()
}
function getSlidePrev () {
  randomNum--
  if (randomNum === 0) randomNum = 20
  setBg()
}
next.addEventListener('click', getSlideNext)
prev.addEventListener('click', getSlidePrev)

showTime()
changeRandomNum()
showGreeting()

//weather
if (!city.value) {
  city.value = 'Киев'
}

async function getWeather(city) {
  if (!city) {
    city = 'Киев'
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=ru&appid=0cb48b86053deaaa4abe8cd25507d3d6&units=metric`;
  const res = await fetch(url)
  const data = await res.json()

  weatherIcon.className = 'weather-icon owf';
  weatherIcon.classList.add(`owf-${data.weather[0].id}`)
  temperature.textContent = `${data.main.temp}°C`
  weatherDescription.textContent = data.weather[0].description
}

city.addEventListener('change', () => {
  getWeather(city.value)
})

getWeather()

//quotes

async function getQuotes () {
  const quotes = `./assets/data/quotes.json`
  const res = await fetch(quotes)
  const data = await res.json()
  const num = Math.floor(Math.random() * data.length)

  quote.textContent = data[num].text
  author.textContent = data[num].author
}

getQuotes()

changeQuote.addEventListener('click', () => {
  getQuotes()
})

