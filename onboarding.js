/* =========================================
   SENEGAL CHALLENGE — GUIDE DE PREMIÈRE VISITE
   Fichier indépendant : script.js n'est pas modifié.
   Le guide observe les écrans du jeu et affiche
   une bulle adaptée à l'écran visible.
========================================= */

(() => {
    "use strict";

    const STORAGE_KEY = "senegal-challenge-guide-done";

    const STEPS = [
        {
            screen: "home-screen",
            target: "#start-button",
            title: "Bienvenue !",
            text:
                "Sénégal Challenge se joue à plusieurs, sur un seul téléphone. " +
                "Vous formez des duos, remplissez un saladier de mots, " +
                "puis un joueur mime pendant que son partenaire devine."
        },
        {
            screen: "players-screen",
            target: "#players-form",
            title: "Ajoutez les joueurs",
            text:
                "Écris un prénom et appuie sur le bouton + pour chaque joueur. " +
                "Il faut au moins 4 joueurs, et un nombre pair pour former des duos."
        },
        {
            screen: "duos-screen",
            target: "#reveal-button",
            title: "Les duos",
            text:
                "Le hasard forme les équipes. Appuyez sur le bouton pour " +
                "découvrir les duos un par un, et retenez qui est votre partenaire."
        },
        {
            screen: "words-screen",
            target: "#word-inputs",
            title: "Le saladier",
            text:
                "Chaque joueur propose en secret 2 à 5 mots que les autres " +
                "devront deviner. Passez le téléphone à chaque tour pour que " +
                "personne ne voie les mots des autres."
        },
        {
            screen: "game-screen",
            target: "#reveal-word-button",
            title: "À vous de jouer",
            text:
                "Le mimeur appuie sur « Révéler le mot » puis mime sans parler. " +
                "Son partenaire devine. Mot trouvé : +1 point. Mot trop difficile : " +
                "Passer. Vous avez 60 secondes par tour."
        }
    ];

    /* ---------- Mémorisation (première visite) ---------- */

    function isDone() {
        try {
            return localStorage.getItem(STORAGE_KEY) === "1";
        } catch (error) {
            return false;
        }
    }

    function setDone(value) {
        try {
            if (value) {
                localStorage.setItem(STORAGE_KEY, "1");
            } else {
                localStorage.removeItem(STORAGE_KEY);
            }
        } catch (error) {
            /* Stockage indisponible : le guide s'affichera à chaque visite. */
        }
    }

    /* ---------- Création de la bulle ---------- */

    const bubble = document.createElement("section");
    bubble.className = "guide-bubble";
    bubble.hidden = true;
    bubble.setAttribute("role", "dialog");
    bubble.setAttribute("aria-live", "polite");
    bubble.setAttribute("aria-label", "Guide de découverte");

    const progress = document.createElement("p");
    progress.className = "guide-progress";

    const title = document.createElement("p");
    title.className = "guide-title";

    const text = document.createElement("p");
    text.className = "guide-text";

    const actions = document.createElement("div");
    actions.className = "guide-actions";

    const nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.className = "guide-next";

    const skipButton = document.createElement("button");
    skipButton.type = "button";
    skipButton.className = "guide-skip";
    skipButton.textContent = "Passer le guide";

    actions.append(nextButton, skipButton);
    bubble.append(progress, title, text, actions);
    document.body.appendChild(bubble);

    /* ---------- État ---------- */

    let active = !isDone();
    let currentIndex = -1;
    const seenSteps = new Set();
    let highlighted = null;

    /* ---------- Affichage ---------- */

    function clearHighlight() {
        if (highlighted) {
            highlighted.classList.remove("guide-highlight");
            highlighted = null;
        }
    }

    function highlight(selector) {
        clearHighlight();

        const element = document.querySelector(selector);

        if (!element || element.closest("[hidden]")) return;

        element.classList.add("guide-highlight");
        highlighted = element;

        element.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function hideBubble() {
        bubble.hidden = true;
        currentIndex = -1;
        clearHighlight();
        document.body.style.paddingBottom = "";
    }

    function showStep(index) {
        const step = STEPS[index];

        currentIndex = index;
        seenSteps.add(index);

        progress.textContent = `Étape ${index + 1} sur ${STEPS.length}`;
        title.textContent = step.title;
        text.textContent = step.text;
        nextButton.textContent =
            index === STEPS.length - 1 ? "C'est parti" : "Compris";

        bubble.hidden = false;

        bubble.classList.remove("guide-enter");
        void bubble.offsetWidth;
        bubble.classList.add("guide-enter");

        /* Laisse de la place pour que la bulle ne cache pas le contenu. */
        document.body.style.paddingBottom = `${bubble.offsetHeight + 24}px`;

        highlight(step.target);
    }

    function finishGuide() {
        setDone(true);
        active = false;
        hideBubble();
    }

    /* ---------- Synchronisation avec les écrans du jeu ---------- */

    function syncWithScreen() {
        if (!active) return;

        const visibleIndex = STEPS.findIndex((step) => {
            const screen = document.getElementById(step.screen);
            return screen && !screen.hidden;
        });

        if (visibleIndex === -1) {
            if (currentIndex !== -1) hideBubble();
            return;
        }

        if (!seenSteps.has(visibleIndex)) {
            showStep(visibleIndex);
            return;
        }

        if (currentIndex !== visibleIndex && currentIndex !== -1) {
            hideBubble();
        }
    }

    const observer = new MutationObserver(syncWithScreen);

    STEPS.forEach((step) => {
        const screen = document.getElementById(step.screen);

        if (screen) {
            observer.observe(screen, {
                attributes: true,
                attributeFilter: ["hidden"]
            });
        }
    });

    /* ---------- Boutons de la bulle ---------- */

    nextButton.addEventListener("click", () => {
        if (currentIndex === STEPS.length - 1) {
            finishGuide();
        } else {
            hideBubble();
        }
    });

    skipButton.addEventListener("click", finishGuide);

    /* ---------- Lien « Revoir le guide » sur l'accueil ---------- */

    const homeScreen = document.getElementById("home-screen");

    if (homeScreen) {
        const replayButton = document.createElement("button");

        replayButton.type = "button";
        replayButton.className = "guide-replay";
        replayButton.textContent = "Revoir le guide";

        replayButton.addEventListener("click", () => {
            setDone(false);
            active = true;
            seenSteps.clear();
            hideBubble();
            syncWithScreen();
        });

        homeScreen.appendChild(replayButton);
    }

    /* ---------- Démarrage ---------- */

    syncWithScreen();
})();