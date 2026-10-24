/* =========================================
   SENEGAL CHALLENGE — SCRIPT PRINCIPAL
   ========================================= */

/* 1. ÉLÉMENTS HTML */

const homeScreen = document.getElementById("home-screen");
const playersScreen = document.getElementById("players-screen");
const duosScreen = document.getElementById("duos-screen");
const wordsScreen = document.getElementById("words-screen");
const gameScreen = document.getElementById("game-screen");

const startButton = document.getElementById("start-button");
const backButton = document.getElementById("back-button");

const playersForm = document.getElementById("players-form");
const playerNameInput = document.getElementById("player-name");
const playersList = document.getElementById("players-list");
const playerCount = document.getElementById("player-count");
const formMessage = document.getElementById("form-message");
const continueButton = document.getElementById("continue-button");

const duoDescription = document.getElementById("duos-description");
const duoCard = document.getElementById("duo-card");
const duoNumber = document.getElementById("duo-number");
const duoNames = document.getElementById("duo-names");
const duoMessage = document.getElementById("duo-message");
const revealButton = document.getElementById("reveal-button");
const allDuos = document.getElementById("all-duos");
const allDuosList = document.getElementById("all-duos-list");
const wordsButton = document.getElementById("words-button");

const wordPlayerMessage = document.getElementById("word-player-message");
const wordPrivateScreen = document.getElementById("word-private-screen");
const wordPlayerName = document.getElementById("word-player-name");
const wordsForm = document.getElementById("words-form");
const wordInputs = document.getElementById("word-inputs");
const addWordButton = document.getElementById("add-word-button");
const wordsCount = document.getElementById("words-count");
const wordsMessage = document.getElementById("words-message");
const nextPlayerScreen = document.getElementById("next-player-screen");
const nextPlayerMessage = document.getElementById("next-player-message");
const readyButton = document.getElementById("ready-button");
const wordsFinishedScreen = document.getElementById("words-finished-screen");
const prepareSaladButton = document.getElementById("prepare-salad-button");

const gameDuoLabel = document.getElementById("game-duo-label");
const gameMimerLabel = document.getElementById("game-mimer-label");
const gameMimerName = document.getElementById("game-mimer-name");
const gameTimer = document.getElementById("game-timer");
const gameWordContainer = document.getElementById("game-word-container");
const gameWord = document.getElementById("game-word");
const gameMessage = document.getElementById("game-message");
const revealWordButton = document.getElementById("reveal-word-button");
const gameActions = document.getElementById("game-actions");
const guessedButton = document.getElementById("guessed-button");
const passButton = document.getElementById("pass-button");
const gameScore = document.getElementById("game-score");
const nextTurnButton = document.getElementById("next-turn-button");

/* 2. DONNÉES DU JEU */

const players = [];

let duos = [];
let currentDuoIndex = 0;
let currentDuoRevealIndex = 0;
let currentWordPlayerIndex = 0;

let submittedWords = [];
let saladWords = [];

let scores = [];
let duoRoleTurns = [];

let currentWord = null;
let secondsRemaining = 60;
let timerInterval = null;

let turnFinished = false;
let gameEnded = false;
let nextTurnTimeout = null;

/* 3. TABLEAU DES SCORES ET BOUTON D'ARRÊT */

const scoreBoard = document.createElement("section");
scoreBoard.className = "score-board";
scoreBoard.setAttribute("aria-label", "Scores des duos");

const scoreBoardTitle = document.createElement("h2");
scoreBoardTitle.className = "score-board-title";
scoreBoardTitle.textContent = "Scores en direct";

const scoreBoardList = document.createElement("div");
scoreBoardList.className = "score-board-list";

scoreBoard.append(scoreBoardTitle, scoreBoardList);

gameDuoLabel.insertAdjacentElement("beforebegin", scoreBoard);

scoreBoard.hidden = true;
scoreBoard.style.display = "none";

const stopGameButton = document.createElement("button");
stopGameButton.type = "button";
stopGameButton.className = "stop-game-button";
stopGameButton.textContent = "Arrêter la partie";
stopGameButton.hidden = true;

scoreBoard.insertAdjacentElement("afterend", stopGameButton);

/* 4. FONCTIONS UTILITAIRES */

