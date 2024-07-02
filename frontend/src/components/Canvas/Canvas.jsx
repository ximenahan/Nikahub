import React, { useState, useEffect } from 'react';
import { fetchCanvases, createCanvas, updateCanvas, deleteCanvas } from '../services/canvasService';
import Card from '../Card/Card';
import './Canvas.css';

const Canvas = () => {
  const [canvases, setCanvases] = useState([]);
  const [newCanvas, setNewCanvas] = useState('');
  const [editingCanvasId, setEditingCanvasId] = useState(null);
  const [editingCanvasName, setEditingCanvasName] = useState('');

  useEffect(() => {
    loadCanvases();
  }, []);

  const loadCanvases = async () => {
    const response = await fetchCanvases();
    setCanvases(response.data);
  };

  const handleCreateCanvas = async () => {
    await createCanvas({ name: newCanvas, createdAt: new Date() });
    setNewCanvas('');
    loadCanvases();
  };

  const handleEditCanvas = (canvas) => {
    setEditingCanvasId(canvas.id);
    setEditingCanvasName(canvas.name);
  };

  const handleUpdateCanvas = async (id) => {
    await updateCanvas(id, { name: editingCanvasName });
    setEditingCanvasId(null);
    setEditingCanvasName('');
    loadCanvases();
  };

  const handleDeleteCanvas = async (id) => {
    await deleteCanvas(id);
    loadCanvases();
  };

  return (
    <div>
      <h1>Canvases</h1>
      <input
        value={newCanvas}
        onChange={(e) => setNewCanvas(e.target.value)}
        placeholder="New Canvas Name"
      />
      <button onClick={handleCreateCanvas}>Add Canvas</button>
      <ul>
        {canvases.map((canvas) => (
          <li key={canvas.id}>
            {editingCanvasId === canvas.id ? (
              <div>
                <input
                  value={editingCanvasName}
                  onChange={(e) => setEditingCanvasName(e.target.value)}
                  placeholder="Edit Canvas Name"
                />
                <button onClick={() => handleUpdateCanvas(canvas.id)}>Save</button>
                <button onClick={() => setEditingCanvasId(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <h2>{canvas.name}</h2>
                <button onClick={() => handleEditCanvas(canvas)}>Edit</button>
                <button onClick={() => handleDeleteCanvas(canvas.id)}>Delete</button>
              </div>
            )}
            <Card canvasId={canvas.id} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Canvas;
