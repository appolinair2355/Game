// game.js - Version corrigée avec règles exactes du jeu TV

const State = {
    user: null,
    userPhoto: null,
    voice: 'homme',
    volume: 0.8,
    game: {
        players: [],
        robots: [],
        scores: {},
        qualified: [], // Ceux qui ont atteint 9 points
        eliminated: [], // Ceux éliminés (4ème)
        currentManche: 0,
        currentQuestion: null,
        currentBuzzer: null,
        buzzerLocked: false,
        timers: {},
        selectedAnswer: null,
        // 4 à la suite
        current4SPlayer: 0,
        themes4S: [],
        currentTheme: null,
        serie4S: 0,
        // Face à face
        fafPlayers: [],
        fafScores: {},
        fafCurrentPlayer: null, // Celui qui a la main
        fafZones: { main: [4, 2], other: [3, 1] }, // Zones selon qui prend la main
        fafCurrentZone: null
    }
};

// Questions enrichies
const Questions = {
    neufPoints: [
        { q: "Capitale de la France ?", a: "Paris", options: ["Lyon", "Marseille", "Paris", "Bordeaux"], points: 1 },
        { q: "Nombre de continents ?", a: "7", options: ["5", "6", "7", "8"], points: 1 },
        { q: "Peintre de la Joconde ?", a: "Léonard de Vinci", options: ["Michel-Ange", "Raphaël", "Léonard de Vinci", "Van Gogh"], points: 2 },
        { q: "Plus grand océan ?", a: "Pacifique", options: ["Atlantique", "Indien", "Pacifique", "Arctique"], points: 1 },
        { q: "Révolution française ?", a: "1789", options: ["1789", "1792", "1804", "1776"], points: 2 },
        { q: "Symbole de l'or ?", a: "Au", options: ["Ag", "Fe", "Au", "Cu"], points: 3 },
        { q: "Auteur des Misérables ?", a: "Victor Hugo", options: ["Zola", "Hugo", "Balzac", "Dumas"], points: 2 },
        { q: "Planète proche du Soleil ?", a: "Mercure", options: ["Vénus", "Mercure", "Terre", "Mars"], points: 1 },
        { q: "Plus long fleuve ?", a: "Nil", options: ["Amazone", "Nil", "Mississippi", "Yangtsé"], points: 2 },
        { q: "Inventeur ampoule ?", a: "Edison", options: ["Tesla", "Edison", "Einstein", "Newton"], points: 2 },
        { q: "Joueurs football ?", a: "11", options: ["9", "10", "11", "12"], points: 1 },
        { q: "Capitale Japon ?", a: "Tokyo", options: ["Pékin", "Séoul", "Tokyo", "Bangkok"], points: 1 },
        { q: "Petit Prince auteur ?", a: "Saint-Exupéry", options: ["Saint-Exupéry", "Verne", "Hugo", "Proust"], points: 2 },
        { q: "Plus grand désert ?", a: "Sahara", options: ["Gobi", "Sahara", "Kalahari", "Atacama"], points: 2 },
        { q: "Premier pas Lune ?", a: "1969", options: ["1965", "1969", "1972", "1959"], points: 3 }
    ],
    quatreSuite: [
        { theme: "Géographie", questions: [
            { q: "Capitale de l'Italie ?", a: "Rome", options: ["Milan", "Rome", "Venise", "Naples"] },
            { q: "Plus grande île ?", a: "Groenland", options: ["Australie", "Groenland", "Madagascar", "Borneo"] },
            { q: "Fleuve de Paris ?", a: "La Seine", options: ["La Loire", "Le Rhône", "La Seine", "La Garonne"] },
            { q: "Montagne plus haute ?", a: "L'Everest", options: ["K2", "L'Everest", "Mont Blanc", "Kilimandjaro"] }
        ]},
        { theme: "Histoire", questions: [
            { q: "Premier président Vème République ?", a: "De Gaulle", options: ["De Gaulle", "Mitterrand", "Pompidou", "Giscard"] },
            { q: "Fin Seconde Guerre mondiale ?", a: "1945", options: ["1943", "1944", "1945", "1946"] },
            { q: "Roi pendant Révolution ?", a: "Louis XVI", options: ["Louis XIV", "Louis XV", "Louis XVI", "Charles X"] },
            { q: "Découvreur Amérique 1492 ?", a: "Christophe Colomb", options: ["Magellan", "Vasco de Gama", "Christophe Colomb", "Marco Polo"] }
        ]},
        { theme: "Sciences", questions: [
            { q: "Planète plus grande ?", a: "Jupiter", options: ["Saturne", "Jupiter", "Neptune", "Uranus"] },
            { q: "Formule eau ?", a: "H2O", options: ["CO2", "H2O", "O2", "NaCl"] },
            { q: "Vitesse lumière ?", a: "300000", options: ["150000", "300000", "400000", "250000"] },
            { q: "Os plus long ?", a: "Le fémur", options: ["L'humérus", "Le fémur", "Le tibia", "La colonne"] }
        ]},
        { theme: "Arts", questions: [
            { q: "Nuit étoilée peintre ?", a: "Van Gogh", options: ["Picasso", "Monet", "Van Gogh", "Cézanne"] },
            { q: "Quatre Saisons ?", a: "Vivaldi", options: ["Mozart", "Bach", "Vivaldi", "Beethoven"] },
            { q: "Roméo et Juliette ?", a: "Shakespeare", options: ["Molière", "Shakespeare", "Corneille", "Racine"] },
            { q: "Le Penseur ?", a: "Rodin", options: ["Michel-Ange", "Rodin", "Donatello", "Bernin"] }
        ]},
        { theme: "Sports", questions: [
            { q: "Sport avec shuttlecock ?", a: "Badminton", options: ["Tennis", "Badminton", "Squash", "Ping-pong"] },
            { q: "JO 2024 ?", a: "Paris", options: ["Londres", "Tokyo", "Paris", "Los Angeles"] },
            { q: "Coupe du Monde fréquence ?", a: "4 ans", options: ["2 ans", "3 ans", "4 ans", "5 ans"] },
            { q: "Tour de France mois ?", a: "Juillet", options: ["Juin", "Juillet", "Août", "Mai"] }
        ]}
    ],
    faceAFace: [
        { theme: "Cinéma", reponse: "Titanic", indices: ["Film 1997", "James Cameron", "Bateau qui coule", "DiCaprio", "Iceberg"], options: ["Titanic", "Avatar", "Pearl Harbor", "Gladiator"] },
        { theme: "Gastronomie", reponse: "Croissant", indices: ["Viennoiserie", "Forme lune", "Beurre", "Petit-déj", "France"], options: ["Croissant", "Pain choco", "Brioche", "Baguette"] },
        { theme: "Sport", reponse: "Tour de France", indices: ["Cyclisme", "1903", "Maillot jaune", "Juillet", "France"], options: ["Tour de France", "Giro", "Vuelta", "Paris-Roubaix"] },
        { theme: "Histoire", reponse: "Napoléon", indices: ["Empereur", "Petite taille", "Waterloo 1815", "Code civil", "Sainte-Hélène"], options: ["Napoléon", "Louis XIV", "Charlemagne", "De Gaulle"] },
        { theme: "Musique", reponse: "Mozart", indices: ["Autrichien", "Enfant prodige", "600 œuvres", "Opéra à 12 ans", "Vienne"], options: ["Mozart", "Beethoven", "Bach", "Vivaldi"] },
        { theme: "Technologie", reponse: "Internet", indices: ["Réseau mondial", "Militaire US", "Tim Berners-Lee", "WWW", "HTTP"], options: ["Internet", "Intranet", "Ethernet", "WiFi"] },
        { theme: "Littérature", reponse: "Harry Potter", indices: ["7 tomes", "JK Rowling", "Sorcier", "Poudlard", "Voldemort"], options: ["Harry Potter", "Seigneur Anneaux", "Narnia", "Hunger Games"] },
        { theme: "Science", reponse: "Einstein", indices: ["Physicien", "Relativité", "E=mc²", "Nobel 1921", "Cheveux"], options: ["Einstein", "Newton", "Galilée", "Tesla"] }
    ]
};

