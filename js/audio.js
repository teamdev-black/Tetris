// audio.js

const SOUND_URLS = {
  land: 'sounds/tetris_block_land.mp3',
  rotate: 'sounds/tetris_block_rotate.mp3',
  clear: 'sounds/tetris_line_clear.mp3'
};
const BGM_URL = 'sounds/tetris_background_music.mp3';  

let bgm;
let bgmLoaded = false;

const VOLUMES = {
  land: 0.7,    
  rotate: 0.2,  
  clear: 0.5,    
  bgm: 0.02
};

const sounds = {};

// 効果音を読み込む関数
export function loadSounds() {
  Object.entries(SOUND_URLS).forEach(([key, url]) => {
      sounds[key] = new Audio(url);
      sounds[key].volume = VOLUMES[key]; 
  });
  bgm = new Audio(BGM_URL);
  bgm.volume = VOLUMES.bgm;
  bgm.loop = true; 
  
  // BGMの読み込みが完了したらフラグを立てる
  bgm.oncanplaythrough = () => {
      bgmLoaded = true;
  };
}

export function playBGM() {
  if (bgmLoaded) {
      bgm.play();
  } else {
      // BGMがまだ読み込まれていない場合、読み込み完了後に自動再生
      bgm.oncanplaythrough = () => {
          bgmLoaded = true;
          bgm.play();
      };
  }
}

export function stopBGM() {
    if (bgm) {
        bgm.pause();
        bgm.currentTime = 0;
    }
}
// 効果音を再生する関数
export function playSound(soundName) {
    if (sounds[soundName]) {
        sounds[soundName].currentTime = 0;  // 音を最初から再生
        sounds[soundName].play();
    }
}

