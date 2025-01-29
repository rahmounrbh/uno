document.addEventListener('DOMContentLoaded', () => {
    const deck = document.getElementById('deck');
    const discardPile = document.getElementById('discardPile');
    const player1Hand = document.getElementById('player1Hand');
    const player2Hand = document.getElementById('player2Hand');
    const player3Hand = document.getElementById('player3Hand');
    const player1CardsCount = document.getElementById('player1CardsCount');
    const player2CardsCount = document.getElementById('player2CardsCount');
    const player3CardsCount = document.getElementById('player3CardsCount');
    const unoButton = document.getElementById('unoButton');

    const colors = ['أحمر', 'أزرق', 'أخضر', 'أصفر'];
    const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'تخطي', 'عكس', 'سحب اثنين', 'بري', 'بري سحب أربعة'];

    let gameDeck = [];
    let player1Cards = [];
    let player2Cards = [];
    let player3Cards = [];
    let currentCard = null;
    let currentColor = null;
    let currentPlayer = 1;
    let unoCalled = false;

    // Create the deck
    function createDeck() {
        for (let color of colors) {
            for (let value of values) {
                if (value !== 'بري' && value !== 'بري سحب أربعة') {
                    gameDeck.push({ color, value });
                }
            }
        }
        for (let i = 0; i < 4; i++) {
            gameDeck.push({ color: 'بري', value: 'بري' });
            gameDeck.push({ color: 'بري', value: 'بري سحب أربعة' });
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

    // Deal cards to the players
    function dealCards() {
        for (let i = 0; i < 7; i++) {
            player1Cards.push(drawCard());
            player2Cards.push(drawCard());
            player3Cards.push(drawCard());
        }
        currentCard = drawCard();
        currentColor = currentCard.color;
        updateDiscardPile();
        updatePlayerHands();
    }

    // Draw a card from the deck
    function drawCard() {
        if (gameDeck.length === 0) {
            gameDeck = [...discardPile.children].map(card => ({
                color: card.style.backgroundColor,
                value: card.innerHTML
            }));
            shuffleDeck();
        }
        return gameDeck.pop();
    }

    // Update the discard pile
    function updateDiscardPile() {
        discardPile.innerHTML = `<div class="card" style="background-color: ${currentCard.color};">${currentCard.value}</div>`;
    }

    // Update the player's hands
    function updatePlayerHands() {
        updatePlayerHand(player1Hand, player1Cards, player1CardsCount);
        updatePlayerHand(player2Hand, player2Cards, player2CardsCount);
        updatePlayerHand(player3Hand, player3Cards, player3CardsCount);
    }

    // Update a single player's hand
    function updatePlayerHand(handElement, cards, cardsCountElement) {
        handElement.innerHTML = '';
        cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.style.backgroundColor = card.color;
            cardElement.innerHTML = card.value;
            cardElement.addEventListener('click', () => playCard(index));
            handElement.appendChild(cardElement);
        });
        cardsCountElement.textContent = cards.length;
    }

    // Play a card from the player's hand
    function playCard(index) {
        let cards;
        if (currentPlayer === 1) {
            cards = player1Cards;
        } else if (currentPlayer === 2) {
            cards = player2Cards;
        } else {
            cards = player3Cards;
        }

        const card = cards[index];
        if (card.color === currentColor || card.value === currentCard.value || card.value === 'بري' || card.value === 'بري سحب أربعة') {
            cards.splice(index, 1);
            currentCard = card;
            if (card.value === 'بري' || card.value === 'بري سحب أربعة') {
                currentColor = prompt('اختر لون: أحمر، أزرق، أخضر، أصفر');
            } else {
                currentColor = card.color;
            }
            updateDiscardPile();
            updatePlayerHands();
            nextPlayer();
        }
    }

    // Move to the next player
    function nextPlayer() {
        currentPlayer = (currentPlayer % 3) + 1;
        unoCalled = false;
        unoButton.disabled = true;
    }

    // Call UNO
    function callUno() {
        if (currentPlayer === 1 && player1Cards.length === 1 && !unoCalled) {
            alert('UNO!');
            unoCalled = true;
        }
    }

    // Event listener for drawing a card
    deck.addEventListener('click', () => {
        if (currentPlayer === 1) {
            player1Cards.push(drawCard());
        } else if (currentPlayer === 2) {
            player2Cards.push(drawCard());
        } else {
            player3Cards.push(drawCard());
        }
        updatePlayerHands();
        nextPlayer();
    });

    // Initialize the game
    function initializeGame() {
        createDeck();
        dealCards();
    }

    initializeGame();
});
