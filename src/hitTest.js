import * as THREE from "three";
import { metadata as rows } from "./components/Map";
import { player, position } from "./components/Player";
import { getCurrentScore, particleSystem, audioManager, livesManager } from "./main";

const resultDOM = document.getElementById("result-container");
const finalScoreDOM = document.getElementById("final-score");
const gameOverOverlay = document.getElementById("game-over-overlay");

// Import the initialize function
let initializeGameFunction = null;

export function setInitializeGameFunction(initFunc) {
  initializeGameFunction = initFunc;
}

function autoRestartGame() {
  if (initializeGameFunction) {
    initializeGameFunction();
  }
}

let countdownInterval = null;

// Export countdown interval for external access
window.countdownInterval = null;

function startCountdownAndRestart() {
  let timeLeft = 3;
  const countdownElement = document.getElementById("countdown");
  
  // Clear any existing countdown
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
  if (window.countdownInterval) {
    clearInterval(window.countdownInterval);
  }
  
  // Update countdown every second
  countdownInterval = setInterval(() => {
    timeLeft--;
    if (countdownElement) {
      countdownElement.textContent = timeLeft.toString();
    }
    
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      window.countdownInterval = null;
      autoRestartGame();
    }
  }, 1000);
  
  // Store reference globally
  window.countdownInterval = countdownInterval;
}

export function hitTest() {
  const row = rows[position.currentRow - 1];
  if (!row) return;

  if (row.type === "car" || row.type === "truck") {
    const playerBoundingBox = new THREE.Box3();
    playerBoundingBox.setFromObject(player);

    row.vehicles.forEach(({ ref }) => {
      if (!ref) throw Error("Vehicle reference is missing");

      const vehicleBoundingBox = new THREE.Box3();
      vehicleBoundingBox.setFromObject(ref);

      if (playerBoundingBox.intersectsBox(vehicleBoundingBox)) {
        // Check if player is invulnerable
        if (livesManager.isPlayerInvulnerable()) return;
        
        // Create collision particles
        particleSystem.createCollisionParticles(player.position.clone());
        
        // Play collision sound
        audioManager.playSound('collision');
        
        // Add screen shake effect
        shakeScreen();
        
        // Lose a life
        const isGameOver = livesManager.loseLife();
        
        if (isGameOver) {
          // Game Over sequence
          if (!resultDOM || !finalScoreDOM || !gameOverOverlay) return;
          
          // Stop background music immediately
          audioManager.stopBackgroundMusic();
          
          // Play collision sound first
          audioManager.playSound('collision');
          
          // Show dramatic Game Over message first
          gameOverOverlay.style.display = "flex";
          
          // Play dramatic pause sound
          setTimeout(() => {
              audioManager.playSound('dramaticPause');
          }, 200);
          
          // Play game over sound after dramatic pause
          setTimeout(() => {
              audioManager.playSound('gameOver');
          }, 1000);
          
          // After 2.5 seconds, hide Game Over message and show result screen
          setTimeout(() => {
            gameOverOverlay.style.display = "none";
            resultDOM.style.visibility = "visible";
            finalScoreDOM.innerText = getCurrentScore().toString();
            
            // Start countdown and auto restart
            startCountdownAndRestart();
          }, 2500);
          
        } else {
          // Player still has lives - respawn effect
          respawnPlayer();
        }
      }
    });
  }
}

function respawnPlayer() {
  // Move player back a few steps to give them a chance
  if (position.currentRow > 2) {
    position.currentRow -= 2;
    player.position.y = position.currentRow * 40; // Assuming tileSize is 40
  }
}

function shakeScreen() {
  const canvas = document.querySelector('canvas');
  if (!canvas) return;
  
  canvas.style.animation = 'shake 0.5s ease-in-out';
  
  // Add shake animation if not already present
  if (!document.querySelector('#shake-animation-style')) {
    const style = document.createElement('style');
    style.id = 'shake-animation-style';
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
        20%, 40%, 60%, 80% { transform: translateX(3px); }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Remove animation after completion
  setTimeout(() => {
    canvas.style.animation = '';
  }, 500);
}