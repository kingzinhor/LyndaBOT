const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isContextMenuCommand()) return;	

        const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}
        
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
			await interaction.reply({ content: `Erro: \`${error}\``, ephemeral: true });
        }
	},
};