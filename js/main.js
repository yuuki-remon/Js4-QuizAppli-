{
  const fetchQuizData = async () => {
    primaryElement.textContent = '取得中';
    questionElement.textContent = '少々お待ちください'; 
    
    const response = await fetch("https://opentdb.com/api.php?amount=10&type=multiple");
    const data = await response.json();
    const quizInstance = new Quiz(data);

    createQuizField(quizInstance);
  }
  
  class Quiz {
    constructor(data) {
      this.quizzes = data.results;
      this.quizCount = 0;
      this.correctAnswer = 0;
    }
    
    getQuizCategory() {
      return this.quizzes[this.quizCount].category;
    }
    
    getQuizDifficulty() {
      return this.quizzes[this.quizCount].difficulty;
    }
    
    getQuizQuestion() {
      return this.quizzes[this.quizCount].question; 
    }

    getQuizAnswers() {
      const answers = [
        ...this.quizzes[this.quizCount].incorrect_answers,
        this.quizzes[this.quizCount].correct_answer,
      ];
      return shuffleArr(answers);
    }

    getQuizCorrectAnswer() {
      return this.quizzes[this.quizCount].correct_answer;
    }

    addCorrectCount() {
      this.correctAnswer++;
    }

    addQuizCount() {
      this.quizCount++;
    }
  };

  const shuffleArr = arr => {
    for(let i = arr.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }; 
  
  const primaryElement = document.getElementById('primary');
  const genreElement = document.getElementById('genre');
  const difficultyElement = document.getElementById('difficulty');
  const questionElement = document.getElementById('question');
  const answersBlock = document.getElementById('answers');
  const startButton = document.getElementById('start-button');

  startButton.addEventListener('click', () => {
    startButton.remove();
    fetchQuizData();
  });
  
  
  const createQuizField = (quizInstance) => {
    primaryElement.textContent = `問題${quizInstance.quizCount + 1}`;
    genreElement.textContent = `【ジャンル】 ${quizInstance.getQuizCategory()}`;
    difficultyElement.textContent = `【難易度】 ${quizInstance.getQuizDifficulty()}`;
    questionElement.textContent = `${quizInstance.getQuizQuestion()}`;
    
    const answers = quizInstance.getQuizAnswers();
    answers.forEach(answer => {
      const buttonElement = document.createElement('button');
      buttonElement.textContent = answer;
      buttonElement.addEventListener('click', () => {
        changeQuiz(quizInstance, answer);
      });
      
      const div = document.createElement('div');
      div.appendChild(buttonElement);
      answersBlock.appendChild(div);
    });
  };
  
  const changeQuiz = (quizInstance, answer) => {
    while(answersBlock.firstChild) {
      answersBlock.removeChild(answersBlock.firstChild);
    }
    if(answer === quizInstance.getQuizCorrectAnswer()) {
      quizInstance.addCorrectCount();
    }
    
    quizInstance.addQuizCount();
    
    if(quizInstance.quizCount === quizInstance.quizzes.length) {
      finishQuizEvent(quizInstance);
    } else {
      createQuizField(quizInstance);
    }
  };
  
  const finishQuizEvent = quizInstance => {
    primaryElement.textContent = `あなたの正答数は${quizInstance.correctAnswer}です！！`;
    questionElement.textContent = '再チャレンジしたい場合は下のボタンをクリック！';
    genreElement.remove();
    difficultyElement.remove();
    
    const returnBtn = document.createElement('button');
    returnBtn.textContent = 'ホームに戻る'; 
    returnBtn.addEventListener('click', () => {
      location.reload();
    })
    answersBlock.appendChild(returnBtn);
  };
}