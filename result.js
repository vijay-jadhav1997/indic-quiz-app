import {overlayElement, startQuizPage, useLoacalStorage, quizData, quizTopic} from './script.js'
import {homepageElemenet} from './script.js'
// import {resultPage} from './quiz.js'

// console.log("result.js => Jay Shree Radhe Krushna")

//! Selecting key DOM elements for user interaction:
// * 'quiz-page' DOM elements:
export const quizPage = document.querySelector('.quiz-page');

// * 'result-page' DOM elements:
export const resultPage = document.querySelector('.result-page');
export const levelResult = document.querySelector('.level-result');
export const correctBarElement = document.querySelector('.result-bar .correct-bar');
export const incorrectBarElement = document.querySelector('.result-bar .incorrect-bar');
export const resultStatisticElement = document.querySelector('.result-stats');
export const FeedbackMessageElement = document.querySelector('.feedback-message');
export const retryBtn = document.querySelector('.retry-btn');
const goToHomeBtn = document.querySelector('.go-to-home-btn');



//! functions


//! Events :
//* Event listener to retry the quiz again
goToHomeBtn.addEventListener('click', (e) => {
  e.stopPropagation()


  resultPage.className = 'result-page inactive'
  quizPage.className = 'quiz-page inactive'
  startQuizPage.className = 'start-quiz-page inactive'
  homepageElemenet.className = 'homepage'
  
})

