# Sénégal Challenge

Jeu de mime et de devinettes à jouer entre amis, sur un seul téléphone. Les joueurs s'inscrivent, le hasard forme les duos, chacun glisse ses mots dans le saladier, puis on mime, on devine et on rigole.

**Jouer en ligne : https://jeynita.github.io/senega;-challenge**

![Aperçu du jeu](preview.png)

## Principe du jeu

1. Les joueurs ajoutent leur prénom ou pseudo (4 joueurs minimum, nombre pair).
2. Le hasard forme les duos, révélés un par un.
3. Chaque joueur saisit en secret entre 2 et 5 mots à faire deviner, puis passe le téléphone.
4. À chaque tour, un joueur du duo mime les mots du saladier pendant 60 secondes, son partenaire devine.
5. Un mot deviné rapporte 1 point au duo, un mot peut être passé.
6. À la fin, le classement des duos et le duo gagnant sont affichés.

## Fonctionnalités

- Inscription des joueurs avec validation (doublons, nombre minimum, nombre pair)
- Tirage au sort aléatoire des duos avec révélation animée
- Saisie privée des mots, joueur par joueur
- Chrono de 60 secondes avec alerte visuelle en fin de temps
- Tableau des scores en direct et classement final
- Interface responsive, pensée d'abord pour le mobile
- Design coloré et ludique, animations respectueuses de `prefers-reduced-motion`

## Technologies

- HTML5 sémantique
- CSS3 (variables CSS, Grid, Flexbox, animations)
- JavaScript natif (aucune dépendance, aucune étape de compilation)
- Polices Google Fonts : Fredoka et Nunito Sans
- Hébergement : GitHub Pages

## Structure du projet

```
.
├── index.html    Structure des écrans du jeu
├── style.css     Styles et animations
├── script.js     Logique du jeu
└── README.md
```

## Lancer le projet en local

```bash
git clone https://github.com/jeynita/senegal-challenge.git
cd NOM-DU-DEPOT
```

Ouvre ensuite `index.html` dans un navigateur, ou lance-le avec l'extension Live Server de VS Code.

## Améliorations prévues

- Installation sur l'écran d'accueil (PWA)
- Choix de la durée du chrono
- Plusieurs manches
- Thèmes de mots (culture sénégalaise, célébrités, objets du quotidien)

## Auteure

**Dieynaba Baldé **, étudiante en génie logiciel à l'École Supérieure Polytechnique de Dakar.

GitHub : [@jeynita](https://github.com/jeynita)
