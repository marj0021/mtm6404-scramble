/** 
 * Scramble Game - React + Local Storages.
 */

const { useState, useEffect } = React;

function ScrambleGame() {
  const wordsArray = ['table', 'pencil', 'guitar', 'laptop', 'orange', 'planet', 'camera', 'jacket', 'rocket', 'tunnel'];
  
  const [wordList, setWordList] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [passes, setPasses] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('Welcome to Scramble!');

  useEffect(() => {
    const savedGame = JSON.parse(localStorage.getItem('scrambleGameState'));
    if (savedGame) {
      setWordList(savedGame.wordList);
      setCurrentWord(savedGame.currentWord);
      setScrambledWord(savedGame.scrambledWord);
      setScore(savedGame.score);
      setStrikes(savedGame.strikes);
      setPasses(savedGame.passes);
      setGameOver(savedGame.gameOver);
      setMessage(savedGame.message);
    } else {
      initializeGame();
    }
  }, []);

  useEffect(() => {
    if (!gameOver) {
      const gameState = { wordList, currentWord, scrambledWord, score, strikes, passes, gameOver, message };
      localStorage.setItem('scrambleGameState', JSON.stringify(gameState));
    }
  }, [wordList, currentWord, scrambledWord, score, strikes, passes, gameOver, message]);

  function initializeGame() {
    const shuffledWords = shuffle([...wordsArray]);
    setWordList(shuffledWords);
    setCurrentWord(shuffledWords[0]);
    setScrambledWord(shuffle(shuffledWords[0]));
    setScore(0);
    setStrikes(0);
    setPasses(3);
    setGameOver(false);
    setMessage('Welcome to Scramble!');
  }

  function handleGuess(e) {
    e.preventDefault();
    if (userInput.toLowerCase() === currentWord.toLowerCase()) {
      setScore(score + 1);
      setMessage('Correct! Next word.');
      moveToNextWord();
    } else {
      setStrikes(strikes + 1);
      setMessage('Wrong, try again.');
      if (strikes + 1 === 3) {
        setGameOver(true);
        setMessage('Game Over! Click "Play Again" to restart.');
      }
    }
    setUserInput('');
  }

  function moveToNextWord() {
    const remainingWords = wordList.filter(word => word !== currentWord);
    if (remainingWords.length === 0) {
      setGameOver(true);
      setMessage('You guessed all words! Play again?');
    } else {
      const newWord = remainingWords[0];
      setWordList(remainingWords);
      setCurrentWord(newWord);
      setScrambledWord(shuffle(newWord));
    }
  }

  function handlePass() {
    if (passes > 0) {
      setPasses(passes - 1);
      setMessage('You passed! Next word.');
      moveToNextWord();
    }
  }

  function restartGame() {
    localStorage.removeItem('scrambleGameState');
    initializeGame();
  }

  return (
    <div className="game-container">
      <h1>Scramble Game</h1>
      <div className="stats">
        <p>Points: {score}</p>
        <p>Strikes: {strikes}/3</p>
        <p>Passes: {passes}</p>
      </div>
      <p className="scrambled-word">{scrambledWord}</p>
      <form onSubmit={handleGuess}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={gameOver}
        />
        <button type="submit" disabled={gameOver}>Guess</button>
      </form>
      <button onClick={handlePass} disabled={gameOver || passes === 0}>Pass ({passes} left)</button>
      <p className={message.includes('Correct') ? 'correct' : 'incorrect'}>{message}</p>
      {gameOver && (
        <div className="game-over">
          <p>{message}</p>
          <button onClick={restartGame}>Play Again</button>
        </div>
      )}
    </div>
  );
}

function shuffle(src) {
  const copy = [...src];
  for (let i = 0; i < copy.length; i++) {
    const randIndex = Math.floor(Math.random() * copy.length);
    [copy[i], copy[randIndex]] = [copy[randIndex], copy[i]];
  }
  return typeof src === 'string' ? copy.join('') : copy;
}

ReactDOM.render(<ScrambleGame />, document.getElementById('root'));
