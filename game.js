// game.js - Version complète avec photos, voix homme/femme, zones FAF exactes

const State = {
    user: null,
    userPhoto: null,
    voice: 'homme', // 'homme' ou 'femme'
    volume: 0.8,
    game: {
        players: [],
        robots: [],
        scores: {},
        qualified: [],
        currentManche: 0,
        currentQuestion: null,
        currentBuzzer: null,
        buzzerLocked: false,
        timers: {},
        selectedAnswer: null,
        fafScores: {},
        currentIndices: [],
        indiceIndex: 0
    }
};

// Base de données questions enrichie
const Questions = {
    neufPoints: [
        { q: "Quelle est la capitale de la France ?", a: "Paris", options: ["Lyon", "Marseille", "Paris", "Bordeaux"], points: 1 },
        { q: "Combien de continents sur Terre ?", a: "7", options: ["5", "6", "7", "8"], points: 1 },
        { q: "Qui a peint la Joconde ?", a: "Léonard de Vinci", options: ["Michel-Ange", "Raphaël", "Léonard de Vinci", "Van Gogh"], points: 2 },
        { q: "Plus grand océan du monde ?", a: "Pacifique", options: ["Atlantique", "Indien", "Pacifique", "Arctique"], points: 1 },
        { q: "Année de la Révolution française ?", a: "1789", options: ["1789", "1792", "1804", "1776"], points: 2 },
        { q: "Symbole chimique de l'or ?", a: "Au", options: ["Ag", "Fe", "Au", "Cu"], points: 3 },
        { q: "Auteur des Misérables ?", a: "Victor Hugo", options: ["Zola", "Hugo", "Balzac", "Dumas"], points: 2 },
        { q: "Planète la plus proche du Soleil ?", a: "Mercure", options: ["Vénus", "Mercure", "Terre", "Mars"], points: 1 },
        { q: "Plus long fleuve du monde ?", a: "Nil", options: ["Amazone", "Nil", "Mississippi", "Yangtsé"], points: 2 },
        { q: "Inventeur de la ampoule électrique ?", a: "Edison", options: ["Tesla", "Edison", "Einstein", "Newton"], points: 2 },
        { q: "Nombre de joueurs dans une équipe de football ?", a: "11", options: ["9", "10", "11", "12"], points: 1 },
        { q: "Capitale du Japon ?", a: "Tokyo", options: ["Pékin", "Séoul", "Tokyo", "Bangkok"], points: 1 },
        { q: "Qui a écrit 'Le Petit Prince' ?", a: "Saint-Exupéry", options: ["Saint-Exupéry", "Verne", "Hugo", "Proust"], points: 2 },
        { q: "Plus grand désert du monde ?", a: "Sahara", options: ["Gobi", "Sahara", "Kalahari", "Atacama"], points: 2 },
        { q: "Année du premier pas sur la Lune ?", a: "1969", options: ["1965", "1969", "1972", "1959"], points: 3 }
    ],
    quatreSuite: [
        {
            theme: "Géographie",
            questions: [
                { q: "Capitale de l'Italie ?", a: "Rome", options: ["Milan", "Rome", "Venise", "Naples"] },
                { q: "Plus grande île du monde ?", a: "Groenland", options: ["Australie", "Groenland", "Madagascar", "Borneo"] },
                { q: "Fleuve qui traverse Paris ?", a: "La Seine", options: ["La Loire", "Le Rhône", "La Seine", "La Garonne"] },
                { q: "Montagne la plus haute du monde ?", a: "L'Everest", options: ["K2", "L'Everest", "Mont Blanc", "Kilimandjaro"] }
            ]
        },
        {
            theme: "Histoire",
            questions: [
                { q: "Premier président de la Vème République ?", a: "De Gaulle", options: ["De Gaulle", "Mitterrand", "Pompidou", "Giscard"] },
                { q: "Année de la fin de la Seconde Guerre mondiale ?", a: "1945", options: ["1943", "1944", "1945", "1946"] },
                { q: "Roi de France pendant la Révolution ?", a: "Louis XVI", options: ["Louis XIV", "Louis XV", "Louis XVI", "Charles X"] },
                { q: "Qui a découvert l'Amérique en 1492 ?", a: "Christophe Colomb", options: ["Magellan", "Vasco de Gama", "Christophe Colomb", "Marco Polo"] }
            ]
        },
        {
            theme: "Sciences",
            questions: [
                { q: "Planète la plus grande ?", a: "Jupiter", options: ["Saturne", "Jupiter", "Neptune", "Uranus"] },
                { q: "Formule chimique de l'eau ?", a: "H2O", options: ["CO2", "H2O", "O2", "NaCl"] },
                { q: "Vitesse de la lumière (km/s) ?", a: "300 000", options: ["150 000", "300 000", "400 000", "250 000"] },
                { q: "Os le plus long du corps humain ?", a: "Le fémur", options: ["L'humérus", "Le fémur", "Le tibia", "La colonne vertébrale"] }
            ]
        },
        {
            theme: "Arts et Culture",
            questions: [
                { q: "Peintre de 'La Nuit étoilée' ?", a: "Van Gogh", options: ["Picasso", "Monet", "Van Gogh", "Cézanne"] },
                { q: "Compositeur des 'Quatre Saisons' ?", a: "Vivaldi", options: ["Mozart", "Bach", "Vivaldi", "Beethoven"] },
                { q: "Auteur de 'Romeo et Juliette' ?", a: "Shakespeare", options: ["Molière", "Shakespeare", "Corneille", "Racine"] },
                { q: "Sculpteur de 'Le Penseur' ?", a: "Rodin", options: ["Michel-Ange", "Rodin", "Donatello", "Bernin"] }
            ]
        }
    ],
    faceAFace: [
        {
            theme: "Cinéma",
            reponse: "Titanic",
            indices: [
                "Film sorti en 1997",
                "Réalisé par James Cameron",
                "Histoire d'amour sur un bateau",
                "Leonardo DiCaprio joue dedans",
                "Le bateau coule après avoir heurté un iceberg"
            ],
            options: ["Titanic", "Avatar", "Pearl Harbor", "Le Pont de la Rivière Kwai"]
        },
        {
            theme: "Gastronomie",
            reponse: "Croissant",
            indices: [
                "Viennoiserie française",
                "Forme de croissant de lune",
                "Fait avec du beurre",
                "Se mange au petit-déjeuner",
                "Originaire de Vienne, popularisé en France"
            ],
            options: ["Croissant", "Pain au chocolat", "Brioche", "Baguette"]
        },
        {
            theme: "Sport",
            reponse: "Tour de France",
            indices: [
                "Compétition cycliste annuelle",
                "Créée en 1903 par Henri Desgrange",
                "Le leader porte un maillot jaune",
                "Se déroule en juillet",
                "Parcourt les routes de France"
            ],
            options: ["Tour de France", "Giro d'Italia", "Vuelta", "Paris-Roubaix"]
        },
        {
            theme: "Histoire",
            reponse: "Napoléon Bonaparte",
            indices: [
                "Empereur des Français",
                "Connu pour sa petite taille",
                "Défait à Waterloo en 1815",
                "A créé le Code civil",
                "Mort en exil sur l'île de Sainte-Hélène"
            ],
            options: ["Napoléon", "Louis XIV", "Charlemagne", "De Gaulle"]
        },
        {
            theme: "Musique",
            reponse: "Mozart",
            indices: [
                "Compositeur autrichien du XVIIIe siècle",
                "Considéré comme un enfant prodige",
                "A composé plus de 600 œuvres",
                "A écrit son premier opéra à 12 ans",
                "Mort à 35 ans à Vienne"
            ],
            options: ["Mozart", "Beethoven", "Bach", "Vivaldi"]
        },
        {
            theme: "Technologie",
            reponse: "Internet",
            indices: [
                "Réseau mondial de communication",
                "Créé à l'origine par l'armée américaine",
                "WWW a été inventé par Tim Berners-Lee",
                "Permet d'envoyer des emails",
                "Utilise des protocoles comme HTTP"
            ],
            options: ["Internet", "Intranet", "Ethernet", "WiFi"]
        },
        {
            theme: "Littérature",
            reponse: "Harry Potter",
            indices: [
                "Saga littéraire en 7 tomes",
                "Écrite par J.K. Rowling",
                "Parle d'un jeune sorcier",
                "L'école s'appelle Poudlard",
                "L'ennemi principal est Voldemort"
            ],
            options: ["Harry Potter", "Seigneur des Anneaux", "Narnia", "Hunger Games"]
        },
        {
            theme: "Science",
            reponse: "Albert Einstein",
            indices: [
                "Physicien théoricien allemand",
                "A développé la théorie de la relativité",
                "Célèbre formule E=mc²",
                "A reçu le prix Nobel de physique en 1921",
                "Cheveux emblématiques en bataille"
            ],
            options: ["Einstein", "Newton", "Galilée", "Tesla"]
        }
    ]
};

