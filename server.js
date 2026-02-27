const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🏆 Questions pour un Champion Multi-joueur démarré sur le port ${PORT}`);
    console.log(`🤖 Mode robots activé`);
    console.log(`👑 Admin: Sossou Kouamé`);
});
