const { MessageEmbed } = require('discord.js')
const { ROLES_DB } = require('../config.json')

const DATA = {
    "name": "remove",
    "description": "Removes you from the notification list for a game",
    "options": [
        {
            "name":"role",
            "description": "Which game do you want to not be notified for?",
            "type": "ROLE",
            "required": true
        }
    ]
}

module.exports = {
    json: DATA,
    execute: async (interaction, db, { role }) => {
        const embed = new MessageEmbed()
            .setTitle("Removing from game")
            .setColor("DARK_BLUE")
            .setURL('https://github.com/KaceCottam/IndexBot5')
        try {
            db.removeUserFromRole(interaction.guild.id, role.id, interaction.user.id)
            console.log(`Removing user ${interaction.user.id} from role ${role.id}.`)
            embed.addField(':no_bell: Successfully unsubscribed from game!', `Unsubscribed from notifications for ${role.members.size != 0 ? role : role.name}.`, false)
        } catch {
            embed.setColor("RED")
            embed.addField(":x: Error!", `Not recieving notifications for ${role}!`, false)
        }
        if (role.members.size == 0 && db.listUsers(interaction.guild.id, role.id).length == 0) {
            console.log(`Removing role ${role.id} from guild ${interaction.guild.id}`)
            await role.delete()
            embed.addField(':broken_heart: Deleting role', `Deleting role "${role.name}"`, false)
            embed.setColor("ORANGE")
        }
        db.commit(ROLES_DB)
        await interaction.reply({ embeds: [embed] })
    }
}
