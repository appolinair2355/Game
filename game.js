// game.js
// Questions pour un Champion - Version TV5 authentique

const GameState = {
    players: [],
    currentManche: 0, // 0: menu, 1: 9PG, 2: 4Suite, 3: FaceAFace
    questions: {
        neufPoints: [],
        quatreSuite: [],
        faceAFace: []
    },
    
    // 9 Points Gagnants
    current9PG: {
        qualified: [], // IDs des qualifiés
        eliminated: [],
        currentQuestion: null,
        questionIndex: 0,
        pointsValue: 1, // 1, 2 ou 3 points
        buzzerLocked: false,
        currentBuzzer: null,
        timerInterval: null,
        responseInterval: null
    },
    
    // 4 à la Suite
    current4S: {
        remainingPlayers: [],
        currentPlayerIndex: 0,
        currentTheme: null,
        usedThemes: [],
        serie: 0, // 0 à 4
        timer: 40,
        timerInterval: null,
        scores: {} // playerId -> best serie
    },
    
    // Face à Face
    currentFAF: {
        players: [],
        scores: [0, 0],
        currentQuestion: null,
        hasHand: null, // 0 ou 1 (index dans currentFAF.players)
        indiceIndex: 0,
        timer: 20,
        timerInterval: null,
        zoneActive: 0 // 0:4pts, 1:3pts, 2:2pts, 3:1pt
    }
};

