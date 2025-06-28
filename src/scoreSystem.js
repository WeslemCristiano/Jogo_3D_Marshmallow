// Score System with bonuses
import * as THREE from "three";
import { position } from "./components/Player";

class ScoreManager {
    constructor() {
        this.score = 0;
        this.maxRowReached = 0;
        this.moveStartTime = Date.now();
        this.consecutiveFastMoves = 0;
        this.scoreMultiplier = 1;
        this.particleSystem = null;
        this.audioManager = null;
    }

    setParticleSystem(particleSystem) {
        this.particleSystem = particleSystem;
    }

    setAudioManager(audioManager) {
        this.audioManager = audioManager;
    }

    reset() {
        this.score = 0;
        this.maxRowReached = 0;
        this.moveStartTime = Date.now();
        this.consecutiveFastMoves = 0;
        this.scoreMultiplier = 1;
    }

    updateScore() {
        const currentRow = Math.max(0, position.currentRow);
        
        // Only increase score when player reaches new forward positions
        if (currentRow > this.maxRowReached) {
            const rowsAdvanced = currentRow - this.maxRowReached;
            
            // Base points per row
            let points = rowsAdvanced * 10;
            
            // Speed bonus - if player moves quickly
            const timeSinceLastMove = Date.now() - this.moveStartTime;
            if (timeSinceLastMove < 500) { // Less than 500ms
                points *= 1.5; // 50% bonus
                this.consecutiveFastMoves++;
                
                // Create speed boost particles
                if (this.particleSystem) {
                    this.particleSystem.createSpeedBoostParticles(
                        new THREE.Vector3(position.currentTile * 40, position.currentRow * 40, 10)
                    );
                }
                
                // Play bonus sound
                if (this.audioManager) {
                    this.audioManager.playSound('bonus');
                }
                
                // Combo multiplier for consecutive fast moves
                if (this.consecutiveFastMoves >= 3) {
                    points *= 2; // Double points for combo
                    this.showBonusText("COMBO! 2x");
                }
                
                this.showBonusText(`SPEED BONUS! +${Math.floor(points - (rowsAdvanced * 10))}`);
            } else {
                this.consecutiveFastMoves = 0;
            }
            
            // Distance milestone bonuses
            if (currentRow % 10 === 0 && currentRow > 0) {
                const milestoneBonus = 50;
                points += milestoneBonus;
                this.showBonusText(`MILESTONE! +${milestoneBonus}`);
                
                // Play milestone sound
                if (this.audioManager) {
                    this.audioManager.playSound('milestone');
                }
            }
            
            this.score += Math.floor(points);
            this.maxRowReached = currentRow;
            this.moveStartTime = Date.now();
        }
        
        return this.score;
    }

    showBonusText(text) {
        // Create floating bonus text
        const bonusElement = document.createElement('div');
        bonusElement.textContent = text;
        bonusElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #ffd700;
            font-family: 'Press Start 2P', cursive;
            font-size: 14px;
            pointer-events: none;
            z-index: 1000;
            animation: bonusFloat 2s ease-out forwards;
        `;

        // Add CSS animation if not already present
        if (!document.querySelector('#bonus-animation-style')) {
            const style = document.createElement('style');
            style.id = 'bonus-animation-style';
            style.textContent = `
                @keyframes bonusFloat {
                    0% { 
                        opacity: 1; 
                        transform: translate(-50%, -50%) scale(1);
                    }
                    50% { 
                        transform: translate(-50%, -70%) scale(1.2);
                    }
                    100% { 
                        opacity: 0; 
                        transform: translate(-50%, -90%) scale(0.8);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(bonusElement);
        
        // Remove element after animation
        setTimeout(() => {
            if (bonusElement.parentNode) {
                bonusElement.parentNode.removeChild(bonusElement);
            }
        }, 2000);
    }

    getScore() {
        return this.score;
    }
}

export const scoreManager = new ScoreManager();
