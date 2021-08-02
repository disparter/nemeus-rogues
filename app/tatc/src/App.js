import { Client } from 'boardgame.io/client';
import { Tatc } from './Game';
import { Size } from './helpers/size.js';

class TatcClient {
  constructor(rootElement) {
    this.client = Client({ game: Tatc });
    this.client.start();
    this.rootElement = rootElement;
    this.createCardHand(4);
    this.createBoard(new Size(16, 100));
    this.attachListeners();
    this.client.subscribe(state => this.update(state));
  }

  createBoard(size) {
    const rows = [];
    for (const i of Array(size.rows).keys()) {
      const cells = [];
      for (let j of Array(size.columns).keys()) {
        const id = 3 * i + j;
        cells.push(`<div class="cell" data-id="${id}"></div>`);
      }
      rows.push(`<div class="row">${cells.join('')}</div>`);
    }

    this.rootElement.innerHTML += `
      <div id="board">${rows.join('')}</div>
    `;
  }

  createCardHand(length) {
    const cards = [];
      for (let c of Array(length).keys()) {
        cards.push(`<div id="card_${c}" class="card" data-id="card_${c}"></div>`);
      }
    
    this.rootElement.innerHTML = `
      <div id="hand"><div id="cards">${cards.join('')}</div></div>
    `;
  }

  attachListeners() {
    // Attach event listeners to the board cells.
    const cells = this.rootElement.querySelectorAll('.cell');
    // This event handler will read the cell id from the cell’s
    // `data-id` attribute and make the `clickCell` move.
    const handleCellClick = event => {
      const id = parseInt(event.target.dataset.id);
      this.client.moves.clickCell(id);
    };
    cells.forEach(cell => {
      cell.onclick = handleCellClick;
    });

     // Attach event listeners to the hand cards.
     const cards = this.rootElement.querySelectorAll('.card');
     // This event handler will read the card id from the card’s
     // `data-id` attribute and make the `clickCard` move.
     const handleCardClick = event => {
       const id = event.target.dataset.id;
       this.client.moves.clickCard(id);
     };
     cards.forEach(card => {
       card.onclick = handleCardClick;
     });

     // Attach event listeners to popup.
     const backFromPopup = document.getElementById('backCard');
     backFromPopup.addEventListener("click", this.client.moves.closePopup);
  }

  update(state) {
    // Get all the board cells.
    const cells = this.rootElement.querySelectorAll('.cell');
    // Update cells to display the values in game state.
    cells.forEach(cell => {
      const cellId = parseInt(cell.dataset.id);
      const cellValue = state.G.cells[cellId];
      cell.textContent = cellValue !== null ? cellValue : '';
    });
  }
}

const appElement = document.getElementById('app');
const app = new TatcClient(appElement);