// Initialisation
function init() {
    // Charger session existante
    const session = localStorage.getItem('qpc_session');
    if (session) {
        const data = JSON.parse(session);
        State.user = data.user;
        State.userPhoto = data.photo;
        State.voice = data.voice || 'homme';
        State.volume = data.volume || 0.8;
        showMenu();
    }
}

// Upload photo
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            State.userPhoto = e.target.result;
            document.getElementById('previewPhoto').src = e.target.result;
            document.getElementById('previewPhoto').style.display = 'block';
            document.getElementById('photoPlaceholder').style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
}

// Sélection voix
function selectVoice(voice, element) {
    State.voice = voice;
    document.querySelectorAll('.voice-option').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
    
    // Test vocal immédiat
    speak(`Voix ${voice} sélectionnée`);
}

// Volume
function updateVolume(val) {
    State.volume = val / 100;
    document.getElementById('volumeValue').textContent = val + '%';
}

// Synthèse vocale avec choix homme/femme
function speak(text) {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'fr-FR';
    utter.rate = 0.9;
    utter.pitch = State.voice === 'femme' ? 1.2 : 0.9;
    utter.volume = State.volume;
    
    // Essayer de trouver une voix correspondante
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => {
        if (State.voice === 'femme') {
            return v.lang.includes('fr') && (v.name.includes('female') || v.name.includes('Woman') || v.name.includes('Samantha'));
        } else {
            return v.lang.includes('fr') && (v.name.includes('male') || v.name.includes('Man') || v.name.includes('Thomas'));
        }
    });
    
    if (preferredVoice) utter.voice = preferredVoice;
    
    window.speechSynthesis.speak(utter);
}

