import React from 'react';

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6">Welcome Back</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div 
            key={item}
            className="p-4 bg-gray-900/50 rounded-lg hover:bg-gray-900 transition-colors cursor-pointer"
          >
            <div className="w-full aspect-square bg-gray-800 rounded-md mb-4"></div>
            <h3 className="font-medium">Playlist {item}</h3>
            <p className="text-sm text-gray-400">Sample Description</p>
          </div>
        ))}
      </div>
    </div>
  );
}