const { Client, Intents, Collection, Interaction, MessageEmbed } = require("discord.js");
const botConfig = require("./botConfig.json");
const fs = require("fs");
const discord = require("discord.js");
const Discord = require("discord.js");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  Intents.FLAGS.GUILD_MEMBERS]
});

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith(".js"));

for (const file of commandFiles) {

  const command = require(`./commands/${file}`);

  client.commands.set(command.help.name, command);

  console.log(`The file ${command.help.name}.js Booted`);

}

client.on("ready", async () => {
    console.log(`${client.user.username} is online!`);
    let statuses = [`You`, `The server`]
    setInterval(function () {
        let status = statuses[Math.floor(Math.random() * statuses.length)];
        client.user.setActivity(status, { type: "WATCHING" });
    }, 15000)
});

    
client.on("messageCreate", async message => {
    if (message.author.bot) return;

    var prefix = botConfig.prefix;

    var messageArray = message.content.split(" ");

    var command = messageArray[0];
    
    if (!message.content.startsWith(prefix)) return;

    const commandData = client.commands.get(command.slice(prefix.length));

    if (!commandData) return;

    var arguments = messageArray.slice(1);

    try {

        await commandData.run(client, message, arguments);

    } catch (error) {
       console.log(error);
       await message.reply("something went wrong while executing this command\n\ntry again later") ;
    }

});

client.login(botConfig.token);