// Données par défaut
const defaultQuestions = {
    neufPoints: [
        { q: "Dans quelle ville se trouve la Tour Eiffel ?", a: "Paris", points: 1 },
        { q: "Quel est le plus grand océan du monde ?", a: "Pacifique", points: 1 },
        { q: "Combien de planètes dans le système solaire ?", a: "8", points: 1 },
        { q: "Qui a peint la Joconde ?", a: "Léonard de Vinci", points: 2 },
        { q: "Quelle est la capitale de l'Australie ?", a: "Canberra", points: 2 },
        { q: "En quelle année a eu lieu la Révolution française ?", a: "1789", points: 2 },
        { q: "Quel est le symbole chimique de l'or ?", a: "Au", points: 3 },
        { q: "Quelle est la racine carrée de 144 ?", a: "12", points: 3 },
        { q: "Qui a écrit 'Les Misérables' ?", a: "Victor Hugo", points: 3 }
    ],
    quatreSuite: [
        { theme: "Géographie", questions: ["Capitale de l'Italie ?", "Plus grand désert du monde ?", "Fleuve qui traverse Paris ?", "Plus haute montagne d'Europe ?"], answers: ["Rome", "Sahara", "Seine", "Mont Blanc"] },
        { theme: "Histoire", questions: ["Premier président de la Vème République ?", "Année de la fin de la WWII ?", "Roi soleil ?", "Révolution de 1789 commence où ?"], answers: ["De Gaulle", "1945", "Louis XIV", "Paris"] },
        { theme: "Sciences", questions: ["Planète la plus proche du soleil ?", "Formule de l'eau ?", "Vitesse de la lumière (km/s) ?", "Os le plus long du corps ?"], answers: ["Mercure", "H2O", "300000", "Fémur"] },
        { theme: "Arts", questions: ["Auteur de 'Le Petit Prince' ?", "Peintre de 'La Nuit étoilée' ?", "Compositeur des 'Quatre Saisons' ?", "Sculpteur de 'Le Penseur' ?"], answers: ["Saint-Exupéry", "Van Gogh", "Vivaldi", "Rodin"] }
    ],
    faceAFace: [
        { 
            theme: "Cinéma", 
            reponse: "Titanic", 
            indices: ["Film de 1997", "Réalisé par James Cameron", "Histoire d'amour sur un bateau", "Leonardo DiCaprio", "Naufrage célèbre de 1912"] 
        },
        { 
            theme: "Gastronomie", 
            reponse: "Croissant", 
            indices: ["Pâtisserie française", "Forme de lune", "Au beurre", "Petit déjeuner", "Origine autrichienne (Viennoiserie)"] 
        },
        { 
            theme: "Sport", 
            reponse: "Tour de France", 
            indices: ["Compétition cycliste", "Créée en 1903", "Maillot jaune", "Contre la montre", "Grande Boucle"] 
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
    const saved = localStorage.getItem('qpc_questions_v2');
    if (saved) {
        GameState.questions = JSON.parse(saved);
    } else {
        GameState.questions = JSON.parse(JSON.stringify(defaultQuestions));
        saveQuestions();
    }
}

function saveQuestions() {
    localStorage.setItem('qpc_questions_v2', JSON.stringify(GameState.questions));
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
    const keys = ['A', 'P', 'L', 'M'];
    const colors = ['#E74C3C', '#3498DB', '#27AE60', '#F39C12'];
    
    grid.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        grid.innerHTML += `
            <div class="player-setup">
                <h3>Joueur ${i + 1}</h3>
                <input type="text" id="name${i}" placeholder="Nom du joueur" value="Joueur ${i + 1}">
                <div class="buzzer-key">⌨️ Touche ${keys[i]}</div>
                <div style="width: 100%; height: 10px; background: ${colors[i]}; border-radius: 5px; margin-top: 10px;"></div>
            </div>
        `;
    }
}

function startGame() {
    // Initialiser les joueurs
    const keys = ['a', 'p', 'l', 'm'];
    const colors = ['#E74C3C', '#3498DB', '#27AE60', '#F39C12'];
    
    GameState.players = [];
    for (let i = 0; i < 4; i++) {
        GameState.players.push({
            id: i,
            name: document.getElementById(`name${i}`).value || `Joueur ${i + 1}`,
            key: keys[i],
            color: colors[i],
            score9PG: 0,
            qualified: false
        });
    }
    
    // Réinitialiser les manches
    GameState.current9PG = {
        qualified: [],
        eliminated: [],
        currentQuestion: null,
        questionIndex: 0,
        pointsValue: 1,
        buzzerLocked: false,
        currentBuzzer: null,
        timerInterval: null,
        responseInterval: null
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
        
        div.innerHTML = `
            <div class="qualification-status">QUALIFIÉ ✓</div>
            <div class="player-name" style="color: ${player.color}">${player.name}</div>
            <div class="player-score-9pg">${player.score9PG}</div>
            <div style="font-size: 0.9rem; margin-top: 10px;">Touche ${player.key.toUpperCase()}</div>
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
    // Vérifier si on a 3 qualifiés
    if (GameState.current9PG.qualified.length >= 3) {
        end9PG();
        return;
    }
    
    // Réinitialiser l'état
    GameState.current9PG.currentBuzzer = null;
    GameState.current9PG.buzzerLocked = false;
    stopAllTimers();
    
    // Afficher la question
    const q = GameState.questions.neufPoints[GameState.current9PG.questionIndex % GameState.questions.neufPoints.length];
    GameState.current9PG.currentQuestion = q;
    GameState.current9PG.questionIndex++;
    
    document.getElementById('question9PG').textContent = q.q;
    document.getElementById('btnNextQ').style.display = 'none';
    document.getElementById('btnCorrect').style.display = 'none';
    document.getElementById('btnWrong').style.display = 'none';
    document.getElementById('btnReset').style.display = 'none';
    document.getElementById('timer9PGContainer').style.display = 'block';
    document.getElementById('buzzerInstr').style.display = 'block';
    
    // Lire la question et démarrer le timer visuel
    speak(q.q);
    startVisualTimer9PG();
    updatePointsIndicator();
    renderPlayers9PG();
}

function startVisualTimer9PG() {
    const fill = document.getElementById('timerBarFill');
    const text = document.getElementById('timerText');
    let timeLeft = 5;
    let width = 100;
    
    GameState.current9PG.timerInterval = setInterval(() => {
        timeLeft -= 0.05;
        width = (timeLeft / 5) * 100;
        
        fill.style.width = width + '%';
        text.textContent = Math.ceil(timeLeft);
        
        // Changer la couleur vers la fin
        if (timeLeft <= 2) {
            fill.style.background = 'linear-gradient(90deg, #ff0000 0%, #990000 100%)';
        } else {
            fill.style.background = 'linear-gradient(90deg, #ff9500 0%, #ff5e00 50%, #ff0000 100%)';
        }
        
        if (timeLeft <= 0) {
            clearInterval(GameState.current9PG.timerInterval);
            handleTimeout9PG();
        }
    }, 50);
}

function handleTimeout9PG() {
    GameState.current9PG.buzzerLocked = true;
    document.getElementById('buzzerInstr').textContent = '⏰ TEMPS ÉCOULÉ !';
    speak('Temps écoulé !');
    
    setTimeout(() => {
        showAnswer9PG();
    }, 2000);
}

function handleBuzzer9PG(playerId) {
    if (GameState.current9PG.buzzerLocked || GameState.current9PG.currentBuzzer !== null) return;
    if (GameState.players[playerId].qualified) return;
    if (GameState.current9PG.eliminated.includes(playerId)) return;
    
    // Arrêter le timer
    clearInterval(GameState.current9PG.timerInterval);
    
    GameState.current9PG.currentBuzzer = playerId;
    GameState.current9PG.buzzerLocked = true;
    
    const player = GameState.players[playerId];
    document.getElementById('buzzerPlayerInfo').innerHTML = 
        `<span style="color: ${player.color}; font-size: 3rem;">${player.name}</span>`;
    document.getElementById('modalBuzzer').classList.add('active');
    
    speak(`${player.name} a buzzé !`);
    renderPlayers9PG();
    
    // Timer de réponse de 5 secondes
    let responseTime = 5;
    document.getElementById('buzzerInstr').textContent = `${player.name} doit répondre... ${responseTime}s`;
    
    GameState.current9PG.responseInterval = setInterval(() => {
        responseTime--;
        document.getElementById('buzzerInstr').textContent = `${player.name} doit répondre... ${responseTime}s`;
        
        if (responseTime <= 0) {
            clearInterval(GameState.current9PG.responseInterval);
            wrongAnswer9PG();
        }
    }, 1000);
    
    // Montrer les boutons de contrôle
    document.getElementById('btnCorrect').style.display = 'inline-block';
    document.getElementById('btnWrong').style.display = 'inline-block';
    document.getElementById('btnReset').style.display = 'inline-block';
}

function correctAnswer9PG() {
    clearInterval(GameState.current9PG.responseInterval);
    const playerId = GameState.current9PG.currentBuzzer;
    const player = GameState.players[playerId];
    const points = GameState.current9PG.pointsValue;
    
    player.score9PG += points;
    speak(`Bonne réponse ! ${points} point${points > 1 ? 's' : ''} pour ${player.name}`);
    
    // Vérifier qualification
    if (player.score9PG >= 9 && !player.qualified) {
        player.qualified = true;
        GameState.current9PG.qualified.push(playerId);
        speak(`${player.name} est qualifié !`);
        createConfetti();
    }
    
    renderPlayers9PG();
    showAnswer9PG();
    
    setTimeout(() => {
        closeModal('modalBuzzer');
        nextQuestion9PG();
    }, 2000);
}

function wrongAnswer9PG() {
    clearInterval(GameState.current9PG.responseInterval);
    const playerId = GameState.current9PG.currentBuzzer;
    const player = GameState.players[playerId];
    
    speak(`Mauvaise réponse pour ${player.name} !`);
    
    // Réinitialiser pour les autres
    GameState.current9PG.currentBuzzer = null;
    GameState.current9PG.buzzerLocked = false;
    
    document.getElementById('btnCorrect').style.display = 'none';
    document.getElementById('btnWrong').style.display = 'none';
    
    // Redémarrer le timer si temps restant
    startVisualTimer9PG();
    renderPlayers9PG();
    closeModal('modalBuzzer');
}

function resetBuzzers9PG() {
    clearInterval(GameState.current9PG.responseInterval);
    GameState.current9PG.currentBuzzer = null;
    GameState.current9PG.buzzerLocked = false;
    document.getElementById('btnCorrect').style.display = 'none';
    document.getElementById('btnWrong').style.display = 'none';
    startVisualTimer9PG();
    renderPlayers9PG();
    closeModal('modalBuzzer');
}

function showAnswer9PG() {
    const q = GameState.current9PG.currentQuestion;
    document.getElementById('question9PG').innerHTML = 
        `${q.q}<br><br><span style="color: #90EE90; font-size: 1.5rem;">Réponse: ${q.a}</span>`;
    document.getElementById('btnNextQ').style.display = 'inline-block';
    speak(`La réponse était: ${q.a}`);
}

function end9PG() {
    // Déterminer le 4ème éliminé (celui qui n'est pas qualifié)
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
    
    // Initialiser avec les 3 qualifiés dans l'ordre de qualification
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
    
    // Ajouter le thème mystère
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
        // Tous les joueurs ont joué, voir si on fait un deuxième tour ou on passe au FAF
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
        // Choisir un thème aléatoire pour le mystère
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
        // Toutes les questions répondues
        endTurn4S();
        return;
    }
    
    document.getElementById('question4S').textContent = theme.questions[qIdx];
    speak(theme.questions[qIdx]);
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
        // 4 à la suite réussi !
        createConfetti();
        speak('4 à la suite ! Excellent !');
        setTimeout(endTurn4S, 1500);
        return;
    }
    
    nextQuestion4S();
}

function wrong4S() {
    speak('Mauvaise réponse ! La série est perdue.');
    GameState.current4S.serie = 0;
    updateSerieDisplay();
    
    // Continuer avec la question suivante mais série à 0
    const theme = GameState.current4S.currentThemeData;
    const currentQ = GameState.current4S.serie; // 0 car reset
    
    // Passer à la question suivante quand même
    if (currentQ < theme.questions.length - 1) {
        // On garde l'index mais on affiche la suivante
        // En vrai jeu, on continue avec les questions suivantes
    }
}

function endTurn4S() {
    clearInterval(GameState.current4S.timerInterval);
    
    const playerId = GameState.current4S.remainingPlayers[GameState.current4S.currentPlayerIndex];
    GameState.current4S.scores[playerId] = Math.max(GameState.current4S.scores[playerId], GameState.current4S.serie);
    
    speak(`Fin du temps. Série de ${GameState.current4S.serie} pour ${GameState.players[playerId].name}`);
    
    GameState.current4S.currentPlayerIndex++;
    setTimeout(nextPlayer4S, 2000);
}

function end4Suite() {
    // Trier les joueurs par score
    const sorted = GameState.current4S.remainingPlayers.sort((a, b) => 
        GameState.current4S.scores[b] - GameState.current4S.scores[a]
    );
    
    // Prendre les 2 meilleurs
    const finalists = sorted.slice(0, 2);
    
    speak(`${GameState.players[finalists[0]].name} et ${GameState.players[finalists[1]].name} se qualifient pour le face à face !`);
    
    setTimeout(() => {
        startFaceAFace(finalists);
    }, 3000);
}

// ==================== MANCHE 3: FACE A FACE ====================

function startFaceAFace(finalists) {
    GameState.currentManche = 3;
    document.getElementById('mancheIndicator').textContent = 'MANCHE 3: FACE À FACE (12 POINTS)';
    showScreen('screenFaceAFace');
    
    GameState.currentFAF.players = finalists;
    GameState.currentFAF.scores = [0, 0];
    GameState.currentFAF.hasHand = null;
    GameState.currentFAF.indiceIndex = 0;
    
    document.getElementById('fafName1').textContent = GameState.players[finalists[0]].name;
    document.getElementById('fafName2').textContent = GameState.players[finalists[1]].name;
    document.getElementById('fafName1').style.color = GameState.players[finalists[0]].color;
    document.getElementById('fafName2').style.color = GameState.players[finalists[1]].color;
    
    updateFAFDisplay();
    nextQuestionFAF();
}

function nextQuestionFAF() {
    // Vérifier victoire
    if (GameState.currentFAF.scores[0] >= 12 || GameState.currentFAF.scores[1] >= 12) {
        endGame();
        return;
    }
    
    GameState.currentFAF.hasHand = null;
    GameState.currentFAF.indiceIndex = 0;
    GameState.currentFAF.zoneActive = 0;
    
    // Choisir une question
    const questions = GameState.questions.faceAFace;
    GameState.currentFAF.currentQuestion = questions[Math.floor(Math.random() * questions.length)];
    
    document.getElementById('indiceReveal').textContent = `Thème: ${GameState.currentFAF.currentQuestion.theme} - Prenez ou laissez la main`;
    document.getElementById('btnTakeHand').disabled = false;
    document.getElementById('btnLeaveHand').disabled = false;
    
    updateZonesFAF();
    updateFAFDisplay();
    
    speak(`Thème: ${GameState.currentFAF.currentQuestion.theme}. Prenez ou laissez la main.`);
}

function chooseHand(take) {
    const currentPlayer = GameState.currentFAF.scores[0] <= GameState.currentFAF.scores[1] ? 0 : 1;
    
    if (take) {
        GameState.currentFAF.hasHand = currentPlayer;
        speak(`${GameState.players[GameState.currentFAF.players[currentPlayer]].name} prend la main !`);
    } else {
        GameState.currentFAF.hasHand = 1 - currentPlayer;
        speak(`${GameState.players[GameState.currentFAF.players[currentPlayer]].name} laisse la main. ${GameState.players[GameState.currentFAF.players[1-currentPlayer]].name} répondra.`);
    }
    
    document.getElementById('btnTakeHand').disabled = true;
    document.getElementById('btnLeaveHand').disabled = true;
    
    updateFAFDisplay();
    startTimerFAF();
}

function startTimerFAF() {
    GameState.currentFAF.timer = 20;
    GameState.currentFAF.zoneActive = 0;
    
    updateZonesFAF();
    
    GameState.currentFAF.timerInterval = setInterval(() => {
        GameState.currentFAF.timer -= 0.1;
        
        // Déterminer la zone active
        const elapsed = 20 - GameState.currentFAF.timer;
        if (elapsed < 8) GameState.currentFAF.zoneActive = 0; // 4 pts
        else if (elapsed < 14) GameState.currentFAF.zoneActive = 1; // 3 pts
        else if (elapsed < 18) GameState.currentFAF.zoneActive = 2; // 2 pts
        else GameState.currentFAF.zoneActive = 3; // 1 pt
        
        document.getElementById('timerFAF').textContent = Math.ceil(GameState.currentFAF.timer);
        updateZonesFAF();
        
        if (GameState.currentFAF.timer <= 0) {
            clearInterval(GameState.currentFAF.timerInterval);
            wrongFAF();
        }
    }, 100);
}

function updateZonesFAF() {
    const zones = document.querySelectorAll('.zone');
    zones.forEach((z, idx) => {
        z.classList.toggle('active', idx === GameState.currentFAF.zoneActive);
    });
    
    // Mettre à jour qui a la main
    document.getElementById('fafPlayer1').classList.toggle('has-hand', GameState.currentFAF.hasHand === 0);
    document.getElementById('fafPlayer2').classList.toggle('has-hand', GameState.currentFAF.hasHand === 1);
    document.getElementById('fafMain1').textContent = GameState.currentFAF.hasHand === 0 ? '✋ A LA MAIN' : '';
    document.getElementById('fafMain2').textContent = GameState.currentFAF.hasHand === 1 ? '✋ A LA MAIN' : '';
}

function updateFAFDisplay() {
    document.getElementById('fafScore1').textContent = GameState.currentFAF.scores[0];
    document.getElementById('fafScore2').textContent = GameState.currentFAF.scores[1];
}

function nextIndice() {
    const q = GameState.currentFAF.currentQuestion;
    if (GameState.currentFAF.indiceIndex < q.indices.length) {
        const indice = q.indices[GameState.currentFAF.indiceIndex];
        document.getElementById('indiceReveal').innerHTML += `<br><span class="indice-number">${GameState.currentFAF.indiceIndex + 1}</span>${indice}`;
        speak(`Indice: ${indice}`);
        GameState.currentFAF.indiceIndex++;
    }
}

function correctFAF() {
    clearInterval(GameState.currentFAF.timerInterval);
    
    const points = [4, 3, 2, 1][GameState.currentFAF.zoneActive];
    const winner = GameState.currentFAF.hasHand;
    
    GameState.currentFAF.scores[winner] += points;
    speak(`Bonne réponse ! ${points} points pour ${GameState.players[GameState.currentFAF.players[winner]].name} !`);
    
    updateFAFDisplay();
    
    setTimeout(nextQuestionFAF, 2000);
}

function wrongFAF() {
    clearInterval(GameState.currentFAF.timerInterval);
    
    // La main passe à l'autre
    const other = 1 - GameState.currentFAF.hasHand;
    speak(`Mauvaise réponse ! La main passe à ${GameState.players[GameState.currentFAF.players[other]].name}`);
    
    // En vrai, l'autre joue les indices restants dans les zones 3 et 1
    // Simplifié ici: on passe à la question suivante
    setTimeout(nextQuestionFAF, 2000);
}

function endGame() {
    const winnerIdx = GameState.currentFAF.scores[0] >= 12 ? 0 : 1;
    const winner = GameState.players[GameState.currentFAF.players[winnerIdx]];
    
    showScreen('screenWinner');
    document.getElementById('winnerName').textContent = winner.name;
    document.getElementById('winnerName').style.color = winner.color;
    
    speak(`Félicitations à ${winner.name}, champion du jour !`);
    
    for (let i = 0; i < 100; i++) {
        setTimeout(createConfetti, i * 50);
    }
}

// ==================== UTILITAIRES ====================

function setupKeyboard() {
    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        
        if (GameState.currentManche === 1) { // 9PG
            const player = GameState.players.findIndex(p => p.key === key);
            if (player !== -1) {
                handleBuzzer9PG(player);
            }
        }
    });
}

function speak(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'fr-FR';
        utter.rate = 0.9;
        window.speechSynthesis.speak(utter);
    }
}

function stopAllTimers() {
    clearInterval(GameState.current9PG.timerInterval);
    clearInterval(GameState.current9PG.responseInterval);
    clearInterval(GameState.current4S.timerInterval);
    clearInterval(GameState.currentFAF.timerInterval);
}

function createConfetti() {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = Math.random() * 100 + 'vw';
    c.style.backgroundColor = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#F9CA24'][Math.floor(Math.random() * 5)];
    c.style.animationDuration = (Math.random() * 2 + 2) + 's';
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4000);
}

// Admin questions (simplifié)
function showQuestionsAdmin() {
    alert('Gestion des questions - À implémenter selon vos besoins\n\nVous pouvez modifier le fichier game.js pour ajouter vos propres questions dans les tableaux defaultQuestions.');
}

// Démarrage
init();
