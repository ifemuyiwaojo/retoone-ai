export function formatTrack(rawTrack, index, { genre, subgenres, description }) {
  if (!rawTrack?.audio_url) {
    console.error('Invalid track data:', rawTrack);
    throw new Error('Track is missing audio URL');
  }

  const variantSuffix = index > 0 ? ` (Variation ${index + 1})` : '';
  const albumName = subgenres.length 
    ? `${genre}: ${subgenres.join(' × ')}` 
    : `${genre} Explorations`;

  const track = {
    id: rawTrack.id || `${Date.now()}-${index}`,
    title: (rawTrack.title || `${genre} Melody`) + variantSuffix,
    artist: `${genre} Collective AI`,
    album: albumName,
    coverUrl: rawTrack.image_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    duration: 180,
    liked: false,
    audioUrl: rawTrack.audio_url,
    lyrics: rawTrack.lyric || '',
    genre,
    description
  };

  // Validate required fields
  const requiredFields = ['id', 'title', 'artist', 'album', 'coverUrl', 'audioUrl'];
  const missingFields = requiredFields.filter(field => !track[field]);

  if (missingFields.length > 0) {
    console.error('Track missing required fields:', {
      missingFields,
      track,
      rawTrack
    });
    throw new Error(`Track is missing required fields: ${missingFields.join(', ')}`);
  }

  return track;
}