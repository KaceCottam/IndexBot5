const { MessageEmbed } = require('discord.js')

const DATA = {
    "name": "mygames",
    "description": "Displays all the games you are being notified for"
}

module.exports = {
    json: DATA,
    execute: async (interaction, db) => {
        let embed = new MessageEmbed()
            .setColor("DARK_BLUE")
            .setTitle(`${interaction.user.username}'s roles`)
            .setURL('https://github.com/KaceCottam/IndexBot5')
        const allRoles = await db.listRoles(interaction.guild.id, interaction.user.id)
        const roles = await Promise.all(allRoles.map(roleid => interaction.guild.roles.fetch(roleid)))
        if (roles.length == 0) {
            embed.addField(":x: Error!", `This user has no roles!`, false)
            embed.setColor="RED"
        } else {
            embed.addField(":video_game: Roles", roles.map(r => `${r}`).join('\n'), false)
        }
        await interaction.reply({ embeds: [embed] })
    }
}
