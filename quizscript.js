const quizzes = [
  {
    title: "⚙️ Mechanical Quiz",
    questions: [
      { q: "Which law states that stress is directly proportional to strain within the elastic limit?", options: ["Pascal’s Law", "Hooke’s Law", "Boyle’s Law", "Newton’s Law"], answer: "Hooke’s Law" },
      { q: "In a four-stroke engine, the power stroke occurs during:", options: ["Intake stroke", "Compression stroke", "Power stroke", "Exhaust stroke"], answer: "Power stroke" },
      { q: "The efficiency of an ideal Otto cycle depends on:", options: ["Fuel type", "Compression ratio", "Temperature only", "Cylinder size"], answer: "Compression ratio" }
    ]
  },
  {
    title: "💻 Technical Quiz",
    questions: [
      { q: "Which data structure uses the principle of LIFO (Last In, First Out)?", options: ["Queue", "Stack", "Linked List", "Tree"], answer: "Stack" },
      { q: "Which of the following is NOT a programming language?", options: ["Python", "Java", "HTML", "C++"], answer: "HTML" },
      { q: "In computer networks, IP address 192.168.1.1 belongs to:", options: ["Public IP range", "Private IP range", "Loopback address", "Multicast address"], answer: "Private IP range" }
    ]
  }
];

let currentQuizIndex = 0;
let currentQuestionIndex = 0;
let score = 0;
let history = JSON.parse(localStorage.getItem("quizHistory")) || [];

function loadQuestion() {
  const quiz = quizzes[currentQuizIndex];
  const question = quiz.questions[currentQuestionIndex];
  document.getElementById("question-title").textContent = question.q;

  const optionsContainer = document.getElementById("options-container");
  optionsContainer.innerHTML = "";

  const letters = ["A", "B", "C", "D"];
  question.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerHTML = `<span class="option-label">${letters[index]}</span> ${option}`;
    btn.onclick = () => checkAnswer(btn, option);
        optionsContainer.appendChild(btn);
  });

  document.getElementById("score-display").textContent = `Score: ${score}`;
}

function checkAnswer(button, selected) {
  const correct = quizzes[currentQuizIndex].questions[currentQuestionIndex].answer;
  const allButtons = document.querySelectorAll(".option-btn");

  // Disable all buttons
  allButtons.forEach(btn => {
    btn.disabled = true;
    btn.classList.remove("selected", "correct", "wrong");
    if (btn.textContent.includes(correct)) {
      btn.classList.add("correct");
    }
  });

  if (selected === correct) {
    score += 1;
    button.classList.add("selected");
  } else {
    button.classList.add("wrong");
  }

  // Show next button
  document.getElementById("next-btn").style.display = "inline-block";
}

function nextQuestion() {
  currentQuestionIndex++;
  document.getElementById("next-btn").style.display = "none";

  if (currentQuestionIndex < quizzes[currentQuizIndex].questions.length) {
    loadQuestion();
  } else {
    showFinalScore();
  }
}

function showFinalScore() {
  document.getElementById("quiz-container").style.display = "none";
  document.getElementById("end-screen").style.display = "block";

  const finalScore = `You scored ${score}/${quizzes[currentQuizIndex].questions.length}`;
  document.getElementById("final-score").textContent = finalScore;

  history.push({
    quizTitle: quizzes[currentQuizIndex].title,
    score: finalScore,
    date: new Date().toLocaleString()
  });

  localStorage.setItem("quizHistory", JSON.stringify(history));
}

function startNewQuiz() {
  currentQuizIndex = (currentQuizIndex + 1) % quizzes.length;
  currentQuestionIndex = 0;
  score = 0;
  document.getElementById("quiz-container").style.display = "block";
  document.getElementById("end-screen").style.display = "none";
  document.getElementById("history-section").style.display = "none";
  loadQuestion();
}

function viewHistory() {
  const historyList = document.getElementById("history-list");
  historyList.innerHTML = "";

  history.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${item.quizTitle} - ${item.score} (${item.date})`;
    historyList.appendChild(li);
  });

  document.getElementById("history-section").style.display = "block";
}

function clearHistory() {
  localStorage.removeItem("quizHistory");
  history = [];
  viewHistory();
}

window.onload = loadQuestion;

