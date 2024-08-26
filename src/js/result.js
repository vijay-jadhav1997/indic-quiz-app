import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';

import {overlayElement, startQuizPage, useLocalStorage, quizData, quizTopic, prepareQuiz} from './script.js'
import {homepageElemenet} from './script.js'
// import {resultPage} from './quiz.js'

// console.log("result.js => Jay Shree Radhe Krushna")

//! Selecting key DOM elements for user interaction:
// * 'quiz-page' DOM elements:
export const quizPage = document.querySelector('.quiz-page');

// * 'result-page' DOM elements:
export const resultPage = document.querySelector('.result-page');
export const subjectResult = document.querySelector('.subject-result');
export const levelResult = document.querySelector('.level-result');
export const correctBarElement = document.querySelector('.result-bar .correct-bar');
export const incorrectBarElement = document.querySelector('.result-bar .incorrect-bar');
export const resultStatContainer = document.querySelector('.result-stats-container');
export const FeedbackMessageElement = document.querySelector('.feedback-message');
const backBtn = document.querySelector('.back-btn');
export const celebrationElem = document.querySelector('.celebration');
export const retryBtn = document.querySelector('.retry-btn');
const goToHomeBtn = document.querySelector('.go-to-home-btn');

export const resultStatisticElement = document.querySelector('.result-stats');
const result = document.querySelector('#result');
const downloadBtn = document.querySelector('.download');

// console.log(result)
//! functions
  function downloading(time){
    downloadBtn.classList.add('downloading')
    
    setTimeout(() => {
      downloadBtn.classList.remove('downloading')
    }, time)
  }


//! Events :
//* Event listener for back to the start-quiz-page :
backBtn.addEventListener('click', (e) => {
  e.stopPropagation()

  // console.log("Back-btn clicked")

  prepareQuiz(quizTopic)
  
  // startQuizPage.className = 'start-quiz-page inactive'
  resultPage.className = 'result-page inactive'
  // homepageElemenet.className = 'homepage inactive'
  // quizPage.className = 'quiz-page'
})

//* Event listener to retry the quiz again
goToHomeBtn.addEventListener('click', (e) => {
  e.stopPropagation()

  resultPage.className = 'result-page inactive'
  quizPage.className = 'quiz-page inactive'
  startQuizPage.className = 'start-quiz-page inactive'
  homepageElemenet.className = 'homepage'
  useLocalStorage('activePage', 'homepage')
})


//* 
resultStatContainer.firstElementChild.addEventListener('click', (e) => {
  e.stopPropagation()

  resultStatContainer.classList.toggle('open')
})


//* 
downloadBtn.addEventListener('click', (e) => {
  e.stopPropagation()

  console.log("Har Har Mahadev..")

  htmlToImage.toPng(result)
  .then(function(imageUrl) {
    const link = document.createElement('a')
    link.setAttribute('href', imageUrl)
    link.setAttribute('download', `${quizData?.topic} -score.png`)
    link.click()
    downloading(5000)
  })
  .catch(function (error) {
    console.error('oops, something went wrong!', error);
  });

})