// ... (le reste du code d'initialisation reste similaire)

// ==================== 9 POINTS GAGNANTS CORRIGÉ ====================

function renderPupitres9PG() {
    const container = document.getElementById('pupitres9PG');
    container.innerHTML = '';
    
    const allPlayers = [State.user, ...State.game.robots];
    
    allPlayers.forEach((player, idx) => {
        const isQualified = State.game.qualified.includes(idx);
        const isEliminated = State.game.eliminated.includes(idx);
        const score = State.game.scores[idx] || 0;
        
        const div = document.createElement('div');
        div.className = 'pupitre';
        if (State.game.currentBuzzer === idx) div.classList.add('active');
        if (isQualified) {
            div.style.borderColor = 'var(--vert)';
            div.style.boxShadow = '0 0 30px var(--vert)';
        }
        if (isEliminated) {
            div.style.opacity = '0.3';
            div.style.filter = 'grayscale(100%)';
        }
        
        // Photo
        let photoHtml = idx === 0 ? 
            `<img src="${State.userPhoto}" alt="Photo">` : 
            `<div style="font-size: 4rem;">🤖</div>`;
        
        // Barre de 9 cases
        let pointsHtml = '<div class="points-bar">';
        for (let i = 0; i < 9; i++) {
            const filled = i < score;
            pointsHtml += `<div class="point-slot ${filled ? 'filled' : ''}"></div>`;
        }
        pointsHtml += '</div>';
        
        // IMPORTANT: Si qualifié ou éliminé, pas de bouton buzzer
        let buzzerHtml = '';
        if (!isQualified && !isEliminated) {
            buzzerHtml = `<button class="btn-buzz" onclick="buzz9PG(${idx})" 
                ${State.game.buzzerLocked || State.game.currentBuzzer !== null ? 'disabled' : ''}>
                ${State.game.currentBuzzer === idx ? '✓ EN RÉPONSE' : 'JE VEUX RÉPONDRE'}
            </button>`;
        } else if (isQualified) {
            buzzerHtml = '<div style="color: var(--vert); font-weight: 900; margin-top: 10px;">✓ QUALIFIÉ</div>';
        } else if (isEliminated) {
            buzzerHtml = '<div style="color: var(--rouge); font-weight: 900; margin-top: 10px;">✗ ÉLIMINÉ</div>';
        }
        
        div.innerHTML = `
            <div class="pupitre-photo">${photoHtml}</div>
            <div class="pupitre-name">${player.prenom}</div>
            ${pointsHtml}
            <div class="score-display">${score}/9</div>
            ${buzzerHtml}
        `;
        
        container.appendChild(div);
    });
}

