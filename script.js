import questions, {multipleChoiceQuestions} from "./mcq_data.js"
// console.dir(multipleChoiceQuestions)

//! Selection
const overlayElement = document.querySelector('.overlay');
const startQuizPage = document.querySelector('.start-quiz-page');
const maxScoreElement = document.querySelector('.max-score-board');
const startQuizBtn = document.querySelector('.start-now-btn');
const quizPage = document.querySelector('.quiz-page');
const confirmFinishPopup = document.querySelector('.confirm-finish-popup');
const soundControlElement = document.querySelector('.volume-icons');
const optionsContainer = document.querySelector('.options-container');
const questionElement = document.querySelector('.question');
const timeElement = document.querySelector('.question-time');
const questionNumber = document.querySelector('.question-num');
const nextBtn = document.querySelector('.next-btn');
const finishBtn = document.querySelector('.finish-btn');
const confirmFinishBtn = document.querySelector('.confirm-finish-btn');
const backBtn = document.querySelector('.back-to-quiz-btn');

// alert(overlayElement)


//! State and data:
let userMaxScore = 0
let score = 0
let wrongAnswered = 0
let currentMcqNumber = 0
let mcqDataArray = []
let questionTimeInterval = 0
let hasPaused = false
let hasUserSelectedAnyOption = false



// ! DOM Manipulation
// maxScoreElement.innerText = `Your Highest Score: ${userMaxScore < 10 ? '0' + userMaxScore : userMaxScore}/25`


// console.log('Jay Hari')

//! Handlers
function handleQuizFinish (e) {
  e.stopPropagation()
  // console.log(e)

  clearInterval(questionTimeInterval)
  quizPage.className = "quiz-page inactive"   //* so that style of page will get to be its original state
  optionsContainer.className = 'options-container'
  startQuizPage.className = 'start-quiz-page'
  nextBtn.classList.remove('hidden')
  overlayElement.classList.remove('open')
  confirmFinishPopup.classList.add('closed')
  hasPaused = false

  if(userMaxScore < score) {
    userMaxScore = score
  }
  maxScoreElement.className = 'max-score-board hasMaxScore'
  maxScoreElement.innerText = `Your Highest Score: ${userMaxScore < 10 ? '0' + userMaxScore : userMaxScore}/${mcqDataArray.length}`

  console.log("userMaxScore =>", userMaxScore);
  console.log("score =>", score);
  console.log("wrongAnswered =>", wrongAnswered);
  console.log("TotalQuestions =>", mcqDataArray.length);
}



//! function
//* function to start the quiz 
function startQuiz(quizData) {
  score = 0
  wrongAnswered = 0
  questionTimeInterval = 0
  currentMcqNumber = 0
  mcqDataArray = quizData
  nextQuestion(mcqDataArray, currentMcqNumber)
}


//* function to get next question 
function nextQuestion(data, mcqNum) {
  currentMcqNumber++
  questionNumber.innerText = `${currentMcqNumber > 9 ? currentMcqNumber : '0' + currentMcqNumber}/${mcqDataArray.length}` 
  questionElement.innerText = `${data[mcqNum]?.question}`
  timeElement.innerText = `00:30`
  hasUserSelectedAnyOption = false //* Now user can select any option.
  nextBtn.setAttribute('disabled', '')

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
      }
      
      timeElement.innerText = `00:${count >= 10 ? count : '0' + count}`
      if(count === 15) {
        quizPage.className = "quiz-page yellow-zone"
      }
      else if(count === 5) {
        quizPage.className = "quiz-page red-zone"
      }
      else if(count === 0) {
        nextBtn.removeAttribute('disabled')
        optionsContainer.classList.add('no-selection')
        hasUserSelectedAnyOption = true //* Now user can't select any option for this question if user try to so.
        clearInterval(questionTimeInterval)
        questionTimeInterval = 0
      }
    }, 1000)
  }

  if(currentMcqNumber === mcqDataArray.length){
    nextBtn.className = 'next-btn hidden'
  }
}


//* function to create 'option' elements 
function createOptionElement(option, index) {
  // optionsContainer.firstElementChild.remove()
  const optionBox = document.createElement('div');
  optionBox.className = 'option-box'
  
  const optionElement = document.createElement('p');
  optionElement.innerText = `${option}`;
  optionBox.appendChild(optionElement);

  const youChose = document.createElement('span');
  youChose.className = 'user-chose'
  youChose.innerText = 'You chose';
  optionBox.appendChild(youChose);
  
  if(index === "correct") {
    const correctIcon = document.createElement('span');
    correctIcon.className = 'correct-icon'
    correctIcon.innerHTML = '&checkmark;';
    optionBox.classList.add('correct')
    optionBox.appendChild(correctIcon);
  } 
  else {
    const wrongIcon = document.createElement('span');
    wrongIcon.className = 'wrong-icon'
    wrongIcon.innerHTML = '&times;';
    optionBox.appendChild(wrongIcon);
  } 

  optionsContainer.appendChild(optionBox)

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
  startQuiz(questions)
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
    score++
    // console.log(e.target)
  }
  else {
    e.target.classList.add('incorrect')
    wrongAnswered++
  }

  nextBtn.removeAttribute('disabled')
  hasUserSelectedAnyOption = true //* Now user can't select any other option for this question if user try to do so.
  clearInterval(questionTimeInterval)
  questionTimeInterval = 0
})



//* Event listener to go on next question
nextBtn.addEventListener('click', (e) => {
  e.stopPropagation()
  quizPage.className = "quiz-page"   //* so that style of page will get to be its original state
  optionsContainer.className = 'options-container'
  
  questionTimeInterval = 0
  nextQuestion(mcqDataArray, currentMcqNumber)
})


//* Event listener to popup the 'confirm-finish-popup' element
finishBtn.addEventListener('click', e => {
  e.stopPropagation()
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




//! Intervals :
// setInterval()



