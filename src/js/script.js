import {API_KEY} from "../../assets.js"


//! Selecting key DOM elements for user interaction:
// * 'body' DOM elements:
export const overlayElement = document.querySelector('.overlay');
const notificationElement = document.querySelector('.notification-container');
const notificationCloseBtn = document.querySelector('.notification-close-btn');

// * 'homepage' DOM elements:
export const homepageElemenet = document.querySelector('.homepage');
const navBoxElemenet = document.querySelector('.nav-box');
const humbergerMenu = document.querySelector('.humberger-menu');
const slideElements = document.querySelectorAll('.slide');
const flipcardElement = document.querySelector('.flipcard');
const flipBtn = document.querySelector('.flip-the-card');
const bubblesWrapperElement = document.querySelector('.bubbles-wrapper');

// * 'quiz-start-page' DOM elements:
export const startQuizPage = document.querySelector('.start-quiz-page');
export const levelBtnsContainer = document.querySelector('.level-btns-container');
export const maxScoreElement = document.querySelector('.max-score-board');
export const backToHomeBtn = document.querySelector('.back-to-home-btn');


// ! State and global Variables
export let quizTopic = useLocalStorage('quizTopic') || ''
export let quizData = useLocalStorage(quizTopic) || {}


const welcomeMessages = [
  "Welcome to the 'Indic Quiz'! Ready to play a new Quiz?",
  "Get ready for some fun! Welcome to 'Indic Quiz'!",
  "Welcome back, dear learner! Let's dive in!",
  "Namaste, learner! Ready to start your journey?",
  "Welcome to 'Indic Quiz'! Let's get started!",
  "Glad to see you! Ready for a new challenge?",
  "Namaste! 'Indo-Quiz' welcomes you. Prepare for a new Quiz challenge."
]




//! Constructor function
function Quiz(topic, levels) {
  this.topic = topic,
  this.levels = levels,
  this.results = createResults(Object.keys(levels))
}

// function to create dummy result data
function createResults(levels) {
  
  return levels.reduce((acc, curr, index) => {
   const level = {
      userScore : 0,
      userMaxScore : 0,
      totalScore : 0,
      totalQuestions : 0,
      currentMcqNumber : 0,
      correctAnswered : 0,
      wrongAnswered : 0,
      quizCompletionTime : 0,
      isCompleted : false,
      isCurrentLevel : index === 0 ? true : false
    }

    return {...acc, [curr]: level}
  }, {})
}



//! function
//* function to get or set data to localStorage
export function useLocalStorage(key, data='') {
  if(data === '') return JSON.parse(localStorage.getItem(key))
  
  localStorage.setItem(key, JSON.stringify(data))
  // return `Your data is successfully stored in the localStorage as key '${key}'.`
}


//* function to prepare all the basic things to start the Quiz
export async function prepareQuiz(topic){
  // check data in localStorage, if available assign it to 'quizData'
  // if not, then fetch specific topic data from api and assign it to 'quizData' and also set it to local storage for ferther use.
  // then open the 'startQuizPage' and hide the 'homePage'
  //* Basically do all the things to be get ready to start the quiz

  
  overlayElement.classList.add('open') // Shimmer effect start
  overlayElement.innerHTML = `<div class='loading'></div>`
  try {
    quizData = useLocalStorage(topic)
    // console.log(quizData)
    if (!quizData) {
      // console.log(API_KEY)
      const response = await fetch(`${API_KEY}/${topic}`)
  
      if (!response.ok) throw new Error('Please, check your network connection!')
  
      const data = await response.json()

      if (data) {
        quizData = new Quiz(data?.topic, data?.levels)
  
        useLocalStorage(topic, quizData)
      }
    }
    
    // check for quizData shouldn't be empty before moving to 'startQuiz' page
    if (Object.entries(quizData).length !== 0) {
      createLevelBtns(quizData)
      setMaxScore(quizData.results)
      homepageElemenet.classList.add('inactive')
      startQuizPage.classList.remove('inactive')
      useLocalStorage('activePage', 'start-quiz-page')
    }
  } 
  catch (error) {
    console.error('There has been a problem with your network connect:', error)
    alert("Oops! Something went wrong. Check your network connection. Please try again later!")
  }

  overlayElement.classList.remove('open') // Shimmer effect end
  overlayElement.innerHTML = ``
}


