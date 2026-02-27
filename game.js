// game.js
// Questions pour un Champion - Version QCM avec 30 secondes pour répondre

const GameState = {
    players: [],
    currentManche: 0,
    questions: {
        neufPoints: [],
        quatreSuite: [],
        faceAFace: []
    },
    
    // 9 Points Gagnants
    current9PG: {
        qualified: [],
        eliminated: [],
        currentQuestion: null,
        questionIndex: 0,
        pointsValue: 1,
        buzzerLocked: false,
        currentBuzzer: null,
        readingTimerInterval: null,
        responseTimerInterval: null,
        timeRemaining: 30,
        selectedAnswer: null
    },
    
    // 4 à la Suite
    current4S: {
        remainingPlayers: [],
        currentPlayerIndex: 0,
        currentTheme: null,
        usedThemes: [],
        serie: 0,
        timer: 40,
        timerInterval: null,
        scores: {}
    },
    
    // Face à Face
    currentFAF: {
        players: [],
        scores: [0, 0],
        currentQuestion: null,
        hasHand: null,
        indiceIndex: 0,
        timer: 20,
        timerInterval: null,
        zoneActive: 0
    }
};

// Données par défaut avec QCM (4 réponses)
const defaultQuestions = {
    neufPoints: [
        { 
            q: "Dans quelle ville se trouve la Tour Eiffel ?", 
            a: "Paris", 
            options: ["Londres", "Berlin", "Paris", "Madrid"],
            points: 1 
        },
        { 
            q: "Quel est le plus grand océan du monde ?", 
            a: "Pacifique", 
            options: ["Atlantique", "Indien", "Pacifique", "Arctique"],
            points: 1 
        },
        { 
            q: "Combien de planètes dans le système solaire ?", 
            a: "8", 
            options: ["7", "8", "9", "10"],
            points: 1 
        },
        { 
            q: "Qui a peint la Joconde ?", 
            a: "Léonard de Vinci", 
            options: ["Michel-Ange", "Raphaël", "Léonard de Vinci", "Van Gogh"],
            points: 2 
        },
        { 
            q: "Quelle est la capitale de l'Australie ?", 
            a: "Canberra", 
            options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
            points: 2 
        },
        { 
            q: "En quelle année a eu lieu la Révolution française ?", 
            a: "1789", 
            options: ["1789", "1792", "1804", "1776"],
            points: 2 
        },
        { 
            q: "Quel est le symbole chimique de l'or ?", 
            a: "Au", 
            options: ["Ag", "Fe", "Au", "Cu"],
            points: 3 
        },
        { 
            q: "Quelle est la racine carrée de 144 ?", 
            a: "12", 
            options: ["10", "11", "12", "14"],
            points: 3 
        },
        { 
            q: "Qui a écrit 'Les Misérables' ?", 
            a: "Victor Hugo", 
            options: ["Émile Zola", "Victor Hugo", "Gustave Flaubert", "Alexandre Dumas"],
            points: 3 
        },
        { 
            q: "Quelle est la plus grande planète du système solaire ?", 
            a: "Jupiter", 
            options: ["Saturne", "Jupiter", "Neptune", "Uranus"],
            points: 1 
        },
        { 
            q: "Quel pays a remporté la Coupe du Monde 2018 ?", 
            a: "France", 
            options: ["Croatie", "France", "Belgique", "Angleterre"],
            points: 2 
        },
        { 
            q: "Quel est le plus long fleuve du monde ?", 
            a: "Nil", 
            options: ["Amazone", "Nil", "Mississippi", "Yangtsé"],
            points: 2 
        }
    ],
    quatreSuite: [
        { 
            theme: "Géographie", 
            questions: [
                { q: "Capitale de l'Italie ?", a: "Rome", options: ["Milan", "Rome", "Venise", "Naples"] },
                { q: "Plus grand désert du monde ?", a: "Sahara", options: ["Gobi", "Sahara", "Kalahari", "Atacama"] },
                { q: "Fleuve qui traverse Paris ?", a: "Seine", options: ["Loire", "Rhône", "Seine", "Garonne"] },
                { q: "Plus haute montagne d'Europe ?", a: "Mont Blanc", options: ["Mont Blanc", "Cervin", "Mont Rose", "Weisshorn"] }
            ]
        },
        { 
            theme: "Histoire", 
            questions: [
                { q: "Premier président de la Vème République ?", a: "De Gaulle", options: ["De Gaulle", "Mitterrand", "Pompidou", "Giscard"] },
                { q: "Année de la fin de la WWII ?", a: "1945", options: ["1944", "1945", "1946", "1943"] },
                { q: "Roi soleil ?", a: "Louis XIV", options: ["Louis XIII", "Louis XIV", "Louis XV", "Henri IV"] },
                { q: "Révolution de 1789 commence où ?", a: "Paris", options: ["Lyon", "Marseille", "Paris", "Versailles"] }
            ]
        },
        { 
            theme: "Sciences", 
            questions: [
                { q: "Planète la plus proche du soleil ?", a: "Mercure", options: ["Vénus", "Mercure", "Terre", "Mars"] },
                { q: "Formule de l'eau ?", a: "H2O", options: ["CO2", "H2O", "O2", "NaCl"] },
                { q: "Vitesse de la lumière (km/s) ?", a: "300000", options: ["150000", "300000", "400000", "250000"] },
                { q: "Os le plus long du corps ?", a: "Fémur", options: ["Humérus", "Fémur", "Tibia", "Colonne"] }
            ]
        },
        { 
            theme: "Arts", 
            questions: [
                { q: "Auteur du 'Petit Prince' ?", a: "Saint-Exupéry", options: ["Saint-Exupéry", "Jules Verne", "Hugo", "Proust"] },
                { q: "Peintre de 'La Nuit étoilée' ?", a: "Van Gogh", options: ["Picasso", "Monet", "Van Gogh", "Cézanne"] },
                { q: "Compositeur des 'Quatre Saisons' ?", a: "Vivaldi", options: ["Mozart", "Bach", "Vivaldi", "Beethoven"] },
                { q: "Sculpteur de 'Le Penseur' ?", a: "Rodin", options: ["Michel-Ange", "Rodin", "Donatello", "Bernin"] }
            ]
        }
    ],
    faceAFace: [
        { 
            theme: "Cinéma", 
            reponse: "Titanic", 
            indices: ["Film de 1997", "Réalisé par James Cameron", "Histoire d'amour sur un bateau", "Leonardo DiCaprio", "Naufrage célèbre de 1912"],
            options: ["Titanic", "Avatar", "Gladiator", "Braveheart"]
        },
        { 
            theme: "Gastronomie", 
            reponse: "Croissant", 
            indices: ["Pâtisserie française", "Forme de lune", "Au beurre", "Petit déjeuner", "Origine autrichienne"],
            options: ["Croissant", "Pain au chocolat", "Brioche", "Baguette"]
        },
        { 
            theme: "Sport", 
            reponse: "Tour de France", 
            indices: ["Compétition cycliste", "Créée en 1903", "Maillot jaune", "Contre la montre", "Grande Boucle"],
            options: ["Tour de France", "Giro d'Italia", "Vuelta", "Paris-Roubaix"]
        }
    ]
};

