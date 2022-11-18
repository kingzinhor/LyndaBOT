const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js")
const wait = require('node:timers/promises').setTimeout;

var client;

module.exports = {
	data: new SlashCommandBuilder()

		.setName('test')
        .setNameLocalizations({'pt-BR': 'testar'})
        
		.setDescription('Tests something')
        .setDescriptionLocalizations({'pt-BR': 'Testa alguma coisa'})

        .setDMPermission(false),

	async execute(interaction) {

		client = interaction.client;

        const locales = {
            'pt-BR': 'Testando!'
        };

		await interaction.reply(locales[interaction.locale] ?? "Testing!")
	},
};