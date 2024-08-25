import {overlayElement, startQuizPage, useLocalStorage, quizData, quizTopic, levelBtnsContainer, setMaxScore, homepageElemenet, prepareQuiz, } from './script.js'
import {correctBarElement, incorrectBarElement, levelResult, quizPage, resultPage, resultStatisticElement, retryBtn, subjectResult} from "./result.js"

// debugger
// console.log("quiz.js => Jay Shree Vitthal Rakhumai")


//! Selecting key DOM elements for user interaction:
// * 'quiz-start-page' DOM elements:
// const maxScoreElement = document.querySelector('.max-score-board');
const startQuizBtn = document.querySelector('.start-now-btn');


// * 'quiz-page' DOM elements:
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
const backToQuizBtn = document.querySelector('.back-to-quiz-btn');

// * 'result-page' DOM elements:


// //! Variables
let activeLevel = useLocalStorage('activeLevel') || 'level1'
let currentLevelMCQArray = quizData?.levels?.[activeLevel] || []

const activeLevelResultData = quizData?.results?.[activeLevel]

let score = activeLevelResultData?.userScore || 0
let userMaxScore = activeLevelResultData?.userMaxScore || 0
let quizTotalScore = activeLevelResultData?.totalScore || 0
let totalQuestions = activeLevelResultData?.totalQuestions || 0
let correctAnswered = activeLevelResultData?.correctAnswered || 0
let wrongAnswered = activeLevelResultData?.wrongAnswered || 0
let quizCompletionTime = activeLevelResultData?.quizCompletionTime || 0
let currentMcqNumber = activeLevelResultData?.currentMcqNumber || 0

let hasPaused = false
let questionTimeInterval = 0
let hasUserSelectedAnyOption = false

// console.log("quizTopic",quizTopic)
// console.log("quizData", quizData)
// console.log("activeLevel", activeLevel)
// console.log('currentLevelMCQArray', currentLevelMCQArray)
// console.log('activeLevelResultData', activeLevelResultData)
// console.log('correctAnswered', correctAnswered)
// console.log('totalQuestions', totalQuestions)
// console.log('score', score)
// console.log('userMaxScore', userMaxScore)
// console.log('quizTotalScore', quizTotalScore)
// console.log('wrongAnswered', wrongAnswered)
// console.log('currentMcqNumber', currentMcqNumber)
// console.log('quizCompletionTime', quizCompletionTime)


//! State and data:

document.addEventListener('DOMContentLoaded', e => {
  e.stopPropagation()
  // console.log("Jay Shree Ram")
  const activePage = useLocalStorage('activePage') || 'homepage'
  if (activePage) {
    [...document.body.children].forEach(elm => {
      if(elm.className.startsWith(activePage)) {
        elm.className = activePage
        // console.log(elm.className)
      }
      else if (elm.className.includes('page')){
        elm.classList.remove('inactive')
        elm.classList.add('inactive')
        // console.log(elm.className)
      }
      else {
        // console.log(elm.className)
      }
    })
  }

  switch (activePage) {
    case 'start-quiz-page':
      prepareQuiz(quizTopic)
      break;

    case 'quiz-page':
      nextQuestion(currentLevelMCQArray, currentMcqNumber, activeLevel)
      subjectHeadingWrapper.firstElementChild.innerText = quizData?.topic
      subjectHeadingWrapper.lastElementChild.innerText = activeLevel
      break;

    case 'result-page':
      calcAndDisplayResult()
      break;
  
    default:
      break;
  }


  // if(activePage === 'start-quiz-page') {
  //   prepareQuiz(quizTopic)
  // }

  // if(activePage === 'quiz-page') {
  //   nextQuestion(currentLevelMCQArray, currentMcqNumber, activeLevel)
  // }
  // else if (activePage === 'result-page') {
    
  // }
})