// Initialisation
function init() {
    loadQuestions();
    setupKeyboard();
    renderSetup();
}

function loadQuestions() {
    const saved = localStorage.getItem('qpc_questions_v3');
    if (saved) {
        GameState.questions = JSON.parse(saved);
    } else {
        GameState.questions = JSON.parse(JSON.stringify(defaultQuestions));
        saveQuestions();
    }
}

function saveQuestions() {
    localStorage.setItem('qpc_questions_v3', JSON.stringify(GameState.questions));
}

// Navigation
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function showMenu() {
    showScreen('screenMenu');
    document.getElementById('mancheIndicator').textContent = 'Menu Principal';
    stopAllTimers();
}

function showSetup() {
    renderSetup();
    showScreen('screenSetup');
}

function showRules() {
    document.getElementById('modalRules').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Configuration joueurs
function renderSetup() {
    const grid = document.getElementById('setupGrid');
    const colors = ['#E74C3C', '#3498DB', '#27AE60', '#F39C12'];
    
    grid.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        grid.innerHTML += `
            <div class="player-setup">
                <h3>Joueur ${i + 1}</h3>
                <input type="text" id="name${i}" placeholder="Nom du joueur" value="Joueur ${i + 1}">
                <div style="width: 100%; height: 10px; background: ${colors[i]}; border-radius: 5px; margin-top: 10px;"></div>
            </div>
        `;
    }
}

