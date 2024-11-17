import React from 'react';
import { X, Music2 } from 'lucide-react';
import { Track } from '../../types';

interface QueuePanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrack: Track | null;
  queue: Track[];
  history: Track[];
  onTrackSelect: (track: Track) => void;
  onRemoveFromQueue: (trackId: string) => void;
}

export default function QueuePanel({
  isOpen,
  onClose,
  currentTrack,
  queue = [],
  history = [],
  onTrackSelect,
  onRemoveFromQueue
}: QueuePanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 bottom-20 w-96 bg-gray-900 shadow-lg z-50 overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h3 className="text-lg font-bold">Play Queue</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {currentTrack && (
          <div className="p-4 border-b border-gray-800">
            <div className="text-sm text-gray-400 mb-2">Now Playing</div>
            <div className="flex items-center gap-3">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="w-12 h-12 rounded"
              />
              <div>
                <div className="font-medium text-green-500">{currentTrack.title}</div>
                <div className="text-sm text-gray-400">{currentTrack.artist}</div>
              </div>
            </div>
          </div>
        )}

        {queue.length > 0 ? (
          <div className="p-4 border-b border-gray-800">
            <div className="text-sm text-gray-400 mb-2">Next Up • {queue.length} tracks</div>
            <div className="space-y-2">
              {queue.map((track) => (
                <div key={track.id} className="flex items-center gap-3 group">
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-12 h-12 rounded"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{track.title}</div>
                    <div className="text-sm text-gray-400">{track.artist}</div>
                  </div>
                  <button
                    onClick={() => onRemoveFromQueue(track.id)}
                    className="p-2 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-full transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400 border-b border-gray-800">
            <Music2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Your queue is empty</p>
            <p className="text-sm">Add songs to play next</p>
          </div>
        )}

        {history.length > 0 && (
          <div className="p-4">
            <div className="text-sm text-gray-400 mb-2">Recently Played • {history.length} tracks</div>
            <div className="space-y-2">
              {history.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded transition-colors"
                  onClick={() => onTrackSelect(track)}
                >
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-12 h-12 rounded"
                  />
                  <div>
                    <div className="font-medium">{track.title}</div>
                    <div className="text-sm text-gray-400">{track.artist}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}