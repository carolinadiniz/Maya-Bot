const { Events } = require("discord.js");
const GuildService = require("../services/guildService");

module.exports = {
    name: Events.GuildAvailable,
    once: true,
    execute(guild, client) {
        console.log(`Guild Ready! Running at guild: ${guild.name}`);
        const guildService = new GuildService();
        guildService.guildCreate(guild);
    }
}