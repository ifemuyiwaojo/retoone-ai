import React, { useState } from 'react';
import './App.css';
import Sidebar from './Sidebar';
import headerImage from './header-image.png'; // You'll need to add this image to your src folder


// Import your custom images
import byteBeatImage from './images/bytebeat-artist.jpg';
import quantumHarmonyImage from './images/quantum-harmony-artist.jpg';
import neuralNoteImage from './images/neural-note-artist.jpg';
import synthSoulImage from './images/synth-soul-artist.jpg';
import dataMelodyImage from './images/data-melody-artist.jpg';
import algoRhythmImage from './images/algo-rhythm-artist.jpg';

import digitalDreamscapeAlbum from './images/digital-dreamscape-album.jpg';
import quantumQuaversAlbum from './images/quantum-quavers-album.jpg';
import neuralNocturnesAlbum from './images/neural-nocturnes-album.jpg';
import syntheticSerenadesAlbum from './images/synthetic-serenades-album.jpg';
import dataDecibelsAlbum from './images/data-decibels-album.jpg';
import algorithmicAnthemsAlbum from './images/algorithmic-anthems-album.jpg';

const genreSubgenres = {
  "Pop": ["Dance-pop", "Teen pop", "Synth-pop"],
  "Rock": ["Classic rock", "Punk rock", "Alternative rock"],
  "Hip-Hop/Rap": ["Trap", "Boom bap", "Cloud rap"],
  "Electronic/Dance": ["House", "Techno", "Dubstep"],
  "Jazz": ["Bebop", "Smooth jazz", "Acid jazz"],
  "Classical": ["Baroque", "Romantic", "Contemporary classical"],
  "Country": ["Traditional country", "Country pop", "Americana"],
  "R&B/Soul": ["Neo-soul", "Funk", "Contemporary R&B"],
  "Reggae": ["Dub", "Dancehall", "Roots reggae"],
  "Afrobeat": ["Afro-fusion", "Highlife"],
  "World Music": ["K-pop", "Flamenco"],
  "Indie/Alternative": ["Indie rock", "Indie pop", "Alternative folk"],
  "Metal": ["Heavy metal", "Black metal", "Metalcore"],
  "Folk": ["Contemporary folk", "Folk rock", "Folk punk"],
  "Blues": ["Delta blues", "Chicago blues", "Electric blues"],
  "Latin": ["Reggaeton", "Salsa", "Latin pop"],
  "Soundtracks": ["Movie scores", "Video game music", "Musical theater"],
  "Others": ["New age", "Children's music", "Comedy"]
};

