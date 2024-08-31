const { SlashCommandBuilder } = require('discord.js');

// Define the allowed user ID(s)
const ALLOWED_USER_IDS = ['1145477822123626596']; // Replace with actual user ID(s)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('restricted')
        .setDescription('A command that only a specific user can execute.'),
    async execute(interaction) {
        // Debugging line to log the user ID
        console.log(`User ID executing command: ${interaction.user.id}`);
        
        // Check if the user executing the command is in the allowed list
        if (!ALLOWED_USER_IDS.includes(interaction.user.id)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        // Proceed with the command execution
        await interaction.reply({ content: 'You have access to this command!', ephemeral: true });
    }
};
