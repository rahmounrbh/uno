document.addEventListener('DOMContentLoaded', () => {
    const deck = document.getElementById('deck');
    const discardPile = document.getElementById('discardPile');
    const playerHand = document.getElementById('playerHand');

    const colors = ['red', 'blue', 'green', 'yellow'];
    const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Skip', 'Reverse', 'Draw Two', 'Wild', 'Wild Draw Four'];

    let gameDeck = [];
    let playerCards = [];
    let currentCard = null;

    // Create the deck
    function createDeck() {
        for (let color of colors) {
            for (let value of values) {
                if (value !== 'Wild' && value !== 'Wild Draw Four') {
                    gameDeck.push({ color, value });
                }
            }
        }
        for (let i = 0; i < 4; i++) {
            gameDeck.push({ color: 'wild', value: 'Wild' });
            gameDeck.push({ color: 'wild', value: 'Wild Draw Four' });
        }
        shuffleDeck();
    }

    // Shuffle the deck
    function shuffleDeck() {
        for (let i = gameDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [gameDeck[i], gameDeck[j]] = [gameDeck[j], gameDeck[i]];
        }
    }

    // Deal cards to the player
    function dealCards() {
        for (let i = 0; i < 7; i++) {
            playerCards.push(drawCard());
        }
        currentCard = drawCard();
        updateDiscardPile();
        updatePlayerHand();
    }

    // Draw a card from the deck
    function drawCard() {
        return gameDeck.pop();
    }

    // Update the discard pile
    function updateDiscardPile() {
        discardPile.innerHTML = `<div class="card" style="background-color: ${currentCard.color};">${currentCard.value}</div>`;
    }

    // Update the player's hand
    function updatePlayerHand() {
        playerHand.innerHTML = '';
        playerCards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.style.backgroundColor = card.color;
            cardElement.innerHTML = card.value;
            cardElement.addEventListener('click', () => playCard(index));
            playerHand.appendChild(cardElement);
        });
    }

    // Play a card from the player's hand
    function playCard(index) {
        const card = playerCards[index];
        if (card.color === currentCard.color || card.value === currentCard.value || card.value === 'Wild' || card.value === 'Wild Draw Four') {
            playerCards.splice(index, 1);
            currentCard = card;
            updateDiscardPile();
            updatePlayerHand();
        }
    }

    // Initialize the game
    function initializeGame() {
        createDeck();
        dealCards();
    }

    // Event listener for drawing a card
    deck.addEventListener('click', () => {
        playerCards.push(drawCard());
        updatePlayerHand();
    });

    initializeGame();
});
