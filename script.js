
const homeScreen = document.querySelector("#home-screen");
const playersScreen = document.querySelector("#players-screen");
const duosScreen = document.querySelector("#duos-screen");
const wordsScreen = document.querySelector("#words-screen");

const startButton = document.querySelector("#start-button");
const backButton = document.querySelector("#back-button");

const playersForm = document.querySelector("#players-form");
const playerInput = document.querySelector("#player-name");
const playersList = document.querySelector("#players-list");
const playerCount = document.querySelector("#player-count");
const formMessage = document.querySelector("#form-message");
const continueButton = document.querySelector("#continue-button");

const duosDescription = document.querySelector("#duos-description");
const duoCard = document.querySelector("#duo-card");
const duoNumber = document.querySelector("#duo-number");
const duoNames = document.querySelector("#duo-names");
const duoMessage = document.querySelector("#duo-message");
const revealButton = document.querySelector("#reveal-button");
const allDuos = document.querySelector("#all-duos");
const allDuosList = document.querySelector("#all-duos-list");
const wordsButton = document.querySelector("#words-button");

// Écran de saisie des mots
const wordPlayerMessage = document.querySelector("#word-player-message");
const wordPrivateScreen = document.querySelector("#word-private-screen");
const wordPlayerName = document.querySelector("#word-player-name");
const wordsForm = document.querySelector("#words-form");
const wordInputs = document.querySelector("#word-inputs");
const addWordButton = document.querySelector("#add-word-button");
const wordsCount = document.querySelector("#words-count");
const wordsMessage = document.querySelector("#words-message");

const nextPlayerScreen = document.querySelector("#next-player-screen");
const nextPlayerMessage = document.querySelector("#next-player-message");
const readyButton = document.querySelector("#ready-button");

const wordsFinishedScreen = document.querySelector("#words-finished-screen");
const prepareSaladButton = document.querySelector("#prepare-salad-button");

const players = [];

let duos = [];
let currentDuoIndex = 0;
let currentWordPlayerIndex = 0;
let submittedWords = [];
let saladWords = [];

// INSCRIPTION DES JOUEURS

startButton.addEventListener("click", () => {
    homeScreen.hidden = true;
    playersScreen.hidden = false;
    playerInput.focus();
});

backButton.addEventListener("click", () => {
    playersScreen.hidden = true;
    homeScreen.hidden = false;
    formMessage.textContent = "";
});

playersForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = playerInput.value.trim();

    if (!name) {
        formMessage.textContent = "Entre un prénom ou un pseudo.";
        playerInput.focus();
        return;
    }

    const alreadyExists = players.some(
        (player) =>
            player.toLocaleLowerCase("fr") ===
            name.toLocaleLowerCase("fr")
    );

    if (alreadyExists) {
        formMessage.textContent = "Ce nom est déjà dans la liste.";
        playerInput.focus();
        return;
    }

    players.push(name);
    playerInput.value = "";
    formMessage.textContent = "";

    renderPlayers();
    playerInput.focus();
});

function renderPlayers() {
    playersList.replaceChildren();

    players.forEach((name, index) => {
        const item = document.createElement("li");
        item.className = "player-item";

        const playerName = document.createElement("span");
        playerName.className = "player-name";
        playerName.textContent = `${index + 1}. ${name}`;

        const removeButton = document.createElement("button");
        removeButton.className = "remove-player";
        removeButton.type = "button";
        removeButton.textContent = "Supprimer";
        removeButton.setAttribute("aria-label", `Supprimer ${name}`);

        removeButton.addEventListener("click", () => {
            players.splice(index, 1);
            formMessage.textContent = "";
            renderPlayers();
        });

        item.append(playerName, removeButton);
        playersList.append(item);
    });

    const count = players.length;
    playerCount.textContent =
        `${count} joueur${count > 1 ? "s" : ""}`;

    continueButton.disabled = !(count >= 4 && count % 2 === 0);
}

