const { MessageEmbed } = require('discord.js')

const DATA = {
    "name": "roles",
    "description": "Displays all the games in the server, or of a user",
    "options": [
        {
            "name": "user",
            "description": "Which user do you want to display the roles of?",
            "type": "USER",
            "required": false
        }
    ]
}

module.exports = {
    json: DATA,
    execute: async (interaction, db, { user }) => {
        let embed = new MessageEmbed()
            .setColor("DARK_BLUE")
            .setTitle(`${user ? user.username : interaction.guild}'s roles`)
            .setFooter('https://github.com/KaceCottam/IndexBot5')
        const allRoles = user ? await db.listRoles(interaction.guild.id, user.id) : await db.listAllRoles(interaction.guild.id)
        const roles = await Promise.all(allRoles.map(roleid => interaction.guild.roles.fetch(roleid)))
        if (roles.length == 0) {
            embed.addField(":x: Error!", `This ${user ? 'user' : 'server' } has no roles!`, false)
            embed.setColor="RED"
        } else {
            embed.addField(":video_game: Roles", roles.map(r => `${r}`).join('\n'), false)
        }
        try {
            await interaction.reply({ embeds: [embed] })
        } catch (err) {
            await interaction.reply("The intended message is too big!")
        }
    }
}
