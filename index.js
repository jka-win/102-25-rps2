
function show(...elements) {
    for (const element of elements) {
        element.style.display = "flex";
    }
}

function hide(...elements) {
    for (const element of elements) {
        element.style.display = "none";
    }
}

const panelLogin = document.getElementById("panel-login");
const loginName = document.getElementById("login-name");
const loginSubmit = document.getElementById("login-submit");

const panelOpponent = document.getElementById("panel-opponent");
const opponentList = document.getElementById("opponent-list");
const opponentSubmit = document.getElementById("opponent-submit");

const panelGame = document.getElementById("panel-game");
const gameHands = document.getElementById("game-hands");

const panelHistory = document.getElementById("panel-history");
const historyScores = document.getElementById("history-scores");
const historyMatches = document.getElementById("history-matches");

hide(panelOpponent, panelGame, panelHistory);

const hands = ["Rock", "Paper", "Scissors"];

class Player {
    constructor(name, strategy) {
        this.name = name;
        this.wins = 0;
        this.draws = 0;
        this.losses = 0;
        this.strategy = strategy
            || (hand => Math.floor(Math.random() * 3));

        const display = document.createElement("div");
        display.classList.add("score-item");
        function createAndAppend() {
            const element = document.createElement("p");
            display.appendChild(element);
            return element;
        }

        this.display = {};
        this.display.name = createAndAppend();
        this.display.wins = createAndAppend();
        this.display.losses = createAndAppend();
        this.display.draws = createAndAppend();

        this.updateDisplay();
        historyScores.appendChild(display);
    }

    updateDisplay() {
        this.display.name.innerText = this.name;
        this.display.wins.innerText = `Wins: ${this.wins}`;
        this.display.losses.innerText = `Losses: ${this.losses}`;
        this.display.draws.innerText = `Draws: ${this.draws}`;
    }
}

const player = new Player();
let currentOpponent;

const opponents = [
    new Player("Betty"),
    new Player("Chris"),
    new Player("Gautama", hand => hand),
    new Player("Grugg", hand => 0),
    new Player("Hector"),
    new Player("Little Timmy", hand => (hand - 1 + 3) % 3),
    new Player("Sabrina", hand => (hand + 1) % 3),
];

///// Login Setup /////

loginName.onkeyup = e => {
    if (e.key === "Enter") {
        loginSubmit.click();
    }
};

loginSubmit.onclick = e => {
    const name = loginName.value.trim();
    if (name.length > 0) {
        player.name = name;
        player.updateDisplay();
        hide(panelLogin);
        show(panelOpponent, panelHistory);
    }
};

///// Opponent Setup /////

opponents.map(opponent => {
    const option = document.createElement("option");
    option.value = opponent.name;
    option.text = opponent.name;
    opponentList.appendChild(option);
});

opponentSubmit.onclick = e => {
    currentOpponent = opponents.find(o => o.name === opponentList.value);
    hide(panelOpponent);
    show(panelGame);
};

///// Game Setup /////

for (let i = 0; i < hands.length; i++) {
    const button = document.createElement("button");
    button.innerText = hands[i];
    button.onclick = e => {
        const playerHand = i;
        const enemyHand = currentOpponent.strategy(playerHand);

        const history = document.createElement("li");
        history.innerText = `${player.name} -vs- ${currentOpponent.name}... ${hands[playerHand]}! ${hands[enemyHand]}! `;
        if (playerHand == enemyHand) {
            player.draws++;
            currentOpponent.draws++;
            history.innerText += "Draw!";
        } else if (playerHand == (enemyHand + 1) % 3) {
            player.wins++;
            currentOpponent.losses++;
            history.innerText += `${player.name} wins!`;
        } else {
            player.losses++;
            currentOpponent.wins++;
            history.innerText += `${currentOpponent.name} wins!`;
        }
        historyMatches.prepend(history);
        player.updateDisplay();
        currentOpponent.updateDisplay();

        hide(panelGame);
        show(panelOpponent);
    };
    gameHands.appendChild(button);
}

///// Testing /////

//loginName.value = "Joseph";
//loginSubmit.click();
