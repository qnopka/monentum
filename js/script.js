import playList from "./playList.js"
import playListUa from "./playList_ua.js"

const time = document.querySelector('.time')
const date = document.querySelector('.date')
const greeting = document.querySelector('.greeting')
const name = document.querySelector('input.name')
const body = document.querySelector('body')
const next = document.querySelector('.slide-next')
const prev = document.querySelector('.slide-prev')
let randomNum
// let quoteNum
const weatherIcon = document.querySelector('.weather-icon')
const temperature = document.querySelector('.temperature')
const weatherDescription = document.querySelector('.weather-description')
const city = document.querySelector('.city')
const quote = document.querySelector('.quote')
const author = document.querySelector('.author')
const changeQuote = document.querySelector('.change-quote')
const audio = new Audio()
let isPlay = false
let playNum = 0
const btn = document.querySelector('.play')
const prevBtn = document.querySelector('.play-prev')
const nextBtn = document.querySelector('.play-next')
const playListContainer = document.querySelector('.play-list')
const en = document.querySelector('.lang-en')
const ua = document.querySelector('.lang-ua')
let language
const greetingText = document.querySelector('.greeting-text')

function setLocalStorage () {
  localStorage.setItem('name', name.value)
  localStorage.setItem('city', city.value)
  localStorage.setItem('lang', language)
}

window.addEventListener('beforeunload', setLocalStorage)

function getLocalStorage () {
  if (localStorage.getItem('name')) {
    name.value = localStorage.getItem('name')
  }

  if (localStorage.getItem('city')) {
    city.value = localStorage.getItem('city')
  }

  if (localStorage.getItem('lang')) {
    language = localStorage.getItem('lang')
  } else {
    language = 'en'
  }
  if (language === 'en') {
    en.classList.add('active')
    ua.classList.remove('active')
  } else if (language === 'ua') {
    ua.classList.add('active')
    en.classList.remove('active')
  }
  greetingText.textContent = language === 'ua' ? `💙 Ми з України 💛` : `💙 We are from Ukraine 💛`
  city.placeholder = language === 'ua' ? `[Введіть місто]` : `[Enter city]`
  name.placeholder = language === 'ua' ? `[Введіть імʼя]` : `[Enter your name]`
  getQuotes()
  getWeather()
  for (let i = 0; i < playList.length; i++) {
    const li = document.createElement('li')
    li.classList.add('play-item')
    console.log(language)
    li.textContent = language === 'ua' ? playListUa[i].title : playList[i].title; 
    playListContainer.append(li)
  }
  
}

window.addEventListener('load', getLocalStorage)

function showTime () {
  const currentTime = new Date()
  time.textContent = currentTime.toLocaleTimeString()
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
  date.textContent = language === 'ua' ? currentDate.toLocaleDateString('uk-UA', options) : currentDate.toLocaleDateString('en-US', options)
}

function showGreeting () {
  const timeOfDay = getTimeOfDayGreeting()
  greeting.textContent = textContent(timeOfDay)
}

function getTimeOfDay () {
  const date = new Date()
  const hours = date.getHours()

    if (hours >= 6 && hours < 12) {
      return 'morning'
    } else if (hours >= 12 && hours < 18) {
      return 'afternoon'
    } else if (hours >= 18 && hours < 24) {
      return 'evening'
    } else {
      return 'night'
    }
  
}

function getTimeOfDayGreeting () {
  const date = new Date()
  const hours = date.getHours()

  if (language === 'en') {
    if (hours >= 6 && hours < 12) {
      return 'morning'
    } else if (hours >= 12 && hours < 18) {
      return 'afternoon'
    } else if (hours >= 18 && hours < 24) {
      return 'evening'
    } else {
      return 'night'
    }
  } else if (language === 'ua') {
    if (hours >= 6 && hours < 12) {
      return 'ранку'
    } else if (hours >= 12 && hours < 18) {
      return 'дня'
    } else if (hours >= 18 && hours < 24) {
      return 'вечора'
    } else {
      return 'ночі'
    }
  }
}

