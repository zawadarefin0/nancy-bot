const express = require('express');
const server = express();

server.all(`/`, (req, res) => {
    res.send(`Bot is running`);
});

function keepAlive() {
    server.listen(3000, () => {
        console.log(`Creator: zuttosrevenge`);
    });
}

module.exports = keepAlive;