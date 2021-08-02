const { MessageEmbed } = require('discord.js')

const DATA = {
    "name": "game",
    "description": "Adds you to the notification list for a game",
    "options": [
        {
            "name": "input",
            "description": "Which game do you want to be notified for?",
            "type": "STRING",
            "required": true
        }
    ]
}

module.exports = {
    json: DATA,
    execute: async (interaction, db, { input }) => {
        const input_ = input.toLowerCase().trim()
        if ((/<@.*>/g).test(input_)) {
            const embed = new MessageEmbed()
                .setTitle('Adding to game')
                .setFooter('https://github.com/KaceCottam/IndexBot5')
                .setColor("RED")
                .setDescription("You tried creating a role with an '@'!\nTry using /join instead!")
            return await interaction.reply({ embeds: [embed], ephemeral: true })
        }
        const embed = new MessageEmbed()
            .setTitle('Adding to game')
            .setColor("DARK_BLUE")
            .setFooter('https://github.com/KaceCottam/IndexBot5')
        let existingRole = interaction.guild.roles.cache.find(r => r.name === input_)
        if (!existingRole) {
            try {
                const newRole = await interaction.guild.roles.create({
                    name: input_,
                    mentionable: true
                })
                embed
                    .addField(':white_check_mark: New role created!', `New role ${newRole} created!`, false)
                    .setColor("GREEN")
                existingRole = newRole
                console.log(`New role '${newRole.id}' created in guild '${interaction.guild.id}'`)
            } catch {
                embed.addField(':x: Error!', 'That name is too long!')
                await interaction.reply({ embeds: [embed] })
                return
            }
        }

        require('./join').execute(interaction, db, { role: existingRole, existingEmbed: embed })
    }
}
