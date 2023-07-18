const dotenv = require('dotenv')
dotenv.config({ path: `${__dirname}/../.env` })
const { exec } = require('child_process');

const webhookUrl = process.env.HEALTHCHECK_WEBHOOK

function sendToDiscord() {
    fetch(webhookUrl, {
        method: 'post',
        body:    JSON.stringify({ content: '@dev No successful notifications in the last 24 hours' }),
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => console.log('Message sent to discord'))
    .catch(error => console.error(error));
}

function checkLogs() {
    exec("journalctl -u ketl-notifications-backend.service --since '24 hours ago'", (error, stdout) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        if (!stdout.includes('success: true')) {
            sendToDiscord();
        }
    });
}

checkLogs();