function showScreen(screenToShow) {
    const screens = [
        homeScreen,
        playersScreen,
        duosScreen,
        wordsScreen,
        gameScreen
    ];

    screens.forEach((screen) => {
        if (screen) {
            screen.hidden = screen !== screenToShow;
        }
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

function normalizeWord(word) {
    return word
        .trim()
        .toLocaleLowerCase("fr")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function showMessage(element, message, isError = false) {
    if (!element) return;

    element.textContent = message;
    element.classList.toggle("error-message", isError);
}

/* 5. INSCRIPTION DES JOUEURS */

startButton.addEventListener("click", () => {
    showScreen(playersScreen);
    playerNameInput.focus();
});

backButton.addEventListener("click", () => {
    showScreen(homeScreen);
});

function updatePlayersDisplay() {
    playersList.replaceChildren();

    players.forEach((player, index) => {
        const item = document.createElement("li");
        const name = document.createElement("span");
        const removeButton = document.createElement("button");

        name.textContent = player;

        removeButton.type = "button";
        removeButton.textContent = "Retirer";

        removeButton.addEventListener("click", () => {
            players.splice(index, 1);
            updatePlayersDisplay();
        });

        item.append(name, removeButton);
        playersList.appendChild(item);
    });

    playerCount.textContent = String(players.length);

    const validCount =
        players.length >= 4 && players.length % 2 === 0;

    continueButton.disabled = !validCount;

    if (players.length < 4) {
        showMessage(formMessage, "Il faut au moins 4 joueurs.");
    } else if (players.length % 2 !== 0) {
        showMessage(
            formMessage,
            "Ajoutez un joueur pour avoir un nombre pair."
        );
    } else {
        showMessage(
            formMessage,
            "Parfait ! Vous pouvez continuer."
        );
    }
}

playersForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = playerNameInput.value.trim();

    if (!name) {
        showMessage(formMessage, "Entre un prénom.", true);
        return;
    }

    const exists = players.some(
        (player) =>
            player.toLocaleLowerCase("fr") ===
            name.toLocaleLowerCase("fr")
    );

    if (exists) {
        showMessage(
            formMessage,
            "Ce prénom est déjà dans la liste.",
            true
        );
        return;
    }

    players.push(name);
    playerNameInput.value = "";

    updatePlayersDisplay();
    playerNameInput.focus();
});

continueButton.addEventListener("click", () => {
    if (players.length < 4 || players.length % 2 !== 0) return;

    createDuos();
    showScreen(duosScreen);
    displayNextDuo();
});

/* 6. FORMATION DES DUOS */

function createDuos() {
    const shuffledPlayers = shuffleArray([...players]);

    duos = [];

    for (let i = 0; i < shuffledPlayers.length; i += 2) {
        duos.push([
            shuffledPlayers[i],
            shuffledPlayers[i + 1]
        ]);
    }

    currentDuoRevealIndex = 0;

    allDuos.hidden = true;
    wordsButton.hidden = true;
    duoCard.hidden = false;

    revealButton.hidden = false;
    revealButton.disabled = false;
    revealButton.textContent = "Découvrir le duo";

    showMessage(duoDescription, "Découvrez les duos un par un !");
    showMessage(duoMessage, "");
}

function displayNextDuo() {
    if (currentDuoRevealIndex >= duos.length) {
        duoCard.hidden = true;
        allDuos.hidden = false;
        wordsButton.hidden = false;
        revealButton.hidden = true;

        displayAllDuos();

        showMessage(duoMessage, "Tous les duos sont formés !");
        return;
    }

    const duo = duos[currentDuoRevealIndex];

    duoNumber.textContent = `DUO ${currentDuoRevealIndex + 1}`;
    duoNames.textContent = `${duo[0]} & ${duo[1]}`;

    currentDuoRevealIndex++;

    revealButton.textContent =
        currentDuoRevealIndex < duos.length
            ? "Découvrir le duo suivant"
            : "Voir tous les duos";
}

revealButton.addEventListener("click", displayNextDuo);

function displayAllDuos() {
    allDuosList.replaceChildren();

    duos.forEach((duo, index) => {
        const item = document.createElement("li");

        item.textContent =
            `Duo ${index + 1} : ${duo[0]} & ${duo[1]}`;

        allDuosList.appendChild(item);
    });
}

/* 7. SAISIE DES MOTS */

wordsButton.addEventListener("click", () => {
    currentWordPlayerIndex = 0;
    submittedWords = [];

    showScreen(wordsScreen);
    showWordEntry();
});

function showWordEntry() {
    wordPrivateScreen.hidden = false;
    nextPlayerScreen.hidden = true;
    wordsFinishedScreen.hidden = true;

    const player = players[currentWordPlayerIndex];

    wordPlayerName.textContent = player;
    wordPlayerMessage.textContent =
        `C'est au tour de ${player} de proposer ses mots.`;

    wordsMessage.textContent = "";
    wordInputs.replaceChildren();

    for (let i = 0; i < 2; i++) {
        addWordInput();
    }

    updateWordCount();
}

function addWordInput() {
    const input = document.createElement("input");

    input.type = "text";
    input.className = "word-input";
    input.name = "word";
    input.maxLength = 50;
    input.autocomplete = "off";
    input.placeholder =
        `Mot ${wordInputs.children.length + 1}`;

    wordInputs.appendChild(input);
}

function updateWordCount() {
    const inputs = [
        ...wordInputs.querySelectorAll("input")
    ];

    const filled = inputs.filter(
        (input) => input.value.trim() !== ""
    ).length;

    wordsCount.textContent = `${filled} mot(s) saisi(s)`;
}

addWordButton.addEventListener("click", () => {
    if (wordInputs.querySelectorAll("input").length >= 5) {
        showMessage(wordsMessage, "5 mots maximum.");
        return;
    }

    addWordInput();
    updateWordCount();

    const inputs = wordInputs.querySelectorAll("input");
    inputs[inputs.length - 1].focus();
});

wordInputs.addEventListener("input", updateWordCount);

wordsForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const enteredWords = [
        ...wordInputs.querySelectorAll("input")
    ]
        .map((input) => input.value.trim())
        .filter(Boolean);

    if (enteredWords.length < 2 || enteredWords.length > 5) {
        showMessage(wordsMessage, "Entre 2 et 5 mots.", true);
        return;
    }

    submittedWords.push(...enteredWords);
    currentWordPlayerIndex++;

    if (currentWordPlayerIndex < players.length) {
        wordPrivateScreen.hidden = true;
        nextPlayerScreen.hidden = false;
        wordsFinishedScreen.hidden = true;

        const nextPlayer = players[currentWordPlayerIndex];

        nextPlayerMessage.textContent =
            `Passe le téléphone à ${nextPlayer}.`;

        readyButton.textContent =
            `C'est parti, ${nextPlayer} !`;
    } else {
        wordPrivateScreen.hidden = true;
        nextPlayerScreen.hidden = true;
        wordsFinishedScreen.hidden = false;
    }
});

