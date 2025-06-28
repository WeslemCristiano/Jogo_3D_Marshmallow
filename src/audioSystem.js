// Audio System for Crossy Road Game
class AudioManager {
    constructor() {
        this.sounds = {};
        this.musicVolume = 0.3;
        this.sfxVolume = 0.5;
        this.isMuted = false;
        this.currentMusic = null;
        
        // Load mute state from localStorage
        this.isMuted = localStorage.getItem('crossy-road-muted') === 'true';
        this.musicVolume = parseFloat(localStorage.getItem('crossy-road-music-volume') || '0.3');
        this.sfxVolume = parseFloat(localStorage.getItem('crossy-road-sfx-volume') || '0.5');
        
        this.initializeAudio();
    }

    initializeAudio() {
        // Create audio context for Web Audio API
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
        } catch (e) {
            console.warn('Web Audio API não suportado');
        }

        // Initialize sound effects using oscillators (synthetic sounds)
        this.createSyntheticSounds();
    }

    createSyntheticSounds() {
        // Create synthetic sound effects since we don't have audio files
        this.sounds = {
            move: () => this.playTone(220, 0.1, 'square'),
            collision: () => this.playCollisionSound(),
            bonus: () => this.playBonusSound(),
            milestone: () => this.playMilestoneSound(),
            gameStart: () => this.playGameStartSound(),
            gameOver: () => this.playGameOverSound(),
            loseLife: () => this.playLoseLifeSound(),
            dramaticPause: () => this.playDramaticPauseSound()
        };
    }

    playTone(frequency, duration, type = 'sine', volume = 0.3) {
        if (this.isMuted || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume * this.sfxVolume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    playCollisionSound() {
        if (this.isMuted || !this.audioContext) return;

        // Create crash sound with multiple frequencies
        const frequencies = [80, 120, 200, 300];
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.playTone(freq, 0.3, 'sawtooth', 0.6);
            }, index * 50);
        });
    }

    playBonusSound() {
        if (this.isMuted || !this.audioContext) return;

        // Ascending arpeggio for bonus
        const notes = [261.63, 329.63, 392.00, 523.25]; // C, E, G, C (major chord)
        notes.forEach((freq, index) => {
            setTimeout(() => {
                this.playTone(freq, 0.2, 'sine', 0.4);
            }, index * 100);
        });
    }

    playMilestoneSound() {
        if (this.isMuted || !this.audioContext) return;

        // Fanfare-like sound
        const melody = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C (higher octave)
        melody.forEach((freq, index) => {
            setTimeout(() => {
                this.playTone(freq, 0.3, 'triangle', 0.5);
            }, index * 150);
        });
    }

    playGameStartSound() {
        if (this.isMuted || !this.audioContext) return;

        // Rising scale
        const startMelody = [261.63, 293.66, 329.63, 349.23, 392.00]; // C, D, E, F, G
        startMelody.forEach((freq, index) => {
            setTimeout(() => {
                this.playTone(freq, 0.15, 'sine', 0.4);
            }, index * 80);
        });
    }

    playGameOverSound() {
        if (this.isMuted || !this.audioContext) return;

        // Descending dramatic scale
        const gameOverMelody = [392.00, 369.99, 329.63, 293.66, 261.63]; // G, F#, E, D, C
        gameOverMelody.forEach((freq, index) => {
            setTimeout(() => {
                this.playTone(freq, 0.4, 'triangle', 0.5);
            }, index * 200);
        });
    }

    playBackgroundMusic() {
        if (this.isMuted || !this.audioContext || this.currentMusic) return;

        // Simple background melody loop
        const melody = [
            261.63, 293.66, 329.63, 293.66, // C, D, E, D
            261.63, 293.66, 329.63, 349.23, // C, D, E, F
            392.00, 349.23, 329.63, 293.66, // G, F, E, D
            261.63, 261.63, 261.63, 0       // C, C, C, rest
        ];

        const playMelody = () => {
            if (this.isMuted) return;
            
            melody.forEach((freq, index) => {
                setTimeout(() => {
                    if (freq > 0 && !this.isMuted) {
                        this.playTone(freq, 0.4, 'sine', 0.1);
                    }
                }, index * 500);
            });
        };

        // Play melody and loop
        playMelody();
        this.currentMusic = setInterval(playMelody, melody.length * 500);
    }

    stopBackgroundMusic() {
        if (this.currentMusic) {
            clearInterval(this.currentMusic);
            this.currentMusic = null;
        }
    }

    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }

    setMuted(muted) {
        this.isMuted = muted;
        localStorage.setItem('crossy-road-muted', muted.toString());
        
        if (muted) {
            this.stopBackgroundMusic();
        } else {
            this.playBackgroundMusic();
        }
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        localStorage.setItem('crossy-road-music-volume', this.musicVolume.toString());
    }

    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        localStorage.setItem('crossy-road-sfx-volume', this.sfxVolume.toString());
    }

    resumeAudioContext() {
        // Resume audio context on user interaction (required by browsers)
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    playLoseLifeSound() {
        if (this.isMuted || !this.audioContext) return;

        // Sad descending tone for losing a life
        const sadMelody = [392.00, 349.23, 293.66]; // G, F, D
        sadMelody.forEach((freq, index) => {
            setTimeout(() => {
                this.playTone(freq, 0.3, 'triangle', 0.4);
            }, index * 150);
        });
    }

    playDramaticPauseSound() {
        if (this.isMuted || !this.audioContext) return;

        // Dramatic low tone that builds tension
        const dramaticTone = 130.81; // Low C
        this.playTone(dramaticTone, 1.5, 'triangle', 0.3);
        
        // Add some harmonic tension
        setTimeout(() => {
            this.playTone(dramaticTone * 1.25, 0.8, 'triangle', 0.2);
        }, 500);
    }
}

export const audioManager = new AudioManager();
