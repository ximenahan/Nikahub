import React, { useState, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';

const SingleCard = ({ card, updateCard, deleteCard, startConnection, endConnection }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const textareaRef = useRef(null);

  const handleMouseDown = (e, action) => {
    e.stopPropagation();
    if (action === 'drag') setIsDragging(true);
    if (action === 'resize') setIsResizing(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;
      updateCard(card.id, { positionX: card.positionX + dx, positionY: card.positionY + dy });
      setStartPos({ x: e.clientX, y: e.clientY });
    }
    if (isResizing) {
      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;
      updateCard(card.id, { 
        width: Math.max(100, card.width + dx),
        height: Math.max(100, card.height + dy)
      });
      setStartPos({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging, isResizing, startPos, card, updateCard]);

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleBlur = () => {
    setIsEditing(false);
    updateCard(card.id, { content: textareaRef.current.value });
  };

  return (
    <div 
      className="absolute bg-white shadow-lg rounded-lg overflow-hidden"
      style={{ 
        left: card.positionX, 
        top: card.positionY, 
        width: card.width, 
        height: card.height,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={(e) => handleMouseDown(e, 'drag')}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
    >
      <div className="absolute top-2 right-2 flex space-x-2 opacity-0 hover:opacity-100 transition-opacity">
        <button 
          className="text-blue-500 hover:text-blue-700 text-sm"
          onMouseDown={(e) => {
            e.stopPropagation();
            startConnection(card.id);
          }}
        >
          Connect
        </button>
        <button 
          className="text-red-500 hover:text-red-700 text-sm"
          onClick={(e) => {
            e.stopPropagation();
            deleteCard(card.id);
          }}
        >
          Delete
        </button>
      </div>
      {isEditing ? (
        <textarea
          ref={textareaRef}
          className="w-full h-full p-4 resize-none outline-none"
          defaultValue={card.content}
          onBlur={handleBlur}
        />
      ) : (
        <div className="p-4 w-full h-full overflow-auto">
          <ReactMarkdown>{card.content}</ReactMarkdown>
        </div>
      )}
      <div 
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={(e) => handleMouseDown(e, 'resize')}
      />
    </div>
  );
};

export default SingleCard;
