interface Card {
    color: string;
    value: string;
}

interface Player {
    cards: Card[];
    cardsCountElement: HTMLElement;
    handElement: HTMLElement;
}

const deckElement = document.getElementById('deck') as HTMLElement;
const discardPileElement = document.getElementById('discardPile') as HTMLElement;
const unoButton = document.getElementById('unoButton') as HTMLButtonElement;

const colors: string[] = ['أحمر', 'أزرق', 'أخضر', 'أصفر'];
const values: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'تخطي', 'عكس', 'سحب اثنين', 'بري', 'بري سحب أربعة'];

let gameDeck: Card[] = [];
let players: Player[] = [];
let currentCard: Card | null = null;
let currentColor: string | null = null;
let currentPlayerIndex: number = 0;
let unoCalled: boolean = false;

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
    for (let player of players) {
        for (let i = 0; i < 7; i++) {
            player.cards.push(drawCard());
        }
    }
    currentCard = drawCard();
    currentColor = currentCard.color;
    updateDiscardPile();
    updatePlayerHands();
}

// Draw a card from the deck
function drawCard(): Card {
    if (gameDeck.length === 0) {
        gameDeck = [...discardPileElement.children].map(card => ({
            color: card.style.backgroundColor,
            value: card.innerHTML
        })) as Card[];
        shuffleDeck();
    }
    return gameDeck.pop() as Card;
}

// Update the discard pile
function updateDiscardPile() {
    discardPileElement.innerHTML = `<div class="card" style="background-color: ${currentCard?.color};">${currentCard?.value}</div>`;
}

// Update the player's hands
function updatePlayerHands() {
    for (let player of players) {
        updatePlayerHand(player);
    }
}

// Update a single player's hand
function updatePlayerHand(player: Player) {
    player.handElement.innerHTML = '';
    player.cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.style.backgroundColor = card.color;
        cardElement.innerHTML = card.value;
        cardElement.addEventListener('click', () => playCard(player, index));
        player.handElement.appendChild(cardElement);
    });
    player.cardsCountElement.textContent = player.cards.length.toString();
}

// Play a card from the player's hand
function playCard(player: Player, index: number) {
    const card = player.cards[index];
    if (card.color === currentColor || card.value === currentCard?.value || card.value === 'بري' || card.value === 'بري سحب أربعة') {
        player.cards.splice(index, 1);
        currentCard = card;
        if (card.value === 'بري' || card.value === 'بري سحب أربعة') {
            currentColor = prompt('اختر لون: أحمر، أزرق، أخضر، أصفر') as string;
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
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    unoCalled = false;
    unoButton.disabled = true;
}

// Call UNO
function callUno() {
    if (players[currentPlayerIndex].cards.length === 1 && !unoCalled) {
        alert('UNO!');
        unoCalled = true;
    }
}

// Event listener for drawing a card
deckElement.addEventListener('click', () => {
    players[currentPlayerIndex].cards.push(drawCard());
    updatePlayerHands();
    nextPlayer();
});

// Initialize the game
function initializeGame() {
    createDeck();
    players = [
        { cards: [], cardsCountElement: document.getElementById('player1CardsCount') as HTMLElement, handElement: document.getElementById('player1Hand') as HTMLElement },
        { cards: [], cardsCountElement: document.getElementById('player2CardsCount') as HTMLElement, handElement: document.getElementById('player2Hand') as HTMLElement },
        { cards: [], cardsCountElement: document.getElementById('player3CardsCount') as HTMLElement, handElement: document.getElementById('player3Hand') as HTMLElement }
    ];
    dealCards();
}

initializeGame();