// TIRAGE ALÉATOIRE DES DUOS

continueButton.addEventListener("click", () => {
    if (players.length < 4 || players.length % 2 !== 0) {
        return;
    }

    duos = createDuos(players);
    currentDuoIndex = 0;

    homeScreen.hidden = true;
    playersScreen.hidden = true;
    duosScreen.hidden = false;

    allDuos.hidden = true;
    allDuosList.replaceChildren();

    duosDescription.textContent =
        `${duos.length} duos vont être révélés. Que le suspense commence !`;

    duoNumber.textContent = "À VOUS DE JOUER";
    duoNames.replaceChildren();

    const questionOne = document.createElement("span");
    questionOne.textContent = "?";

    const ampersand = document.createElement("span");
    ampersand.className = "duo-ampersand";
    ampersand.textContent = "&";

    const questionTwo = document.createElement("span");
    questionTwo.textContent = "?";

    duoNames.append(questionOne, ampersand, questionTwo);

    duoMessage.textContent = "Qui sera ton partenaire ?";

    revealButton.hidden = false;
    revealButton.querySelector(".button-label").textContent =
        "Révéler le premier duo";
});

function createDuos(names) {
    const shuffledPlayers = [...names];

    for (let i = shuffledPlayers.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));

        [shuffledPlayers[i], shuffledPlayers[randomIndex]] =
            [shuffledPlayers[randomIndex], shuffledPlayers[i]];
    }

    const result = [];

    for (let i = 0; i < shuffledPlayers.length; i += 2) {
        result.push([
            shuffledPlayers[i],
            shuffledPlayers[i + 1]
        ]);
    }

    return result;
}

revealButton.addEventListener("click", () => {
    if (currentDuoIndex >= duos.length) {
        return;
    }

    const duo = duos[currentDuoIndex];

    duoNumber.textContent = `DUO ${currentDuoIndex + 1}`;
    duoNames.replaceChildren();

    const firstPlayer = document.createElement("span");
    firstPlayer.textContent = duo[0];

    const ampersand = document.createElement("span");
    ampersand.className = "duo-ampersand";
    ampersand.textContent = "&";

    const secondPlayer = document.createElement("span");
    secondPlayer.textContent = duo[1];

    duoNames.append(firstPlayer, ampersand, secondPlayer);

    duoMessage.textContent = "Votre aventure commence ensemble !";

    duoCard.classList.remove("reveal");
    void duoCard.offsetWidth;
    duoCard.classList.add("reveal");

    currentDuoIndex++;

    if (currentDuoIndex < duos.length) {
        revealButton.querySelector(".button-label").textContent =
            "Découvrir le duo suivant";
    } else {
        revealButton.hidden = true;
        duosDescription.textContent =
            "Tous les partenaires ont été tirés au sort !";

        displayAllDuos();
    }
});

function displayAllDuos() {
    allDuosList.replaceChildren();

    duos.forEach((duo, index) => {
        const item = document.createElement("li");
        item.textContent =
            `Duo ${index + 1} : ${duo[0]} & ${duo[1]}`;

        allDuosList.append(item);
    });

    allDuos.hidden = false;
}

// DÉMARRAGE DE LA SAISIE PRIVÉE

wordsButton.addEventListener("click", () => {
    duosScreen.hidden = true;
    wordsScreen.hidden = false;

    currentWordPlayerIndex = 0;
    submittedWords = [];
    saladWords = [];

    showPassPhoneScreen();
});

function showPassPhoneScreen() {
    wordPrivateScreen.hidden = true;
    nextPlayerScreen.hidden = false;
    wordsFinishedScreen.hidden = true;

    nextPlayerMessage.textContent =
        `Passe le téléphone à ${players[currentWordPlayerIndex]}. ` +
        "Assure-toi que personne ne regarde l'écran.";

    readyButton.textContent = "Je suis prêt";
}