function startGame() {
    const colors = ['#E74C3C', '#3498DB', '#27AE60', '#F39C12'];
    
    GameState.players = [];
    for (let i = 0; i < 4; i++) {
        GameState.players.push({
            id: i,
            name: document.getElementById(`name${i}`).value || `Joueur ${i + 1}`,
            color: colors[i],
            score9PG: 0,
            qualified: false
        });
    }
    
    GameState.current9PG = {
        qualified: [],
        eliminated: [],
        currentQuestion: null,
        questionIndex: 0,
        pointsValue: 1,
        buzzerLocked: false,
        currentBuzzer: null,
        readingTimerInterval: null,
        responseTimerInterval: null,
        timeRemaining: 30,
        selectedAnswer: null
    };
    
    start9PG();
}

// ==================== MANCHE 1: 9 POINTS GAGNANTS ====================

function start9PG() {
    GameState.currentManche = 1;
    document.getElementById('mancheIndicator').textContent = 'MANCHE 1: 9 POINTS GAGNANTS';
    showScreen('screen9PG');
    renderPlayers9PG();
    nextQuestion9PG();
}

function renderPlayers9PG() {
    const container = document.getElementById('players9PG');
    container.innerHTML = '';
    
    GameState.players.forEach((player, idx) => {
        const div = document.createElement('div');
        div.className = 'player-9pg';
        div.id = `player9pg-${idx}`;
        
        if (player.qualified) div.classList.add('qualified');
        if (GameState.current9PG.eliminated.includes(idx)) div.classList.add('eliminated');
        if (GameState.current9PG.currentBuzzer === idx) div.classList.add('buzzer-active');
        if (!GameState.current9PG.buzzerLocked && !player.qualified && !GameState.current9PG.eliminated.includes(idx)) {
            div.classList.add('can-buzz');
        }
        
        const canBuzz = !GameState.current9PG.buzzerLocked && !player.qualified && !GameState.current9PG.eliminated.includes(idx);
        
        div.innerHTML = `
            <div class="qualification-status">QUALIFIÉ ✓</div>
            <div class="player-name" style="color: ${player.color}">${player.name}</div>
            <div class="player-score-9pg">${player.score9PG}</div>
            <button class="btn-buzz ${GameState.current9PG.currentBuzzer === idx ? 'active' : ''}" 
                    onclick="handleBuzz9PG(${idx})" 
                    ${!canBuzz ? 'disabled' : ''}>
                ${GameState.current9PG.currentBuzzer === idx ? '✓ EN RÉPONSE' : 'JE VEUX RÉPONDRE'}
            </button>
        `;
        container.appendChild(div);
    });
    
    updatePointsIndicator();
}

function updatePointsIndicator() {
    const qualified = GameState.current9PG.qualified.length;
    let points = 1;
    
    if (qualified === 0) points = [1, 2, 3][GameState.current9PG.questionIndex % 3];
    else if (qualified === 1) points = [2, 3][GameState.current9PG.questionIndex % 2];
    else if (qualified === 2) points = 3;
    
    GameState.current9PG.pointsValue = points;
    document.getElementById('pointsValue').textContent = `${points} POINT${points > 1 ? 'S' : ''}`;
}

