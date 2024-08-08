import {overlayElement} from './script.js'
import {calculateAndDisplayResult} from './result.js'


//! Selecting key DOM elements for user interaction:


// * 'quiz-start-page' DOM elements:
export const startQuizPage = document.querySelector('.start-quiz-page');
const maxScoreElement = document.querySelector('.max-score-board');
const startQuizBtn = document.querySelector('.start-now-btn');



// * 'quiz-page' DOM elements:
const quizPage = document.querySelector('.quiz-page');
const confirmFinishPopup = document.querySelector('.confirm-finish-popup');
const soundControlElement = document.querySelector('.volume-icons');
const optionsContainer = document.querySelector('.options-container');
const questionElement = document.querySelector('.question');
const timeElement = document.querySelector('.question-time');
const questionNumber = document.querySelector('.question-num');
const nextBtn = document.querySelector('.next-btn');
const skipBtn = document.querySelector('.skip-btn');
const finishBtn = document.querySelector('.finish-btn');
const confirmFinishBtn = document.querySelector('.confirm-finish-btn');
const backBtn = document.querySelector('.back-to-quiz-btn');




//! Variables, State and data:
// let userMaxScore = 0
// let score = 0
// let totalScoreOfQuiz = 0
// let totalQuestions = 0
// let correctAnswered = 0
// let wrongAnswered = 0
// let currentMcqNumber = 0
// let mcqDataArray = JSON.parse(window.localStorage.getItem('mcqQuestions')) || []
// let questionTimeInterval = 0
// let quizCompletionTime = 0
// let hasPaused = false
// let hasUserSelectedAnyOption = false

let userScore = 0
let userMaxScore = 0
let QuizTotalScore = 0
let totalQuestions = 0
let correctAnswered = 0
let wrongAnswered = 0
let quizCompletionTime = 0

let mcqDataArray = []

let currentMcqNumber = 0
let hasPaused = false
let questionTimeInterval = 0
let hasUserSelectedAnyOption = false






//! functions
//* function to start the quiz 
function startQuiz(quizData) {
  score = 0
  correctAnswered = 0
  wrongAnswered = 0
  questionTimeInterval = 0
  currentMcqNumber = 0
  quizCompletionTime = 0
  mcqDataArray = quizData
  totalQuestions = mcqDataArray.length
  nextQuestion(mcqDataArray, currentMcqNumber)
}


//* function to get next question 
function nextQuestion(data, mcqNum) {
  currentMcqNumber++
  questionNumber.innerText = `${currentMcqNumber.toString().padStart(2, 0)}/${totalQuestions.toString().padStart(2, 0)}` 
  questionElement.innerText = `${data[mcqNum]?.question}`
  timeElement.innerText = `00:30`
  hasUserSelectedAnyOption = false //* Now user can select any option.
  nextBtn.setAttribute('disabled', '')  
  skipBtn.removeAttribute('disabled')


  const previousTotalOptions = optionsContainer.children.length
  for(let i = 0; i < previousTotalOptions; i++ ){
    optionsContainer?.firstElementChild?.remove()
  }
  for(const key in data[mcqNum]?.options) {
    createOptionElement(data[mcqNum]?.options[key], key)
  }
  
  if(questionTimeInterval === 0){
    let count = `${30}`
    questionTimeInterval = setInterval((e) => {
      //* This time interval will show the available time to solve the question 

      if (!hasPaused) {
        count--
        quizCompletionTime++
      }

      // 

      
      timeElement.innerText = `00:${count.toString().padStart(2, 0)}`
      if(count === 15) {
        quizPage.className = "quiz-page yellow-zone"
      }
      else if(count === 5) {
        quizPage.className = "quiz-page red-zone"
        currentMcqNumber === totalQuestions && finishBtn.removeAttribute('disabled')
      }
      else if(count === 0) {
        nextBtn.removeAttribute('disabled')
        skipBtn.setAttribute('disabled', '')
        optionsContainer.classList.add('no-selection')
        hasUserSelectedAnyOption = true //* Now user can't select any option for this question if user try to so.
        clearInterval(questionTimeInterval)
        questionTimeInterval = 0
      }
    }, 1000)
  }

  if(currentMcqNumber === totalQuestions){
    skipBtn.setAttribute('disabled', '')

    nextBtn.className = 'next-btn hidden'
    skipBtn.className = 'skip-btn hidden'
    finishBtn.innerText = 'Submit QUIZ'
    finishBtn.setAttribute('disabled', '')
  }
}


//* function to create 'option' elements 
function createOptionElement(option, index) {
  // optionsContainer.firstElementChild.remove()
  const optionBoxElement = document.createElement('div');
  optionBoxElement.className = 'option-box'
  
  const optionElement = document.createElement('p');
  optionElement.innerText = `${option}`;
  optionBoxElement.appendChild(optionElement);

  const youChose = document.createElement('span');
  youChose.className = 'user-chose'
  youChose.innerText = 'You chose';
  optionBoxElement.appendChild(youChose);
  
  if(index === "opt5") {
    const correctIcon = document.createElement('span');
    correctIcon.className = 'correct-icon'
    correctIcon.innerHTML = '&checkmark;';
    optionBoxElement.classList.add('correct')
    optionBoxElement.appendChild(correctIcon);
  } 
  else {
    const wrongIcon = document.createElement('span');
    wrongIcon.className = 'wrong-icon'
    wrongIcon.innerHTML = '&times;';
    optionBoxElement.appendChild(wrongIcon);
  } 

  optionsContainer.appendChild(optionBoxElement)

}