readyButton.addEventListener("click", showWordEntry);


/* 8. PRÉPARATION DU SALADIER */

prepareSaladButton.addEventListener("click", () => {
    const uniqueWords = [];
    const seenWords = new Set();

    submittedWords.forEach((word) => {
        const cleaned = word.trim();
        const key = normalizeWord(cleaned);

        if (key && !seenWords.has(key)) {
            seenWords.add(key);
            uniqueWords.push(cleaned);
        }
    });

    if (uniqueWords.length === 0) {
        showMessage(wordPlayerMessage, "Aucun mot disponible.");
        return;
    }

    saladWords = shuffleArray([...uniqueWords]);

    scores = duos.map(() => 0);
    duoRoleTurns = duos.map(() => 0);

    currentDuoIndex = 0;
    currentWord = null;
    secondsRemaining = 60;
    gameEnded = false;
    turnFinished = false;

    startGame();
});


/* 9. DÉBUT DE LA PARTIE */

function startGame() {
    stopTimer();
    clearPendingTurn();

    gameEnded = false;
    turnFinished = false;

    showScreen(gameScreen);

    scoreBoard.hidden = false;
    scoreBoard.style.display = "";
    stopGameButton.hidden = true;

    updateScoreBoard();
    startTurn();
}

function startTurn() {
    if (gameEnded) return;

    stopTimer();
    clearPendingTurn();

    if (saladWords.length === 0) {
        endGame("Tous les mots ont été devinés !");
        return;
    }

    turnFinished = false;
    currentWord = null;
    secondsRemaining = 60;

    const duo = duos[currentDuoIndex];

    const mimerIndex = duoRoleTurns[currentDuoIndex] % 2;
    const mimer = duo[mimerIndex];
    const guesser = duo[1 - mimerIndex];

    gameDuoLabel.textContent =
        `Duo ${currentDuoIndex + 1} — ${mimer} mime, ${guesser} devine !`;

    gameMimerLabel.textContent = "C'est à toi de mimer";
    gameMimerName.textContent = mimer;

    gameTimer.textContent = "60";
    gameTimer.classList.remove("timer-warning");

    gameWord.textContent = "";
    gameWordContainer.hidden = true;

    gameMessage.textContent =
        "Prêts ? Révélez le premier mot pour commencer.";

    revealWordButton.hidden = false;
    revealWordButton.disabled = false;
    revealWordButton.textContent = "Révéler le mot";

    gameActions.hidden = true;
    nextTurnButton.hidden = true;

    scoreBoard.hidden = false;
    scoreBoard.style.display = "";

    updateScoreBoard();
}


