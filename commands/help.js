const { MessageEmbed } = require('discord.js')

const DATA = {
    "name": "help",
    "description": "Displays help information"
}

module.exports = {
    json: DATA,
    execute: async (interaction, db) => {
        // code here
        embed = new MessageEmbed()
            .setColor("DARK_BLUE")
            .setTitle('IndexBot v5 Help')
            .setURL('https://github.com/KaceCottam/IndexBot5')
            .setDescription("I will ping everyone subscribed to a game if someone mentions that game!")
            .addFields(
                { name: "/help", value: "Displays help information", inline: false },
                { name: "/game <input> or /join <role>", value: "Adds you to the notification list for a game", inline: false },
                { name: "/remove <role>", value: "Removes you from the notification list for a game", inline: false },
                { name: "/mygames", value: "Displays all the games you are being notified for", inline: false },
                { name: "/roles [user]", value: "Displays all the games in the server, or of a user", inline: false },
                // { name: "/forcejoin <user> <role>", value: "Forces a user to join a role (admin)", inline: false },
                // { name: "/forceremove <user> <role>", value: "Forces a user to be removed from a role (admin)", inline: false },
                // { name: "/removerole <role>", value: "Deletes a role (admin)", inline: false }
            )
        await interaction.reply({ embeds: [embed] })
    }
}
