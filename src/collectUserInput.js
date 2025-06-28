import { queueMove } from "./components/Player";
import { audioManager } from "./main";

function handleMove(direction) {
    queueMove(direction);
    audioManager.playSound('move');
}

function updateMuteButton() {
    const muteBtn = document.querySelector("#mute-btn");
    if (muteBtn) {
        muteBtn.textContent = audioManager.isMuted ? "🔇" : "🔊";
        muteBtn.title = audioManager.isMuted ? "Unmute (M)" : "Mute (M)";
    }
}

document
  .getElementById("forward")
  ?.addEventListener("click", () => handleMove("forward"));

document
  .getElementById("backward")
  ?.addEventListener("click", () => handleMove("backward"));

document
  .getElementById("left")
  ?.addEventListener("click", () => handleMove("left"));

document
  .getElementById("right")
  ?.addEventListener("click", () => handleMove("right"));

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    event.preventDefault(); // Avoid scrolling the page
    handleMove("forward");
  } else if (event.key === "ArrowDown") {
    event.preventDefault(); // Avoid scrolling the page
    handleMove("backward");
  } else if (event.key === "ArrowLeft") {
    event.preventDefault(); // Avoid scrolling the page
    handleMove("left");
  } else if (event.key === "ArrowRight") {
    event.preventDefault(); // Avoid scrolling the page
    handleMove("right");
  } else if (event.key === "m" || event.key === "M") {
    // Toggle mute with M key
    audioManager.setMuted(!audioManager.isMuted);
    showMuteStatus();
    updateMuteButton();
  }
});

function showMuteStatus() {
    const muteText = audioManager.isMuted ? "🔇 MUTED" : "🔊 UNMUTED";
    const muteElement = document.createElement('div');
    muteElement.textContent = muteText;
    muteElement.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        font-family: 'Press Start 2P', cursive;
        font-size: 16px;
        background-color: rgba(0, 0, 0, 0.7);
        padding: 10px 20px;
        border-radius: 8px;
        pointer-events: none;
        z-index: 1000;
        animation: fadeInOut 2s ease-out forwards;
    `;

    // Add fade animation if not present
    if (!document.querySelector('#mute-animation-style')) {
        const style = document.createElement('style');
        style.id = 'mute-animation-style';
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                30% { opacity: 1; transform: translateX(-50%) translateY(0); }
                70% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(muteElement);
    
    setTimeout(() => {
        if (muteElement.parentNode) {
            muteElement.parentNode.removeChild(muteElement);
        }
    }, 2000);
}