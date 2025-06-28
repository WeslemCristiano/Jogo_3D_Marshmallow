// Lives Management System
class LivesManager {
    constructor() {
        this.maxLives = 5;
        this.currentLives = this.maxLives;
        this.isInvulnerable = false;
        this.invulnerabilityDuration = 2000; // 2 seconds
        this.audioManager = null;
    }

    setAudioManager(audioManager) {
        this.audioManager = audioManager;
    }

    reset() {
        this.currentLives = this.maxLives;
        this.isInvulnerable = false;
        this.updateLivesDisplay();
    }

    loseLife() {
        if (this.isInvulnerable || this.currentLives <= 0) return false;

        this.currentLives--;
        this.updateLivesDisplay();
        
        // Play lose life sound
        if (this.audioManager) {
            this.audioManager.playSound('loseLife');
        }
        
        if (this.currentLives > 0) {
            this.startInvulnerability();
            return false; // Player still alive
        }
        
        return true; // Game over
    }

    startInvulnerability() {
        this.isInvulnerable = true;
        this.showInvulnerabilityEffect();
        
        setTimeout(() => {
            this.isInvulnerable = false;
            this.removeInvulnerabilityEffect();
        }, this.invulnerabilityDuration);
    }

    showInvulnerabilityEffect() {
        // Add blinking effect to player (this will be handled by the main game)
        document.body.classList.add('player-invulnerable');
        
        // Show invulnerability message
        this.showMessage('INVULNERABLE!', '#00ff88');
    }

    removeInvulnerabilityEffect() {
        document.body.classList.remove('player-invulnerable');
    }

    updateLivesDisplay() {
        const livesContainer = document.getElementById('lives');
        if (!livesContainer) return;

        const lifeElements = livesContainer.querySelectorAll('.life');
        
        lifeElements.forEach((life, index) => {
            if (index < this.currentLives) {
                // Life is active
                life.classList.remove('lost', 'lost-animation');
            } else {
                // Life is lost
                if (!life.classList.contains('lost')) {
                    // Animate the loss
                    life.classList.add('lost-animation');
                    setTimeout(() => {
                        life.classList.remove('lost-animation');
                        life.classList.add('lost');
                    }, 600);
                }
            }
        });
    }

    showMessage(text, color = '#ffffff') {
        const messageElement = document.createElement('div');
        messageElement.textContent = text;
        messageElement.style.cssText = `
            position: fixed;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: ${color};
            font-family: 'Press Start 2P', cursive;
            font-size: 18px;
            pointer-events: none;
            z-index: 1000;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
            animation: messageFloat 2s ease-out forwards;
        `;

        // Add CSS animation if not already present
        if (!document.querySelector('#message-animation-style')) {
            const style = document.createElement('style');
            style.id = 'message-animation-style';
            style.textContent = `
                @keyframes messageFloat {
                    0% { 
                        opacity: 1; 
                        transform: translate(-50%, -50%) scale(1);
                    }
                    50% { 
                        transform: translate(-50%, -60%) scale(1.1);
                    }
                    100% { 
                        opacity: 0; 
                        transform: translate(-50%, -70%) scale(0.9);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(messageElement);
        
        // Remove element after animation
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 2000);
    }

    getLives() {
        return this.currentLives;
    }

    getMaxLives() {
        return this.maxLives;
    }

    isPlayerInvulnerable() {
        return this.isInvulnerable;
    }
}

export const livesManager = new LivesManager();
