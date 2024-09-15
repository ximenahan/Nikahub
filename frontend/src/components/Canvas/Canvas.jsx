import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchCanvases } from '../../services/canvasService';
import { createCard } from '../../services/cardService';
import SingleCard from '../Card/SingleCard';
import { Move, PanelLeftOpen, PanelLeftClose } from 'lucide-react';

const Canvas = () => {
  const [cards, setCards] = useState([]);
  const [canvases, setCanvases] = useState([]);
  const [selectedCanvas, setSelectedCanvas] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [lastClickTime, setLastClickTime] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => {
    loadCanvases();
  }, []);

  async function loadCanvases() {
    try {
      const response = await fetchCanvases();
      setCanvases(response.data);
      if (response.data.length > 0) {
        setSelectedCanvas(response.data[0].id);
      }
    } catch (error) {
      console.error('Error loading canvases:', error);
    }
  }

  const handleCanvasClick = useCallback(async (e) => {
    const currentTime = new Date().getTime();
    const timeSinceLastClick = currentTime - lastClickTime;

    if (timeSinceLastClick < 300 && selectedCanvas) { // Double-click threshold
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - canvasOffset.x;
      const y = e.clientY - rect.top - canvasOffset.y;
      const newCard = {
        title: 'New Card',
        content: '# New Card\n\nClick to edit',
        positionX: x,
        positionY: y,
        width: 200,
        height: 150,
        canvasId: selectedCanvas,
      };
      try {
        const response = await createCard(newCard);
        setCards([...cards, response.data]);
      } catch (error) {
        console.error('Error creating card:', error);
      }
    }

    setLastClickTime(currentTime);
  }, [cards, canvasOffset, lastClickTime, selectedCanvas]);

  const handleMouseDown = useCallback((e) => {
    if (e.button === 1) { // Middle mouse button
      setIsDragging(true);
      setStartPos({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;
      setCanvasOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setStartPos({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging, startPos]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const updateCard = useCallback((id, updates) => {
    setCards(cards => cards.map(card => 
      card.id === id ? { ...card, ...updates } : card
    ));
  }, []);

  const deleteCard = useCallback((id) => {
    setCards(cards => cards.filter(card => card.id !== id));
  }, []);
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 relative">
      {sidebarOpen && (
        <div className="w-64 bg-white shadow-md p-4">
          <h2 className="text-xl font-bold mb-4">Canvases</h2>
          <ul>
            {canvases.map(canvas => (
              <li
                key={canvas.id}
                className={`cursor-pointer p-2 ${selectedCanvas === canvas.id ? 'bg-blue-200' : ''}`}
                onClick={() => setSelectedCanvas(canvas.id)}
              >
                {canvas.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div 
        className="flex-grow relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
      >
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          width={window.innerWidth}
          height={window.innerHeight}
        />
        <div 
          className="absolute" 
          style={{ 
            transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px)`,
            cursor: isDragging ? 'grabbing' : 'default'
          }}
        >
          {cards.map(card => (
            <SingleCard 
              key={card.id} 
              card={card}
              updateCard={updateCard}
              deleteCard={deleteCard}
            />
          ))}
        </div>
        <div className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md">
          <Move size={24} />
        </div>
        <button 
          className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <PanelLeftClose size={24} /> : <PanelLeftOpen size={24} />}
        </button>
      </div>
    </div>
  );
}

export default Canvas;