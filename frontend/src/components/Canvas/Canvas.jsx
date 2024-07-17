import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchCanvases} from '../../services/canvasService';
import SingleCard from '../Card/SingleCard';
import { Move, PanelLeftOpen, PanelLeftClose } from 'lucide-react';

const Canvas = () => {
  const [cards, setCards] = useState([]);
  const [connections, setConnections] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [connectionStart, setConnectionStart] = useState(null);
  const [lastClickTime, setLastClickTime] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => {
    loadCanvases();
  }, []);

  async function loadCanvases() {
    const response = await fetchCanvases();
    fetchCanvases(response.data);
  }

  const handleCanvasClick = useCallback((e) => {
    const currentTime = new Date().getTime();
    const timeSinceLastClick = currentTime - lastClickTime;

    if (timeSinceLastClick < 300) { // Double-click threshold
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - canvasOffset.x;
      const y = e.clientY - rect.top - canvasOffset.y;
      setCards([...cards, { id: Date.now(), x, y, width: 200, height: 150, content: '# New Card\n\nClick to edit' }]);
    }

    setLastClickTime(currentTime);
  }, [cards, canvasOffset, lastClickTime]);

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
    setConnections(connections => connections.filter(conn => conn.start !== id && conn.end !== id));
  }, []);

  const startConnection = useCallback((cardId) => {
    setConnectionStart(cardId);
  }, []);

  const endConnection = useCallback((cardId) => {
    if (connectionStart && connectionStart !== cardId) {
      setConnections(prev => [...prev, { start: connectionStart, end: cardId }]);
      setConnectionStart(null);
    }
  }, [connectionStart]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    connections.forEach(conn => {
      const startCard = cards.find(card => card.id === conn.start);
      const endCard = cards.find(card => card.id === conn.end);
      if (startCard && endCard) {
        ctx.beginPath();
        ctx.moveTo(startCard.x + startCard.width / 2, startCard.y + startCard.height / 2);
        ctx.lineTo(endCard.x + endCard.width / 2, endCard.y + endCard.height / 2);
        ctx.stroke();
      }
    });
  }, [connections, cards, canvasOffset]);

  return (
    <div className="flex h-screen">
      <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'}`}>
        {sidebarOpen && (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Sidebar</h2>
            <p>You can add content here.</p>
          </div>
        )}
      </div>
      <div 
        className="flex-grow overflow-hidden bg-gray-100 relative" 
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
              startConnection={startConnection}
              endConnection={endConnection}
            />
          ))}
        </div>
        <div className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md">
          <Move size={24} />
        </div>
      </div>
      <button 
        className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <PanelLeftClose size={24} /> : <PanelLeftOpen size={24} />}
      </button>
    </div>
  );
};

export default Canvas;
