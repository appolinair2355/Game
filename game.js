// game.js - Version complète corrigée selon les vraies règles TV

const State = {
    user: null,
    userPhoto: null,
    voice: 'homme',
    volume: 0.8,
    game: {
        players: [],
        robots: [],
        scores: {},
        qualified: [],
        eliminated: [],
        currentManche: 0,
        currentQuestion: null,
        currentBuzzer: null,
        buzzerLocked: false,
        timers: {},
        selectedAnswer: null,
        current4SPlayer: 0,
        themes4S: [],
        currentTheme: null,
        serie4S: 0,
        fafPlayers: [],
        fafScores: {},
        fafCurrentPlayer: null,
        fafZones: { main: [4, 2], other: [3, 1] },
        fafCurrentZone: null,
        indiceIndex: 0,
        fafTimeLeft: 20
    }
};

const Questions = {
    neufPoints: [
        { q: "Capitale de la France ?", a: "Paris", options: ["Lyon", "Marseille", "Paris", "Bordeaux"], points: 1 },
        { q: "Nombre de continents sur Terre ?", a: "7", options: ["5", "6", "7", "8"], points: 1 },
        { q: "Qui a peint la Joconde ?", a: "Léonard de Vinci", options: ["Michel-Ange", "Raphaël", "Léonard de Vinci", "Van Gogh"], points: 2 },
        { q: "Plus grand océan du monde ?", a: "Pacifique", options: ["Atlantique", "Indien", "Pacifique", "Arctique"], points: 1 },
        { q: "Année de la Révolution française ?", a: "1789", options: ["1789", "1792", "1804", "1776"], points: 2 },
        { q: "Symbole chimique de l'or ?", a: "Au", options: ["Ag", "Fe", "Au", "Cu"], points: 3 },
        { q: "Auteur des Misérables ?", a: "Victor Hugo", options: ["Zola", "Hugo", "Balzac", "Dumas"], points: 2 },
        { q: "Planète la plus proche du Soleil ?", a: "Mercure", options: ["Vénus", "Mercure", "Terre", "Mars"], points: 1 },
        { q: "Plus long fleuve du monde ?", a: "Nil", options: ["Amazone", "Nil", "Mississippi", "Yangtsé"], points: 2 },
        { q: "Inventeur de l'ampoule électrique ?", a: "Edison", options: ["Tesla", "Edison", "Einstein", "Newton"], points: 2 },
        { q: "Nombre de joueurs dans une équipe de football ?", a: "11", options: ["9", "10", "11", "12"], points: 1 },
        { q: "Capitale du Japon ?", a: "Tokyo", options: ["Pékin", "Séoul", "Tokyo", "Bangkok"], points: 1 },
        { q: "Qui a écrit 'Le Petit Prince' ?", a: "Saint-Exupéry", options: ["Saint-Exupéry", "Verne", "Hugo", "Proust"], points: 2 },
        { q: "Plus grand désert du monde ?", a: "Sahara", options: ["Gobi", "Sahara", "Kalahari", "Atacama"], points: 2 },
        { q: "Année du premier pas sur la Lune ?", a: "1969", options: ["1965", "1969", "1972", "1959"], points: 3 }
    ],
    quatreSuite: [
        { theme: "Géographie", questions: [
            { q: "Capitale de l'Italie ?", a: "Rome", options: ["Milan", "Rome", "Venise", "Naples"] },
            { q: "Plus grande île du monde ?", a: "Groenland", options: ["Australie", "Groenland", "Madagascar", "Borneo"] },
            { q: "Fleuve qui traverse Paris ?", a: "La Seine", options: ["La Loire", "Le Rhône", "La Seine", "La Garonne"] },
            { q: "Montagne la plus haute du monde ?", a: "L'Everest", options: ["K2", "L'Everest", "Mont Blanc", "Kilimandjaro"] }
        ]},
        { theme: "Histoire", questions: [
            { q: "Premier président de la Vème République ?", a: "De Gaulle", options: ["De Gaulle", "Mitterrand", "Pompidou", "Giscard"] },
            { q: "Année de la fin de la Seconde Guerre mondiale ?", a: "1945", options: ["1943", "1944", "1945", "1946"] },
            { q: "Roi de France pendant la Révolution ?", a: "Louis XVI", options: ["Louis XIV", "Louis XV", "Louis XVI", "Charles X"] },
            { q: "Qui a découvert l'Amérique en 1492 ?", a: "Christophe Colomb", options: ["Magellan", "Vasco de Gama", "Christophe Colomb", "Marco Polo"] }
        ]},
        { theme: "Sciences", questions: [
            { q: "Planète la plus grande du système solaire ?", a: "Jupiter", options: ["Saturne", "Jupiter", "Neptune", "Uranus"] },
            { q: "Formule chimique de l'eau ?", a: "H2O", options: ["CO2", "H2O", "O2", "NaCl"] },
            { q: "Vitesse de la lumière (km/s) ?", a: "300000", options: ["150000", "300000", "400000", "250000"] },
            { q: "Os le plus long du corps humain ?", a: "Le fémur", options: ["L'humérus", "Le fémur", "Le tibia", "La colonne vertébrale"] }
        ]},
        { theme: "Arts et Culture", questions: [
            { q: "Peintre de 'La Nuit étoilée' ?", a: "Van Gogh", options: ["Picasso", "Monet", "Van Gogh", "Cézanne"] },
            { q: "Compositeur des 'Quatre Saisons' ?", a: "Vivaldi", options: ["Mozart", "Bach", "Vivaldi", "Beethoven"] },
            { q: "Auteur de 'Roméo et Juliette' ?", a: "Shakespeare", options: ["Molière", "Shakespeare", "Corneille", "Racine"] },
            { q: "Sculpteur de 'Le Penseur' ?", a: "Rodin", options: ["Michel-Ange", "Rodin", "Donatello", "Bernin"] }
        ]},
        { theme: "Sports", questions: [
            { q: "Dans quel sport utilise-t-on un shuttlecock ?", a: "Badminton", options: ["Tennis", "Badminton", "Squash", "Ping-pong"] },
            { q: "Où se sont déroulés les JO 2024 ?", a: "Paris", options: ["Londres", "Tokyo", "Paris", "Los Angeles"] },
            { q: "Tous les combien d'années a lieu la Coupe du Monde de football ?", a: "4 ans", options: ["2 ans", "3 ans", "4 ans", "5 ans"] },
            { q: "En quel mois se déroule le Tour de France ?", a: "Juillet", options: ["Juin", "Juillet", "Août", "Mai"] }
        ]}
    ],
    faceAFace: [
        { theme: "Cinéma", reponse: "Titanic", indices: ["Film sorti en 1997", "Réalisé par James Cameron", "Histoire d'amour sur un bateau", "Leonardo DiCaprio joue dedans", "Le bateau coule après avoir heurté un iceberg"], options: ["Titanic", "Avatar", "Pearl Harbor", "Le Pont de la Rivière Kwai"] },
        { theme: "Gastronomie", reponse: "Croissant", indices: ["Viennoiserie française", "Forme de croissant de lune", "Fait avec du beurre", "Se mange au petit-déjeuner", "Originaire de Vienne, popularisé en France"], options: ["Croissant", "Pain au chocolat", "Brioche", "Baguette"] },
        { theme: "Sport", reponse: "Tour de France", indices: ["Compétition cycliste annuelle", "Créée en 1903 par Henri Desgrange", "Le leader porte un maillot jaune", "Se déroule en juillet", "Parcourt les routes de France"], options: ["Tour de France", "Giro d'Italia", "Vuelta", "Paris-Roubaix"] },
        { theme: "Histoire", reponse: "Napoléon Bonaparte", indices: ["Empereur des Français", "Connu pour sa petite taille", "Défait à Waterloo en 1815", "A créé le Code civil", "Mort en exil sur l'île de Sainte-Hélène"], options: ["Napoléon", "Louis XIV", "Charlemagne", "De Gaulle"] },
        { theme: "Musique", reponse: "Mozart", indices: ["Compositeur autrichien du XVIIIe siècle", "Considéré comme un enfant prodige", "A composé plus de 600 œuvres", "A écrit son premier opéra à 12 ans", "Mort à 35 ans à Vienne"], options: ["Mozart", "Beethoven", "Bach", "Vivaldi"] },
        { theme: "Technologie", reponse: "Internet", indices: ["Réseau mondial de communication", "Créé à l'origine par l'armée américaine", "WWW a été inventé par Tim Berners-Lee", "Permet d'envoyer des emails", "Utilise des protocoles comme HTTP"], options: ["Internet", "Intranet", "Ethernet", "WiFi"] },
        { theme: "Littérature", reponse: "Harry Potter", indices: ["Saga littéraire en 7 tomes", "Écrite par J.K. Rowling", "Parle d'un jeune sorcier", "L'école s'appelle Poudlard", "L'ennemi principal est Voldemort"], options: ["Harry Potter", "Le Seigneur des Anneaux", "Narnia", "Hunger Games"] },
        { theme: "Science", reponse: "Albert Einstein", indices: ["Physicien théoricien allemand", "A développé la théorie de la relativité", "Célèbre formule E=mc²", "A reçu le prix Nobel de physique en 1921", "Cheveux emblématiques en bataille"], options: ["Einstein", "Newton", "Galilée", "Tesla"] }
    ]
};

