const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
const { ROLES_DB } = require('../config.json')
const EventEmitter = require('events')

const DATA = {
    'name': 'join',
    'description': 'Adds you to the notification list for a game',
    'options': [
        {
            'name': 'role',
            'description': 'Which game do you want to be notified for?',
            'type': 'ROLE',
            'required': true
        }
    ]
}

const eventer = new EventEmitter()
let listeners = []
eventer.on('newListener', (event, listener) => {
    // mem leak prevention
    listeners.push(listener)
    if (listeners.length <= 10) return
    let firstListener
    [firstListener, ...listeners] = listeners
    eventer.removeListener('interactionCreate', firstListener)
})

async function execute(interaction, db, { role, existingEmbed, secretReply })  {
    const embed = existingEmbed || new MessageEmbed()
        .setTitle('Adding to game')
        .setColor('DARK_BLUE')
        .setFooter('https://github.com/KaceCottam/IndexBot5')
    try {
        db.addRoles(interaction.guild.id, role.id, interaction.user.id)
        embed.addField(':video_game: Successfully added user to the game!', `Added ${interaction.user} to ${role}!`)
        console.log(`Adding user ${interaction.user.id} to role ${role.id}.`)
    } catch (err) {
        embed.setColor('RED')
        embed.addField(':x: Error!', `Already in ${role}!`)
    }
    db.commit(ROLES_DB)

    try {
        if (secretReply) return await interaction.reply({ embeds: [embed], ephemeral: true })
    } catch (err) {
        return
    }

    const buttonId = `join_button_${role.id}`

    const listener_func = async newinteraction => {
        if (newinteraction.customId != buttonId) return
        if (await newinteraction.guild.roles.fetch(role.id)) return await execute(newinteraction, db, { role: role, secretReply: true })
        const newEmbed = new MessageEmbed()
            .setTitle('Adding to game')
            .setColor('RED')
            .setFooter('https://github.com/KaceCottam/IndexBot5')
            .addField(':x: Error!', 'That roles doesn\'t exist anymore!')
        await newinteraction.reply({ embeds: [newEmbed] })
    }

    eventer.on('interactionCreate', listener_func)

    const button = new MessageButton()
        .setCustomId(buttonId)
        .setStyle('PRIMARY')
        .setLabel('Join this role!')
        .setEmoji('🔔')

    const row = new MessageActionRow().addComponents(button)
    try {
        await interaction.reply({ embeds: [embed], components: [row] })
    } catch (err) {
        console.error(err)
    }
}

module.exports = {
    json: DATA,
    setup: (db, client) => {
        client.on('interactionCreate', interaction => interaction.isButton() && eventer.emit('interactionCreate', interaction))
    },
    execute
}
