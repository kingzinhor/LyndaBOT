const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COLOR } = require('../config.json');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('avatar')

    .setDescription('Show an user\'s avatar')
    .setDescriptionLocalizations({'pt-BR': 'Mostra o avatar de um usuário'})

    .addUserOption(option => option
        .setName('user')
        .setNameLocalizations({'pt-BR': 'usuário'})
        
        .setDescription('User that you want to display the avatar')
        .setDescriptionLocalizations({'pt-BR': 'Usuário no qual você quer exibir o avatar'})
        .setRequired(false)),

    async execute(interaction) {

        var user = interaction.options.getUser("user");

        if (!user) user = interaction.user; 

        user = await interaction.client.users.fetch(
            user,
            {
                force: true
            }
        )

        const locales = {
            'pt-BR': `Avatar de ${user.username}`
        }

        const embed = new EmbedBuilder()

            .setTitle(locales[interaction.locale] ?? `${user.username}'s avatar`)
            .setImage(user.displayAvatarURL() + "?size=1024")
            .setFooter({text: user.id})
            .setColor(user.accentColor ?? COLOR.RGB);

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}