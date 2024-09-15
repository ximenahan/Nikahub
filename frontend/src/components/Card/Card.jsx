import React, { useState, useCallback, useEffect } from 'react';
import { fetchCards, createCard, updateCard, deleteCard } from '../../services/cardService';
import SingleCard from './SingleCard'; 

const Card = ({ canvasId }) => {
  const [cards, setCards] = useState([]);
  const [newCard, setNewCard] = useState({
    title: '',
    content: '',
    positionX: 0,
    positionY: 0,
    width: 100,
    height: 100,
    canvasId,
    createdAt: new Date().toISOString(),
  });

  const loadCards = useCallback(async () => {
    try {
      const response = await fetchCards();
      setCards(response.data.filter((card) => card.canvasId === canvasId));
    } catch (error) {
      console.error('Error loading cards:', error);
    }
  }, [canvasId]);

  useEffect(() => {
    loadCards();
  }, [canvasId, loadCards]);

  const handleCreateCard = async () => {
    const validCard = {
      ...newCard,
      positionX: Number(newCard.positionX),
      positionY: Number(newCard.positionY),
      width: Number(newCard.width),
      height: Number(newCard.height),
      canvasId: Number(canvasId),
      createdAt: new Date().toISOString(),
    };

    try {
      console.log('Creating card with data:', validCard);
      await createCard(validCard);
      setNewCard({
        title: '',
        content: '',
        positionX: 0,
        positionY: 0,
        width: 100,
        height: 100,
        canvasId,
        createdAt: new Date().toISOString(),
      });
      loadCards();
    } catch (error) {
      console.error('Error creating card:', error.response?.data || error.message);
    }
  };

  const handleUpdateCard = async (id, updatedCard) => {
    const validCard = {
      ...updatedCard,
      positionX: Number(updatedCard.positionX),
      positionY: Number(updatedCard.positionY),
      width: Number(updatedCard.width),
      height: Number(updatedCard.height),
      canvasId: Number(canvasId),
      createdAt: updatedCard.createdAt || new Date().toISOString(),
    };

    try {
      await updateCard(id, validCard);
      loadCards();
    } catch (error) {
      console.error('Error updating card:', error.response?.data || error.message);
    }
  };

  const handleDeleteCard = async (id) => {
    try {
      await deleteCard(id);
      loadCards();
    } catch (error) {
      console.error('Error deleting card:', error.response?.data || error.message);
    }
  };

  return (
    <div className="relative w-full h-full">
      <h3 className="text-xl font-bold mb-4">Cards</h3>
      <div className="mb-4">
        <input
          value={newCard.title}
          onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
          placeholder="Card Title"
          className="border p-2 mb-2 mr-2"
        />
        <input
          value={newCard.content}
          onChange={(e) => setNewCard({ ...newCard, content: e.target.value })}
          placeholder="Card Content"
          className="border p-2 mb-2 mr-2"
        />
        <button onClick={handleCreateCard} className="bg-blue-500 text-white p-2 rounded">
          Add Card
        </button>
      </div>
      {cards.map((card) => (
        <SingleCard
          key={card.id}
          card={card}
          updateCard={handleUpdateCard}
          deleteCard={handleDeleteCard}
          startConnection={() => {}}
          endConnection={() => {}}
        />
      ))}
    </div>
  );
};

export default Card;
