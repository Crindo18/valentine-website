import React, { useState, useRef } from 'react';
import './ValentinePage.css';

const ValentinePage = ({ onNavigate }) => {
  const [yesClicked, setYesClicked] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [yesButtonSize, setYesButtonSize] = useState(1);
  const noButtonRef = useRef(null);

  const handleYesClick = async () => {
    setYesClicked(true);
    
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

  const handleNoHover = () => {
    // Move the button to a random position
    const container = document.querySelector('.valentine-container');
    const button = noButtonRef.current;
    
    if (!container || !button) return;
    
    const containerRect = container.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    
    // Calculate random position within container bounds
    const maxX = containerRect.width - buttonRect.width - 40;
    const maxY = containerRect.height - buttonRect.height - 40;
    
    const randomX = Math.random() * maxX - (containerRect.width / 2 - buttonRect.width / 2);
    const randomY = Math.random() * maxY - (containerRect.height / 2 - buttonRect.height / 2);
    
    setNoButtonPosition({ x: randomX, y: randomY });
    
    // Increase yes button size slightly each time
    setYesButtonSize(prev => Math.min(prev + 0.1, 2));
  };

  if (yesClicked) {
    return (
      <div className="valentine-container celebration">
        <div className="celebration-content">
          <h1 className="celebration-title">🎉 Yay! 🎉</h1>
          <p className="celebration-text">I knew you'd say yes! ❤️</p>
          <p className="celebration-subtitle">You've made me the happiest person!</p>
          <button 
            className="recordings-button"
            onClick={() => onNavigate('recordings')}
          >
            Listen to something special
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

  return (
    <div className="valentine-container">
      <div className="valentine-content">
        <h1 className="valentine-title">Will you be my Valentine? 💕</h1>
        <p className="valentine-subtitle">Please say yes... 🥺</p>
        
        <div className="buttons-container">
          <button 
            className="yes-button"
            onClick={handleYesClick}
            style={{ transform: `scale(${yesButtonSize})` }}
          >
            Yes! 💖
          </button>
          
          <button 
            ref={noButtonRef}
            className="no-button"
            onMouseEnter={handleNoHover}
            onTouchStart={handleNoHover}
            style={{
              transform: `translate(${noButtonPosition.x}px, ${noButtonPosition.y}px)`
            }}
          >
            No
          </button>
        </div>
        
        <p className="hint-text">
          (Hint: The "Yes" button is the right choice 😊)
        </p>
      </div>
    </div>
  );
};

export default ValentinePage;
