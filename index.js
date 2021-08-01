const { Client, Intents, DiscordAPIError } = require('discord.js')
const { TOKEN, APPLICATION_ID, ROLES_DB, GUILD_IDS } = require('./config.json')
const api = require('./api.js')
const fs = require('fs')
const { inspect } = require('util')
const { exit } = require('process')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES] })
let db

const uniques = xs => [...new Set(xs)]

async function deployCommands(guild_ids) {
    console.log('Deploying commands...')

    let data = fs
        .readdirSync('./commands')
        .filter(filename => filename.endsWith('.js'))
        .map(file => {
            console.log(`Loading ./commands/${file}...`)

            const { json, execute } = require('./commands/' + file)

            client.on('interactionCreate', async interaction => {
                if (!interaction.isCommand() || interaction.commandName != json.name) return // this may be inefficient
                let args = {}
                json.options?.forEach(option => {
                    const f = 'get' + option.type[0] + option.type.substring(1).toLowerCase()
                    args[option.name] = interaction.options[f](option.name)
                })
                await execute(interaction, db, args)
            })
            return json
        })

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
    await deployCommands(GUILD_IDS)
    db = await api.makeApi(ROLES_DB)
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

    const threadName = [...gameRoles.values()].map(it => it.name).join('-') + ' Discussion'

    const thread = await message.startThread({ name: threadName, autoArchiveDuration: 1440 })
    const mentionedUsers = [...gameRoles.values()].map(role => db.listUsers(message.guild.id, role.id)).flat().map(user => `<@${user}>`)
    await thread.send(uniques(mentionedUsers).join(' '))
})

client.on('error', err => {
    console.error(err)
})

client.login(TOKEN)
