const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
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
    data: new SlashCommandBuilder()
    .setName('info')

    .setDescription('Display server or user info')
    .setDescriptionLocalizations({'pt-BR': 'Exibe informações de um servidor ou usuário'})

    .addSubcommand(subcommand => subcommand
        .setName('user')
        .setNameLocalizations({'pt-BR': 'usuário'})

        .setDescription('Gets user info')
        .setDescriptionLocalizations({'pt-BR': 'Diz informações de um usuário'})

        .addUserOption(option => option
            .setName('user')
            .setNameLocalizations({'pt-BR': 'usuários'})
            
            .setDescription('User that you want to know the info about')
            .setDescriptionLocalizations({'pt-BR': 'Usuário no qual você quer receber informações sobre'})
            .setRequired(false)))
    
    .addSubcommand(subcommand => subcommand
        .setName('server')
        .setNameLocalizations({'pt-BR': 'servidor'})
        
        .setDescription('Gets server\'s info')
        .setDescriptionLocalizations({'pt-BR': 'Diz informações do servidor'})
        
        .addStringOption(option => option
            .setName('id')
            
            .setDescription('Server\'s ID that you want to display the information')
            .setDescriptionLocalizations({'pt-BR': 'ID do servidor no qual você quer exibir informações'})
            .setRequired(false))),

    async execute(interaction) {
        switch (interaction.options.getSubcommand()){

            // Informações do usuário
            case 'user':

                var user = interaction.options.getUser("user");

                // Caso o usuário não tenha informado o "usuário-alvo", escolheremos ele mesmo
                if (!user) user = interaction.user; 

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

                break;
       




            // Informações do servidor
            case 'server':

                let guild;

                // Se eu não conseguir achar um servidor através do ID que o usuário me passou (ou não passou), eu vou usar o próprio servidor no qual o comando foi usado 
                try{
                    guild = await interaction.client.guilds.fetch(interaction.options.getString('id'));
                }catch{
                    guild = await interaction.client.guilds.fetch(interaction.guildId);
                }

                // Eu só quero que o usuário saiba a quantidade dos canais que ele possa ver 
                // Ás vezes pode não ser muito ideal que o usuário saiba a quantidade de canais ocultos daquele servidor
                const visibleChannels = guild.channels.cache.filter(canal => canal.permissionsFor(interaction.member).toArray().findIndex(perm => perm == 'ViewChannel') >= 0);

                // Coletando os eventos marcados no servidor-alvo, no formato
                // `nomeDoEvento (dia/mês/ano)`
                const scheduledEvents = [];
                (await guild.scheduledEvents.fetch()).forEach(event => {
                    const date = event.scheduledStartAt;
                    scheduledEvents.push(`\`${event.name} (${date.getDate()}/${date.getMonth()}/${date.getFullYear()})\``)
                })

                // Embed com as informações do servidor
                const guildEmbed = new EmbedBuilder()
                    .setAuthor({name: guild.name, iconURL: guild.iconURL()})
                    .setThumbnail(guild.iconURL())
                    .setTitle('📋 Descrição:')
                    .setDescription(guild.description ?? '\`Sem descrição\`')
                    .setFields(
                        { name: '\u200b', value: '\u200b' }, // Blank Field
                        { name: '👑 Dono:', value: `> ${(await guild.fetchOwner()).tag}`, inline: true },
                        { name: '📖 Canal de regras:', value: '> ' + (guild.rulesChannelId == null ? '`Sem canal de regras`' : `<#${guild.rulesChannelId}>`), inline: true },
                        { name: '💎 Boosts:', value: `> \`${guild.premiumSubscriptionCount}\``, inline: true },
                        { name: '⏫ Maior cargo:', value: `> \`${guild.roles.highest.name}\``, inline: true },
                        { name: '🏝️ Natividade:', value: `> :flag_${guild.preferredLocale.substring(3).toLowerCase()}: \`${guild.preferredLocale}\``, inline: true },
                        { name: '⏱️ Criado em:', value: `> \`${guild.createdAt.toLocaleString(interaction.locale)}\``, inline: true },
                        { name: '\u200b', value: '\u200b' }, // Blank Field
                        { name: '👥 Membros:', value: `> \`${guild.memberCount}\``, inline: true },
                        { name: '🎮 Integrações:', value: `> \`${(await guild.fetchIntegrations()).size}\``, inline: true },
                        { name: '😜 Emojis:', value: `> \`${(await guild.emojis.fetch()).size}\``, inline: true },
                        { name: '🦋 Stickers:', value: `> \`${(await guild.stickers.fetch()).size}\``, inline: true },
                        { name: '\u200b', value: '\u200b' }, // Blank Field
                        { name: '📆 Eventos agendados:', value: `> ${scheduledEvents.length > 0 ? scheduledEvents.join(';\n> ') : '`Sem eventos`'}`},
                    )
                    .setColor(COLOR.RGB)
                    .setFooter({text: guild.id});

                // Informações adicionais para usuários com permissão de Gerenciar Canais
                if(interaction.member.permissions.toArray().findIndex(perm => perm == 'ManageChannels') >= 0){
                    guildEmbed
                        .addFields(
                            { name: '\u200b', value: '\u200b' }, // Blank Field
                            { name: '💬 Canais de texto:', value: `> \`${visibleChannels.filter(canal => canal.type == 0).size}\``, inline: true }, // '0' = GuildText
                            { name: '🔊 Canais de voz:', value: `> \`${visibleChannels.filter(canal => canal.type == 2).size}\``, inline: true } // '2' = GuildVoice
                        );
                }

                // Informações adicionais para usuários com permissão de Moderar Membros
                if(interaction.member.permissions.toArray().findIndex(perm => perm == 'ModerateMembers') >= 0){
                    guildEmbed
                        .addFields(                
                            { name: '🗡️ Banimentos:', value: `> \`${(await guild.bans.fetch()).size}\``, inline: true }
                        );
                }

                // Informações adicionais para usuários com permissão de Gerenciar Cargos
                if(interaction.member.permissions.toArray().findIndex(perm => perm == 'ManageRoles') >= 0){            
                    guildEmbed
                        .addFields(
                            { name: '🏅 Total de cargos:', value: `> \`${(await guild.roles.fetch()).size - 1}\``, inline: true }
                        );
                }

                // Se o servidor tiver um banner, o exibirei. Senão, se o servidor for o servidor principal, eu exibirei um banner personalizado do servidor principal
                if (guild.banner){
                    guildEmbed
                        .setImage((guild.bannerURL()) + '?size=1024');
                }else if (guild.id == MAIN_SERVER_ID){
                    guildEmbed
                        .setImage('https://imgur.com/2NOTFOa.png?size=1024');
                }
                
                await interaction.reply({embeds: [guildEmbed], ephemeral: true});

                break;
        }
    }
}