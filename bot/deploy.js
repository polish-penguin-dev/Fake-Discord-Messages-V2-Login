import { REST, Routes } from "discord.js";

async function deploy() {
    const commands = [
        {
            name: "login",
            description: "Generates a login link for FDM."
        }
    ];
    
    const rest = new REST({ version: "10" }).setToken(process.env.token);
    
    try {
        console.log("Started refreshing application (/) commands.");
    
        await rest.put(Routes.applicationCommands(process.env.clientId), { body: commands });
    
        console.log("Successfully reloaded application (/) commands.");
    } catch(err) {
        console.error(err);
    }
}

module.exports = deploy;