function nextQuestion9PG() {
    if (GameState.current9PG.qualified.length >= 3) {
        end9PG();
        return;
    }
    
    // Réinitialiser l'état
    GameState.current9PG.currentBuzzer = null;
    GameState.current9PG.buzzerLocked = false;
    GameState.current9PG.selectedAnswer = null;
    stopAllTimers();
    
    // Afficher la question
    const q = GameState.questions.neufPoints[GameState.current9PG.questionIndex % GameState.questions.neufPoints.length];
    GameState.current9PG.currentQuestion = q;
    GameState.current9PG.questionIndex++;
    
    document.getElementById('question9PG').textContent = q.q;
    document.getElementById('btnNextQ').style.display = 'none';
    document.getElementById('btnValidate').style.display = 'none';
    document.getElementById('btnCancel').style.display = 'none';
    document.getElementById('timerReadingContainer').style.display = 'block';
    document.getElementById('timerResponseContainer').style.display = 'none';
    document.getElementById('answersContainer').style.display = 'none';
    document.getElementById('buzzerInstr').style.display = 'block';
    document.getElementById('buzzerInstr').textContent = '⚡ CLIQUEZ SUR "JE VEUX RÉPONDRE" ! ⚡';
    
    // Lire la question et démarrer le timer de lecture (5 secondes)
    speak(q.q);
    startReadingTimer();
    updatePointsIndicator();
    renderPlayers9PG();
}

function startReadingTimer() {
    const fill = document.getElementById('timerReadingFill');
    const text = document.getElementById('timerReadingText');
    let timeLeft = 5;
    let width = 100;
    
    GameState.current9PG.readingTimerInterval = setInterval(() => {
        timeLeft -= 0.05;
        width = (timeLeft / 5) * 100;
        
        fill.style.width = width + '%';
        text.textContent = Math.ceil(timeLeft);
        
        if (timeLeft <= 2) {
            fill.style.background = 'linear-gradient(90deg, #ff0000 0%, #990000 100%)';
        } else {
            fill.style.background = 'linear-gradient(90deg, #ff9500 0%, #ff5e00 50%, #ff0000 100%)';
        }
        
        if (timeLeft <= 0) {
            clearInterval(GameState.current9PG.readingTimerInterval);
            handleReadingTimeout();
        }
    }, 50);
}

function handleReadingTimeout() {
    GameState.current9PG.buzzerLocked = true;
    document.getElementById('buzzerInstr').textContent = '⏰ TEMPS ÉCOULÉ !';
    speak('Temps écoulé ! Personne n\'a buzzé.');
    
    setTimeout(() => {
        showCorrectAnswer();
    }, 2000);
}

function handleBuzz9PG(playerId) {
    if (GameState.current9PG.buzzerLocked || GameState.current9PG.currentBuzzer !== null) return;
    if (GameState.players[playerId].qualified) return;
    if (GameState.current9PG.eliminated.includes(playerId)) return;
    
    // Arrêter le timer de lecture
    clearInterval(GameState.current9PG.readingTimerInterval);
    
    GameState.current9PG.currentBuzzer = playerId;
    GameState.current9PG.buzzerLocked = true;
    
    const player = GameState.players[playerId];
    
    // Afficher le modal
    document.getElementById('answeringPlayerInfo').innerHTML = 
        `<span style="color: ${player.color}; font-size: 3rem;">${player.name}</span>`;
    document.getElementById('modalAnswering').classList.add('active');
    
    speak(`${player.name} a buzzé ! Vous avez 30 secondes pour répondre.`);
    
    // Masquer le timer de lecture, afficher le timer de réponse
    document.getElementById('timerReadingContainer').style.display = 'none';
    document.getElementById('timerResponseContainer').style.display = 'block';
    document.getElementById('buzzerInstr').textContent = `${player.name} choisit sa réponse...`;
    
    // Afficher les options de réponse
    showAnswerOptions();
    
    // Démarrer le timer de 30 secondes
    startResponseTimer();
    
    // Mettre à jour l'affichage des joueurs
    renderPlayers9PG();
    
    // Afficher les boutons de contrôle
    document.getElementById('btnValidate').style.display = 'inline-block';
    document.getElementById('btnCancel').style.display = 'inline-block';
}

