const fs = require("fs");

module.exports = class BotService {
  botPathData = "./src/config/bots.json";

  constructor() {}

  botCreate(client) {
    // recebe o guild
    let rawData = fs.readFileSync(this.botPathData);
    let data = JSON.parse(rawData);
    // insere os dados
    data[client.user.id] = {
      id: client.user.id,
      username: client.user.username,
      globalName: client.user.globalName,
      avatar: client.user.avatar,
    };
    // salva os dados
    fs.writeFileSync(this.botPathData, JSON.stringify(data, null, 2));
  }
};