// Navigation
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function showMenu() {
    showScreen('screenMenu');
    document.getElementById('menuUserName').textContent = State.user.prenom + ' ' + State.user.nom;
}

function login() {
    const nom = document.getElementById('loginNom').value.trim();
    const prenom = document.getElementById('loginPrenom').value.trim();
    
    if (!nom || !prenom) {
        document.getElementById('loginError').textContent = 'Veuillez remplir tous les champs';
        return;
    }
    if (!State.userPhoto) {
        document.getElementById('loginError').textContent = 'Veuillez ajouter une photo';
        return;
    }
    
    State.user = { nom, prenom, id: Date.now() };
    
    // Sauvegarder session
    localStorage.setItem('qpc_session', JSON.stringify({
        user: State.user,
        photo: State.userPhoto,
        voice: State.voice,
        volume: State.volume
    }));
    
    speak(`Bienvenue ${prenom} ${nom} !`);
    showMenu();
}

function logout() {
    localStorage.removeItem('qpc_session');
    location.reload();
}

// Démarrer jeu
function startGame() {
    // Initialiser joueurs: user + 3 robots
    State.game.players = [State.user];
    State.game.robots = [
        { id: 1, nom: 'ROBOT', prenom: 'ALPHA', photo: '🤖' },
        { id: 2, nom: 'ROBOT', prenom: 'BETA', photo: '🤖' },
        { id: 3, nom: 'ROBOT', prenom: 'GAMMA', photo: '🤖' }
    ];
    State.game.scores = { 0: 0, 1: 0, 2: 0, 3: 0 };
    State.game.qualified = [];
    State.game.currentManche = 1;
    State.game.questionIndex = 0;
    
    start9PG();
}

// ==================== 9 POINTS GAGNANTS ====================
function start9PG() {
    showScreen('screen9PG');
    document.getElementById('mancheTitle').textContent = '9 POINTS GAGNANTS';
    renderPupitres9PG();
    nextQuestion9PG();
}

