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
  });

  const loadCards = useCallback(async () => {
    const response = await fetchCards();
    setCards(response.data.filter((card) => card.canvasId === canvasId));
  }, [canvasId]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const handleCreateCard = async () => {
    await createCard(newCard);
    setNewCard({
      title: '',
      content: '',
      positionX: 0,
      positionY: 0,
      width: 100,
      height: 100,
      canvasId,
    });
    loadCards();
  };

  const handleEditCard = (card) => {
    setEditingCardId(card.id);
    setEditingCard({ ...card });
  };

  const handleUpdateCard = async () => {
    await updateCard(editingCardId, editingCard);
    setEditingCardId(null);
    setEditingCard({
      title: '',
      content: '',
      positionX: 0,
      positionY: 0,
      width: 100,
      height: 100,
      canvasId,
    });
    loadCards();
  };

  const handleDeleteCard = async (id) => {
    await deleteCard(id);
    loadCards();
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
