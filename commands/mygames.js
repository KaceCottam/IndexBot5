const { MessageEmbed } = require('discord.js')

const DATA = {
    'name': 'mygames',
    'description': 'Displays all the games you are being notified for'
}

module.exports = {
    json: DATA,
    execute: async (interaction, db) => {
        const allRoles = await db.listRoles(interaction.guild.id, interaction.user.id)
        const roles = await Promise.all(allRoles.map(roleid => interaction.guild.roles.fetch(roleid)))
        let embed = new MessageEmbed()
            .setColor('DARK_BLUE')
            .setTitle(`${interaction.user.username}'s roles`)
            .setFooter('https://github.com/KaceCottam/IndexBot5')
        if (roles.length == 0) {
            embed
                .addField(':x: Error!', 'This user has no roles!', false)
                .setColor('RED')
        } else {
            embed.addField(':video_game: Roles', roles.map(r => `${r}`).join('\n'), false)
        }
        try {
            await interaction.reply({ embeds: [embed] })
        } catch (err) {
            console.error(err)
        }
    }
}
