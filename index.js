const { Client, Intents, MessageEmbed, MessageAttachment, Formatters } = require('discord.js')
const { TOKEN, ROLES_DB, GUILD_IDS } = require('./config.json')
const api = require('./api.js')
const fs = require('fs')
const moment = require('moment')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES] })
let db

const uniques = xs => [...new Set(xs)]

function loadFile(file) {
    console.log(`Loading ./commands/${file}...`)

    const { json, execute, setup } = require('./commands/' + file)//

    if (setup) setup(db, client)

    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand() || interaction.commandName != json.name) return // this may be inefficient
        if (!interaction.guild) return // if the interaction is not in a guild dont do it
        let args = { client }
        if (json.options) json.options.forEach(option => {
            const f = 'get' + option.type[0] + option.type.substring(1).toLowerCase()
            args[option.name] = interaction.options[f](option.name)
        })
        try {
            await execute(interaction, db, args)
        } catch (err) {
            console.error("Error! ", err)
            const embed = new MessageEmbed()
                .setTitle("Error with interaction")
                .setColor("RED")
                .setFooter('https://github.com/KaceCottam/IndexBot5')
                .setDescription(':x: There was an error!')
            const errorMessage = new MessageAttachment(err.toString(), `${json.name}-error-trace`)
            await interaction.reply({ embeds: [embed], files: [errorMessage] })
        }
    })
    return json
}

async function deployCommands(guild_ids) {
    console.log('Deploying commands...')
    console.log()
    let data = fs
        .readdirSync('./commands')
        .filter(filename => filename.endsWith('.js'))
        .map(loadFile)

    await Promise.all(
        client.guilds.cache.map(async guild => {
            if (! guild.id in guild_ids) return
            return guild.commands.set(data)
        })
    )

    console.log('Done deploying commands.')
}

client.on('ready', async () => {
    console.log(`Connected as ${client.user.username}#${client.user.discriminator} (${client.user.id})!`)
    db = await api.makeApi(ROLES_DB)
    await deployCommands(GUILD_IDS)
    console.log("READY")
    console.log("------------------------")
})

client.on("guildCreate", async guild => {
    console.log(`Joined guild '${guild.id}'.`)
    await deployCommands([guild.id])
})

client.on('guildDelete', guild => {
    // update roles db
    db.removeGuild(guild.id)
    console.log(`Left guild '${guild.id}'.`)
})

client.on('messageCreate', async message => {
    // check message mentions
    if (!message.guild) return
    if (message.author.bot) return

    const allRoles = await db.listAllRoles(message.guild.id)
    const gameRoles = message.mentions.roles
        .filter(role => allRoles.indexOf(role.id) > -1)

    if (gameRoles.size == 0) return
    const mentionedUsers = [...gameRoles.values()].map(role => db.listUsers(message.guild.id, role.id)).flat().map(user => `<@${user}>`)
    const finalMessage = uniques(mentionedUsers).join(' ')

    if (message.channel.isThread()) return await message.reply(finalMessage)
    const threadName = `[${moment(message.createdTimestamp).format('MM-DD-YY')}] ${[...gameRoles.values()].map(it => it.name).join('-')} Discussion`

    const thread = await message.startThread({ name: threadName, autoArchiveDuration: 60 })
    await thread.send({ content: finalMessage })
})

client.on('error', err => {
    console.error(err)
})

client.login(TOKEN)

const express = require('express')
const app = express()
const port = 3000
app.get('/', (req, res) => {
    res.send('Hello world!')
})
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})
