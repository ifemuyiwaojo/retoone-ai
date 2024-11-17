export function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function calculateProgress(current: number, total: number): number {
  if (!isFinite(current) || !isFinite(total) || total <= 0) return 0;
  return Math.min(Math.max((current / total) * 100, 0), 100);
}

export async function validateAudioUrl(url: string): Promise<boolean> {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    return false;
  }

  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      headers: {
        'Range': 'bytes=0-0'
      }
    });

    if (!response.ok) {
      const getResponse = await fetch(url, {
        headers: {
          'Range': 'bytes=0-1024'
        }
      });
      
      return getResponse.ok;
    }

    return true;
  } catch {
    return new Promise((resolve) => {
      const audio = new Audio();
      let timeoutId: NodeJS.Timeout;

      const cleanup = () => {
        audio.removeEventListener('canplaythrough', handleCanPlay);
        audio.removeEventListener('error', handleError);
        audio.src = '';
        clearTimeout(timeoutId);
      };

      const handleCanPlay = () => {
        cleanup();
        resolve(true);
      };

      const handleError = () => {
        cleanup();
        resolve(false);
      };

      timeoutId = setTimeout(() => {
        cleanup();
        resolve(false);
      }, 5000);

      audio.addEventListener('canplaythrough', handleCanPlay);
      audio.addEventListener('error', handleError);
      
      audio.src = url;
      audio.load();
    });
  }
}