function showAnswerOptions() {
    const container = document.getElementById('answersContainer');
    const q = GameState.current9PG.currentQuestion;
    
    container.innerHTML = '';
    container.style.display = 'grid';
    
    const labels = ['A', 'B', 'C', 'D'];
    
    q.options.forEach((option, idx) => {
        const div = document.createElement('div');
        div.className = 'answer-option';
        div.onclick = () => selectAnswer(idx, div);
        div.innerHTML = `<span class="answer-label">${labels[idx]}</span>${option}`;
        container.appendChild(div);
    });
}

function selectAnswer(index, element) {
    // Désélectionner les autres
    document.querySelectorAll('.answer-option').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Sélectionner celle-ci
    element.classList.add('selected');
    GameState.current9PG.selectedAnswer = index;
    
    // Feedback sonore
    speak('Réponse sélectionnée');
}

function startResponseTimer() {
    const timerDisplay = document.getElementById('timer30s');
    GameState.current9PG.timeRemaining = 30;
    
    GameState.current9PG.responseTimerInterval = setInterval(() => {
        GameState.current9PG.timeRemaining--;
        timerDisplay.textContent = GameState.current9PG.timeRemaining;
        
        if (GameState.current9PG.timeRemaining <= 10) {
            timerDisplay.classList.add('warning');
        } else {
            timerDisplay.classList.remove('warning');
        }
        
        if (GameState.current9PG.timeRemaining <= 0) {
            clearInterval(GameState.current9PG.responseTimerInterval);
            handleResponseTimeout();
        }
    }, 1000);
}

function handleResponseTimeout() {
    const player = GameState.players[GameState.current9PG.currentBuzzer];
    speak(`Temps écoulé pour ${player.name} !`);
    
    // Marquer comme mauvaise réponse
    wrongAnswer9PG();
}

function validateAnswer() {
    if (GameState.current9PG.selectedAnswer === null) {
        alert('Veuillez sélectionner une réponse !');
        return;
    }
    
    clearInterval(GameState.current9PG.responseTimerInterval);
    
    const q = GameState.current9PG.currentQuestion;
    const selectedOption = q.options[GameState.current9PG.selectedAnswer];
    
    // Vérifier si c'est la bonne réponse
    if (selectedOption === q.a) {
        correctAnswer9PG();
    } else {
        // Montrer la mauvaise réponse sélectionnée
        document.querySelectorAll('.answer-option').forEach((el, idx) => {
            if (idx === GameState.current9PG.selectedAnswer) {
                el.classList.add('wrong');
            }
            if (q.options[idx] === q.a) {
                el.classList.add('correct');
            }
            el.classList.add('disabled');
        });
        
        setTimeout(() => {
            wrongAnswer9PG();
        }, 2000);
    }
}

function cancelBuzz() {
    clearInterval(GameState.current9PG.responseTimerInterval);
    
    // Réinitialiser
    GameState.current9PG.currentBuzzer = null;
    GameState.current9PG.buzzerLocked = false;
    GameState.current9PG.selectedAnswer = null;
    
    // Cacher les éléments de réponse
    document.getElementById('timerResponseContainer').style.display = 'none';
    document.getElementById('answersContainer').style.display = 'none';
    document.getElementById('btnValidate').style.display = 'none';
    document.getElementById('btnCancel').style.display = 'none';
    
    // Redémarrer le timer de lecture
    document.getElementById('timerReadingContainer').style.display = 'block';
    startReadingTimer();
    
    renderPlayers9PG();
    closeModal('modalAnswering');
}

function correctAnswer9PG() {
    const playerId = GameState.current9PG.currentBuzzer;
    const player = GameState.players[playerId];
    const points = GameState.current9PG.pointsValue;
    
    player.score9PG += points;
    
    // Animation de la bonne réponse
    document.querySelectorAll('.answer-option').forEach((el, idx) => {
        if (GameState.current9PG.currentQuestion.options[idx] === GameState.current9PG.currentQuestion.a) {
            el.classList.add('correct');
        }
        el.classList.add('disabled');
    });
    
    speak(`Bonne réponse ! ${points} point${points > 1 ? 's' : ''} pour ${player.name}`);
    
    // Vérifier qualification
    if (player.score9PG >= 9 && !player.qualified) {
        player.qualified = true;
        GameState.current9PG.qualified.push(playerId);
        speak(`${player.name} est qualifié !`);
        createConfetti();
    }
    
    renderPlayers9PG();
    
    setTimeout(() => {
        closeModal('modalAnswering');
        nextQuestion9PG();
    }, 3000);
}