readyButton.addEventListener("click", () => {
    if (currentWordPlayerIndex >= players.length) {
        return;
    }

    nextPlayerScreen.hidden = true;
    wordsFinishedScreen.hidden = true;
    wordPrivateScreen.hidden = false;

    wordPlayerName.textContent =
        `À toi de jouer, ${players[currentWordPlayerIndex]} !`;

    wordPlayerMessage.textContent =
        "Saisis tes mots sans les montrer aux autres.";

    resetWordInputs();
});

function resetWordInputs() {
    wordInputs.replaceChildren();

    for (let i = 1; i <= 3; i++) {
        createWordInput(i);
    }

    wordsMessage.textContent = "";
    updateWordCount();

    wordInputs.querySelector("input")?.focus();
}

function createWordInput(number) {
    const input = document.createElement("input");

    input.type = "text";
    input.className = "word-input";
    input.placeholder = `Mot ${number}`;
    input.maxLength = 40;
    input.required = true;
    input.autocomplete = "off";

    input.addEventListener("input", updateWordCount);
    wordInputs.append(input);
}

addWordButton.addEventListener("click", () => {
    const inputs = wordInputs.querySelectorAll(".word-input");

    if (inputs.length >= 5) {
        wordsMessage.textContent = "Tu as atteint la limite de 5 mots.";
        return;
    }

    createWordInput(inputs.length + 1);
    updateWordCount();

    const updatedInputs = wordInputs.querySelectorAll(".word-input");
    updatedInputs[updatedInputs.length - 1].focus();
});

function updateWordCount() {
    const inputs = [...wordInputs.querySelectorAll(".word-input")];

    const filledCount = inputs.filter(
        (input) => input.value.trim() !== ""
    ).length;

    wordsCount.textContent =
        `${filledCount}/5 mots saisis — 3 minimum, 5 maximum.`;

    addWordButton.disabled = inputs.length >= 5;
}

wordsForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const inputs = [...wordInputs.querySelectorAll(".word-input")];

    const words = inputs
        .map((input) => input.value.trim())
        .filter((word) => word !== "");

    if (words.length < 3) {
        wordsMessage.textContent = "Il faut saisir au moins 3 mots.";
        return;
    }

    if (words.length > 5) {
        wordsMessage.textContent = "Tu ne peux pas saisir plus de 5 mots.";
        return;
    }

    submittedWords.push(...words);

    // Supprime les champs visibles avant de passer le téléphone.
    wordInputs.replaceChildren();
    wordsMessage.textContent = "";

    currentWordPlayerIndex++;

    if (currentWordPlayerIndex < players.length) {
        showPassPhoneScreen();
    } else {
        wordPrivateScreen.hidden = true;
        nextPlayerScreen.hidden = true;
        wordsFinishedScreen.hidden = false;

        wordsFinishedScreen.querySelector("h2").textContent =
            "Le saladier est presque prêt !";

        wordsFinishedScreen.querySelector("p").textContent =
            "Tous les joueurs ont terminé. Prêts à jouer ?";
    }
});

// PRÉPARATION SECRÈTE DU SALADIER

prepareSaladButton.addEventListener("click", () => {
    const uniqueWords = new Map();

    submittedWords.forEach((word) => {
        const key = word
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLocaleLowerCase("fr");

        if (!uniqueWords.has(key)) {
            uniqueWords.set(key, word);
        }
    });

    saladWords = [...uniqueWords.values()];

    for (let i = saladWords.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));

        [saladWords[i], saladWords[randomIndex]] =
            [saladWords[randomIndex], saladWords[i]];
    }

    // Ne jamais afficher la liste des mots ici.
    wordsFinishedScreen.querySelector("h2").textContent =
        "Le saladier est prêt !";

    wordsFinishedScreen.querySelector("p").textContent =
        `${saladWords.length} mots sont prêts. Le jeu peut bientôt commencer !`;

    prepareSaladButton.textContent = "Saladier préparé !";
    prepareSaladButton.disabled = true;
});
