import React, { useState, useEffect, useCallback } from 'react';
import { fetchCards, createCard, updateCard, deleteCard } from '../../services/cardService';

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
  const [editingCardId, setEditingCardId] = useState(null);
  const [editingCard, setEditingCard] = useState({
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

  const handleEditCard = (card) => {
    setEditingCardId(card.id);
    setEditingCard({ ...card });
  };

  const handleUpdateCard = async () => {
    const validCard = {
      ...editingCard,
      positionX: Number(editingCard.positionX),
      positionY: Number(editingCard.positionY),
      width: Number(editingCard.width),
      height: Number(editingCard.height),
      canvasId: Number(canvasId),
      createdAt: editingCard.createdAt || new Date().toISOString(),
    };

    try {
      await updateCard(editingCardId, validCard);
      setEditingCardId(null);
      setEditingCard({
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
    <div className="p-4">
      <h3 className="text-xl font-bold mb-4">Cards</h3>
      <div className="mb-4">
        <input
          value={newCard.title}
          onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
          placeholder="Card Title"
          className="border p-2 mb-2"
        />
        <input
          value={newCard.content}
          onChange={(e) => setNewCard({ ...newCard, content: e.target.value })}
          placeholder="Card Content"
          className="border p-2 mb-2"
        />
        <button onClick={handleCreateCard} className="bg-blue-500 text-white p-2 rounded">
          Add Card
        </button>
      </div>
      <ul>
        {cards.map((card) => (
          <li key={card.id} className="mb-4">
            {editingCardId === card.id ? (
              <div>
                <input
                  value={editingCard.title}
                  onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                  placeholder="Edit Card Title"
                  className="border p-2 mb-2"
                />
                <input
                  value={editingCard.content}
                  onChange={(e) => setEditingCard({ ...editingCard, content: e.target.value })}
                  placeholder="Edit Card Content"
                  className="border p-2 mb-2"
                />
                <button onClick={handleUpdateCard} className="bg-green-500 text-white p-2 rounded mb-2">
                  Save
                </button>
                <button onClick={() => setEditingCardId(null)} className="bg-gray-500 text-white p-2 rounded mb-2">
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <h4 className="text-lg font-semibold">{card.title}</h4>
                <p>{card.content}</p>
                <button onClick={() => handleEditCard(card)} className="bg-yellow-500 text-white p-2 rounded mb-2">
                  Edit
                </button>
                <button onClick={() => handleDeleteCard(card.id)} className="bg-red-500 text-white p-2 rounded mb-2">
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Card;