import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Player from './Player';
import Home from '../pages/Home';
import Search from '../pages/Search';
import Library from '../pages/Library';

export default function Layout() {
  return (
    <div className="h-screen flex flex-col bg-black text-white">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-gradient-to-b from-gray-900 to-black">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/library" element={<Library />} />
          </Routes>
        </main>
      </div>
      <Player />
    </div>
  );
}