function textContent (timeOfDay) {
  if (language === 'en') {
    return `Good ${timeOfDay}, `
  } else if (language === 'ua') {
    if (timeOfDay === 'ночі') {
      return `Доброї ${timeOfDay}, `
    } else {
      return `Доброго ${timeOfDay}, `
    }
  }
  
}

function getRandomNum (min, max) {
  randomNum = Math.floor(Math.random() * (max - min) + min)
  // console.log(randomNum)
}
getRandomNum(1, 20)

function setBg () {
  const timeOfDay = getTimeOfDay()
  const bgNum = randomNum.toString().padStart(2, '0')
  // console.log(bgNum)
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
  city.value = language === 'ua' ?  'Київ' : 'Kyiv' 
}

async function getWeather(city) {
  if (!city) {
    city = language === 'ua' ? 'Київ' : 'Kyiv' 
  }
  if (!language) {
    language = language === 'ua' ? 'ua' : 'en' 
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=${language}&appid=0cb48b86053deaaa4abe8cd25507d3d6&units=metric`;
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
  const quotes =  language === 'ua' ?  `./assets/data/quotes_ua.json` : `./assets/data/quotes.json`
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


// player

function playAudio() {
  
  audio.src = language === 'ua' ? playListUa[playNum].src : playList[playNum].src;
  audio.currentTime = 0
  audio.play()
  playListContainer.childNodes.forEach(element => {
    element.classList.remove('item-active')
  });
  playListContainer.childNodes[playNum].classList.add('item-active')
}

function stopAudio() {
  audio.pause()
  playListContainer.childNodes.forEach(element => {
    element.classList.remove('item-active')
  });
  playListContainer.childNodes[playNum].classList.remove('item-active')
}

function toggleBtn() {
  btn.classList.toggle('pause')
  if (btn.classList.contains('pause')) {
    isPlay = true
    playAudio()
  } else {
    isPlay = false
    stopAudio()
  }
}

btn.addEventListener('click', toggleBtn)

function playNext() {
  playNum ++
  if (playNum === playList.length) playNum = 0
    playListContainer.childNodes[playNum].classList.add('item-active')
    if (!btn.classList.contains('pause')) btn.classList.add('pause')
    if (isPlay) playAudio()

}

function playPrev() {
  playNum --
  if (playNum === -1) playNum = playList.length-1
  if (!btn.classList.contains('pause')) btn.classList.add('pause')
  if (isPlay) playAudio()

}

prevBtn.addEventListener('click', playPrev)
nextBtn.addEventListener('click', playNext)

// for (let i = 0; i < playList.length; i++) {
//   const li = document.createElement('li')
//   li.classList.add('play-item')
//   console.log(language)
//   li.textContent = language === 'ua' ? playListUa[i].title : playList[i].title; 
//   playListContainer.append(li)
// }


// language

en.addEventListener('click', () => {
  ua.classList.remove('active')
  en.classList.add('active')
  language = 'en'
  getWeather(city.value)
  greetingText.textContent = `💙 We are from Ukraine 💛`
  city.placeholder = `[Enter city]`
  name.placeholder = `[Enter your name]`
  getQuotes()
  showTime()
  showGreeting()
  stopAudio()
  playNum = 0
  if (btn.classList.contains('pause')) btn.classList.remove('pause')
  playListContainer.textContent = ''
  for (let i = 0; i < playList.length; i++) {
    const li = document.createElement('li')
    li.classList.add('play-item')
    li.textContent = language === 'ua' ? playListUa[i].title : playList[i].title; 
    playListContainer.append(li)
  }

})

ua.addEventListener('click', () => {
  en.classList.remove('active')
  ua.classList.add('active')
  language = 'ua'
  getWeather(city.value)
  greetingText.textContent = `💙 Ми з України 💛`
  city.placeholder = `[Введіть місто]`
  name.placeholder = `[Введіть імʼя]` 
  getQuotes()
  showTime()
  showGreeting()
  stopAudio()
  playNum = 0
  if (btn.classList.contains('pause')) btn.classList.remove('pause')
  playListContainer.textContent = ''
  for (let i = 0; i < playList.length; i++) {
    const li = document.createElement('li')
    li.classList.add('play-item')
    li.textContent = language === 'ua' ? playListUa[i].title : playList[i].title; 
    playListContainer.append(li)
  }
})