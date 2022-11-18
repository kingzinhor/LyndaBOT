const { Events, EmbedBuilder } = require('discord.js');
const { COMMAND_LOG_CHANNEL_ID, COLOR } = require('../config.json')

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return; 

		const command = interaction.client.commands.get(interaction.commandName);

		const logChannel = interaction.client.channels.cache.get(COMMAND_LOG_CHANNEL_ID)

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
			const embed = new EmbedBuilder()
				.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
				.setDescription(
					`**Used:** \`${interaction.commandName}\` \n
					**In:** \`${interaction.channel.name}\``)
				.setColor(COLOR.RGB)
				.setTimestamp();
			await logChannel.send({embeds: [embed]})
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: `Erro: \`${error}\``, ephemeral: true });
		}
	
	},
};