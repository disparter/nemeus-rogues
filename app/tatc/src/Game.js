import { INVALID_MOVE } from 'boardgame.io/core';

export const Tatc = {
  setup: () => ({ cells: Array(9).fill(null) }),

  moves: {
    clickCard: clickCard,
    clickCell: clickCell,
    closePopup: closePopup,
  },

  turn: {
    moveLimit: 0,

    stages:{
      CARD_PICK:{
        moves: { clickCard, closePopup },
      },
      TILE_TARGET:{
        moves: { clickCell },
      }
    },
  },
  
  endIf: (G, ctx) => {
    if (IsVictory(G.cells)) {
      return { winner: ctx.currentPlayer };
    }
  },

  ai: {
    enumerate: (G, ctx) => {
      let moves = [];
      for (let i = 0; i < 9; i++) {
        if (G.cells[i] === null) {
          moves.push({ move: 'clickCell', args: [i] });
        }
      }
      return moves;
    },
  },
};

function clickCard(G, ctx, id) {
  selectCard(id);
  popupCard(id);
};

function clickCell(G, ctx, id) {
  if (G.cells[id] !== null) {
    return INVALID_MOVE;
  }
  G.cells[id] = ctx.currentPlayer;
};

function selectCard(id){
  document.getElementById(id).classList.add('selected');
}

function popupCard(id){
  document.getElementById("overlay").style.visibility = "visible";
}

function closePopup(){
  document.getElementById("overlay").style.visibility = "hidden";
};

function IsVictory(cells) {
  return false;
}

