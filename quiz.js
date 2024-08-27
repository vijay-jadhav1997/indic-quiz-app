import {overlayElement, startQuizPage, useLoacalStorage, quizData, quizTopic, levelBtnsContainer} from './script.js'
import {resultPage, calcAndDisplayResult} from './result.js'

// debugger
// console.log("quiz.js => Jay Shree Vitthal Rakhumai")


//! Selecting key DOM elements for user interaction:
// * 'quiz-start-page' DOM elements:
const maxScoreElement = document.querySelector('.max-score-board');
const startQuizBtn = document.querySelector('.start-now-btn');


// * 'quiz-page' DOM elements:
const quizPage = document.querySelector('.quiz-page');
const confirmFinishPopup = document.querySelector('.confirm-finish-popup');
const soundControlElement = document.querySelector('.volume-icons');
const subjectHeadingWrapper = document.querySelector('.subject-heading-wrapper');
const optionsContainer = document.querySelector('.options-container');
const questionElement = document.querySelector('.question');
const timeElement = document.querySelector('.question-time');
const questionNumber = document.querySelector('.question-num');
const nextBtn = document.querySelector('.next-btn');
const skipBtn = document.querySelector('.skip-btn');
const finishBtn = document.querySelector('.finish-btn');
const confirmFinishBtn = document.querySelector('.confirm-finish-btn');
const backBtn = document.querySelector('.back-to-quiz-btn');

// * 'result-page' DOM elements:
// export const resultPage = document.querySelector('.result-page');


//! Variables, State and data:
// let userMaxScore = 0
// let score = 0
// let quizTotalScore = 0
// let totalQuestions = 0
// let correctAnswered = 0
// let wrongAnswered = 0
// let currentMcqNumber = 0
// let currentLevelMCQArray = JSON.parse(window.localStorage.getItem('mcqQuestions')) || []
// let questionTimeInterval = 0
// let quizCompletionTime = 0
// let hasPaused = false
// let hasUserSelectedAnyOption = false

let score = 0
let userMaxScore = 0
let quizTotalScore = 0
let totalQuestions = 0
let correctAnswered = 0
let wrongAnswered = 0
let quizCompletionTime = 0

let currentLevelMCQArray = []

let currentMcqNumber = 0
let hasPaused = false
let questionTimeInterval = 0
let hasUserSelectedAnyOption = false


function Results() {
  this.userScore = 0
  this.userMaxScore = 0
  this.totalScore = 0
  this.totalQuestions = 0
  this.currentMcqNumber = 0
  this.correctAnswered = 0
  this.wrongAnswered = 0
  this.quizCompletionTime = 0
}





//! functions
//* function to start the quiz 
function startQuiz(mcqData, subject, level) {
  score = 0
  correctAnswered = 0
  wrongAnswered = 0
  questionTimeInterval = 0
  currentMcqNumber = 0
  quizCompletionTime = 0
  currentLevelMCQArray = mcqData
  totalQuestions = currentLevelMCQArray.length
  subjectHeadingWrapper.firstElementChild.innerText = subject
  subjectHeadingWrapper.lastElementChild.innerText = level

  // const levelResult = Results()

  // const localStorageTopicdata = useLoacalStorage(quizTopic)
  // console.log(localStorageTopicdata)

  nextQuestion(currentLevelMCQArray, currentMcqNumber)
  console.log("Start now => clicked")
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
  
  // calculate 'quizTotalScore'
  quizTotalScore = 0
  currentLevelMCQArray.forEach(question => {
    if (Object.keys(question.options).length > 2) {
      quizTotalScore = quizTotalScore + 2
    } else {
      quizTotalScore++ 
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
  calcAndDisplayResult()


  //* DOM manipulation of 'quiz-start-page'
  maxScoreElement.className = 'max-score-board hasMaxScore'
  maxScoreElement.innerText = `Your Highest Score: ${userMaxScore.toString().padStart(2, 0)}/${quizTotalScore.toString().padStart(2, 0)}`
}



//! Events
//* Event listener to toggle sound ON/OFF
soundControlElement.addEventListener('click', (e) => {
  e.stopPropagation()
  soundControlElement.classList.toggle('sound-off')
})


//* Event listener to start Quiz
levelBtnsContainer.addEventListener('click', (e) => {
  e.stopPropagation()
  if (e.target.tagName === "BUTTON") {
    // console.log(e.target.innerText)
    // console.log(quizData)
    // Object.entries(quizData?.levels)?.forEach(([level, mcqArray]) => {
    //   // console.log(level, mcqArray)
    //   if(level === e.target.innerText) return currentLevelMCQArray = mcqArray
    //   // console.log(currentLevelMCQArray)
    // })

    e.target.classList.toggle('selected')
    console.log(`${e.target.innerText} button clicked`)

  }
} )


//* Event listener to start Quiz
startQuizBtn.addEventListener('click', (e) => {
  e.stopPropagation()
  // startQuiz(questions)
  
  // console.log(currentLevelMCQArray)

  if (currentLevelMCQArray.length === 0) {
    [...levelBtnsContainer.children].forEach(button => {
      if (button.className === 'selected' || button.firstElementChild.className === 'current-level'){
        currentLevelMCQArray = quizData?.levels?.[button.innerText]
        startQuiz(currentLevelMCQArray, quizData?.topic, button.innerText)
        return
      }  
    })
  }

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
  nextQuestion(currentLevelMCQArray, currentMcqNumber)
})


//* Event listener to go on next question
skipBtn.addEventListener('click', (e) => {
  e.stopPropagation()
  // quizPage.className = "quiz-page"   //* so that style of page will get to be its original state
  // optionsContainer.className = 'options-container'
  
  clearInterval(questionTimeInterval)
  questionTimeInterval = 0
  nextQuestion(currentLevelMCQArray, currentMcqNumber)
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

// console.log(quizTopic, quizData)
