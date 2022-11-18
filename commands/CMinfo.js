const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require('discord.js');
const { COLOR, MAIN_SERVER_ID } = require('../config.json')

const badgesIds = {
    'ACTIVEDEVELOPER': '1042502137868996748',
    'BUGHUNTERLEVEL1':'1042502139450228817',
    'BUGHUNTERLEVEL2': '1042502140855341128',
    'CERTIFIEDMODERATOR': '1042502142428188713',
    'HYPESQUAD': '1042502144114311208',
    'HYPESQUADONLINEHOUSE1': '1042502145850753125',
    'HYPESQUADONLINEHOUSE2': '1042502147884990534',
    'HYPESQUADONLINEHOUSE3': '1042502149797576775',
    'PARTNER': '1042502151181701170',
    'PREMIUMEARLYSUPPORTER': '1042502152603570216',
    'STAFF': '1042502154096746618',
    'VERIFIEDDEVELOPER': '1042502155799634082'
}

module.exports = {
    data: new ContextMenuCommandBuilder()
    .setName('View info')
    .setNameLocalizations({'pt-BR': 'Ver informações'})
    .setType(ApplicationCommandType.User),

    async execute(interaction) {

        var user = interaction.targetUser;

        // Precisamos dar fetch com "force: true" para podermos pegar algumas informações desse usuário-alvo
        user = await interaction.client.users.fetch( 
            user,
            {
                force: true
            }
        )

        // Essa lista guarda strings com o formato ideal para formatar emojis no discord de acordo com as badges que o usuário-alvo tem
        // <:nomeDoEmoji:idDoEmoji>
        let badgesEmojiList = []; 
        user.flags.toArray().forEach(badge => { 
            badge = badge.toUpperCase();
            badgesEmojiList.push(`<:${badge}:${badgesIds[badge]}>`);
        })

        // Aqui faremos a embed que enviaremos para o usuário, obtendo informações do usuário-alvo
        const userEmbed = new EmbedBuilder() 

            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
            .setThumbnail(user.displayAvatarURL() + "?size=480")
            .addFields(
                {name: '🚼 Criado em:', value: '> `' + user.createdAt.toLocaleString(interaction.locale) + '`'},
                {name: '🎏 Flags:', value: '> ' + (badgesEmojiList.length > 0 ? badgesEmojiList.join(' ') : '`Nenhuma flag`'), inline: true},
                {name: '🤖 É um BOT?', value: '> ' + (user.bot ? '✅': '❌'), inline: true}

                //Por algum motivo estou tendo muitos problemas com isso, não está funcionando corretamente
                //{name: '・Status:', value: '> ' + (`${user.presence?.status ?? "Offline"}`)},

            )
            .setFooter({text: user.id})
            .setColor(user.accentColor ?? COLOR.RGB);

        const banner = user.banner; // Essa propriedade (.banner) contém o código do banner do usuário-alvo
        var url = null // Nessa variável iremos montar o link para o banner do usuário alvo através de algumas informações necessárias

        if (banner) {
            
            // Nem eu entendi muito bem mas, aparentemente, se esse tal código do banner do usuário começar com "a_", ele será um gif. Saber se ele será ou não um gif vai ser importante para expecificarmos a extensão no link
            const extension = banner.startsWith('a_') ? '.gif' : '.png';
            
            // Aqui construimos o link
            url = `https://cdn.discordapp.com/banners/${user.id}/${banner}${extension}?size=1024`;
            userEmbed.setImage(url)
        }


        // Outra embed que enviaremos, mas dessa vez será das informações dele como membro do servidor em que usarmos o comando. Ele está sendo declarado agora fora de escopo pois ele será outra coisa caso caia no "else" da condição aninhada lá embaixo
        const memberEmbed = new EmbedBuilder();

        const member = interaction.guild.members.cache.get(user.id);

        if (member) { // Se realmente este usuário for um membro desse servidor...

            const roles = member.roles.cache;

            // Aqui eu estou fazendo que nem quando peguei os emojis das badges, só que dessa vez com cargo. Estou guardando a string ideal para poder ser formatada como menção no discord
            // <@&idDoCargo>
            let rolesMentions = [];

            roles.forEach(role => {
                if ((role.name == '@everyone') || (role.name.includes('»'))) return;
                rolesMentions.push(`<@&${role.id}>`)
            })


            // Fazendo a embed que enviaremos como resposta (caso esse usuário seja um membro deste servidor) 
            memberEmbed
                .setAuthor({name: member.displayName, iconURL: member.displayAvatarURL()})
                .setColor(member.displayColor)
                .setThumbnail(member.displayAvatarURL())
                .setFields(
                    {name: '⌚ Membro desde:', value: '> `'+ member.joinedAt.toLocaleString(interaction.locale) +'`'},
                    {name: '⏫ Cargo mais alto:', value: '> ' + (member.roles.highest.name == '@everyone' ? '`Nenhum`' : `<@&${member.roles.highest.id}>`), inline: true},
                    {name: '⭐ Cargo destacado:', value: '> ' + (member.roles.hoist ?`<@&${member.roles.hoist.id}>` : '`Nenhum`'), inline: true},
                    {name: '🏅 Cargos', value: `> ${rolesMentions.length > 0 ? rolesMentions.join(', ') : '`Nenhum`'}`}
                );

            // Caso o usuário do comando tenha permissão para moderar membros, ele terá acesso a mais um campo dessa embed onde dirá as permissões que o usuário-alvo tem dentro daquele servidor
            if (interaction.member.permissions.toArray().findIndex(perm => perm == 'ModerateMembers') >= 0){
                memberEmbed.addFields(
                    {name: '⚙️ Permissões:', value: `> \`${member.permissions.toArray().length > 0 ? member.permissions.toArray().join(', ') : "Nenhuma"}\``}
                )
            }

        } else {
            
            // Vou tentar achar o usuário-alvo na lista de bans do servidor. 
            // Se eu achar, eu vou colocar uma embed avisando que ele é banido, no lugar da embed de informações.
            // Agora, se eu não achar, apenas direi que ele não está no servidor mesmo
            try{ 
                ban = await interaction.guild.bans.fetch(user.id)
                memberEmbed.setTitle('Esse membro está banido.')
                    .addFields(
                        {name: '・Motivo:', value: `> \`${ban.reason}\``}
                    )
                    .setColor('0xff0000');
            }catch{
                memberEmbed.setTitle('Este membro não está nesse servidor.')
                    .setColor(COLOR.RGB);
            }

        }

        await interaction.reply({ embeds: [userEmbed, memberEmbed], ephemeral: true });
    }
}