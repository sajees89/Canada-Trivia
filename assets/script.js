const quizData = [
    {
      question: "What is the capital city of Canada?",
      a: "Toronto",
      b: "Vancouver",
      c: "Ottawa",
      d: "Montreal",
      correct: "c",
    },
    {
      question: "How many provinces does Canada have?",
      a: "11",
      b: "10",
      c: "13",
      d: "14",
      correct: "b",
    },
    {
      question: "Who was Canada's first French speaking Prime Minister?",
      a: "John A. Macdonald",
      b: "Louis St. Laurent",
      c: "Wilfrid Laurier",
      d: "Pierre Trudeau",
      correct: "c",
    },
    {
      question: "When did the Toronto Blue Jays win their first World Series?",
      a: "1992",
      b: "1991",
      c: "1993",
      d: "1989",
      correct: "a",
    },
    {
      question: "When was Canada founded?",
      a: "July 4th 1867",
      b: "July 1st 1860",
      c: "July 1st 1867",
      d: "July 1st 1870",
      correct: "c",
    },
  ];
  
  const timeLimit = 60 * 1000;
  const intro = document.getElementById('intro')
  const startBtn = document.getElementById('start-btn')
  const submitBtn = document.getElementById('submit')
  const quiz = document.getElementById('quiz')
  
  const highScoresBtn = document.getElementById('high-scores-btn')
  const submitHighScoreBtn = document.getElementById('submit-high-score-btn')
  const homeBtn = document.getElementById('return-home-btn')
  const results = document.getElementById('results')
  const initials = document.getElementById('initials')
  const correctAnswers = document.getElementById('correct-answers')
  
  const timer = document.getElementById('timer')
  
  const questionEl = document.getElementById('question')
  const answerEls = document.querySelectorAll('.answer')
  const a_text = document.getElementById('a')
  const b_text = document.getElementById('b')
  const c_text = document.getElementById('c')
  const d_text = document.getElementById('d')
  
  answerEls.forEach(answerEl => answerEl.addEventListener("click", setAnswer))
  highScoresBtn.addEventListener("click", showHighScores);
  homeBtn.addEventListener("click", returnHome);
  
  startBtn.addEventListener("click", startQuiz);
  
  let highScoreMaxCount = 5;
  let highScoreInitials
  let currentQuiz
  let score
  let timerValue
  let timerId
  let answer
  let rank
  
  function updateTimerText(ms) {
    if (ms === -1) {
      timer.innerText = '';
    }
    else if (ms > 0) {
      timer.innerText = 'Time Remaining: ' + (ms / 1000.0).toFixed(1) + ' seconds';
    }
    else {
      timer.innerText = "Time's up!"
    }
  }
  
  function updateTimer() {
    decrementTimer(100);
    updateTimerText(timerValue)
  }
  
  function startTimer() {
    timerValue = timeLimit;
    updateTimerText(timerValue)
    timerId = setInterval(updateTimer, 100);
  }
  
  function startQuiz() {
    currentQuiz = 0;
    score = 0;
    answer = null;
    quiz.style.display = "block";
    intro.style.display = "none";
    highScoresBtn.style.visibility = "hidden";
    deselectAnswers()
    const currentQuizData = quizData[currentQuiz]
    questionEl.innerText = currentQuizData.question
    a_text.innerText = currentQuizData.a
    b_text.innerText = currentQuizData.b
    c_text.innerText = currentQuizData.c
    d_text.innerText = currentQuizData.d
  
    loadQuiz()
    startTimer()
  }
  
  function stopQuiz() {
    updateTimerText(-1);
    clearInterval(timerId);
  
    rank = 0
    let highScores = getHighScores();
    for (let highScore of highScores) {
      if (score > highScore.correct || rank == highScoreMaxCount)
        break;
  
      rank++;
    }
  
    correctAnswers.innerHTML = `
      You answered ${score} out of ${quizData.length} questions correctly
    `
  
    if (rank < highScoreMaxCount) {
      highScoreInitials = '';
      submitHighScoreBtn.innerHTML = 'Submit';
      initials.innerHTML = `
        <h3>Congratulations, you've reached rank #${rank + 1}!</h3>
        <label>Enter your initials</label>
        <input id="high-score-input" maxlength="3"></input>
      `
    }
    else {
      initials.innerHTML = '';
      submitHighScoreBtn.innerHTML = 'View High Scores';
      highScoresBtn.style.visibility = "visible";
    }
  
    quiz.style.display = "none";
    results.style.display = "block";
  }
  
  function submitHighScore() {
    scores.style.display = "block";
    quiz.style.display = "none";
    let initialsEl = document.getElementById('high-score-input');
    if (initialsEl) {
      setHighScore(rank, initialsEl.value, score);
    }
    updateHighScores();
    scores.style.display = "block";
    results.style.display = "none";
  }
  
  function updateHighScores() {
    let highScores = getHighScores();
    for (let rank = 1; rank <= highScoreMaxCount; rank++) {
      let scoreEl = document.getElementById('high-score-' + rank).getElementsByClassName('name')[0];
      let score = highScores[rank - 1];
      if (score) {
        scoreEl.innerHTML = rank + ') ' + score.initials + ' - ' + score.correct + '/' + quizData.length;
      }
      else {
        scoreEl.innerHTML = '';
      }
    }
  }
  
  function loadQuiz() {
    deselectAnswers()
    const currentQuizData = quizData[currentQuiz]
  
    questionEl.innerText = currentQuizData.question
    a_text.innerText = currentQuizData.a
    b_text.innerText = currentQuizData.b
    c_text.innerText = currentQuizData.c
    d_text.innerText = currentQuizData.d
  }
  
  function decrementTimer(value) {
    timerValue -= value;
    if (timerValue <= 0) {
      clearInterval(timerId);
      stopQuiz();
    }
  }
  
  function deselectAnswers() {
    answerEls.forEach(answerEl => answerEl.checked = false)
  }
  
  function setAnswer(e) {
    answer = e.target.id
  }
  
  function getHighScores() {
    let highScores = JSON.parse(localStorage.getItem('highscores'));
    if (!highScores)
      highScores = []
  
    return highScores
  }
  
  function getHighScore(position) {
    let highScores = getHighScores();
    if (!highScores)
      return null
  
    if (highScores.length < position)
      return null
  
    return highScores[position]
  }
  
  function setHighScore(position, initials, correct) {
    let highScores = getHighScores();
    if (!highScores || !Array.isArray(highScores))
      highScores = [];
  
    highScores.splice(position, 0, { initials, correct })
    if (highScores.length > highScoreMaxCount)
      highScores.pop();
  
    localStorage.setItem('highscores', JSON.stringify(highScores))
  }
  
  function showHighScores() {
    updateHighScores();
    scores.style.display = "block";
    intro.style.display = "none";
    quiz.style.display = "none";
    highScoresBtn.style.visibility = "hidden";
  }
  
  function returnHome() {
    scores.style.display = "none";
    intro.style.display = "block";
    highScoresBtn.style.visibility = "visible";
  }
  
  submitBtn.addEventListener('click', () => {
    if (answer === quizData[currentQuiz].correct) {
      score++;
    }
    else {
      decrementTimer(5000);
      updateTimerText(timerValue);
    }
  
    answer = null
    currentQuiz++;
  
    if (currentQuiz < quizData.length) {
      loadQuiz();
    } else {
      stopQuiz();
    }
  })