//* function to create level buttons
function createLevelBtns(quiz) {
  const prevTotalLevelBtns = levelBtnsContainer.children.length
  for(let i = 0; i < prevTotalLevelBtns; i++ ){
    levelBtnsContainer?.firstElementChild?.remove()
  }

  const results = Object.entries(quiz?.results)

    results.forEach(([level, result]) => {
      const button = document.createElement('button')
      if(result?.isCompleted) {
        button.innerHTML = `${level} <i class="completed">&check;</i>`
      } else if(result?.isCurrentLevel) {
        button.innerHTML = `${level} <i class="current-level"></i>`
      } else {
        button.setAttribute('disabled', '')
        button.innerHTML = `${level} <i class="lock-icon">&#x1F512;</i>`
      }
      levelBtnsContainer.appendChild(button)
      // console.log(result)
    })

}


//* function to set userMaxScore on maxScoreElement
export function setMaxScore(data) {
  let maxScore = ''
  Object.entries(data).reduce((acc, [key, value]) => {
    let maxPercentage = (value.userMaxScore/value.totalScore) * 100
    if (acc <= maxPercentage) {
      acc = maxPercentage
      maxScore = `Your Highest Score (${key}): ${value.userMaxScore.toString().padStart(2, 0)}/${value.totalScore.toString().padStart(2, 0)}`
    }
    return acc
  }, 0)

  if(maxScore){
    maxScoreElement.className = 'max-score-board hasMaxScore'
    maxScoreElement.innerText = `${maxScore}`
  }
  // console.log(maxScore, data)
}


//! Events :
//* Event listener to 
humbergerMenu.addEventListener('click', (e) => {
  e.stopPropagation()
  e.preventDefault()

  // console.log(e.target.tagName, e.target.className)
  humbergerMenu.classList.toggle('close')
  navBoxElemenet.classList.toggle('open')
})


//* Event listener to 
navBoxElemenet.addEventListener('click', (e) => {
  e.stopPropagation()
  e.preventDefault()

  // console.log(e.target.tagName, e.target.className)
  if ((e.target.tagName === "A") && e.target.className === "sub-topic") {

    quizTopic = e.target.innerText.toLowerCase()
    if (quizTopic.includes(' '))  quizTopic = quizTopic.replaceAll(" ", "_")

    if (quizTopic.includes('_&_')) quizTopic = quizTopic.replaceAll('_&_', '_')
   
    // console.log(e.target.tagName, e.target.className, quizTopic)

    // console.log(quizTopic)
    prepareQuiz(quizTopic)
    useLocalStorage('quizTopic', quizTopic)  // save quizTopic to the localStorage
    navBoxElemenet.classList.toggle('open')
    humbergerMenu.classList.toggle('close')
  }
})




//* Event listener to close the welcome notification
notificationCloseBtn.addEventListener('click', (e) => {
  e.stopPropagation()

  notificationElement.classList.remove('open')
})


//* Event listener to retry the quiz again
backToHomeBtn.addEventListener('click', (e) => {
  e.stopPropagation()
  startQuizPage.className = 'start-quiz-page inactive'
  maxScoreElement.className = 'max-score-board'
  homepageElemenet.className = 'homepage'
  useLocalStorage('activePage', 'homepage')
})


//* Event listener to flip the flipcard
flipBtn.addEventListener('click', (e) => {
  e.stopPropagation()
  flipcardElement.classList.toggle('flip')
  // console.log(flipcardElement)
})




//! Timeout and Intervals :
//* setTimeout to show welcome notification
setTimeout(() => {
  notificationElement.classList.add('open')
  
  const welcomeNotificationElem = notificationElement.firstElementChild.firstElementChild
  welcomeNotificationElem.innerText = `${welcomeMessages[parseInt(Math.random()*6)]}`

  setTimeout( e => {
    notificationElement.classList.remove('open')
    bubblesWrapperElement.classList.add('inactive')
    // console.log("Jay Shree Ram Krushna Hari")
  }, 30000)
  
}, 1000)


// let counter = 0
// setInterval(() => {
//   if (counter < 4){
//     counter++
//   }else {
//     counter--
//   }
//   slideElements.forEach((slide, index) => {
//     slide.style.transform = `translateX(-${counter * 100}%)`
//     console.log(counter * index * 100)
//   })
// }, 4000)




