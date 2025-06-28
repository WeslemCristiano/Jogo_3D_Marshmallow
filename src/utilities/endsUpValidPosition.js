import { calculateFinalPosition } from "./calculateFinalPosition";
import { minTileIndex, maxTileIndex } from "../constants";
import { metadata as rows } from "../components/Map";

export function endsUpInValidPosition(currentPosition, moves) {
  // Calculo da posição final após os movimentos
  const finalPosition = calculateFinalPosition(
    currentPosition,
    moves
  );

  // Detecção de limites do mapa
  if (
    finalPosition.rowIndex === -1 ||
    finalPosition.tileIndex === minTileIndex - 1 ||
    finalPosition.tileIndex === maxTileIndex + 1
  ) {
    // retorna false se a posição final estiver fora dos limites do mapa
    return false;
  }

  // Detecção de colisão com obstáculos
  const finalRow = rows[finalPosition.rowIndex - 1];
  if (
    finalRow &&
    finalRow.type === "forest" &&
    finalRow.trees.some(
      (tree) => tree.tileIndex === finalPosition.tileIndex
    )
  ) {
    // retorna false se houver uma árvore na posição final
    return false;
  }

  return true;
}