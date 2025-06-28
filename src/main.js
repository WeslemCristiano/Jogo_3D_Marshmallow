import * as THREE from "three";
import { Renderer } from "./components/Renderer"; 
import { Camera } from "./components/Camera";
import { DirectionalLight } from "./components/DirectionalLight";
import { player, initializePlayer, position } from "./components/Player";
import { map, initializeMap } from "./components/Map";
import { animateVehicles } from "./animateVehicles";
import { animatePlayer } from "./animatePlayer";
import { hitTest, setInitializeGameFunction } from "./hitTest";
import { scoreManager } from "./scoreSystem";
import { ParticleSystem } from "./particleSystem";
import { audioManager } from "./audioSystem";
import { livesManager } from "./livesSystem";
import "./style.css";
import "./collectUserInput";


const scene = new THREE.Scene();
scene.add(player); //Adiciona um player na cena
scene.add(map);

// Initialize particle system
const particleSystem = new ParticleSystem(scene);
scoreManager.setParticleSystem(particleSystem);
scoreManager.setAudioManager(audioManager);
livesManager.setAudioManager(audioManager);

const ambienteLight = new THREE.AmbientLight();
scene.add(ambienteLight); //Adiciona uma luz ambiente na cena (sem sombra)

const dirLight = DirectionalLight();
dirLight.target = player;
player.add(dirLight); //Adiciona a luz direcional na cena (com sombra)

const camera = Camera();
player.add(camera); //Adiciona uma câmera na cena

const scoreDOM = document.getElementById("score");
const resultDOM = document.getElementById("result-container");
const distanceDOM = document.getElementById("distance");
const bestScoreDOM = document.getElementById("best-score");
const gameOverOverlay = document.getElementById("game-over-overlay");

// Load best score from localStorage
let bestScore = parseInt(localStorage.getItem("crossy-road-best-score") || "0");

// Export particle system, audio manager and lives manager for use in other files
export { particleSystem, audioManager, livesManager };

initializeGame(); 

// Set the initialize function for auto-restart
setInitializeGameFunction(initializeGame);

// Initialize audio controls
updateMuteButton();

// Resume audio context on first user interaction
document.addEventListener('click', () => {
    audioManager.resumeAudioContext();
}, { once: true });

document.addEventListener('keydown', () => {
    audioManager.resumeAudioContext();
}, { once: true });

document
  .querySelector("#retry")
  ?.addEventListener("click", () => {
    // Clear any countdown when manually restarting
    const countdownInterval = window.countdownInterval;
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    initializeGame();
  });

// Audio controls
document
  .querySelector("#mute-btn")
  ?.addEventListener("click", () => {
    audioManager.setMuted(!audioManager.isMuted);
    updateMuteButton();
  });

function updateMuteButton() {
    const muteBtn = document.querySelector("#mute-btn");
    if (muteBtn) {
        muteBtn.textContent = audioManager.isMuted ? "🔇" : "🔊";
        muteBtn.title = audioManager.isMuted ? "Unmute (M)" : "Mute (M)";
    }
}

function initializeGame(){
    initializePlayer();
    initializeMap();

    // Reset all systems
    scoreManager.reset();
    livesManager.reset();
    updateScore();
    updateGameInfo();

    // Reset countdown display
    const countdownElement = document.getElementById("countdown");
    if (countdownElement) {
        countdownElement.textContent = "3";
    }

    // Play game start sound and background music
    audioManager.playSound('gameStart');
    setTimeout(() => {
        audioManager.playBackgroundMusic();
    }, 1000);

    if (resultDOM) resultDOM.style.visibility = "hidden";
    if (gameOverOverlay) gameOverOverlay.style.display = "none";
}

function updateScore() {
    const currentScore = scoreManager.updateScore();
    if (scoreDOM) scoreDOM.innerText = currentScore.toString();
    
    // Update best score
    if (currentScore > bestScore) {
        bestScore = currentScore;
        localStorage.setItem("crossy-road-best-score", bestScore.toString());
        updateGameInfo();
    }
}

function updateGameInfo() {
    if (distanceDOM) distanceDOM.innerText = `Distance: ${Math.max(0, position.currentRow)}`;
    if (bestScoreDOM) bestScoreDOM.innerText = `Best: ${bestScore}`;
}

// Export score for use in hitTest
export function getCurrentScore() {
    return scoreManager.getScore();
}


const renderer = Renderer();
renderer.setAnimationLoop(animate);

// Animation clock for particle system
const clock = new THREE.Clock();

function animate(){
    const deltaTime = clock.getDelta();
    
    animateVehicles();
    animatePlayer();
    hitTest();
    
    // Update particle system
    particleSystem.update(deltaTime);
    
    // Update score and game info continuously
    updateScore();
    updateGameInfo();
  
    renderer.render(scene, camera);
}