function renderPupitres9PG() {
    const container = document.getElementById('pupitres9PG');
    container.innerHTML = '';
    
    const allPlayers = [State.user, ...State.game.robots];
    
    allPlayers.forEach((player, idx) => {
        const isRobot = idx > 0;
        const isQualified = State.game.qualified.includes(idx);
        const score = State.game.scores[idx] || 0;
        
        const div = document.createElement('div');
        div.className = 'pupitre';
        if (State.game.currentBuzzer === idx) div.classList.add('active');
        if (isQualified) div.style.borderColor = 'var(--vert)';
        
        // Photo
        let photoHtml;
        if (isRobot) {
            photoHtml = `<div style="font-size: 4rem;">🤖</div>`;
        } else {
            photoHtml = `<img src="${State.userPhoto}" alt="Photo">`;
        }
        
        // Barre de points (9 cases)
        let pointsHtml = '<div class="points-bar">';
        for (let i = 0; i < 9; i++) {
            const filled = i < score;
            const current = i === score && State.game.currentBuzzer === idx;
            pointsHtml += `<div class="point-slot ${filled ? 'filled' : ''} ${current ? 'current' : ''}"></div>`;
        }
        pointsHtml += '</div>';
        
        div.innerHTML = `
            <div class="pupitre-photo">${photoHtml}</div>
            <div class="pupitre-name">${player.prenom}</div>
            ${pointsHtml}
            <div class="score-display">${score}/9</div>
            <button class="btn-buzz" onclick="buzz9PG(${idx})" 
                ${State.game.buzzerLocked || State.game.currentBuzzer !== null ? 'disabled' : ''}>
                ${State.game.currentBuzzer === idx ? '✓ EN RÉPONSE' : 'JE VEUX RÉPONDRE'}
            </button>
        `;
        
        container.appendChild(div);
    });
}

function nextQuestion9PG() {
    if (State.game.qualified.length >= 3) {
        end9PG();
        return;
    }
    
    // Réinitialiser
    State.game.currentBuzzer = null;
    State.game.buzzerLocked = false;
    State.game.selectedAnswer = null;
    clearTimers();
    
    // Nouvelle question
    const q = Questions.neufPoints[State.game.questionIndex % Questions.neufPoints.length];
    State.game.currentQuestion = q;
    State.game.questionIndex++;
    
    // UI
    document.getElementById('questionText').textContent = q.q;
    document.getElementById('pointsValue').textContent = q.points + ' POINT' + (q.points > 1 ? 'S' : '');
    document.getElementById('readingTimer').style.display = 'block';
    document.getElementById('responseTimerContainer').style.display = 'none';
    document.getElementById('answersContainer').style.display = 'none';
    document.getElementById('instructionText').style.display = 'block';
    document.getElementById('instructionText').textContent = '⚡ CLIQUEZ SUR "JE VEUX RÉPONDRE" ⚡';
    document.getElementById('btnNext').style.display = 'none';
    document.getElementById('btnValidate').style.display = 'none';
    
    speak(q.q);
    startReadingTimer();
    renderPupitres9PG();
}

function startReadingTimer() {
    const fill = document.getElementById('readingFill');
    const text = document.getElementById('readingText');
    let time = 5;
    
    State.game.timers.reading = setInterval(() => {
        time -= 0.05;
        fill.style.width = (time / 5 * 100) + '%';
        text.textContent = Math.ceil(time);
        
        if (time <= 0) {
            clearInterval(State.game.timers.reading);
            handleReadingTimeout();
        }
    }, 50);
}

function handleReadingTimeout() {
    State.game.buzzerLocked = true;
    document.getElementById('instructionText').textContent = '⏰ TEMPS ÉCOULÉ !';
    speak('Temps écoulé ! Personne n\'a buzzé.');
    
    setTimeout(() => {
        showCorrectAnswer();
    }, 2000);
}

