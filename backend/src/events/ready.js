const { Events } = require("discord.js");
const BotService = require("../services/botService");

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Bot Ready! Logged in as: ${client.user.tag}`)
        const botService = new BotService()
        botService.botCreate(client)
    }
}