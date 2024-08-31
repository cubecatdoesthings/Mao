const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const state = require('../mod/helper/state'); // Import the state module

module.exports = {
    data: new SlashCommandBuilder()
        .setName('perfdbg')
        .setDescription('Start or stop monitoring performance stats.')
        .addStringOption(option =>
            option.setName('action')
                .setDescription('Action to perform')
                .setRequired(true)
                .addChoices(
                    { name: 'Start', value: 'start' },
                    { name: 'Stop', value: 'stop' }
                )),
    async execute(interaction) {
        const action = interaction.options.getString('action');

        if (action === 'start') {
            if (state.getMonitoringInterval()) {
                return interaction.reply({ content: 'Monitoring is already running!', ephemeral: true });
            }

            const monitorMessage = await interaction.reply({
                embeds: [createPerformanceEmbed(interaction.client)],
                fetchReply: true
            });

            const intervalDuration = 2000; // Update every 2 seconds
            const autoStopDuration = 5 * 60 * 1000; // 5 minutes in milliseconds

            // Start monitoring interval
            const interval = setInterval(async () => {
                try {
                    const updatedEmbed = createPerformanceEmbed(interaction.client);
                    await monitorMessage.edit({ embeds: [updatedEmbed] });
                } catch (error) {
                    console.error('Failed to update monitor message:', error);
                    state.clearMonitoringInterval();
                }
            }, intervalDuration);

            // Set monitoring interval in state
            state.setMonitoringInterval(interval);

            // Automatically stop monitoring after the specified duration
            setTimeout(() => {
                if (state.getMonitoringInterval()) {
                    state.clearMonitoringInterval();
                    interaction.followUp({ content: 'Performance monitoring automatically stopped after 5 minutes.', ephemeral: true });
                }
            }, autoStopDuration);
        } else if (action === 'stop') {
            if (!state.getMonitoringInterval()) {
                return interaction.reply({ content: 'No monitoring is currently running!', ephemeral: true });
            }

            state.clearMonitoringInterval();
            await interaction.reply({ content: 'Performance monitoring stopped.', ephemeral: true });
        }
    }
};

function createPerformanceEmbed(client) {
    const uptime = formatUptime(client.uptime);
    const { rss, heapUsed, heapTotal } = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    const totalCpuTime = (cpuUsage.user + cpuUsage.system) / 1000; // Convert microseconds to milliseconds
    const elapsedTime = process.uptime() * 1000; // Convert seconds to milliseconds
    const cpuUsagePercentage = ((totalCpuTime / elapsedTime) * 100).toFixed(2);

    return new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Performance Stats')
        .addFields(
            { name: 'Uptime', value: uptime },
            { name: 'CPU Usage', value: `${cpuUsagePercentage}%`, inline: true },
            { name: 'RAM Usage', value: `RSS: ${(rss / 1024 / 1024).toFixed(2)} MB\nHeap: ${(heapUsed / 1024 / 1024).toFixed(2)} MB / ${(heapTotal / 1024 / 1024).toFixed(2)} MB`, inline: true },
            { name: 'Ping', value: `${client.ws.ping}`, inline: true }
        );
}

function formatUptime(ms) {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}
