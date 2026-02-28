const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🏆 Questions pour un Champion TV démarré sur le port ${PORT}`);
    console.log(`📸 Photos de profil activées`);
    console.log(`🎙️ Voix homme/femme sélectionnable`);
    console.log(`🎯 Zones Face-à-face 4-3-2-1 exactes`);
});
