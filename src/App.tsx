import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Player from './components/Player';
import AIGenerator from './components/AIGenerator';
import Search from './components/Search';
import Library from './components/Library';
import LikedSongs from './components/LikedSongs';
import Playlist from './components/Playlist';
import { PlayerProvider } from './context/PlayerContext';
import { QueueProvider } from './context/QueueContext';

const genreSubgenres = {
  "Pop": ["Dance-pop", "Teen pop", "Synth-pop"],
  "Rock": ["Classic rock", "Punk rock", "Alternative rock"],
  "Hip-Hop/Rap": ["Trap", "Boom bap", "Cloud rap"],
  "Electronic/Dance": ["House", "Techno", "Dubstep"],
  "Jazz": ["Bebop", "Smooth jazz", "Acid jazz"],
  "Classical": ["Baroque", "Romantic", "Contemporary classical"],
};

export default function App() {
  const [showGenerator, setShowGenerator] = useState(false);

  const handleGenerateClick = () => {
    console.log('Opening generator...');
    setShowGenerator(true);
  };

  const handleGeneratorClose = () => {
    console.log('Closing generator...');
    setShowGenerator(false);
  };

  return (
    <PlayerProvider>
      <QueueProvider>
        <Router>
          <div className="h-screen flex flex-col bg-black text-white">
            <div className="flex-1 flex overflow-hidden">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                {showGenerator ? (
                  <AIGenerator 
                    genreSubgenres={genreSubgenres}
                    onClose={handleGeneratorClose}
                  />
                ) : (
                  <Routes>
                    <Route path="/" element={<MainContent onGenerateClick={handleGenerateClick} />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/library" element={<Library />} />
                    <Route path="/liked" element={<LikedSongs />} />
                    <Route path="/playlist/:id" element={<Playlist />} />
                  </Routes>
                )}
              </div>
            </div>
            <Player />
          </div>
        </Router>
      </QueueProvider>
    </PlayerProvider>
  );
}