function wrongAnswer9PG() {
    const playerId = GameState.current9PG.currentBuzzer;
    const player = GameState.players[playerId];
    
    speak(`Mauvaise réponse pour ${player.name} !`);
    
    // Réinitialiser pour les autres
    GameState.current9PG.currentBuzzer = null;
    GameState.current9PG.buzzerLocked = false;
    GameState.current9PG.selectedAnswer = null;
    
    // Cacher les réponses
    document.getElementById('timerResponseContainer').style.display = 'none';
    document.getElementById('answersContainer').style.display = 'none';
    document.getElementById('btnValidate').style.display = 'none';
    document.getElementById('btnCancel').style.display = 'none';
    document.getElementById('timerReadingContainer').style.display = 'block';
    
    // Redémarrer le timer de lecture si temps restant
    startReadingTimer();
    renderPlayers9PG();
    closeModal('modalAnswering');
}

function showCorrectAnswer() {
    const q = GameState.current9PG.currentQuestion;
    document.getElementById('question9PG').innerHTML = 
        `${q.q}<br><br><span style="color: #90EE90; font-size: 1.5rem;">Réponse: ${q.a}</span>`;
    document.getElementById('btnNextQ').style.display = 'inline-block';
    document.getElementById('timerReadingContainer').style.display = 'none';
    speak(`La réponse était: ${q.a}`);
}

function end9PG() {
    const eliminated = GameState.players.findIndex((p, idx) => 
        !GameState.current9PG.qualified.includes(idx)
    );
    GameState.current9PG.eliminated.push(eliminated);
    
    speak(`Fin de la première manche. ${GameState.players[eliminated].name} est éliminé.`);
    
    setTimeout(() => {
        start4Suite();
    }, 3000);
}

// ==================== MANCHE 2: 4 A LA SUITE ====================

function start4Suite() {
    GameState.currentManche = 2;
    document.getElementById('mancheIndicator').textContent = 'MANCHE 2: 4 À LA SUITE';
    showScreen('screen4Suite');
    
    GameState.current4S.remainingPlayers = [...GameState.current9PG.qualified];
    GameState.current4S.usedThemes = [];
    GameState.current4S.scores = {};
    GameState.current4S.remainingPlayers.forEach(id => {
        GameState.current4S.scores[id] = 0;
    });
    
    renderThemes4S();
    nextPlayer4S();
}

function renderThemes4S() {
    const grid = document.getElementById('themesGrid');
    grid.innerHTML = '';
    
    GameState.questions.quatreSuite.forEach((theme, idx) => {
        const div = document.createElement('div');
        div.className = 'theme-card';
        div.onclick = () => selectTheme4S(idx);
        
        if (GameState.current4S.usedThemes.includes(idx)) {
            div.classList.add('disabled');
        }
        
        div.innerHTML = `<div class="theme-title">${theme.theme}</div>`;
        grid.appendChild(div);
    });
    
    const mystere = document.createElement('div');
    mystere.className = 'theme-card theme-mystere';
    mystere.onclick = () => selectTheme4S('mystere');
    if (GameState.current4S.usedThemes.includes('mystere')) {
        mystere.classList.add('disabled');
    }
    mystere.innerHTML = `<div class="theme-title">❓ Thème Mystère</div>`;
    grid.appendChild(mystere);
}

function nextPlayer4S() {
    if (GameState.current4S.currentPlayerIndex >= GameState.current4S.remainingPlayers.length) {
        if (GameState.current4S.usedThemes.length < 3) {
            GameState.current4S.currentPlayerIndex = 0;
        } else {
            end4Suite();
            return;
        }
    }
    
    const playerId = GameState.current4S.remainingPlayers[GameState.current4S.currentPlayerIndex];
    const player = GameState.players[playerId];
    
    document.getElementById('player4SuiteTurn').textContent = `C'est au tour de ${player.name}`;
    document.getElementById('themesGrid').style.display = 'grid';
    document.getElementById('game4Suite').style.display = 'none';
    
    speak(`Au tour de ${player.name}. Choisissez un thème.`);
}

