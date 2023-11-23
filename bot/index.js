import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";
import crypto from "crypto";
import { MongoClient } from "mongodb";

export function bot() {
    const DiscordClient = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

    DiscordClient.on("ready", () => {
        console.log(`Logged in as ${DiscordClient.user.tag}!`);
    });
    
    DiscordClient.on("interactionCreate", async interaction => {
        if(!interaction.isChatInputCommand()) return;
    
        if(interaction.commandName === "login") {
            const token = crypto.randomUUID();

            const url = process.env.MONGO_URL;
            const DBclient = new MongoClient(url);

            try {
                await DBclient.connect();
                console.log("Connected to database!");
    
                const db = DBclient.db("FakeDiscordMessages");
                const collection = db.collection("Users");
    
                const result = await collection.insertOne({
                    id: interaction.user.id,
                    token: token,
                    expires: new Date(Date.now() + 3600000)
                });


                const loginEmbed = new EmbedBuilder()
                .setTitle("Login to FakeDiscordMessages")
                .setDescription(`[Login](https://fakediscordmsgs.pingwinco.xyz/?token=${token}). This link will expire in 1 hour.`)
                .setColor("#7289da")
                .setFooter({ text: "FDM Login System V1" });
    
                await interaction.reply({ 
                    ephemeral: true,
                    embeds: [loginEmbed]
                });
            } catch(err) {
                console.log(err);

                const failEmbed = new EmbedBuilder()
                .setTitle("Failed to generate a FakeDiscordMessages Login Link.")
                .setDescription("An error has occured. Please try again later.")
                .setColor("#7289da")
                .setFooter({ text: "FDM Login System V1" });
    
                await interaction.reply({ 
                    ephemeral: true,
                    embeds: [failEmbed]
                });
            } finally {
                DBclient.close();
            }
        }
    });
    
    DiscordClient.login(process.env.token);
}
