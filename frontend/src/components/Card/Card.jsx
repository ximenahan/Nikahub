import React, { useState, useEffect, useCallback } from 'react';
import { fetchCards, createCard, updateCard, deleteCard } from '../services/cardService';
import './Card.css';

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
    loadCards(); // call loadCards after creating a card
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
    loadCards(); // call loadCards after updating a card
  };

  const handleDeleteCard = async (id) => {
    await deleteCard(id);
    loadCards(); // call loadCards after deleting a card
  };

  return (
    <div>
      <h3>Cards</h3>
      <input
        value={newCard.title}
        onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
        placeholder="Card Title"
      />
      <input
        value={newCard.content}
        onChange={(e) => setNewCard({ ...newCard, content: e.target.value })}
        placeholder="Card Content"
      />
      <button onClick={handleCreateCard}>Add Card</button>
      <ul>
        {cards.map((card) => (
          <li key={card.id}>
            {editingCardId === card.id ? (
              <div>
                <input
                  value={editingCard.title}
                  onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                  placeholder="Edit Card Title"
                />
                <input
                  value={editingCard.content}
                  onChange={(e) => setEditingCard({ ...editingCard, content: e.target.value })}
                  placeholder="Edit Card Content"
                />
                <button onClick={handleUpdateCard}>Save</button>
                <button onClick={() => setEditingCardId(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <h4>{card.title}</h4>
                <p>{card.content}</p>
                <button onClick={() => handleEditCard(card)}>Edit</button>
                <button onClick={() => handleDeleteCard(card.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Card;