/* 10. GESTION DU MOT ET RÉVÉLATION AUTOMATIQUE */

function displayNextWord(startChronometer = false) {
    if (turnFinished || gameEnded) return;

    if (saladWords.length === 0) {
        endGame("Tous les mots ont été devinés !");
        return;
    }

    currentWord = saladWords.shift();

    gameWord.textContent = currentWord;
    gameWordContainer.hidden = false;

    revealWordButton.hidden = true;
    gameActions.hidden = false;

    gameMessage.textContent =
        "Mime sans parler et sans montrer le mot à ton partenaire !";

    if (startChronometer && timerInterval === null) {
        startTimer();
    }
}

revealWordButton.addEventListener("click", () => {
    if (turnFinished || gameEnded || currentWord !== null) return;

    displayNextWord(true);
});


/* 11. CHRONOMÈTRE */

function startTimer() {
    if (timerInterval !== null || turnFinished || gameEnded) return;

    timerInterval = setInterval(() => {
        if (gameEnded || turnFinished) {
            stopTimer();
            return;
        }

        secondsRemaining--;
        gameTimer.textContent = String(secondsRemaining);

        if (secondsRemaining <= 10) {
            gameTimer.classList.add("timer-warning");
        }

        if (secondsRemaining <= 0) {
            finishTurn();
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

/* 12. GESTION DES CHANGEMENTS DE TOUR */

function clearPendingTurn() {
    if (nextTurnTimeout !== null) {
        clearTimeout(nextTurnTimeout);
        nextTurnTimeout = null;
    }
}


/* 13. MOT DEVINÉ */

guessedButton.addEventListener("click", () => {
    if (turnFinished || gameEnded || currentWord === null) {
        return;
    }

    // Ajouter un point au duo actuel.
    scores[currentDuoIndex]++;

    // Retirer le mot deviné définitivement.
    currentWord = null;

    // Actualiser le tableau des scores.
    updateScoreBoard();

    // Terminer si tous les mots ont été devinés.
    if (saladWords.length === 0) {
        gameWord.textContent = "";
        gameWordContainer.hidden = true;
        gameActions.hidden = true;

        endGame("Tous les mots ont été devinés !");
        return;
    }

    // Afficher automatiquement le mot suivant.
    displayNextWord();

    gameMessage.textContent =
        "Bien joué ! +1 point ! À vous le mot suivant !";
});


/* 14. MOT PASSÉ */

passButton.addEventListener("click", () => {
    if (turnFinished || gameEnded || currentWord === null) {
        return;
    }

    // Remettre le mot à la fin du saladier.
    saladWords.push(currentWord);

    currentWord = null;

    // Afficher automatiquement le mot suivant.
    displayNextWord();

    gameMessage.textContent = "Mot passé ! On continue !";
});


/* 15. FIN DU TOUR ET ROTATION DES DUOS */

function finishTurn() {
    if (turnFinished || gameEnded) return;

    turnFinished = true;

    stopTimer();

    // Le mot non deviné retourne dans le saladier.
    if (currentWord !== null) {
        saladWords.push(currentWord);
        currentWord = null;
    }

    gameTimer.textContent = "0";
    gameTimer.classList.add("timer-warning");

    gameWord.textContent = "";
    gameWordContainer.hidden = true;
    gameActions.hidden = true;

    revealWordButton.hidden = true;
    nextTurnButton.hidden = true;

    gameMessage.textContent =
        "Temps écoulé ! Préparez-vous pour le duo suivant.";

    // Inverser les rôles au prochain tour de ce duo.
    duoRoleTurns[currentDuoIndex]++;

    // Attendre deux secondes avant le prochain duo.
    nextTurnTimeout = setTimeout(() => {
        nextTurnTimeout = null;

        if (gameEnded) return;

        if (saladWords.length === 0) {
            endGame("Tous les mots ont été devinés !");
            return;
        }

        // Passer au duo suivant, en boucle.
        currentDuoIndex =
            (currentDuoIndex + 1) % duos.length;

        startTurn();
    }, 2000);
}

// La rotation des duos est automatique.
nextTurnButton.addEventListener("click", () => {});


/* 16. TABLEAU DES SCORES EN DIRECT */

function updateScoreBoard() {
    scoreBoardList.replaceChildren();

    duos.forEach((duo, index) => {
        const item = document.createElement("div");

        item.className = "score-team";

        // Mettre en évidence le duo qui joue.
        if (index === currentDuoIndex && !gameEnded) {
            item.classList.add("score-team-active");
        }

        const teamInfo = document.createElement("div");
        teamInfo.className = "score-team-info";

        const teamNumber = document.createElement("span");
        teamNumber.className = "score-team-number";
        teamNumber.textContent = `DUO ${index + 1}`;

        const teamNames = document.createElement("span");
        teamNames.className = "score-team-names";
        teamNames.textContent = duo.join(" & ");

        teamInfo.append(teamNumber, teamNames);

        const points = document.createElement("strong");
        points.className = "score-team-points";
        points.textContent = String(scores[index] ?? 0);

        const pointsLabel = document.createElement("span");
        pointsLabel.className = "score-team-label";
        pointsLabel.textContent = "pts";

        const scoreValue = document.createElement("div");
        scoreValue.className = "score-team-value";

        scoreValue.append(points, pointsLabel);

        item.append(teamInfo, scoreValue);

        scoreBoardList.appendChild(item);
    });

    // Aucun texte supplémentaire sous les scores.
}


/* 17. BOUTON ARRÊTER LA PARTIE */

stopGameButton.addEventListener("click", () => {
    // Le bouton reste désactivé dans cette version.
    return;
});

/* 18. RÉINITIALISATION POUR REJOUER OU RECOMMENCER */

function resetGameData() {
    stopTimer();
    clearPendingTurn();

    duos = [];
    submittedWords = [];
    saladWords = [];
    scores = [];
    duoRoleTurns = [];

    currentDuoIndex = 0;
    currentDuoRevealIndex = 0;
    currentWordPlayerIndex = 0;

    currentWord = null;
    secondsRemaining = 60;
    turnFinished = false;
    gameEnded = false;

    gameTimer.textContent = "60";
    gameTimer.classList.remove("timer-warning");

    gameWord.textContent = "";
    gameWordContainer.hidden = true;
    gameActions.hidden = true;

    revealWordButton.hidden = false;
    nextTurnButton.hidden = true;

    scoreBoard.hidden = true;
    scoreBoard.style.display = "none";
    stopGameButton.hidden = true;

    wordsForm.reset();
    wordInputs.replaceChildren();

    const oldResults = document.getElementById("results-screen");

    if (oldResults) {
        oldResults.remove();
    }
}


/*
 * Option 1 : conserver les joueurs.
 * Les duos sont remélangés et les mots sont saisis à nouveau.
 */

function replayWithSamePlayers() {
    resetGameData();

    createDuos();

    showScreen(duosScreen);

    displayNextDuo();
}


/*
 * Option 2 : effacer les joueurs.
 * La prochaine partie recommence depuis l'inscription.
 */

function startNewGame() {
    resetGameData();

    players.length = 0;
    playerNameInput.value = "";

    updatePlayersDisplay();

    showScreen(homeScreen);
}


/* 19. CLASSEMENT FINAL */

function endGame(message) {
    if (gameEnded) return;

    gameEnded = true;
    turnFinished = true;

    stopTimer();
    clearPendingTurn();

    currentWord = null;

    gameScreen.hidden = true;

    scoreBoard.hidden = true;
    scoreBoard.style.display = "none";
    stopGameButton.hidden = true;

    const oldResults = document.getElementById("results-screen");

    if (oldResults) {
        oldResults.remove();
    }

    // Classement du meilleur score au moins bon.
    const results = duos
        .map((duo, index) => ({
            duoNumber: index + 1,
            names: duo,
            score: scores[index] ?? 0
        }))
        .sort((a, b) => b.score - a.score);

    const resultsScreen = document.createElement("section");

    resultsScreen.id = "results-screen";
    resultsScreen.className = "game-screen results-screen";

    const eyebrow = document.createElement("p");

    eyebrow.className = "eyebrow";
    eyebrow.textContent = "SÉNÉGAL CHALLENGE";

    const title = document.createElement("h1");

    title.className = "game-title";
    title.textContent = "Fin de la partie";

    const description = document.createElement("p");

    description.className = "game-description";
    description.textContent = message;

    resultsScreen.append(eyebrow, title, description);

    // Affichage du ou des duos gagnants.
    if (results.length > 0) {
        const highestScore = results[0].score;

        const winners = results.filter(
            (result) => result.score === highestScore
        );

        const winnerCard = document.createElement("div");

        winnerCard.className = "winner-card";

        const winnerLabel = document.createElement("p");

        winnerLabel.className = "winner-label";
        winnerLabel.textContent =
            winners.length > 1 ? "DUOS À ÉGALITÉ" : "DUO GAGNANT";

        const winnerNames = document.createElement("h2");

        winnerNames.className = "winner-names";

        winnerNames.textContent = winners
            .map((winner) => winner.names.join(" & "))
            .join(" / ");

        const winnerPoints = document.createElement("p");

        winnerPoints.className = "winner-points";
        winnerPoints.textContent = `${highestScore} point(s)`;

        winnerCard.append(winnerLabel, winnerNames, winnerPoints);

        resultsScreen.appendChild(winnerCard);
    }

    // Classement complet.
    const rankingTitle = document.createElement("h2");

    rankingTitle.className = "ranking-title";
    rankingTitle.textContent = "Classement final";

    const rankingList = document.createElement("ol");

    rankingList.className = "results-ranking";

    results.forEach((result, index) => {
        const item = document.createElement("li");

        item.className = "results-ranking-item";

        if (result.score === results[0]?.score) {
            item.classList.add("results-ranking-winner");
        }

        const rank = document.createElement("span");

        rank.className = "ranking-position";
        rank.textContent = String(index + 1).padStart(2, "0");

        const team = document.createElement("span");

        team.className = "ranking-team";
        team.textContent =
            `Duo ${result.duoNumber} — ${result.names.join(" & ")}`;

        const points = document.createElement("strong");

        points.className = "ranking-points";
        points.textContent = `${result.score} pts`;

        item.append(rank, team, points);

        rankingList.appendChild(item);
    });

    resultsScreen.append(rankingTitle, rankingList);

    // Bouton 1 : rejouer avec les mêmes joueurs.
    const replayButton = document.createElement("button");

    replayButton.type = "button";
    replayButton.className = "button button-primary restart-button";
    replayButton.textContent = "Rejouer avec les mêmes joueurs";

    replayButton.addEventListener("click", replayWithSamePlayers);

    // Bouton 2 : commencer une nouvelle partie.
    const newGameButton = document.createElement("button");

    newGameButton.type = "button";
    newGameButton.className = "button button-secondary new-game-button";
    newGameButton.textContent = "Nouvelle partie";

    newGameButton.addEventListener("click", startNewGame);

    resultsScreen.append(replayButton, newGameButton);

    gameScreen.insertAdjacentElement("afterend", resultsScreen);

    resultsScreen.hidden = false;
}


/* 20. INITIALISATION */

showScreen(homeScreen);

updatePlayersDisplay();