function correctAnswer() {
    const idx = State.game.currentBuzzer;
    const q = State.game.currentQuestion;
    State.game.scores[idx] += q.points;
    
    const player = idx === 0 ? 'Vous' : `Robot ${idx}`;
    speak(`Bonne réponse ! ${q.points} points pour ${player} !`);
    
    // Vérifier qualification (9 points)
    if (State.game.scores[idx] >= 9 && !State.game.qualified.includes(idx)) {
        State.game.qualified.push(idx);
        if (idx === 0) {
            speak('Félicitations, vous êtes qualifié ! Vous ne pouvez plus buzzer.');
            createConfetti();
        } else {
            speak(`Le robot ${idx} est qualifié et ne peut plus buzzer !`);
        }
    }
    
    // Vérifier si on a 3 qualifiés
    if (State.game.qualified.length >= 3) {
        setTimeout(() => end9PG(), 2000);
        return;
    }
    
    setTimeout(() => {
        State.game.currentBuzzer = null;
        nextQuestion9PG();
    }, 2000);
}

function end9PG() {
    // Le 4ème (non qualifié) est éliminé
    const allPlayers = [0, 1, 2, 3];
    const eliminated = allPlayers.find(i => !State.game.qualified.includes(i));
    State.game.eliminated.push(eliminated);
    
    if (eliminated === 0) {
        speak('Vous êtes éliminé ! Game Over.');
        setTimeout(() => showMenu(), 3000);
        return;
    }
    
    speak(`Fin de la manche. Le joueur ${eliminated} est éliminé. Les qualifiés sont : ${State.game.qualified.join(', ')}`);
    setTimeout(() => start4Suite(), 3000);
}

