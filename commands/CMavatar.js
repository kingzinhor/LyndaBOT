const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require('discord.js');
const { COLOR } = require('../config.json');

module.exports = {
    data : new ContextMenuCommandBuilder()
	    .setName('View avatar')
        .setNameLocalizations({'pt-BR': 'Ver avatar'})
	    .setType(ApplicationCommandType.User),
    async execute(interaction, client) {

        var user = interaction.targetUser;

        // Precisamos dar fetch com "force: true" para podermos pegar algumas informações desse usuário-alvo
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