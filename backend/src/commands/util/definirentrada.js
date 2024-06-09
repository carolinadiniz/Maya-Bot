const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  category: "configurations",
  data: new SlashCommandBuilder()
    .setName("definirentrada")
    .setDescription("cria botão de entrada"),
  async execute(interaction, client) {
    const botName = client.user.username
    const buttonName = "Iniciar";
    const guildName = interaction.member.guild.name;
    const delay = 5000;

    const embed = new EmbedBuilder()
    .setTitle(`PEDIR SET - ${guildName.toUpperCase()}`)
    .setDescription(`Sistema para pedir set exclusivo do ${guildName}!\n\nPara pedir seu set, clique no botão \` ${buttonName} \``)



    // responde a interação
    interaction
      .reply({
        content: `[${botName}] Botão de entrada criado com sucesso!\n <t:${ Math.floor(Date.now() / 1000) + delay / 1000 }:R>.`,
        ephemeral: true,
      })
      .then((msg) => {
        setTimeout(() => {
          msg.delete()
            .catch((err) => console.log(err));
        }, delay);
      })
      .catch((err) => {
        console.log(err);
      });

    // envia mensagem no canal
    interaction.channel
      .send({ content: "oi", embeds: [embed] })
      .then(() => console.log(`[${botName}] button-created: botão de ${buttonName} criado com sucesso!}`))
      .catch((err) => console.error(err));
  },
};