// ==================== 4 À LA SUITE CORRIGÉ ====================

function start4Suite() {
    showScreen('screen4Suite');
    document.getElementById('mancheTitle').textContent = '4 À LA SUITE';
    
    // Ordre des qualifiés pour choisir les thèmes
    State.game.fafPlayers = [...State.game.qualified];
    State.game.current4SPlayer = 0;
    State.game.themes4S = [...Questions.quatreSuite];
    State.game.usedThemes = [];
    
    showThemeSelection();
}

function showThemeSelection() {
    const playerIdx = State.game.fafPlayers[State.game.current4SPlayer];
    const player = playerIdx === 0 ? State.user : State.game.robots[playerIdx - 1];
    
    document.getElementById('theme4S').textContent = `${player.prenom}, choisissez votre thème :`;
    document.getElementById('player4SName').textContent = '';
    document.getElementById('suiteBar').style.display = 'none';
    document.getElementById('question4S').style.display = 'none';
    document.getElementById('timer40s').style.display = 'none';
    document.getElementById('answers4S').style.display = 'none';
    document.getElementById('btnStart4S').style.display = 'none';
    
    // Afficher les thèmes disponibles
    const container = document.getElementById('answers4S');
    container.innerHTML = '';
    container.style.display = 'grid';
    
    State.game.themes4S.forEach((theme, idx) => {
        if (State.game.usedThemes.includes(idx)) return;
        
        const btn = document.createElement('div');
        btn.className = 'answer-btn';
        btn.style.fontSize = '1.5rem';
        btn.textContent = theme.theme;
        btn.onclick = () => selectTheme4S(idx);
        container.appendChild(btn);
    });
    
    // Si c'est un robot, choisir automatiquement
    if (playerIdx !== 0) {
        setTimeout(() => {
            const available = State.game.themes4S.map((t, i) => i).filter(i => !State.game.usedThemes.includes(i));
            const choice = available[Math.floor(Math.random() * available.length)];
            selectTheme4S(choice);
        }, 2000);
    }
}

function selectTheme4S(themeIdx) {
    State.game.usedThemes.push(themeIdx);
    State.game.currentTheme = State.game.themes4S[themeIdx];
    State.game.serie4S = 0;
    
    // Afficher le jeu
    document.getElementById('suiteBar').style.display = 'flex';
    document.getElementById('question4S').style.display = 'block';
    document.getElementById('timer40s').style.display = 'block';
    document.getElementById('theme4S').textContent = 'Thème : ' + State.game.currentTheme.theme;
    
    updateSuiteBar();
    
    const playerIdx = State.game.fafPlayers[State.game.current4SPlayer];
    document.getElementById('player4SName').textContent = playerIdx === 0 ? 
        State.user.prenom : State.game.robots[playerIdx - 1].prenom;
    
    if (playerIdx === 0) {
        document.getElementById('btnStart4S').style.display = 'inline-block';
        document.getElementById('btnStart4S').textContent = 'DÉMARRER (40 secondes)';
    } else {
        // Robot démarre automatiquement
        setTimeout(start4STimer, 1500);
    }
}

// ... (continue avec la logique des robots qui cliquent)

