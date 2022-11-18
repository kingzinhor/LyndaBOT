const { SlashCommandBuilder, ChannelType } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()

		.setName('echo')
        .setNameLocalizations({'pt-BR': 'ecoar'})
        
		.setDescription('Repeat the given text')
        .setDescriptionLocalizations({'pt-BR': 'Repete o texto inserido'})
        .setDMPermission(false)

        .addStringOption(option => option
            .setName('input')
            .setNameLocalizations({'pt-BR': 'conteúdo'})

			.setDescription('The input to echo back')
            .setDescriptionLocalizations({'pt-BR': 'O conteúdo que será ecoado'})

            // Ensure the text will fit in a message
            .setMaxLength(2000)
            .setRequired(true))
        
        .addChannelOption(option => option
            .setName('channel')
            .setNameLocalizations({'pt-BR': 'canal'})
            
            .setDescription('The channel to eco into')
            .setDescriptionLocalizations({'pt-BR': 'O canal onde irá ecoar'})

            // Ensure the user can only select a TextChannel for output
            .addChannelTypes(ChannelType.GuildText))

        .addBooleanOption(option => option
            .setName('secret')
            .setNameLocalizations({'pt-BR': 'secreto'})
            
            .setDescription('Whether or not the echo should be secret')
            .setDescriptionLocalizations({'pt-BR': 'Se o eco deve ser em segredo ou não'})),


	async execute(interaction) {
        const locales = {
            'pt-BR': 'Ecoando!'
        };
        await interaction.reply({content: locales[interaction.locale] ?? 'Echoing!', ephemeral: true});
        const channel = interaction.options.getChannel('channel') ?? interaction.channel;
        const content = interaction.options.getString('input');
        const secret = interaction.options.getBoolean('secret') ?? true;

        channel.send((secret ? "" : "**" + (interaction.member.nickname ?? interaction.user.username) + "**: ") + content)
        
	},
};