function selectTheme4S(themeIdx) {
    if (GameState.current4S.usedThemes.includes(themeIdx)) return;
    
    GameState.current4S.usedThemes.push(themeIdx);
    GameState.current4S.currentTheme = themeIdx;
    GameState.current4S.serie = 0;
    
    let themeName;
    if (themeIdx === 'mystere') {
        themeName = 'Thème Mystère';
        const available = GameState.questions.quatreSuite.filter((_, i) => 
            !GameState.current4S.usedThemes.includes(i)
        );
        GameState.current4S.currentThemeData = available[Math.floor(Math.random() * available.length)];
    } else {
        GameState.current4S.currentThemeData = GameState.questions.quatreSuite[themeIdx];
        themeName = GameState.current4S.currentThemeData.theme;
    }
    
    document.getElementById('currentTheme4S').textContent = themeName;
    document.getElementById('themesGrid').style.display = 'none';
    document.getElementById('game4Suite').style.display = 'block';
    document.getElementById('question4S').textContent = 'Prêt ? Cliquez sur Démarrer';
    document.getElementById('answers4S').style.display = 'none';
    document.getElementById('btnStart4S').style.display = 'inline-block';
    
    updateSerieDisplay();
    document.getElementById('timer40s').textContent = '40';
    
    speak(`Thème: ${themeName}. 40 secondes. 4 bonnes réponses consécutives.`);
}

function startTimer4S() {
    document.getElementById('btnStart4S').style.display = 'none';
    GameState.current4S.timer = 40;
    nextQuestion4S();
    
    GameState.current4S.timerInterval = setInterval(() => {
        GameState.current4S.timer--;
        document.getElementById('timer40s').textContent = GameState.current4S.timer;
        
        if (GameState.current4S.timer <= 0) {
            endTurn4S();
        }
    }, 1000);
}

function nextQuestion4S() {
    const theme = GameState.current4S.currentThemeData;
    const qIdx = GameState.current4S.serie;
    
    if (qIdx >= theme.questions.length) {
        endTurn4S();
        return;
    }
    
    const q = theme.questions[qIdx];
    document.getElementById('question4S').textContent = q.q;
    
    // Afficher les options QCM
    const container = document.getElementById('answers4S');
    container.innerHTML = '';
    container.style.display = 'grid';
    
    const labels = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, idx) => {
        const div = document.createElement('div');
        div.className = 'answer-option';
        div.innerHTML = `<span class="answer-label">${labels[idx]}</span>${opt}`;
        div.onclick = function() {
            // Vérifier la réponse immédiatement
            if (opt === q.a) {
                this.classList.add('correct');
                setTimeout(() => correct4S(), 1000);
            } else {
                this.classList.add('wrong');
                document.querySelectorAll('.answer-option').forEach((el, i) => {
                    if (q.options[i] === q.a) el.classList.add('correct');
                });
                setTimeout(() => wrong4S(), 1500);
            }
            // Désactiver tous les clics
            document.querySelectorAll('.answer-option').forEach(el => el.style.pointerEvents = 'none');
        };
        container.appendChild(div);
    });
    
    speak(q.q);
}

function updateSerieDisplay() {
    const dots = document.querySelectorAll('.serie-dot');
    dots.forEach((dot, idx) => {
        dot.classList.remove('active', 'failed');
        if (idx < GameState.current4S.serie) {
            dot.classList.add('active');
        }
    });
}

function correct4S() {
    GameState.current4S.serie++;
    updateSerieDisplay();
    speak('Bonne réponse !');
    
    if (GameState.current4S.serie >= 4) {
        createConfetti();
        speak('4 à la suite ! Excellent !');
        setTimeout(endTurn4S, 1500);
        return;
    }
    
    nextQuestion4S();
}

function wrong4S() {
    speak
