import React, { useState, useEffect } from 'react';

    const levels = {
      easy: 8,
      medium: 12,
      hard: 16,
    };

    const images = [
      '🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍍', '🥝',
    ];

    function shuffleArray(array) {
      return array.sort(() => Math.random() - 0.5);
    }

    function MemoryGame() {
      const [level, setLevel] = useState('easy');
      const [cards, setCards] = useState([]);
      const [flippedCards, setFlippedCards] = useState([]);
      const [matchedCards, setMatchedCards] = useState([]);
      const [currentPlayer, setCurrentPlayer] = useState(0);
      const [players, setPlayers] = useState([{ name: 'Player 1', score: 0, color: 'red' }, { name: 'Player 2', score: 0, color: 'blue' }]);
      const [gameStarted, setGameStarted] = useState(false);

      useEffect(() => {
        const numPairs = levels[level] / 2;
        const selectedImages = images.slice(0, numPairs);
        const cardSet = shuffleArray([...selectedImages, ...selectedImages]);
        setCards(cardSet);
      }, [level]);

      const handleCardClick = (index) => {
        if (flippedCards.length === 2 || flippedCards.includes(index) || matchedCards.includes(index)) return;

        const newFlippedCards = [...flippedCards, index];
        setFlippedCards(newFlippedCards);

        if (newFlippedCards.length === 2) {
          const [firstIndex, secondIndex] = newFlippedCards;
          if (cards[firstIndex] === cards[secondIndex]) {
            setMatchedCards([...matchedCards, firstIndex, secondIndex]);
            setPlayers(players.map((player, idx) => idx === currentPlayer ? { ...player, score: player.score + 1 } : player));
          } else {
            setTimeout(() => {
              setCurrentPlayer((currentPlayer + 1) % players.length);
            }, 1000);
          }
          setTimeout(() => setFlippedCards([]), 1000);
        }
      };

      const handleLevelChange = (event) => {
        setLevel(event.target.value);
        setMatchedCards([]);
        setFlippedCards([]);
        setPlayers(players.map(player => ({ ...player, score: 0 })));
      };

      const handleNameChange = (index, name) => {
        setPlayers(players.map((player, idx) => idx === index ? { ...player, name } : player));
      };

      const handleColorChange = (index, color) => {
        setPlayers(players.map((player, idx) => idx === index ? { ...player, color } : player));
      };

      const resetGame = () => {
        setMatchedCards([]);
        setFlippedCards([]);
        setPlayers(players.map(player => ({ ...player, score: 0 })));
        setCurrentPlayer(0);
      };

      const startGame = () => {
        setGameStarted(true);
        resetGame();
      };

      return (
        <div>
          {!gameStarted ? (
            <div className="start-screen">
              <h1>Welcome to Memory Game</h1>
              {players.map((player, index) => (
                <div key={index}>
                  <input
                    type="text"
                    placeholder={`Enter name for ${player.name}`}
                    value={player.name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                  />
                  <select value={player.color} onChange={(e) => handleColorChange(index, e.target.value)}>
                    <option value="red">Red</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="yellow">Yellow</option>
                  </select>
                </div>
              ))}
              <button onClick={startGame}>Start Game</button>
            </div>
          ) : (
            <div>
              <h1>Memory Game</h1>
              <div className="scoreboard">
                {players.map((player, index) => (
                  <div key={index} className={`player ${player.color}`}>
                    <span>{player.name}</span>
                    <span>Score: {player.score}</span>
                  </div>
                ))}
              </div>
              <select value={level} onChange={handleLevelChange}>
                {Object.keys(levels).map(lvl => (
                  <option key={lvl} value={lvl}>{lvl.charAt(0).toUpperCase() + lvl.slice(1)}</option>
                ))}
              </select>
              <div className={`grid ${level}`}>
                {cards.map((card, index) => (
                  <div
                    key={index}
                    className={`card ${flippedCards.includes(index) || matchedCards.includes(index) ? 'flipped' : ''} ${matchedCards.includes(index) ? 'matched' : ''}`}
                    onClick={() => handleCardClick(index)}
                  >
                    {flippedCards.includes(index) || matchedCards.includes(index) ? <span>{card}</span> : <span>❓</span>}
                  </div>
                ))}
              </div>
              <p>Current Player: <span className={players[currentPlayer].color}>{players[currentPlayer].name}</span></p>
              <button onClick={resetGame}>Reset Game</button>
            </div>
          )}
        </div>
      );
    }

    export default function App() {
      return <MemoryGame />;
    }