//! functions
//* function that starts the quiz 
function startQuiz(mcqData, subject, level) {
  score = 0
  correctAnswered = 0
  wrongAnswered = 0
  questionTimeInterval = 0
  currentMcqNumber = 1
  quizCompletionTime = 0
  currentLevelMCQArray = mcqData
  activeLevel = level
  totalQuestions = currentLevelMCQArray.length
  userMaxScore = quizData?.results?.[level]?.userMaxScore
  subjectHeadingWrapper.firstElementChild.innerText = subject
  subjectHeadingWrapper.lastElementChild.innerText = level

  useLocalStorage( 'activeLevel', activeLevel)

  nextQuestion(currentLevelMCQArray, currentMcqNumber, level)
}


//* function to get next question 
function nextQuestion(data, mcqNum, level) {
  questionNumber.innerText = `${currentMcqNumber.toString().padStart(2, 0)}/${totalQuestions.toString().padStart(2, 0)}` 
  questionElement.innerText = `${data[mcqNum]?.question}`
  timeElement.innerText = `00:${30}`
  hasUserSelectedAnyOption = false //* Now user can select any option.
  nextBtn.setAttribute('disabled', '')  
  skipBtn.removeAttribute('disabled')


  // remove last options of last question
  const previousTotalOptions = optionsContainer.children.length
  for(let i = 0; i < previousTotalOptions; i++ ){
    optionsContainer?.firstElementChild?.remove()
  }
  for(const key in data[mcqNum]?.options) {
    createOptionElement(data[mcqNum]?.options[key], key)
  }
  
  // time interval (countdown) to select the option
  if(questionTimeInterval === 0){
    let count = `${30}`
    questionTimeInterval = setInterval((e) => {
      //* This time interval will show the available time to solve the question 

      if (!hasPaused) {
        count--
        quizCompletionTime++
      }

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

  // DOM manipulation for last question 
  if(currentMcqNumber === totalQuestions){
    skipBtn.setAttribute('disabled', '')

    nextBtn.className = 'next-btn hidden'
    skipBtn.className = 'skip-btn hidden'
    finishBtn.innerText = 'Submit QUIZ'
    finishBtn.setAttribute('disabled', '')
  }

  
  const updatedLevelResult = getUpdatedLevelResult(quizTopic, level)

  useLocalStorage(quizTopic, updatedLevelResult)


  // console.log("quizTopic",quizTopic)
  // console.log("quizData", quizData)
  // console.log("activeLevel", activeLevel)
  // console.log('currentLevelMCQArray', currentLevelMCQArray)
  // console.log('activeLevelResultData', activeLevelResultData)
  // console.log('correctAnswered', correctAnswered)
  // console.log('totalQuestions', totalQuestions)
  // console.log('score', score)
  // console.log('userMaxScore', userMaxScore)
  // console.log('quizTotalScore', quizTotalScore)
  // console.log('wrongAnswered', wrongAnswered)
  // console.log('currentMcqNumber', currentMcqNumber)
  // console.log('quizCompletionTime', quizCompletionTime)
    
}

//* function to get updated level result
function getUpdatedLevelResult(subject, level, isCompleted=false) {
  const prevData = useLocalStorage(subject)

  // update isCurrentLevel if current level changes
  const isCurrentLevel = Object.entries(prevData?.results).every(([key, value]) => {
    if (key === level && (isCompleted || prevData?.results[level]?.isCompleted)) return false
    return true
  })
  
  prevData.results[level] = {
    userScore : score,
    userMaxScore : userMaxScore,
    totalScore : quizTotalScore,
    totalQuestions : totalQuestions,
    currentMcqNumber : currentMcqNumber,
    correctAnswered : correctAnswered,
    wrongAnswered : wrongAnswered,
    quizCompletionTime : quizCompletionTime,
    isCompleted : prevData?.results[level]?.isCompleted || isCompleted,
    isCurrentLevel : isCurrentLevel
  }

  return prevData
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


//* function final result stats calculation and DOM manipulation of 'result-page'
function calcAndDisplayResult() {

  const correctPercentage = ((correctAnswered / totalQuestions) * 100).toFixed(2)
  const incorrectPercentage = ((wrongAnswered / totalQuestions) * 100).toFixed(2)
  const unattemptedPercentage = (((totalQuestions - correctAnswered - wrongAnswered)/totalQuestions) * 100).toFixed(2)

  subjectResult.innerText = quizData?.topic
  levelResult.innerText = `${activeLevel} - Result`

  incorrectBarElement.previousElementSibling.innerText = `unattempted: ${unattemptedPercentage}%`
  incorrectBarElement.firstElementChild.innerText = `incorrect: ${incorrectPercentage}%`
  correctBarElement.firstElementChild.innerText = `correct: ${correctPercentage}%`

  incorrectBarElement.style.maxWidth = `${parseFloat(incorrectPercentage) + parseFloat(correctPercentage)}%`
  correctBarElement.style.maxWidth = `${parseFloat(correctPercentage)}%`

  const timeInMinutes = (Math.floor(quizCompletionTime / 60)).toString().padStart(2, 0) // convert quiz completeion time which is in secs to minutes.

  let correct = 0
  let incorrect = 0
  const intervalId = setInterval(() => {
    if(correct < parseInt(correctPercentage)) correct++
    
    if(incorrect < parseInt(incorrectPercentage)) incorrect++
    
    if(correct >= parseInt(correctPercentage) && incorrect >= parseInt(incorrectPercentage)) {
      clearInterval(intervalId)
      // console.log("Jay Shree Ram")
    }
    
    document.querySelector('.correct-progress-bar').style.setProperty("--correct-after-content", `"Correct ${correct.toString().padStart(2, 0)}%"`)
    document.querySelector('.incorrect-progress-bar').style.setProperty("--incorrect-after-content", `"Incorrect ${incorrect.toString().padStart(2, 0)}%"`)

    const correctAngle = correct * 3.6
    const incorrectAngle = (correct + incorrect) * 3.6
    document.querySelector('.pi-chart').style.backgroundImage = `conic-gradient(#13d32f ${correctAngle}deg, #e61010 ${correctAngle}deg ${incorrectAngle}deg, #daa520 ${incorrectAngle}deg)`
  }, 25)
  
  document.querySelector('#CorrectBar').style.setProperty("--correct-dash-off", `${440 * (1 - (correctPercentage/100))}`)
  document.querySelector('#IncorrectBar').style.setProperty("--incorrect-dash-off", `${440 * (1 - (incorrectPercentage/100))}`)
  
  const piChartDetailsChildren = document.querySelector('.pi-chart .details').children
  piChartDetailsChildren[0].innerText = `total: ${totalQuestions.toString().padStart(2, 0)}`
  piChartDetailsChildren[1].innerText = `correct: ${correctAnswered.toString().padStart(2, 0)}`
  piChartDetailsChildren[2].innerText = `incorrect: ${wrongAnswered.toString().padStart(2, 0)}`
  piChartDetailsChildren[3].innerText = `unattempted: ${(totalQuestions - correctAnswered - wrongAnswered).toString().padStart(2, 0)}`
  
  
  resultStatisticElement.children[0].innerText = `Total Questions: ${totalQuestions.toString().padStart(2, 0)}`
  resultStatisticElement.children[1].innerText = `Correct: ${correctAnswered.toString().padStart(2, 0)}`
  resultStatisticElement.children[2].innerText = `Inorrect: ${wrongAnswered.toString().padStart(2, 0)}`
  resultStatisticElement.children[3].innerText = `Your Score: ${score.toString().padStart(2, 0)}/${quizTotalScore.toString().padStart(2, 0)}`
  resultStatisticElement.children[4].innerText = `Your Highest Score: ${userMaxScore.toString().padStart(2, 0)}/${quizTotalScore.toString().padStart(2, 0)}`
  resultStatisticElement.children[5].innerText = `Questions Not Attempted: ${(totalQuestions - correctAnswered - wrongAnswered).toString().padStart(2, 0)}`
  resultStatisticElement.children[6].innerText = `Your quiz completion time: ${parseInt(timeInMinutes) && timeInMinutes} mins & ${(quizCompletionTime % 60).toString().padStart(2, 0)} secs.`

  resultPage.classList.remove('inactive')
  useLocalStorage('activePage', 'result-page')


  const isCompleted = correctPercentage > 33 ? true : false
  let updatedLevelResult = getUpdatedLevelResult(quizTopic, activeLevel, isCompleted)
  Object.entries(updatedLevelResult.results).every(([key, value]) => {
    // console.log(key, value)
    if (!value?.isCompleted) {
      updatedLevelResult.results[key].isCurrentLevel = true
      return false
    }
    return true
  })
  setMaxScore(updatedLevelResult.results) // update userMaxScore data on 'quiz-start-page'
  useLocalStorage(quizTopic, updatedLevelResult) // update localStorage data for key => 'quizTopic'
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
}



//! Events
//* Event listener to toggle sound ON/OFF
soundControlElement.addEventListener('click', (e) => {
  e.stopPropagation()
  soundControlElement.classList.toggle('sound-off')
})


//* Event listener to return back to the current quiz
backToQuizBtn.addEventListener('click', e => {
  e.stopPropagation()
  overlayElement.classList.remove('open')
  confirmFinishPopup.classList.add('closed')
  hasPaused = false
})



//* Event listener to start Quiz
levelBtnsContainer.addEventListener('click', (e) => {
  e.stopPropagation()
  const levelButtons = [...levelBtnsContainer.children]
  levelButtons.forEach(button => {
    if(button !== e.target) button.classList.remove('selected')
  })
  if (e.target.tagName === "BUTTON") {
    e.target.classList.toggle('selected')
    // console.log(`${e.target.innerText} button clicked`)
  }
} )


//* Event listener to start Quiz
startQuizBtn.addEventListener('click', (e) => {
  e.stopPropagation()

  // console.log("currentLevelMCQArray => ", currentLevelMCQArray)
  // if (currentLevelMCQArray.length === 0) {
  const levelBtns = [...levelBtnsContainer.children]
  levelBtns.every((button, index) => {
    const selectedLevel = button.textContent.replaceAll('✓', '').replaceAll(' ', '')
    if (button.className === 'selected' || button.firstElementChild.className === 'current-level' || (levelBtns.length === index + 1)) {
      currentLevelMCQArray = quizData?.levels?.[selectedLevel]
      startQuiz(currentLevelMCQArray, quizData?.topic, selectedLevel)
      return 
    }  
    return true
  })

  startQuizPage.className = 'start-quiz-page inactive'
  quizPage.className = 'quiz-page'
  useLocalStorage('activePage', 'quiz-page')
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
  const currentLevel = subjectHeadingWrapper.lastElementChild.innerText
  
  currentMcqNumber++
  nextQuestion(currentLevelMCQArray, currentMcqNumber, currentLevel)
})


//* Event listener to go on next question
skipBtn.addEventListener('click', (e) => {
  e.stopPropagation()
  quizPage.className = "quiz-page"   //* so that style of page will get to be its original state

  
  clearInterval(questionTimeInterval)
  questionTimeInterval = 0
  const currentLevel = subjectHeadingWrapper.lastElementChild.innerText
  currentMcqNumber++
  nextQuestion(currentLevelMCQArray, currentMcqNumber, currentLevel)
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


//* Event listener to retry the quiz again
retryBtn.addEventListener('click', (e) => {
  e.stopPropagation()
  score = 0
  quizTotalScore = 0
  totalQuestions = 0
  correctAnswered = 0
  wrongAnswered = 0
  startQuiz(currentLevelMCQArray, quizData?.topic, activeLevel)

  startQuizPage.className = 'start-quiz-page inactive'
  resultPage.className = 'result-page inactive'
  homepageElemenet.className = 'homepage inactive'
  quizPage.className = 'quiz-page'
  useLocalStorage('activePage', 'quiz-page')
})



