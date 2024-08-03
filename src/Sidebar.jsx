import React from 'react';
import { Home, Compass, Book, Radio, PlusCircle } from 'lucide-react';
import logoImage from './images/logo.png';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo-container">
        <img src={logoImage} alt="Retoone AI Logo" className="logo-image" />
      </div>
      <nav>
        <ul>
          <li><a href="/#"><Home color="#ff5733" size={24} /> Home</a></li>
          <li><a href="/#"><Compass color="#ffdd33" size={24} /> Explore</a></li>
          <li><a href="/#"><Book color="#33ff57" size={24} /> Library</a></li>
          <li><a href="/#"><Radio color="#33ddff" size={24} /> Existing Radio</a></li>
          <li><a href="/#"><PlusCircle color="#8c33ff" size={24} /> Create Radio</a></li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;