function init() {
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

function selectVoice(voice, element) {
    State.voice = voice;
    document.querySelectorAll('.voice-option').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
    speak(`Voix ${voice} sélectionnée`);
}

function updateVolume(val) {
    State.volume = val / 100;
    document.getElementById('volumeValue').textContent = val + '%';
}

function speak(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'fr-FR';
    utter.rate = 0.9;
    utter.pitch = State.voice === 'femme' ? 1.2 : 0.9;
    utter.volume = State.volume;
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

function startGame() {
    State.game.players = [State.user];
    State.game.robots = [
        { id: 1, nom: 'ROBOT', prenom: 'ALPHA', photo: '🤖' },
        { id: 2, nom: 'ROBOT', prenom: 'BETA', photo: '🤖' },
        { id: 3, nom: 'ROBOT', prenom: 'GAMMA', photo: '🤖' }
    ];
    State.game.scores = { 0: 0, 1: 0, 2: 0, 3: 0 };
    State.game.qualified = [];
    State.game.eliminated = [];
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
        
        let photoHtml = idx === 0 ? 
            `<img src="${State.userPhoto}" alt="Photo">` : 
            `<div style="font-size: 4rem;">🤖</div>`;
        
        let pointsHtml = '<div class="points-bar">';
        for (let i = 0; i < 9; i++) {
            const filled = i < score;
            pointsHtml += `<div class="point-slot ${filled ? 'filled' : ''}"></div>`;
        }
        pointsHtml += '</div>';
        
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

function nextQuestion9PG() {
    if (State.game.qualified.length >= 3) {
        end9PG();
        return;
    }
    
    State.game.currentBuzzer = null;
    State.game.buzzerLocked = false;
    State.game.selectedAnswer = null;
    clearTimers();
    
    const q = Questions.neufPoints[State.game.questionIndex % Questions.neufPoints.length];
    State.game.currentQuestion = q;
    State.game.questionIndex++;
    
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
    setTimeout(() => showCorrectAnswer(), 2000);
}

function buzz9PG(playerIdx) {
    if (State.game.buzzerLocked || State.game.currentBuzzer !== null) return;
    if (State.game.qualified.includes(playerIdx)) return;
    
    clearInterval(State.game.timers.reading);
    
    State.game.currentBuzzer = playerIdx;
    State.game.buzzerLocked = true;
    
    const isRobot = playerIdx > 0;
    
    if (isRobot) {
        document.getElementById('instructionText').textContent = `Robot ${playerIdx} a buzzé !`;
        setTimeout(() => robotAnswer9PG(playerIdx), 1000 + Math.random() * 2000);
    } else {
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
    
    if (State.game.scores[idx] >= 9 && !State.game.qualified.includes(idx)) {
        State.game.qualified.push(idx);
        if (idx === 0) {
            speak('Félicitations, vous êtes qualifié ! Vous ne pouvez plus buzzer.');
            createConfetti();
        } else {
            speak(`Le robot ${idx} est qualifié et ne peut plus buzzer !`);
        }
    }
    
    if (State.game.qualified.length >= 3) {
        setTimeout(() => end9PG(), 2000);
        return;
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
        
        document.getElementById('responseTimerContainer').style.display = 'none';
        document.getElementById('answersContainer').style.display = 'none';
        document.getElementById('btnValidate').style.display = 'none';
        document.getElementById('readingTimer').style.display = 'block';
        document.getElementById('instructionText').textContent = '⚡ CLIQUEZ SUR "JE VEUX RÉPONDRE" ⚡';
        
        startReadingTimer();
        renderPupitres9PG();
    }, 2000);
}

function robotAnswer9PG(robotIdx) {
    const isCorrect = Math.random() > 0.3;
    const q = State.game.currentQuestion;
    
    if (isCorrect) {
        State.game.scores[robotIdx] += q.points;
        speak(`Le robot ${robotIdx} a trouvé la bonne réponse !`);
        
        if (State.game.scores[robotIdx] >= 9 && !State.game.qualified.includes(robotIdx)) {
            State.game.qualified.push(robotIdx);
            speak(`Le robot ${robotIdx} est qualifié !`);
        }
    } else {
        speak(`Le robot ${robotIdx} s'est trompé !`);
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
    const allPlayers = [0, 1, 2, 3];
    const eliminated = allPlayers.find(i => !State.game.qualified.includes(i));
    State.game.eliminated.push(eliminated);
    
    if (eliminated === 0) {
        speak('Vous êtes éliminé ! Game Over.');
        setTimeout(() => showMenu(), 3000);
        return;
    }
    
    speak(`Fin de la manche. Le joueur ${eliminated} est éliminé.`);
    setTimeout(() => start4Suite(), 3000);
}

// ==================== 4 À LA SUITE ====================

function start4Suite() {
    showScreen('screen4Suite');
    document.getElementById('mancheTitle').textContent = '4 À LA SUITE';
    
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
    document.getElementById('answers4S').style.display = 'grid';
    document.getElementById('btnStart4S').style.display = 'none';
    
    const container = document.getElementById('answers4S');
    container.innerHTML = '';
    
    State.game.themes4S.forEach((theme, idx) => {
        if (State.game.usedThemes.includes(idx)) return;
        
        const btn = document.createElement('div');
        btn.className = 'answer-btn';
        btn.style.fontSize = '1.5rem';
        btn.textContent = theme.theme;
        btn.onclick = () => selectTheme4S(idx);
        container.appendChild(btn);
    });
    
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
        document.getElementById('btnStart4S').textContent = 'DÉMARRER';
    } else {
        setTimeout(start4STimer, 1500);
    }
}

function updateSuiteBar() {
    const slots = document.querySelectorAll('.suite-number');
    slots.forEach((slot, idx) => {
        slot.classList.remove('active', 'current');
        if (idx <= State.game.serie4S) slot.classList.add('active');
        if (idx === State.game.serie4S) slot.classList.add('current');
    });
}

function start4STimer() {
    document.getElementById('btnStart4S').style.display = 'none';
    document.getElementById('answers4S').style.display = 'none';
    
    next4SQuestion();
    
    let time = 40;
    document.getElementById('timer40s').textContent = time;
    
    State.game.timers.suite = setInterval(() => {
        time--;
        document.getElementById('timer40s').textContent = time;
        if (time <= 0) end4S();
    }, 1000);
}

function next4SQuestion() {
    const q = State.game.currentTheme.questions[State.game.serie4S];
    if (!q || State.game.serie4S >= 4) {
        end4S();
        return;
    }
    
    document.getElementById('question4S').textContent = q.q;
    
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
    State.game.serie4S++;
    updateSuiteBar();
    speak('Bonne réponse !');
    
    if (State.game.serie4S >= 4) {
        clearInterval(State.game.timers.suite);
        createConfetti();
        speak('4 à la suite ! Excellent !');
        setTimeout(() => nextPlayer4S(), 2000);
    } else {
        next4SQuestion();
    }
}

function wrong4S() {
    speak('Mauvaise réponse ! Série perdue.');
    State.game.serie4S = 0;
    updateSuiteBar();
    next4SQuestion();
}

function nextPlayer4S() {
    State.game.current4SPlayer++;
    if (State.game.current4SPlayer >= State.game.fafPlayers.length) {
        startFAF();
    } else {
        clearInterval(State.game.timers.suite);
        showThemeSelection();
    }
}

function end4S() {
    clearInterval(State.game.timers.suite);
    nextPlayer4S();
}

// ==================== FACE À FACE ====================

function startFAF() {
    showScreen('screenFAF');
    document.getElementById('mancheTitle').textContent = 'FACE À FACE';
    
    State.game.fafPlayers = State.game.qualified.slice(0, 2);
    State.game.fafScores = { [State.game.fafPlayers[0]]: 0, [State.game.fafPlayers[1]]: 0 };
    
    renderPupitresFAF();
    nextFAFQuestion();
}

function renderPupitresFAF() {
    const container = document.getElementById('pupitresFAF');
    container.innerHTML = '';
    
    State.game.fafPlayers.forEach((playerIdx, pos) => {
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
    const maxScore = Math.max(...Object.values(State.game.fafScores));
    if (maxScore >= 12) {
        const winner = Object.keys(State.game.fafScores).find(k => State.game.fafScores[k] >= 12);
        endGame(parseInt(winner));
        return;
    }
    
    const q = Questions.faceAFace[Math.floor(Math.random() * Questions.faceAFace.length)];
    State.game.currentFAFQuestion = q;
    State.game.fafTimeLeft = 20;
    State.game.indiceIndex = 0;
    State.game.fafCurrentZone = null;
    
    document.querySelectorAll('.zone').forEach(z => z.classList.remove('active'));
    
    document.getElementById('indicesContainer').innerHTML = `<div style="color: var(--bleu-clair);">Thème : ${q.theme}</div>`;
    document.getElementById('timerFAF').textContent = '20';
    document.getElementById('timerFAF').classList.remove('warning');
    document.getElementById('answersFAF').style.display = 'none';
    
    speak(`Thème : ${q.theme}. Qui prend la main ?`);
    
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
    
    const currentPlayerIdx = State.game.fafPlayers.find(p => State.game.fafScores[p] === Math.min(...Object.values(State.game.fafScores)));
    if (currentPlayerIdx !== 0) {
        setTimeout(() => {
            const shouldTake = Math.random() > 0.3;
            chooseHand(shouldTake);
        }, 2000);
    }
}

function chooseHand(take) {
    const player0 = State.game.fafPlayers[0];
    const player1 = State.game.fafPlayers[1];
    
    if (take) {
        State.game.fafCurrentPlayer = 0;
        speak('Vous prenez la main ! Vos zones : 4 et 2 points.');
    } else {
        State.game.fafCurrentPlayer = 1;
        speak('Vous laissez la main. Le robot prend les zones 4-2.');
    }
    
    startFAFTimer();
}

function startFAFTimer() {
    const q = State.game.currentFAFQuestion;
    
    const container = document.getElementById('answersFAF');
    container.innerHTML = '';
    container.style.display = 'grid';
    
    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, idx) => {
        const btn = document.createElement('div');
        btn.className = 'answer-btn';
        btn.innerHTML = `<span class="answer-letter">${letters[idx]}</span>${opt}`;
        btn.onclick = function() {
            clearInterval(State.game.timers.faf);
            checkAnswerFAF(opt, this);
        };
        container.appendChild(btn);
    });
    
    State.game.timers.faf = setInterval(() => {
        State.game.fafTimeLeft--;
        document.getElementById('timerFAF').textContent = State.game.fafTimeLeft;
        
        const hasHand = State.game.fafCurrentPlayer;
        
        document.querySelectorAll('.zone').forEach(z => z.classList.remove('active'));
        
        if (State.game.fafTimeLeft >= 16) {
            document.getElementById('zone4').classList.add('active');
            State.game.fafCurrentZone = 4;
        } else if (State.game.fafTimeLeft >= 14) {
            document.getElementById('zone3').classList.add('active');
            State.game.fafCurrentZone = 3;
        } else if (State.game.fafTimeLeft >= 10) {
            document.getElementById('zone2').classList.add('active');
            State.game.fafCurrentZone = 2;
        } else if (State.game.fafTimeLeft >= 8) {
            document.getElementById('zone1').classList.add('active');
            State.game.fafCurrentZone = 1;
        } else {
            State.game.fafCurrentZone = 0;
        }
        
        if (State.game.fafTimeLeft <= 5) {
            document.getElementById('timerFAF').classList.add('warning');
        }
        
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

function revealIndice() {
    const q = State.game.currentFAFQuestion;
    if (State.game.indiceIndex < q.indices.length) {
        const div = document.createElement('div');
        div.className = 'indice-item';
        div.textContent = (State.game.indiceIndex + 1) + '. ' + q.indices[State.game.indiceIndex];
        document.getElementById('indicesContainer').appendChild(div);
        speak('Indice ' + (State.game.indiceIndex + 1));
        State.game.indiceIndex++;
    }
}

function checkAnswerFAF(answer, btnElement) {
    const q = State.game.currentFAFQuestion;
    const isCorrect = (answer === q.reponse);
    
    btnElement.classList.add(isCorrect ? 'correct' : 'wrong');
    document.querySelectorAll('.answer-btn').forEach(b => b.style.pointerEvents = 'none');
    
    if (isCorrect) {
        const points = State.game.fafCurrentZone || 1;
        const playerIdx = State.game.fafPlayers[State.game.fafCurrentPlayer];
        State.game.fafScores[playerIdx] += points;
        
        speak(`Bonne réponse ! ${points} points !`);
    } else {
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

function endGame(winnerIdx) {
    showScreen('screenWinner');
    
    const isPlayer = (winnerIdx === 0);
    const winner = isPlayer ? State.user : State.game.robots[winnerIdx - 1];
    
    document.getElementById('winnerName').textContent = winner.prenom + ' ' + winner.nom;
    document.getElementById('winnerPhoto').innerHTML = isPlayer ? 
        `<img src="${State.userPhoto}" style="width: 100%; height: 100%; object-fit: cover;">` : 
        `<div style="font-size: 8rem; text-align: center; line-height: 200px;">🤖</div>`;
    
    if (isPlayer) {
        speak('Félicitations ! Vous êtes le champion du jour !');
        for (let i = 0; i < 100; i++) setTimeout(createConfetti, i * 50);
    } else {
        speak('Le robot remporte cette partie. Retentez votre chance !');
    }
}

function clearTimers() {
    Object.values(State.game.timers).forEach(t => clearInterval(t));
}

function createConfetti() {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = Math.random() * 100 + 'vw';
    c.style.background = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#F9CA24'][Math.floor(Math.random() * 5)];
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 3000);
}

function showRules() {
    document.getElementById('modalTitle').textContent = '📋 RÈGLES DU JEU';
    document.getElementById('modalBody').innerHTML = `
        <div style="text-align: left; line-height: 1.8;">
            <h3 style="color: var(--or);">9 Points Gagnants</h3>
            <p>• 4 joueurs avec photos sur pupitres</p>
            <p>• Barre de 9 cases orange à remplir</p>
            <p>• Une fois qualifié (9 pts), on ne peut plus buzzer</p>
            <p>• 30 secondes pour répondre (clic direct)</p>
            
            <h3 style="color: var(--or); margin-top: 20px;">4 À La Suite</h3>
            <p>• Chaque qualifié choisit SON thème</p>
            <p>• Barre 0-1-2-3-4, 40 secondes</p>
            <p>• 4 bonnes réponses d'affilée</p>
            
            <h3 style="color: var(--or); margin-top: 20px;">Face À Face</h3>
            <p>• 2 finalistes</p>
            <p>• Qui prend la main → zones 4-2</p>
            <p>• Qui laisse → zones 3-1</p>
            <p>• Mauvaise réponse = points à l'autre</p>
            <p>• 20 secondes avec indices</p>
        </div>
    `;
    document.getElementById('modal').classList.add('active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

init();
