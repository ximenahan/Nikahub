import React from 'react';
import ErrorBoundary from './components/ErrorBoundary'; 
import Canvas from './components/Canvas/Canvas';

const App = () => {
  return (
    <div className="bg-gray-200 min-h-screen w-full p-4">
      <ErrorBoundary>
        <Canvas />
      </ErrorBoundary>
    </div>
  );
};

export default App;
