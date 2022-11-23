const { Events, EmbedBuilder } = require('discord.js');
const { currentDate } = require('../classes/useful');
const { COMMAND_LOG_CHANNEL_ID, COLOR, MAIN_SERVER_ID } = require('../config.json')

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member) {
		if (member.guild.id != MAIN_SERVER_ID) return;

        const commandLogChannel = member.client.channels.cache.get(COMMAND_LOG_CHANNEL_ID);
        const enterLogChannel = member.client.channels.cache.get('1044380913871626243');

		try {
            const channel = member.guild.systemChannel ?? member.client.channels.cache.get(COMMAND_LOG_CHANNEL_ID);
            const embed = new EmbedBuilder()
                .setAuthor({name: member.user.tag, iconURL: member.displayAvatarURL()})
                .setTitle(':punch: **Seja bem vindo(a) ao servidor!**')
                .setDescription(`<@${member.id}> acaba de entrar, dêem boas vindas! Ele(a) é o nosso **${member.guild.memberCount}º** membro! :tada:`)
                .setColor(COLOR.RGB);
			await channel.send({content: '<@&1033430676969635890>',embeds: [embed]});
            
            const enterEmbed = new EmbedBuilder()
                .setAuthor({name: `${member.user.tag} entrou`, iconURL: member.displayAvatarURL()})
                .setDescription(member.id)
                .setColor('0x00ff00')
                .setFooter({text: currentDate()});
            await enterLogChannel.send({embeds: [enterEmbed]});
		} catch (error) {
			console.error(error);
			await commandLogChannel.send({ content: `Erro: \`${error}\``, ephemeral: true });
		}
	
        try {
            member.roles.add('1021179217100148856') // Cores
            member.roles.add('1021179353154986105') // Cargos
            member.roles.add('1009276358318362836') // Waifus
            member.roles.add('1021179418808422400') // Pings
            member.roles.add('1021179520021176340') // Perms
            member.roles.add('1009522935683354644') // GarticMOD
		} catch (error) {
			console.error(error);
			await commandLogChannel.send({ content: `Erro: \`${error}\``, ephemeral: true });
		}
	},
};