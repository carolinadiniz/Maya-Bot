const { Events } = require("discord.js");

const buttonActions = {
};

const modalActions = {
};

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`[${client.user.username}] No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                console.log(`[${client.user.username}] command: ${command.data.name} | user: `);
                await command.execute(interaction, client);

            } catch (error) {
                console.error(error);
                const response = {
                    content: 'There was an error while executing this command!',
                    ephemeral: true
                };
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(response);
                } else {
                    await interaction.reply(response);
                }
            }
        }

        else if (interaction.isButton()) {
            const action = buttonActions[interaction.customId];
            if (action) {
                console.log(`[${client.user.username}] button: ${interaction.customId} | user: `)
                action(interaction, client);
            }
        }
        
        else if (interaction.isModalSubmit()) {
            const action = modalActions[interaction.customId];
            if (action) {
                console.log(`[${client.user.username}] submit: ${interaction.customId} | user: `)
                action(interaction, client);
            }
        }
    },
}

