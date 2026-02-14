import React, { useState, useRef } from 'react';
import './ValentinePage.css';
import API_URL from '../config';

const ValentinePage = ({ onNavigate }) => {
  // STAGE: 'intro' | 'question' | 'success'
  const [stage, setStage] = useState('intro');
  const [introIndex, setIntroIndex] = useState(0);
  
  const [noCount, setNoCount] = useState(0);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
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

  // --- YES BUTTON SIZING LOGIC ---
  const MAX_SCALE = 15; 
  const currentScale = Math.min(
    1 + (noCount * ((MAX_SCALE - 1) / noPhrases.length)), 
    MAX_SCALE
  );

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
      await fetch(`${API_URL}/api/valentine-response`, {
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
    
    // --- NO BUTTON MOVEMENT LOGIC ---
    const button = noButtonRef.current;
    if (!button) return;

    // Get button dimensions (add buffer for text growth)
    const buttonWidth = button.offsetWidth + 50; 
    const buttonHeight = button.offsetHeight + 20;

    // Calculate available space (window - button size - safe padding)
    const maxX = window.innerWidth - buttonWidth - 20;
    const maxY = window.innerHeight - buttonHeight - 20;

    // Generate random coordinates ensuring it stays ON SCREEN
    const randomX = Math.max(20, Math.random() * maxX);
    const randomY = Math.max(20, Math.random() * maxY);
    
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
              {introIndex < introMessages.length - 1 ? "NEXT!" : "HEHEHEHE"}
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
          <h1 className="celebration-title">🎉 YEHEYYY HEHEHE🎉</h1>
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
        <button 
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '12px 24px',
            background: 'rgba(102, 126, 234, 0.9)',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 9999
          }}
          onClick={() => onNavigate('admin')}
        >
          ⚙️ Admin
        </button>
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
            style={{ 
              transform: `scale(${currentScale})`,
              transition: 'transform 0.2s ease',
              zIndex: 10
            }}
          >
            Yes!
          </button>
          
          <button 
            ref={noButtonRef}
            className="no-button"
            onClick={handleNoClick}
            style={{
              // FIXED positioning allows it to roam the entire screen
              position: noCount > 0 ? 'fixed' : 'relative',
              left: noCount > 0 ? noButtonPosition.x : 'auto',
              top: noCount > 0 ? noButtonPosition.y : 'auto',
              zIndex: 9999, 
              transition: 'all 0.2s ease'
            }}
          >
            {getNoButtonText()}
          </button>
        </div>
        
        {/* Hint text removed as requested */}
      </div>
    </div>
  );
};

export default ValentinePage;