function buzz9PG(playerIdx) {
    if (State.game.buzzerLocked || State.game.currentBuzzer !== null) return;
    
    clearInterval(State.game.timers.reading);
    
    State.game.currentBuzzer = playerIdx;
    State.game.buzzerLocked = true;
    
    const isRobot = playerIdx > 0;
    
    if (isRobot) {
        // Robot répond
        document.getElementById('instructionText').textContent = `Robot ${playerIdx} a buzzé !`;
        setTimeout(() => robotAnswer(playerIdx), 1000 + Math.random() * 2000);
    } else {
        // Joueur humain
        document.getElementById('readingTimer').style.display = 'none';
        document.getElementById('responseTimerContainer').style.display = 'block';
        document.getElementById('instructionText').textContent = 'Vous avez la main ! Choisissez votre réponse :';
        document.getElementById('btnValidate').style.display = 'inline-block';
        
        showAnswerOptions();
        startResponseTimer();
    }
    
    renderPupitres9PG();
    speak(isRobot ? `Le robot a buzzé !` : `Vous avez buzzé ! 30 secondes pour répondre.`);
}

function showAnswerOptions() {
    const container = document.getElementById('answersContainer');
    const q = State.game.currentQuestion;
    
    container.innerHTML = '';
    container.style.display = 'grid';
    
    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, idx) => {
        const btn = document.createElement('div');
        btn.className = 'answer-btn';
        btn.innerHTML = `<span class="answer-letter">${letters[idx]}</span>${opt}`;
        btn.onclick = () => selectAnswer(idx, btn);
        container.appendChild(btn);
    });
}

function selectAnswer(idx, element) {
    document.querySelectorAll('.answer-btn').forEach(btn => btn.classList.remove('selected'));
    element.classList.add('selected');
    State.game.selectedAnswer = idx;
}

function startResponseTimer() {
    const display = document.getElementById('responseTimer');
    let time = 30;
    
    State.game.timers.response = setInterval(() => {
        time--;
        display.textContent = time;
        
        if (time <= 10) display.classList.add('warning');
        else display.classList.remove('warning');
        
        if (time <= 0) {
            clearInterval(State.game.timers.response);
            wrongAnswer();
        }
    }, 1000);
}

function validateAnswer() {
    if (State.game.selectedAnswer === null) {
        alert('Veuillez sélectionner une réponse !');
        return;
    }
    
    clearInterval(State.game.timers.response);
    
    const q = State.game.currentQuestion;
    const selected = q.options[State.game.selectedAnswer];
    
    // Animation réponse
    document.querySelectorAll('.answer-btn').forEach((btn, idx) => {
        btn.classList.add('disabled');
        btn.style.pointerEvents = 'none';
        if (q.options[idx] === q.a) btn.classList.add('correct');
        else if (idx === State.game.selectedAnswer) btn.classList.add('wrong');
    });
    
    if (selected === q.a) {
        setTimeout(() => correctAnswer(), 1500);
    } else {
        setTimeout(() => wrongAnswer(), 1500);
    }
}

function correctAnswer() {
    const idx = State.game.currentBuzzer;
    const q = State.game.currentQuestion;
    State.game.scores[idx] += q.points;
    
    const player = idx === 0 ? 'Vous' : `Robot ${idx}`;
    speak(`Bonne réponse ! ${q.points} points pour ${player} !`);
    
    // Vérifier qualification
    if (State.game.scores[idx] >= 9 && !State.game.qualified.includes(idx)) {
        State.game.qualified.push(idx);
        if (idx === 0) {
            speak('Félicitations, vous êtes qualifié !');
            createConfetti();
        }
    }
    
    setTimeout(() => {
        State.game.currentBuzzer = null;
        nextQuestion9PG();
    }, 2000);
}

function wrongAnswer() {
    const idx = State.game.currentBuzzer;
    const player = idx === 0 ? 'Vous' : `Robot ${idx}`;
    speak(`Mauvaise réponse pour ${player} !`);
    
    setTimeout(() => {
        State.game.currentBuzzer = null;
        State.game.buzzerLocked = false;
        
        // Reprendre timer lecture si temps
        document.getElementById('responseTimerContainer').style.display = 'none';
        document.getElementById('answersContainer').style.display = 'none';
        document.getElementById('btnValidate').style.display = 'none';
        document.getElementById('readingTimer').style.display = 'block';
        document.getElementById('instructionText').textContent = '⚡ CLIQUEZ SUR "JE VEUX RÉPONDRE" ⚡';
        
        startReadingTimer();
        renderPupitres9PG();
    }, 2000);
}

