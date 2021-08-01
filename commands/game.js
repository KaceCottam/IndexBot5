const { MessageEmbed } = require('discord.js')
const { ROLES_DB } = require('../config.json')

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
        const embed = new MessageEmbed()
            .setTitle('Adding to game')
            .setColor("DARK_BLUE")
            .setFooter('https://github.com/KaceCottam/IndexBot5')
        let existingRole = interaction.guild.roles.cache.find(r => r.name === input_)
        if (!existingRole) {
            const newRole = await interaction.guild.roles.create({
                name: input_,
                mentionable: true
            })
            embed
                .addField(':white_check_mark: New role created!', `New role ${newRole} created!`, false)
                .setColor("GREEN")
            existingRole = newRole
            console.log(`New role '${newRole.id}' created in guild '${interaction.guild.id}'`)
        }
        try {
            db.addRoles(interaction.guild.id, existingRole.id, interaction.user.id)
            console.log(`Adding user ${interaction.user.id} to role ${existingRole.id}.`)
            embed.addField(':video_game: Successfully added user to the game!', `Added ${interaction.user} to ${existingRole}!`)
        } catch {
            embed.setColor("RED")
            embed.addField(":x: Error!", `Already in ${existingRole}!`)
        }
        db.commit(ROLES_DB)
        await interaction.reply({ embeds: [embed] })
    }
}
