const { MessageEmbed } = require('discord.js')

const uniques = xs => [...new Set(xs)]

const DATA = {
    "name": "members",
    "description": "See the notification list for a game",
    "options": [
        {
            "name": "role",
            "description": "Which game do you want to see the members of?",
            "type": "ROLE",
            "required": true
        }
    ]
}

module.exports = {
    json: DATA,
    execute: async (interaction, db, { role }) => {
        const embed = new MessageEmbed()
            .setTitle(`🔔 Members of ${role.name}`)
            .setColor("DARK_BLUE")
            .setFooter('https://github.com/KaceCottam/IndexBot5')
        //try {
            const users = await db.listUsers(role.guild.id, role.id)
            const mentions = users.map(userid => `<@${userid}>`)
            const message = uniques(mentions).join(' ') || "There are no members subscribed to this role."
            embed.setDescription(message)
            await interaction.reply({ embeds: [embed], ephemeral: true })
        //} catch {
        //    embed.addField(":x: Error!", "Something bad happened :(", false)
        //    embed.setColor("RED")
        //    await interaction.reply({ embeds: [embed], ephemeral: true })
        //}
    }
}
