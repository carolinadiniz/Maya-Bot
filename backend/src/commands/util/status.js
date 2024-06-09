const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  category: "util",
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("Verifica se o bot está online!"),
  async execute(interaction, client) {
    const delay = 5000;
    await interaction
      .reply({
        content: `Olá, me chamo ${
          client.user.tag.split("#")[0]
        } e sou um bot do ${interaction.member.guild.name}!\n <t:${
          Math.floor(Date.now() / 1000) + delay / 1000
        }:R>.`,
        ephemeral: true,
      })
      .then((msg) => {
        console.log(
          `[${client.user.username}] mesange-create: verificar bot online`
        );
        setTimeout(() => {
          msg
            .delete()
            .then(() => {
              console.log(
                `[${client.user.username}] mesange-delete: verificar bot online`
              );
            })
            .catch((err) => console.log(err));
        }, delay);
      })
      .catch((err) => {
        console.log(
          `[${client.user.username}] error: erro ao reply interaction`
        );
        console.log(err);
      });
  },
};
