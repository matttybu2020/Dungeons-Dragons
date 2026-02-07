class AudioManager {
    constructor() {
        this.sounds = {
            click: new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'),
            levelUp: new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3'),
            combat: new Audio('https://assets.mixkit.co/active_storage/sfx/2144/2144-preview.mp3'),
            victory: new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3'),
            fireball: new Audio('https://assets.mixkit.co/active_storage/sfx/2591/2591-preview.mp3')
        };

        this.music = {
            world: new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'),
            combat: new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3')
        };

        // Configure loops
        Object.values(this.music).forEach(m => {
            m.loop = true;
            m.volume = 0.3;
        });
    }

    playSFX(name) {
        if (this.sounds[name]) {
            this.sounds[name].currentTime = 0;
            this.sounds[name].play().catch(e => console.log('Audio overlap or blocked'));
        }
    }

    playMusic(type) {
        // Stop all music
        Object.values(this.music).forEach(m => {
            m.pause();
            m.currentTime = 0;
        });

        if (this.music[type]) {
            this.music[type].play().catch(e => console.log('Music blocked by browser policy'));
        }
    }

    setVolume(type, val) {
        if (type === 'music') {
            Object.values(this.music).forEach(m => m.volume = val);
        } else {
            Object.values(this.sounds).forEach(s => s.volume = val);
        }
    }
}

export const audioManager = new AudioManager();
