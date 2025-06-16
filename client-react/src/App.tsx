import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MobileChatUI from './mobile/MobileChatUI';

function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MobileChatUI />} />
      </Routes>
    </Router>
  );
}

export default App;