// ==================== FACE À FACE CORRIGÉ ====================

function startFAF() {
    showScreen('screenFAF');
    document.getElementById('mancheTitle').textContent = 'FACE À FACE';
    
    // Les 2 premiers qualifiés
    State.game.fafPlayers = State.game.qualified.slice(0, 2);
    State.game.fafScores = { [State.game.fafPlayers[0]]: 0, [State.game.fafPlayers[1]]: 0 };
    
    renderPupitresFAF();
    nextFAFQuestion();
}

function nextFAFQuestion() {
    // Vérifier victoire (12 points)
    const maxScore = Math.max(...Object.values(State.game.fafScores));
    if (maxScore >= 12) {
        const winner = Object.keys(State.game.fafScores).find(k => State.game.fafScores[k] >= 12);
        endGame(parseInt(winner));
        return;
    }
    
    const q = Questions.faceAFace[Math.floor(Math.random() * Questions.faceAFace.length)];
    State.game.currentFAFQuestion = q;
    State.game.fafTimeLeft = 20; // 20 secondes, pas 5 !
    State.game.indiceIndex = 0;
    State.game.fafCurrentZone = null;
    
    // Reset zones - aucune active au début
    document.querySelectorAll('.zone').forEach(z => z.classList.remove('active'));
    
    document.getElementById('indicesContainer').innerHTML = `<div style="color: var(--bleu-clair);">Thème : ${q.theme}</div>`;
    document.getElementById('timerFAF').textContent = '20';
    document.getElementById('timerFAF').classList.remove('warning');
    document.getElementById('answersFAF').style.display = 'none';
    
    speak(`Nouvelle manche. Thème : ${q.theme}. Qui prend la main ?`);
    
    // Choix prendre/laisser la main
    showHandChoice();
}

function showHandChoice() {
    const container = document.getElementById('answersFAF');
    container.innerHTML = '';
    container.style.display = 'flex';
    container.style.gap = '20px';
    container.style.justifyContent = 'center';
    
    const takeBtn = document.createElement('button');
    takeBtn.className = 'btn';
    takeBtn.textContent = 'PRENDRE LA MAIN (Zones 4-2)';
    takeBtn.onclick = () => chooseHand(true);
    
    const leaveBtn = document.createElement('button');
    leaveBtn.className = 'btn btn-secondary';
    leaveBtn.textContent = 'LAISSER LA MAIN (Zones 3-1)';
    leaveBtn.onclick = () => chooseHand(false);
    
    container.appendChild(takeBtn);
    container.appendChild(leaveBtn);
    
    // Si c'est au robot de décider
    const currentPlayer = State.game.fafPlayers.find(p => State.game.fafScores[p] === Math.min(...Object.values(State.game.fafScores)));
    if (currentPlayer !== 0) {
        setTimeout(() => {
            // Robot prend la main s'il est en retard
            const shouldTake = Math.random() > 0.3;
            chooseHand(shouldTake);
        }, 2000);
    }
}

function chooseHand(take) {
    const player0 = State.game.fafPlayers[0];
    const player1 = State.game.fafPlayers[1];
    
    if (take) {
        // Celui qui prend la main a les zones 4-2
        // L'autre a les zones 3-1
        State.game.fafCurrentPlayer = 0; // Joueur humain prend
        speak('Vous prenez la main ! Vos zones : 4 et 2 points.');
    } else {
        State.game.fafCurrentPlayer = 1; // Robot prend
        speak('Vous laissez la main. Le robot prend les zones 4-2, vous avez les zones 3-1.');
    }
    
    startFAFTimer();
}

