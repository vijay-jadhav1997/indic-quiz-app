// import questions, {multipleChoiceQuestions, soprtQuestions} from "./mcq_data.js"
import {api_key} from "./assets.js"
// import {startQuizPage} from "./quiz.js"


console.log("script.js => Jay Shree Seeta Ram")

//! Selecting key DOM elements for user interaction:
// * 'body' DOM elements:
export const overlayElement = document.querySelector('.overlay');
const notificationElement = document.querySelector('.notification-container');
const notificationCloseBtn = document.querySelector('.notification-close-btn');

// * 'homepage' DOM elements:
export const homepageElemenet = document.querySelector('.homepage');
const navBoxElemenet = document.querySelector('.nav-box');
const slideElements = document.querySelectorAll('.slide');
const flipcardElement = document.querySelector('.flipcard');

// * 'quiz-start-page' DOM elements:
export const startQuizPage = document.querySelector('.start-quiz-page');



// ! State and global Variables
export let quizData = {}
export let quizTopic = ''


const welcomeMessages = [
  "Welcome to the 'Indic Quiz'! Ready to play a new Quiz?",
  "Get ready for some fun! Welcome to 'Indic Quiz'!",
  "Welcome back, dear learner! Let's dive in!",
  "Namaste, learner! Ready to start your journey?",
  "Welcome to 'Indic Quiz'! Let's get started!",
  "Glad to see you! Ready for a new challenge?",
  "Namaste! 'Indo-Quiz' welcomes you. Prepare for a new Quiz challenge."
]



// ! DOM Manipulation



//! Handlers


//! Constructor function
function Quiz(topic, levels) {
  this.topic = topic,
  this.levels = levels,
  this.results = {}
}



//! function
//* function to get or set data to localStorage
export function useLoacalStorage(key, data='') {
  if(data === '') return JSON.parse(localStorage.getItem(key))
  
  localStorage.setItem(key, JSON.stringify(data))
  
  return `Your data is successfully stored in the localStorage as key '${key}'.`
}


//* function to prepare all the basic things to start the Quiz
async function prepareQuiz(topic){
  // check data in localStorage, if available assign it to 'quizData'
  // if not, then fetch specific topic data from api and assign it to 'quizData' and also set it to local storage for ferther use.
  // then open the 'startQuizPage' and hide the 'homePage'
  //* Basically do all the things to be get ready to start the quiz

  overlayElement.classList.add('open')
  try {
    quizData = useLoacalStorage(topic)
    if (!quizData) {
      const response = await fetch(`${api_key}/${topic}`)
  
      if (!response.ok) throw new Error('Please, check your network connection!')
  
      const data = await response.json()
      if (data) quizData = new Quiz(data?.topic, data?.levels)
      useLoacalStorage(topic, quizData)
    }
    
    

    if (Object.entries(quizData).length !== 0) {
      console.log(quizData)
      homepageElemenet.classList.add('inactive')
      startQuizPage.classList.remove('inactive')
      // overlayElement.classList.remove('open')

      console.log("Jay Shree Ram")
    }
    
  } 
  catch (error) {
    console.error('There has been a problem with your network connect:', error)
    alert("Oops! Something went wrong. Check your network connection. Please try again later!")
  }
  overlayElement.classList.remove('open')
}





//! Events :
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

    console.log(quizTopic)
    prepareQuiz(quizTopic)

  }
})




//* Event listener to show the welcome notification
notificationCloseBtn.addEventListener('click', (e) => {
  e.stopPropagation()

  notificationElement.classList.remove('open')
})



//! Timeout and Intervals :
//* setTimeout to show welcome notification
// setTimeout(() => {
//   notificationElement.classList.add('open')
  
//   const welcomeNotificationElem = notificationElement.firstElementChild.firstElementChild
//   welcomeNotificationElem.innerText = `${welcomeMessages[parseInt(Math.random()*6)]}`

//   setTimeout( e => {
//     notificationElement.classList.remove('open')
//   }, 30000)
  
// }, 1000)
// let counter = 0
// setInterval(() => {
//   if (counter < 4){
//     counter++
//   }else {
//     counter--
//   }
//   slideElements.forEach((slide, index) => {
//     slide.style.transform = `translateX(-${counter * 100}%)`
//     // console.log(counter * index * 100)
//   })
// }, 4000)





flipcardElement.addEventListener('click', (e) => {
  e.stopPropagation()
  flipcardElement.classList.toggle('flip')
  // console.log(flipcardElement)
})

