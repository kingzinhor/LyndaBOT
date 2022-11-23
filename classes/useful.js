const { EmbedBuilder } = require('discord.js');
const { COLOR } = require('../config.json');

module.exports = {
    simpleEmbed: function (content, color = `0x${COLOR.HEX}`) {
        return new EmbedBuilder()
            .setDescription(content)
            .setColor(color);
    },
    currentDate: function () {
        const date = new Date();
        return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} (${date.getHours()}:${date.getMinutes()} in ${date.getSeconds()}.${date.getMilliseconds()})`
    }
}