function robotAnswer(robotIdx) {
    // 70% chance bonne réponse
    const isCorrect = Math.random() > 0.3;
    const q = State.game.currentQuestion;
    
    if (isCorrect) {
        State.game.scores[robotIdx] += q.points;
        speak(`Le robot a trouvé la bonne réponse !`);
        
        if (State.game.scores[robotIdx] >= 9 && !State.game.qualified.includes(robotIdx)) {
            State.game.qualified.push(robotIdx);
            speak(`Le robot ${robotIdx} est qualifié !`);
        }
    } else {
        speak(`Le robot s'est trompé !`);
    }
    
    setTimeout(() => {
        State.game.currentBuzzer = null;
        nextQuestion9PG();
    }, 2000);
}

function showCorrectAnswer() {
    const q = State.game.currentQuestion;
    document.getElementById('questionText').innerHTML = 
        `${q.q}<br><br><span style="color: var(--vert); font-size: 1.5rem;">Réponse : ${q.a}</span>`;
    document.getElementById('btnNext').style.display = 'inline-block';
    document.getElementById('readingTimer').style.display = 'none';
    document.getElementById('instructionText').style.display = 'none';
    speak(`La réponse était : ${q.a}`);
}

function end9PG() {
    const eliminated = [0, 1, 2, 3].find(i => !State.game.qualified.includes(i));
    
    if (eliminated === 0) {
        speak('Vous êtes éliminé ! Game Over.');
        setTimeout(() => showMenu(), 3000);
        return;
    }
    
    speak(`Fin de la manche. Le robot ${eliminated} est éliminé.`);
    setTimeout(() => start4Suite(), 3000);
}

// ==================== 4 A LA SUITE ====================
function start4Suite() {
    showScreen('screen4Suite');
    document.getElementById('mancheTitle').textContent = '4 À LA SUITE';
    
    // Choisir un thème aléatoire
    const theme = Questions.quatreSuite[Math.floor(Math.random() * Questions.quatreSuite.length)];
    State.game.current4S = { theme: theme, questionIdx: 0, serie: 0, score: 0 };
    
    document.getElementById('theme4S').textContent = 'Thème : ' + theme.theme;
    document.getElementById('player4SName').textContent = State.user.prenom + ' ' + State.user.nom;
    document.getElementById('question4S').textContent = 'Cliquez sur Démarrer pour commencer';
    document.getElementById('answers4S').style.display = 'none';
    document.getElementById('btnStart4S').style.display = 'inline-block';
    document.getElementById('btnCorrect4S').style.display = 'none';
    document.getElementById('btnWrong4S').style.display = 'none';
    
    updateSuiteBar();
}

function updateSuiteBar() {
    const slots = document.querySelectorAll('.suite-number');
    slots.forEach((slot, idx) => {
        slot.classList.remove('active', 'current');
        if (idx <= State.game.current4S.serie) slot.classList.add('active');
        if (idx === State.game.current4S.serie) slot.classList.add('current');
    });
}

function start4STimer() {
    document.getElementById('btnStart4S').style.display = 'none';
    document.getElementById('btnCorrect4S').style.display = 'inline-block';
    document.getElementById('btnWrong4S').style.display = 'inline-block';
    
    next4SQuestion();
    
    let time = 40;
    State.game.timers.suite = setInterval(() => {
        time--;
        document.getElementById('timer40s').textContent = time;
        if (time <= 0) end4S();
    }, 1000);
}

function next4SQuestion() {
    const q = State.game.current4S.theme.questions[State.game.current4S.questionIdx];
    if (!q) {
        end4S();
        return;
    }
    
    document.getElementById('question4S').textContent = q.q;
    
    // Afficher options
    const container = document.getElementById('answers4S');
    container.innerHTML = '';
    container.style.display = 'grid';
    
    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, idx) => {
        const btn = document.createElement('div');
        btn.className = 'answer-btn';
        btn.innerHTML = `<span class="answer-letter">${letters[idx]}</span>${opt}`;
        btn.onclick = function() {
            if (opt === q.a) {
                this.classList.add('correct');
                correct4S();
            } else {
                this.classList.add('wrong');
                wrong4S();
            }
        };
        container.appendChild(btn);
    });
    
    speak(q.q);
}

