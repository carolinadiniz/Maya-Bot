const fs = require("fs");

module.exports = class GuildService {
  guildPathData = "./src/config/guilds.json";

  constructor() {}

  async guildCreate(guild) {
    // recebe o guild
    const members = await guild.members.fetch();
    const membersId = members.map((members) => members.id);
    const bots = JSON.parse(fs.readFileSync("./src/config/bots.json"));
    const botsId = Object.keys(bots);
    const inputData = {
      name: guild.name,
      icon: guild.icon,
      ownerId: guild.ownerId,
      botId: membersId.filter((element) => botsId.includes(element))[0],
    };

    // insere os dados
    let rawData = fs.readFileSync(this.guildPathData);
    let data = JSON.parse(rawData);
    data[guild.id] = inputData;

    // salva os dados
    fs.writeFileSync(this.guildPathData, JSON.stringify(data, null, 2));
  }

};
