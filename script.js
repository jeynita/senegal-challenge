
const homeScreen = document.querySelector("#home-screen");
const playersScreen = document.querySelector("#players-screen");

const startButton = document.querySelector("#start-button");
const backButton = document.querySelector("#back-button");

const playersForm = document.querySelector("#players-form");
const playerInput = document.querySelector("#player-name");
const playersList = document.querySelector("#players-list");

const playerCount = document.querySelector("#player-count");
const formMessage = document.querySelector("#form-message");
const continueButton = document.querySelector("#continue-button");

const players = [];

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
        (player) => player.toLocaleLowerCase("fr") === name.toLocaleLowerCase("fr")
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
    playerCount.textContent = `${count} joueur${count > 1 ? "s" : ""}`;

    const validCount = count >= 4 && count % 2 === 0;
    continueButton.disabled = !validCount;
}

const duosScreen = document.querySelector("#duos-screen");
const duosDescription = document.querySelector("#duos-description");
const duoCard = document.querySelector("#duo-card");
const duoNumber = document.querySelector("#duo-number");
const duoNames = document.querySelector("#duo-names");
const duoMessage = document.querySelector("#duo-message");
const revealButton = document.querySelector("#reveal-button");
const allDuos = document.querySelector("#all-duos");
const allDuosList = document.querySelector("#all-duos-list");
const wordsButton = document.querySelector("#words-button");

let duos = [];
let currentDuoIndex = 0;

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
        item.textContent = `Duo ${index + 1} : ${duo[0]} & ${duo[1]}`;
        allDuosList.append(item);
    });

    allDuos.hidden = false;
}

wordsButton.addEventListener("click", () => {
    alert("Prochaine étape : chaque joueur pourra saisir ses mots secrets !");
});

