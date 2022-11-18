const { EmbedBuilder } = require('discord.js');
const { COLOR } = require('../config.json');

module.exports = {
    simpleEmbed: function (content, color = `0x${COLOR.HEX}`) {
        return new EmbedBuilder()
            .setDescription(content)
            .setColor(color);
    }
}