function correct4S() {
    State.game.current4S.serie++;
    State.game.current4S.questionIdx++;
    updateSuiteBar();
    
    speak('Bonne réponse !');
    
    if (State.game.current4S.serie >= 4) {
        clearInterval(State.game.timers.suite);
        createConfetti();
        speak('4 à la suite ! Excellent !');
        setTimeout(() => startFAF(), 2000);
    } else {
        next4SQuestion();
    }
}

function wrong4S() {
    speak('Mauvaise réponse ! Série perdue.');
    State.game.current4S.serie = 0;
    State.game.current4S.questionIdx++;
    updateSuiteBar();
    next4SQuestion();
}

function end4S() {
    clearInterval(State.game.timers.suite);
    startFAF();
}

// ==================== FACE A FACE ====================
function startFAF() {
    showScreen('screenFAF');
    document.getElementById('mancheTitle').textContent = 'FACE À FACE';
    
    // 2 finalistes: joueur + meilleur robot qualifié
    const qualifiedRobots = State.game.qualified.filter(i => i > 0);
    const robotFinalist = qualifiedRobots.length > 0 ? qualifiedRobots[0] : 1;
    
    State.game.fafFinalists = [0, robotFinalist];
    State.game.fafScores = { 0: 0, [robotFinalist]: 0 };
    State.game.fafCurrentPlayer = 0;
    
    renderPupitresFAF();
    nextFAFQuestion();
}

function renderPupitresFAF() {
    const container = document.getElementById('pupitresFAF');
    container.innerHTML = '';
    
    State.game.fafFinalists.forEach((playerIdx, pos) => {
        const isRobot = playerIdx > 0;
        const player = isRobot ? State.game.robots[playerIdx - 1] : State.user;
        const score = State.game.fafScores[playerIdx] || 0;
        
        const div = document.createElement('div');
        div.className = 'pupitre';
        if (State.game.fafCurrentPlayer === pos) div.classList.add('active');
        
        const photo = isRobot ? '🤖' : `<img src="${State.userPhoto}">`;
        
        div.innerHTML = `
            <div class="pupitre-photo">${isRobot ? `<div style="font-size: 4rem;">${photo}</div>` : photo}</div>
            <div class="pupitre-name">${player.prenom}</div>
            <div class="score-display">${score} pts</div>
        `;
        
        container.appendChild(div);
    });
}

function nextFAFQuestion() {
    // Vérifier victoire
    const maxScore = Math.max(...Object.values(State.game.fafScores));
    if (maxScore >= 12) {
        const winner = Object.keys(State.game.fafScores).find(k => State.game.fafScores[k] >= 12);
        endGame(parseInt(winner));
        return;
    }
    
    // Nouvelle question
    const q = Questions.faceAFace[Math.floor(Math.random() * Questions.faceAFace.length)];
    State.game.currentFAFQuestion = q;
    State.game.indiceIndex = 0;
    State.game.fafTimeLeft = 20;
    
    // Reset zones
    document.querySelectorAll('.zone').forEach(z => z.classList.remove('active'));
    document.getElementById('zone4').classList.add('active');
    
    // UI
    document.getElementById('indicesContainer').innerHTML = `<div style="color: var(--bleu-clair); font-size: 1.3rem;">Thème : ${q.theme}</div>`;
    document.getElementById('timerFAF').textContent = '20';
    document.getElementById('timerFAF').classList.remove('warning');
    document.getElementById('answersFAF').style.display = 'none';
    document.getElementById('btnNextIndice').disabled = false;
    
    speak(`Thème : ${q.theme}. Prenez ou laissez la main.`);
    
    // Auto "prendre la main" pour simplifier
    setTimeout(() => {
        startFAFTimer();
    }, 2000);
}

function startFAFTimer() {
    // Afficher réponses
    const container = document.getElementById('answersFAF');
    const q = State.game.currentFAFQuestion;
    container.innerHTML = '';
    container.style.display = 'grid';
    
    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, idx) => {
        const btn = document.createElement('div');
        btn.className = 'answer-btn';
        btn.innerHTML = `<span class="answer-letter">${letters[idx]}</span>${opt}`;
        btn.onclick =