function startFAFTimer() {
    const q = State.game.currentFAFQuestion;
    
    // Afficher réponses
    const container = document.getElementById('answersFAF');
    container.innerHTML = '';
    container.style.display = 'grid';
    
    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, idx) => {
        const btn = document.createElement('div');
        btn.className = 'answer-btn';
        btn.innerHTML = `<span class="answer-letter">${letters[idx]}</span>${opt}`;
        btn.onclick = function() {
            // Réponse immédiate, pas de confirmation
            clearInterval(State.game.timers.faf);
            checkAnswerFAF(opt, this);
        };
        container.appendChild(btn);
    });
    
    // Timer 20 secondes avec zones qui descendent
    State.game.timers.faf = setInterval(() => {
        State.game.fafTimeLeft--;
        document.getElementById('timerFAF').textContent = State.game.fafTimeLeft;
        
        // Déterminer quelle zone est active selon qui a la main
        // Celui qui a la main: 4pts (20-16), 2pts (15-10), 0 (perdu si passe 10)
        // L'autre: 3pts (20-14), 1pt (13-8), 0 (perdu si passe 8)
        
        const hasHand = State.game.fafCurrentPlayer;
        const other = 1 - hasHand;
        
        document.querySelectorAll('.zone').forEach(z => z.classList.remove('active'));
        
        if (State.game.fafTimeLeft >= 16) {
            // Zone 4 active pour celui qui a la main
            document.getElementById('zone4').classList.add('active');
            State.game.fafCurrentZone = 4;
        } else if (State.game.fafTimeLeft >= 14) {
            // Zone 3 active pour l'autre
            document.getElementById('zone3').classList.add('active');
            State.game.fafCurrentZone = 3;
        } else if (State.game.fafTimeLeft >= 10) {
            // Zone 2 active pour celui qui a la main
            document.getElementById('zone2').classList.add('active');
            State.game.fafCurrentZone = 2;
        } else if (State.game.fafTimeLeft >= 8) {
            // Zone 1 active pour l'autre
            document.getElementById('zone1').classList.add('active');
            State.game.fafCurrentZone = 1;
        } else {
            // Temps écoulé, 0 point
            State.game.fafCurrentZone = 0;
        }
        
        if (State.game.fafTimeLeft <= 5) {
            document.getElementById('timerFAF').classList.add('warning');
        }
        
        // Indices automatiques
        if (State.game.fafTimeLeft === 16 && State.game.indiceIndex === 0) revealIndice();
        if (State.game.fafTimeLeft === 12 && State.game.indiceIndex === 1) revealIndice();
        if (State.game.fafTimeLeft === 8 && State.game.indiceIndex === 2) revealIndice();
        if (State.game.fafTimeLeft === 4 && State.game.indiceIndex === 3) revealIndice();
        
        if (State.game.fafTimeLeft <= 0) {
            clearInterval(State.game.timers.faf);
            timeOutFAF();
        }
    }, 1000);
}

function checkAnswerFAF(answer, btnElement) {
    const q = State.game.currentFAFQuestion;
    const isCorrect = (answer === q.reponse);
    
    // Animation
    btnElement.classList.add(isCorrect ? 'correct' : 'wrong');
    document.querySelectorAll('.answer-btn').forEach(b => b.style.pointerEvents = 'none');
    
    if (isCorrect) {
        // Points selon la zone actuelle
        const points = State.game.fafCurrentZone || 1;
        const playerIdx = State.game.fafPlayers[State.game.fafCurrentPlayer];
        State.game.fafScores[playerIdx] += points;
        
        speak(`Bonne réponse ! ${points} points !`);
    } else {
        // MAUVAISE RÉPONSE: Les points vont à l'autre joueur !
        const otherPlayer = 1 - State.game.fafCurrentPlayer;
        const points = State.game.fafCurrentZone || 1;
        const otherIdx = State.game.fafPlayers[otherPlayer];
        State.game.fafScores[otherIdx] += points;
        
        speak(`Mauvaise réponse ! ${points} points pour l'adversaire !`);
    }
    
    renderPupitresFAF();
    setTimeout(nextFAFQuestion, 3000);
}

function timeOutFAF() {
    speak('Temps écoulé ! Aucun point.');
    setTimeout(nextFAFQuestion, 2000);
}

// ... (reste du code)
