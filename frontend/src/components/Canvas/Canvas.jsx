// src/components/Canvas/Canvas.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchCards, createCard } from '../../services/cardService';
import SingleCard from '../Card/SingleCard';
import { Move, PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import { updateCard as updateCardAPI } from '../../services/cardService';
import { deleteCard as deleteCardAPI } from '../../services/cardService';
import ErrorBoundary from '../ErrorBoundary';

const Canvas = () => {
  const [cards, setCards] = useState([]);
  const [canvases, setCanvases] = useState([]);
  const [selectedCanvas, setSelectedCanvas] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    loadCanvases();
  }, []);

  useEffect(() => {
    console.log('Error state updated:', error);
  }, [error]);

  async function loadCanvases() {
    try {
      const { fetchCanvases } = await import('../../services/canvasService');
      const canvasesData = await fetchCanvases();
      console.log('Canvases loaded:', canvasesData);
      setCanvases(canvasesData);
      if (canvasesData.length > 0) {
        setSelectedCanvas(canvasesData[0].id);
      }
    } catch (error) {
      console.error('Error loading canvases:', error);
      setError('Error loading canvases'); // Set error state
    }
  }

  useEffect(() => {
    if (selectedCanvas) {
      loadCards(selectedCanvas);
    }
  }, [selectedCanvas]);

  async function loadCards(canvasId) {
    try {
      const cardsData = await fetchCards(canvasId);
      console.log('Cards loaded:', cardsData);
      setCards(cardsData);
    } catch (error) {
      console.error('Error loading cards:', error);
      setError('Error loading cards'); // Optionally handle card loading errors
    }
  }

  const handleCanvasDoubleClick = useCallback(async (e) => {
    console.log('Canvas double-clicked');

    if (selectedCanvas) {
      const rect = e.currentTarget.getBoundingClientRect();
      console.log('canvasOffset:', canvasOffset);
      const x = e.clientX - rect.left + canvasOffset.x;
      const y = e.clientY - rect.top + canvasOffset.y;
      console.log('x:', x, 'y:', y);
      
      const newCard = {
        title: 'New Card',
        content: '# New Card\n\nClick to edit',
        positionX: x,
        positionY: y,
        width: 200,
        height: 150,
        canvasId: selectedCanvas,
        createdAt: new Date().toISOString(), // Ensure it's a string
      };

      console.log('Creating new card:', newCard);

      try {
        const newCardData = await createCard(newCard);
        console.log('New card created:', newCardData);
        setCards((prevCards) => [...prevCards, newCardData]);
      } catch (error) {
        console.error('Error creating card:', error);
        console.error('Server response:', error.response?.data);
      }
    }
  }, [canvasOffset, selectedCanvas]);


  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only respond to left mouse button
    setIsDragging(true);
    setStartPos({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newX = e.clientX - startPos.x;
    const newY = e.clientY - startPos.y;
    setCanvasOffset({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateCard = useCallback(async (id, updates) => {
    try {
      // Find the existing card data
      const existingCard = cards.find(card => card.id === id);
      if (!existingCard) return;
  
      // Prepare the updated card data
      const updatedCard = {
        ...existingCard,
        ...updates,
      };
  
      // Update in backend
      await updateCardAPI(id, updatedCard);
  
      // Update local state
      setCards(cards => cards.map(card => 
        card.id === id ? updatedCard : card
      ));
    } catch (error) {
      console.error('Error updating card:', error);
    }
  }, [cards]);

  const deleteCard = useCallback(async (id) => {
    try {
      // Delete from backend
      await deleteCardAPI(id);
  
      // Update local state
      setCards(cards => cards.filter(card => card.id !== id));
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  }, []);

  console.log('Rendering Canvas component. Error:', error);

  return (
    <ErrorBoundary>
      {error ? (
        <div data-testid="error-message" className="text-red-500 p-4">
          {error}
        </div>
      ) : (
        <div data-testid="canvas-component" className="flex h-screen overflow-hidden bg-gray-100 relative">
          {sidebarOpen && (
            <div data-testid="sidebar" className="w-64 bg-white shadow-md p-4">
              <h2 className="text-xl font-bold mb-4">Canvases</h2>
              <ul data-testid="canvas-list">
                {Array.isArray(canvases) && canvases.map(canvas => (
                  <li
                    key={canvas.id}
                    data-testid={`canvas-item-${canvas.id}`}
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
            data-testid="canvas-area" 
            className="flex-grow relative"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDoubleClick={handleCanvasDoubleClick}
          >
            <canvas
              ref={canvasRef}
              data-testid="canvas-element"
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              width={window.innerWidth}
              height={window.innerHeight}
            />
            <div 
              data-testid="cards-container" 
              className="relative" 
              style={{ 
                transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px)`,
                cursor: isDragging ? 'grabbing' : 'grab'
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
            <div 
              data-testid="move-icon-container" 
              className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md"
            >
              <Move size={24} />
            </div>
            <button 
              data-testid="sidebar-toggle-button" 
              className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <PanelLeftClose size={24} /> : <PanelLeftOpen size={24} />}
            </button>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
}

export default Canvas;
