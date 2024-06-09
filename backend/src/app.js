const fs = require("fs");
const path = require("path");
const {
  REST,
  Routes,
  Client,
  Collection,
  GatewayIntentBits,
} = require("discord.js");

module.exports = class App {
  client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
    ],
  });

  constructor({ token }) {
    this.token = token;
    this.commandsLoader();
    this.eventsLoader();
    this.login(token);
  }

  commandsLoader() {
    this.client.commands = new Collection();
    const foldersPath = path.join(__dirname, "commands");
    const commandsFolders = fs.readdirSync(foldersPath);

    for (const folder of commandsFolders) {
      const commandsPath = path.join(foldersPath, folder);
      const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".js"));

      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ("data" in command && "execute" in command) {
          this.client.commands.set(command.data.name, command);
          console.log(`Command ${command.data.name} loaded`);
        } else {
          console.log(`Command ${command.data.name} not loaded`);
          console.log(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
          );
        }
      }
    }
  }

  eventsLoader() {
    const eventsPath = path.join(__dirname, "events");
    const eventFiles = fs
      .readdirSync(eventsPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of eventFiles) {
      const filePath = path.join(eventsPath, file);
      const event = require(filePath);
      if (event.once) {
        this.client.once(event.name, (...args) =>
          event.execute(...args, this.client)
        );
      } else {
        this.client.on(event.name, (...args) =>
          event.execute(...args, this.client)
        );
      }
    }
  }

  deployCommands() {
    console.log("Deploying commands");
    const applicationID = this.client.user.id;
    const guildData = JSON.parse(fs.readFileSync("./src/config/guilds.json"));
    const GuildList = Object.keys(guildData);
    let guildID = "";
    GuildList.forEach((element) => {
      if (guildData[element].botId === applicationID) guildID = element;
    });

    const commands = [];
    // Grab all the command folders from the commands directory you created earlier
    const foldersPath = path.join(__dirname, "commands");
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
      // Grab all the command files from the commands directory you created earlier
      const commandsPath = path.join(foldersPath, folder);
      const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".js"));
      // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ("data" in command && "execute" in command) {
          commands.push(command.data.toJSON());
        } else {
          console.log(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
          );
        }
      }
    }
    const rest = new REST().setToken(this.token);

    // and deploy your commands!
    (async () => {
      try {
        console.log(
          `Started refreshing ${commands.length} application (/) commands.`
        );
        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
          Routes.applicationGuildCommands(applicationID, guildID),
          { body: commands }
        );
        console.log(
          `Successfully reloaded ${data.length} application (/) commands.`
        );
      } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
      }
    })();
  }

  login() {
    this.client.login(this.token);
  }
};
