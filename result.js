import {overlayElement, startQuizPage, useLoacalStorage, quizData, quizTopic} from './script.js'
import {homepageElemenet} from './script.js'
// import {resultPage} from './quiz.js'

// console.log("result.js => Jay Shree Radhe Krushna")

//! Selecting key DOM elements for user interaction:

// * 'result-page' DOM elements:
export const resultPage = document.querySelector('.result-page');
const correctBarElement = document.querySelector('.result-bar .correct-bar');
const incorrectBarElement = document.querySelector('.result-bar .incorrect-bar');
const resultStatisticElement = document.querySelector('.result-stats');
const FeedbackMessageElement = document.querySelector('.feedback-message');
const retryBtn = document.querySelector('.retry-btn');
const goToHomeBtn = document.querySelector('.go-to-home-btn');




//! functions
//* final result stats calculation and DOM manipulation of 'result-page'
export function calcAndDisplayResult() {

  const correctPercentage = ((correctAnswered / totalQuestions) * 100).toFixed(2)
  const incorrectPercentage = ((wrongAnswered / totalQuestions) * 100).toFixed(2)
  const unattemptedPercentage = (((totalQuestions - correctAnswered - wrongAnswered)/totalQuestions) * 100).toFixed(2)

  incorrectBarElement.previousElementSibling.innerText = `unattempted: ${unattemptedPercentage}%`
  incorrectBarElement.firstElementChild.innerText = `incorrect: ${incorrectPercentage}%`
  correctBarElement.firstElementChild.innerText = `correct: ${correctPercentage}%`

  incorrectBarElement.style.maxWidth = `${parseFloat(incorrectPercentage) + parseFloat(correctPercentage)}%`
  correctBarElement.style.maxWidth = `${parseFloat(correctPercentage)}%`

  const timeInMinutes = (Math.floor(quizCompletionTime / 60)).toString().padStart(2, 0) // convert quiz completeion time which is in secs to minutes.

  resultStatisticElement.children[0].innerText = `Total Questions: ${totalQuestions.toString().padStart(2, 0)}`
  resultStatisticElement.children[1].innerText = `Correct: ${correctAnswered.toString().padStart(2, 0)}`
  resultStatisticElement.children[2].innerText = `Inorrect: ${wrongAnswered.toString().padStart(2, 0)}`
  resultStatisticElement.children[3].innerText = `Your Score: ${score.toString().padStart(2, 0)}/${totalScoreOfQuiz.toString().padStart(2, 0)}`
  resultStatisticElement.children[4].innerText = `Your Highest Score: ${userMaxScore.toString().padStart(2, 0)}/${totalScoreOfQuiz.toString().padStart(2, 0)}`
  resultStatisticElement.children[5].innerText = `Questions Not Attempted: ${(totalQuestions - correctAnswered - wrongAnswered).toString().padStart(2, 0)}`
  resultStatisticElement.children[6].innerText = `Your quiz completion time: ${parseInt(timeInMinutes) && timeInMinutes} mins & ${(quizCompletionTime % 60).toString().padStart(2, 0)} secs.`

  resultPage.classList.add('show-result')
}


//! Events :

//* Event listener to retry the quiz again
retryBtn.addEventListener('click', (e) => {
  e.stopPropagation()
  score = 0
  totalScoreOfQuiz = 0
  totalQuestions = 0
  correctAnswered = 0
  wrongAnswered = 0
  startQuiz(mcqDataArray)

  startQuizPage.className = 'start-quiz-page inactive'
  resultPage.className = 'result-page'
  quizPage.className = 'quiz-page'
})


//* Event listener to retry the quiz again
goToHomeBtn.addEventListener('click', (e) => {
  e.stopPropagation()


  resultPage.className = 'result-page'
  quizPage.className = 'quiz-page inactive'
  startQuizPage.className = 'start-quiz-page inactive'
  homepageElemenet.className = 'homepage'
  
})

