import * as THREE from "three";
import { Renderer } from "./components/Renderer"; 
import { Camera } from "./components/Camera";
import { DirectionalLight } from "./components/DirectionalLight";
import { player, initializePlayer } from "./components/Player";
import { map, initializeMap } from "./components/Map";
import { animateVehicles } from "./animateVehicles";
import { animatePlayer } from "./animatePlayer";
import { hitTest } from "./hitTest";
import "./style.css";
import "./collectUserInput";


const scene = new THREE.Scene();
scene.add(player); //Adiciona um player na cena
scene.add(map);

const ambienteLight = new THREE.AmbientLight();
scene.add(ambienteLight); //Adiciona uma luz ambiente na cena (sem sombra)

const dirLight = DirectionalLight();
dirLight.target = player;
player.add(dirLight); //Adiciona a luz direcional na cena (com sombra)

const camera = Camera();
player.add(camera); //Adiciona uma câmera na cena

const scoreDOM = document.getElementById("score");
const resultDOM = document.getElementById("result-container");

initializeGame(); 

document
  .querySelector("#retry")
  ?.addEventListener("click", initializeGame);

function initializeGame(){
    initializePlayer();
    initializeMap();

      if (scoreDOM) scoreDOM.innerText = "0";
      if (resultDOM) resultDOM.style.visibility = "hidden";

}


const renderer = Renderer();
renderer.setAnimationLoop(animate);

function animate(){
    animateVehicles();
    animatePlayer();
    hitTest();
  
    renderer.render(scene, camera);
}