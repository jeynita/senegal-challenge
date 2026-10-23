
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

continueButton.addEventListener("click", () => {
    if (players.length < 4 || players.length % 2 !== 0) {
        return;
    }

    alert("Parfait ! Attendez la formation de vos duos.");
});
