import React, { useState, useRef } from 'react';
import './ValentinePage.css';

const ValentinePage = ({ onNavigate }) => {
  // STAGE: 'intro' | 'question' | 'success'
  const [stage, setStage] = useState('question');
  const [introIndex, setIntroIndex] = useState(0);
  
  const [noCount, setNoCount] = useState(0);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [yesButtonSize, setYesButtonSize] = useState(1);
  const noButtonRef = useRef(null);

  
  const introMessages = [
    "Hi love! 👋",
    "I know its late na.",
    "And im sorryyy I will explain thingss mag call taa",
    "but i just wanted to ask something",
    "hehehe"
  ];

  const noPhrases = [
    "No",
    "Are you sure?",
    "sure kana?",
    "indi pwede",
    "PLEASE LOVEEE",
    "LOVEEEEEE",
    "SAY YESS >:((",
    "MASUNGGOD KOOO",
    "CGEE >:((",
    "LOVE GADAKO NA ANG YES PINDUTA NA",
    "LOVIEE PLEASEEEE",
    "BEBEEEEE PRETTYY PLEASEEE",
    "LOVEE NAGDAKO NA SYA OH",
    "LOVEE TAMA NA NGA NOOOO",
    "IHHH DO YOU HATE ME",
    "LOVEEE",
    "Plsss? 🥺",
    "WALA NA IM CRYING NA"
  ];

  // Logic to get the current 'No' message
  const getNoButtonText = () => {
    return noPhrases[Math.min(noCount, noPhrases.length - 1)];
  };

  const handleNextIntro = () => {
    if (introIndex < introMessages.length - 1) {
      setIntroIndex(introIndex + 1);
    } else {
      setStage('question');
    }
  };

  const handleYesClick = async () => {
    setStage('success');
    
    // Optional: Send response to backend
    try {
      await fetch('http://localhost:5000/api/valentine-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: 'yes' })
      });
    } catch (error) {
      console.log('Could not send response:', error);
    }
  };

  const handleNoClick = () => {
    setNoCount(noCount + 1);
    
    // Increase yes button size
    setYesButtonSize(prev => Math.min(prev + 0.2, 3)); // Cap size at 3x

    // Move the button to a random position
    const container = document.querySelector('.valentine-container');
    const button = noButtonRef.current;
    
    if (!container || !button) return;
    
    const containerRect = container.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    
    // Calculate random position within container bounds
    // We use a larger padding to keep it away from edges
    const maxX = containerRect.width - buttonRect.width - 40;
    const maxY = containerRect.height - buttonRect.height - 40;
    
    const randomX = Math.random() * maxX - (containerRect.width / 2 - buttonRect.width / 2);
    const randomY = Math.random() * maxY - (containerRect.height / 2 - buttonRect.height / 2);
    
    setNoButtonPosition({ x: randomX, y: randomY });
  };

  // --- RENDER: INTRO SEQUENCE ---
  if (stage === 'intro') {
    return (
      <div className="valentine-container">
        <div className="valentine-content intro-card">
          <p className="intro-text">
            {introMessages[introIndex]}
          </p>
          <div className="intro-navigation">
            <button className="intro-button" onClick={handleNextIntro}>
              {introIndex < introMessages.length - 1 ? "Next ➡️" : "Show me! 💖"}
            </button>
          </div>
          <div className="intro-progress">
            {introMessages.map((_, idx) => (
              <div 
                key={idx} 
                className={`progress-dot ${idx === introIndex ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: SUCCESS/CELEBRATION ---
  if (stage === 'success') {
    return (
      <div className="valentine-container celebration">
        <div className="celebration-content">
          <h1 className="celebration-title">🎉 Yay! 🎉</h1>
          <p className="celebration-text">I LOVEEE YOUUU</p>
          <p className="celebration-subtitle">DEETS TOMORROW!!</p>
          <button 
            className="recordings-button"
            onClick={() => onNavigate('recordings')}
          >
            hehe here's my surprise
          </button>
        </div>
        <div className="hearts-animation">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="heart" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}>❤️</div>
          ))}
        </div>
      </div>
    );
  }

  // --- RENDER: MAIN QUESTION ---
  return (
    <div className="valentine-container">
      <div className="valentine-content">
        <h1 className="valentine-title">Will you be my Valentine?</h1>
        <p className="valentine-subtitle">THERES ONLY ONE ANSWER BEBE</p>
        
        <div className="buttons-container">
          <button 
            className="yes-button"
            onClick={handleYesClick}
            style={{ transform: `scale(${yesButtonSize})` }}
          >
            Yes!
          </button>
          
          <button 
            ref={noButtonRef}
            className="no-button"
            onClick={handleNoClick}
            style={{
              // Apply position only if it has moved at least once (noCount > 0)
              transform: noCount > 0 ? `translate(${noButtonPosition.x}px, ${noButtonPosition.y}px)` : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            {getNoButtonText()}
          </button>
        </div>
        
        {noCount > 0 && (
          <p className="hint-text">
            
          </p>
        )}
      </div>
    </div>
  );
};

export default ValentinePage;