import * as THREE from "three";
import { endsUpInValidPosition } from "../utilities/endsUpValidPosition";
import { metadata as rows, addRows } from "./Map";

export const player = Player();

function Player(){
    const player = new THREE.Group();

    const body = new THREE.Mesh(
        new THREE.BoxGeometry(15, 15, 20), //Dimensões em x, y e z
        new THREE.MeshStandardMaterial({ //Material simples que não reage a luz de nenhuma forma partícular
            color: "white", //Cor branca
            flatShading: true,
        })
    );
    body.castShadow = true;
    body.receiveShadow = true;
    body.position.z = 10; //Altura do objeto (10 em relação ao chão)
    player.add(body);

    const cap = new THREE.Mesh(
        new THREE.BoxGeometry(2, 4, 2), 
        new THREE.MeshStandardMaterial({
            color: 0xf0619a,
            flatShading: true,
        })
    );

    cap.position.z = 21;
    cap.castShadow = true; 
    cap.receiveShadow = true;
    player.add(cap)

    const playerContainer = new THREE.Group();
    playerContainer.add(player);

    return playerContainer;
}

export const position = {
    currentRow: 0,
    currentTile: 0,
};

export const movesQueue = []; //Cria uma fila para armazenar os comandos do jogador. Adiciona ao final da fila

export function initializePlayer() {
  // Initialize the Three.js player object
  player.position.x = 0;
  player.position.y = 0;
  player.children[0].position.z = 0;

  // Initialize metadata
  position.currentRow = 0;
  position.currentTile = 0;

  // Clear the moves queue
  movesQueue.length = 0;
}

export function queueMove(direction){
    const isValidMove = endsUpInValidPosition(
        {
            rowIndex: position.currentRow,
            tileIndex: position.currentTile,
        },
        [...movesQueue, direction]
    );

    if(!isValidMove) return;

    movesQueue.push(direction);
}

export function stepCompleted(){ //Retira os comando do início da fila
    const direction = movesQueue.shift();

    if(direction === "forward") position.currentRow += 1;
    if(direction === "backward") position.currentRow -= 1;
    if(direction === "left") position.currentTile -= 1;
    if(direction === "right") position.currentTile += 1;

    // Add new rows if the player is running out of them
    if (position.currentRow > rows.length - 10) addRows();
}