//! Handlers
function handleQuizFinish (e) {
  e.stopPropagation()

  clearInterval(questionTimeInterval)
  hasPaused = false
  
  // calculate 'totalScoreOfQuiz'
  totalScoreOfQuiz = 0
  mcqDataArray.forEach(question => {
    if (Object.keys(question.options).length > 2) {
      totalScoreOfQuiz = totalScoreOfQuiz + 2
    } else {
      totalScoreOfQuiz++ 
    }
  })

  // update 'userMaxScore'
  if(userMaxScore < score) {
    userMaxScore = score 
  }

  //* DOM manipulation of 'quiz-page'
  quizPage.className = "quiz-page inactive"   //* so that style of page will get to be its original state
  optionsContainer.className = 'options-container'
  finishBtn.innerText = 'Finish'
  nextBtn.classList.remove('hidden')
  overlayElement.classList.remove('open')
  confirmFinishPopup.classList.add('closed')
  skipBtn.removeAttribute('disabled')
  skipBtn.classList.remove('hidden')
  
  
  //* result stats calculation and DOM manipulation of 'result-page'
  calculateAndDisplayResult()


  //* DOM manipulation of 'quiz-start-page'
  maxScoreElement.className = 'max-score-board hasMaxScore'
  maxScoreElement.innerText = `Your Highest Score: ${userMaxScore.toString().padStart(2, 0)}/${totalScoreOfQuiz.toString().padStart(2, 0)}`
}



//! Events
//* Event listener to toggle sound ON/OFF
soundControlElement.addEventListener('click', (e) => {
  e.stopPropagation()
  soundControlElement.classList.toggle('sound-off')
})


//* Event listener to start Quiz
startQuizBtn.addEventListener('click', (e) => {
  e.stopPropagation()
  // startQuiz(questions)
  startQuiz(mcqDataArray)
  startQuizPage.className = 'start-quiz-page inactive'
  quizPage.className = 'quiz-page'
  
})


//* Event listener to select option
optionsContainer.addEventListener('click', function(e) {
  e.stopPropagation()
  if (hasUserSelectedAnyOption || (e.target.className !== 'option-box') && (e.target.className !== 'option-box correct')) {
    return
  }
  
  optionsContainer.classList.add('user-selection')

  if (e.target.className === 'option-box correct') {
    e.target.classList.add('user-selected-option')

    correctAnswered ++
    if(optionsContainer.children.length > 2) {
      score = score + 2
    }
    else {
      score++
    }
  }
  else {
    e.target.classList.add('incorrect')
    wrongAnswered++
  }

  skipBtn.setAttribute('disabled', '')
  nextBtn.removeAttribute('disabled')
  hasUserSelectedAnyOption = true //* Now user can't select any other option for this question if user try to do so.
  clearInterval(questionTimeInterval)
  questionTimeInterval = 0
  currentMcqNumber === totalQuestions && finishBtn.removeAttribute('disabled')
})


//* Event listener to go on next question
nextBtn.addEventListener('click', (e) => {
  e.stopPropagation()
  quizPage.className = "quiz-page"   //* so that style of page will get to be its original state
  optionsContainer.className = 'options-container'
  
  questionTimeInterval = 0
  nextQuestion(mcqDataArray, currentMcqNumber)
})


//* Event listener to go on next question
skipBtn.addEventListener('click', (e) => {
  e.stopPropagation()
  // quizPage.className = "quiz-page"   //* so that style of page will get to be its original state
  // optionsContainer.className = 'options-container'
  
  clearInterval(questionTimeInterval)
  questionTimeInterval = 0
  nextQuestion(mcqDataArray, currentMcqNumber)
})


//* Event listener to popup the 'confirm-finish-popup' element
finishBtn.addEventListener('click', e => {
  e.stopPropagation()

  if(currentMcqNumber === totalQuestions) {
    confirmFinishBtn.innerText = 'Submit QUIZ'
    confirmFinishPopup.firstElementChild.innerText = "Submit your answers to complete the quiz?"
  }
  else {
    confirmFinishPopup.firstElementChild.innerText = "Are you sure you want to finish the quiz now?"
    confirmFinishBtn.innerText = 'Finish'
  }
  
  overlayElement.classList.add('open')
  confirmFinishPopup.classList.remove('closed')
  hasPaused = true
})


//* Event listener confirming to finish the current Quiz and return to 'start quiz page'
confirmFinishBtn.addEventListener('click', handleQuizFinish)


//* Event listener to return back to the current quiz
backBtn.addEventListener('click', e => {
  e.stopPropagation()
  overlayElement.classList.remove('open')
  confirmFinishPopup.classList.add('closed')
  hasPaused = false
})

