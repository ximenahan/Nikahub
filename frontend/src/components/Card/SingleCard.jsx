import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import debounce from 'lodash.debounce';

const SingleCard = ({ card, updateCard, deleteCard, startConnection, endConnection }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const textareaRef = useRef(null);

  const [localCard, setLocalCard] = useState(card);

  useEffect(() => {
    setLocalCard(card);
  }, [card]);

  // Ref to store the debounced function
  const debouncedUpdateCardRef = useRef();

  useEffect(() => {
    debouncedUpdateCardRef.current = debounce((id, updatedCard) => {
      updateCard(id, updatedCard);
    }, 500);
  }, [updateCard]);

  const handleMouseDown = (e, action) => {
    e.stopPropagation();
    e.preventDefault();
    if (action === 'drag') setIsDragging(true);
    if (action === 'resize') setIsResizing(true);
    setStartPos({ x: e.clientX, y: e.clientY });

    // Attach event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    if (isDragging) {
      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;
      setLocalCard((prev) => ({
        ...prev,
        positionX: prev.positionX + dx,
        positionY: prev.positionY + dy,
      }));
      setStartPos({ x: e.clientX, y: e.clientY });
    }
    if (isResizing) {
      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;
      setLocalCard((prev) => ({
        ...prev,
        width: Math.max(100, prev.width + dx),
        height: Math.max(100, prev.height + dy),
      }));
      setStartPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);

    // Remove event listeners
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);

    // Save the updated card to backend using the debounced function
    debouncedUpdateCardRef.current(localCard.id, localCard);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleBlur = () => {
    setIsEditing(false);
    setLocalCard((prev) => ({
      ...prev,
      content: textareaRef.current.value,
    }));
    updateCard(localCard.id, { content: textareaRef.current.value });
  };

  return (
    <div
      className="absolute bg-white shadow-lg rounded-lg overflow-hidden"
      style={{
        left: localCard.positionX,
        top: localCard.positionY,
        width: localCard.width,
        height: localCard.height,
      }}
    >
      {/* Header area for dragging */}
      <div
        className="cursor-move p-2 bg-gray-200"
        onMouseDown={(e) => handleMouseDown(e, 'drag')}
      >
        <span>Drag Me</span>
      </div>
      {/* Content area */}
      {isEditing ? (
        <textarea
          ref={textareaRef}
          className="w-full h-full p-4 resize-none outline-none"
          defaultValue={localCard.content}
          onBlur={handleBlur}
        />
      ) : (
        <div
          className="p-4 w-full h-full overflow-auto"
          onDoubleClick={handleDoubleClick}
        >
          <ReactMarkdown>{localCard.content}</ReactMarkdown>
        </div>
      )}
      {/* Resize handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={(e) => handleMouseDown(e, 'resize')}
        style={{ backgroundColor: 'gray' }} // Ensure it's visible and can capture events
      />
      {/* Control buttons */}
      <div className="absolute top-2 right-2 flex space-x-2 opacity-0 hover:opacity-100 transition-opacity">
        <button
          className="text-red-500 hover:text-red-700 text-sm"
          onClick={(e) => {
            e.stopPropagation();
            deleteCard(localCard.id);
          }}
        >
          Delete
        </button>
        {/* Comment out the Connect button */}
        {/* 
        <button 
          className="text-blue-500 hover:text-blue-700 text-sm"
          onMouseDown={(e) => {
            e.stopPropagation();
            startConnection(localCard.id);
          }}
        >
          Connect
        </button> 
        */}
      </div>
    </div>
  );
};

export default SingleCard;
