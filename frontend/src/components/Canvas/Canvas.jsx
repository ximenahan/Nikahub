import React, { useState, useEffect } from 'react';
import { fetchCanvases, createCanvas, updateCanvas, deleteCanvas } from '../../services/canvasService';
import Card from '../Card/Card';

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

  const handleUpdateCanvas = async () => {
    await updateCanvas(editingCanvasId, { name: editingCanvasName });
    setEditingCanvasId(null);
    setEditingCanvasName('');
    loadCanvases();
  };

  const handleDeleteCanvas = async (id) => {
    await deleteCanvas(id);
    loadCanvases();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Canvases</h1>
      <input
        value={newCanvas}
        onChange={(e) => setNewCanvas(e.target.value)}
        placeholder="New Canvas Name"
        className="border p-2 mb-4"
      />
      <button onClick={handleCreateCanvas} className="bg-blue-500 text-white p-2 rounded mb-4">
        Add Canvas
      </button>
      <ul>
        {canvases.map((canvas) => (
          <li key={canvas.id} className="mb-4">
            {editingCanvasId === canvas.id ? (
              <div>
                <input
                  value={editingCanvasName}
                  onChange={(e) => setEditingCanvasName(e.target.value)}
                  placeholder="Edit Canvas Name"
                  className="border p-2 mb-2"
                />
                <button onClick={handleUpdateCanvas} className="bg-green-500 text-white p-2 rounded mb-2">
                  Save
                </button>
                <button onClick={() => setEditingCanvasId(null)} className="bg-gray-500 text-white p-2 rounded mb-2">
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-xl">{canvas.name}</h2>
                <button onClick={() => handleEditCanvas(canvas)} className="bg-yellow-500 text-white p-2 rounded mb-2">
                  Edit
                </button>
                <button onClick={() => handleDeleteCanvas(canvas.id)} className="bg-red-500 text-white p-2 rounded mb-2">
                  Delete
                </button>
                <Card canvasId={canvas.id} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Canvas;