function App() {
  const [activeGenre, setActiveGenre] = useState(null);
  const [activeSubgenres, setActiveSubgenres] = useState({});
  const [inputValue, setInputValue] = useState('');

  const handleGenreClick = (genre) => {
    setActiveGenre(activeGenre === genre ? null : genre);
    setActiveSubgenres({}); // Reset subgenres when changing genre
  };

  const handleSubgenreClick = (subgenre) => {
    setActiveSubgenres(prev => ({
      ...prev,
      [subgenre]: !prev[subgenre]
    }));
  };

const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleGenerate = (event) => {
    event.preventDefault();
    const selectedSubgenres = Object.keys(activeSubgenres).filter(key => activeSubgenres[key]);
    const preferences = {
      description: inputValue,
      genre: activeGenre,
      subgenres: selectedSubgenres
    };


 // Here you would typically send the preferences to your API
    console.log('Generating music with preferences:', preferences);
    // You can add your API call here
    // For example: generateMusic(preferences);
  };

 const aiArtists = [
    { name: 'ByteBeat', image: byteBeatImage },
    { name: 'QuantumHarmony', image: quantumHarmonyImage },
    { name: 'NeuralNote', image: neuralNoteImage },
    { name: 'SynthSoul', image: synthSoulImage },
    { name: 'DataMelody', image: dataMelodyImage },
    { name: 'AlgoRhythm', image: algoRhythmImage }
  ];

  const aiAlbums = [
    { name: 'Digital Dreamscape', artist: 'ByteBeat', image: digitalDreamscapeAlbum },
    { name: 'Quantum Quavers', artist: 'QuantumHarmony', image: quantumQuaversAlbum },
    { name: 'Neural Nocturnes', artist: 'NeuralNote', image: neuralNocturnesAlbum },
    { name: 'Synthetic Serenades', artist: 'SynthSoul', image: syntheticSerenadesAlbum },
    { name: 'Data Decibels', artist: 'DataMelody', image: dataDecibelsAlbum },
    { name: 'Algorithmic Anthems', artist: 'AlgoRhythm', image: algorithmicAnthemsAlbum }
  ];


const [selectedImage, setSelectedImage] = useState(null);

const handleImageClick = (item, type) => {
    setSelectedImage({
      url: item.image,
      name: item.name,
      type: type,
      artist: type === 'Album' ? item.artist : null
    });
  };

  return (
    <div className="container">
      <header>
        <img src={headerImage} alt="Retoone AI" className="header-image" />
      </header>

      <div className="content">
        <Sidebar />

   <main className="main-content">
        <div className="prompt-section">
          <h2>What kind of AI-generated music do you want to listen to?</h2>
          <form onSubmit={handleGenerate} className="generate-form">
            <input 
              type="text" 
              className="input-box" 
              placeholder="Describe the music you want generated..." 
              value={inputValue}
              onChange={handleInputChange}
            />
            <button type="submit" className="generate-button">Generate</button>
          </form>

     <div className="genre-options">
            {Object.keys(genreSubgenres).map((genre) => (
              <div key={genre} className="genre-container">
                <button
                  className={`genre-option ${activeGenre === genre ? 'active' : ''}`}
                  onClick={() => handleGenreClick(genre)}
                >
                  {genre}
                </button>
                {activeGenre === genre && (
                  <div className="subgenre-options">
                    {genreSubgenres[genre].map((subgenre) => (
                      <button
                        key={subgenre}
                        className={`subgenre-option ${activeSubgenres[subgenre] ? 'active' : ''}`}
                        onClick={() => handleSubgenreClick(subgenre)}
                      >
                        {subgenre}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>


      <div className="section">
          <div className="section-header">
            <h2>Popular AI Artists</h2>
            <a href="/#" className="show-all">Show all</a>
          </div>
          <div className="grid">
            {aiArtists.map((artist) => (
              <div key={artist.name} className="item artist" onClick={() => handleImageClick(artist, 'Artist')}>
                <div className="item-image" style={{backgroundImage: `url(${artist.image})`}}></div>
                <p className="item-name">{artist.name}</p>
                <p className="item-type">AI Artist</p>
              </div>
            ))}
          </div>
        </div>
        <div className="section">
          <div className="section-header">
            <h2>Popular AI Albums</h2>
            <a href="/#" className="show-all">Show all</a>
          </div>
          <div className="grid">
            {aiAlbums.map((album) => (
              <div key={album.name} className="item" onClick={() => handleImageClick(album, 'Album')}>
                <div className="item-image" style={{backgroundImage: `url(${album.image})`}}></div>
                <p className="item-name">{album.name}</p>
                <p className="item-type">{album.artist}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <aside className="now-playing">
        <h2>Now Playing</h2>
        <div className="item">
          <div className="item-image" style={{backgroundImage: "url('https://picsum.photos/seed/nowplaying/200')"}}></div>
          <p className="item-name">AI Generated Song</p>
          <p className="item-type">AI Artist</p>
        </div>
        {selectedImage && (
          <div className="selected-item">
            <h3>Selected {selectedImage.type}</h3>
            <div className="selected-image-container">
              <img src={selectedImage.url} alt={selectedImage.name} className="selected-image" />
            </div>
            <p className="item-name">{selectedImage.name}</p>
            {selectedImage.type === 'Album' && <p className="item-type">{selectedImage.artist}</p>}
          </div>
        )}
      </aside>
      </div>

<footer>
        <p>&copy; 2024 Retoone AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;