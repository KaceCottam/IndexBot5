const { MessageEmbed } = require('discord.js')
const { ROLES_DB } = require('../config.json')

const DATA = {
    "name": "join",
    "description": "Adds you to the notification list for a game",
    "options": [
        {
            "name": "role",
            "description": "Which game do you want to be notified for?",
            "type": "ROLE",
            "required": true
        }
    ]
}

module.exports = {
    json: DATA,
    execute: async (interaction, db, { role }) => {
        const embed = new MessageEmbed()
            .setTitle("Adding to game")
            .setColor("DARK_BLUE")
            .setFooter('https://github.com/KaceCottam/IndexBot5')
        try {
            db.addRoles(interaction.guild.id, role.id, interaction.user.id)
            embed.addField(':video_game: Successfully added user to the game!', `Added ${interaction.user} to ${role}!`)
            console.log(`Adding user ${interaction.user.id} to role ${role.id}.`)
        } catch {
            embed.setColor("RED")
            embed.addField(":x: Error!", `Already in ${role}!`)
        }
        db.commit(ROLES_DB)
        await interaction.reply({ embeds: [embed] })
    }
}
