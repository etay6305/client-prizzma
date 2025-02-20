import React, { useRef, useState } from 'react';
import "./playvideo.css";

const tracks = [
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3',
];

function PlayVideo() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [play, setplay] = useState(true);
  const handlePlay = () => {
    audioRef.current?.play();
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prevIndex) =>
      prevIndex < tracks.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : tracks.length - 1
    );
  };

  

  return (
    <div className="futuristic-player-container">
      <audio ref={audioRef} src={tracks[currentTrackIndex]} />

      <div className="futuristic-player">
        <div className="track-info">
          <h3>Playing track #{currentTrackIndex + 1}</h3>
        </div>

        <div className="controls">
          <button className="control-btn" onClick={handlePrev}>
           ⏮
          </button>
          {play ? (<button className="control-btn play-btn" onClick={() => {handlePlay(); setplay(!play);}}>
            ▶
          </button>
          ):(
            <button className="control-btn stop-btn" onClick={() => {handleStop(); setplay(!play)}}>
                 ■
               </button>)}
          <button className="control-btn" onClick={handlePause}>
            Pause
          </button>
          <button className="control-btn" onClick={handleNext}>
           ⏭
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlayVideo;
