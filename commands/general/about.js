const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    const: { version } = require('../../package.json'),
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('All hail the CCP'),
    async execute(interaction) {
        const uptime = formatUptime(interaction.client.uptime);
        const { rss, heapUsed, heapTotal } = process.memoryUsage();
        const cpuUsage = process.cpuUsage();
        const totalCpuTime = (cpuUsage.user + cpuUsage.system) / 1000; // Convert microseconds to milliseconds
        const elapsedTime = process.uptime() * 1000; // Convert seconds to milliseconds
        const cpuUsagePercentage = ((totalCpuTime / elapsedTime) * 100).toFixed(2);

        const aboutEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Mao Zedong')
            .setURL('https://github.com/MaoZedong-Bot/Mao')
            .setDescription('experimental bot written in discord.js')
            .setThumbnail(interaction.client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
            .addFields(
                {
                    name: 'Creators',
                    value: '<@907407245149634571>,<@1145477822123626596>',
                    inline: true
                },
                {
                    name: 'Version',
                    value: `${version}`,
                    inline: true
                },
                {
                    name: 'Uptime',
                    value: uptime
                },
                {
                    name: 'CPU Usage',
                    value: `${cpuUsagePercentage}%`,
                    inline: true
                },
                {
                    name: 'RAM Usage',
                    value: `RSS: ${(rss / 1024 / 1024).toFixed(2)} MB\nHeap: ${(heapUsed / 1024 / 1024).toFixed(2)} MB / ${(heapTotal / 1024 / 1024).toFixed(2)} MB`,
                    inline: true
                }
            );

        await interaction.reply({ embeds: [aboutEmbed] });
    }
};

function formatUptime(ms) {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}
