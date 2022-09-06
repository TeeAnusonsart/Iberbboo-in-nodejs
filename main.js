const {config} = require("dotenv");
const Discord=require("discord.js");
const { GatewayIntentBits, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const Xray= require('x-ray');
const xray=Xray();
const {campcommand} = require("./command/camp.js");
const {transcommand} = require("./command/trans.js");





const client = new Discord.Client({intents:[
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
]});

config()
const TOKEN = process.env.token;
const CLIENT_ID = process.env.clientId;
const GUILD_ID =process.env.guild;
const rest = new REST({version:"10"}).setToken(TOKEN)


client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.content.includes("ดิส")){
        message.reply("แปปนึง")
    }
  });



client.on("ready",()=>{
    console.log("Ready!")
});


client.on("interactionCreate",(interraction)=>{
    if (interraction.isChatInputCommand()){
        if(interraction.commandName==='camp'){
            let camp=interraction.options.get('camptype').value;
            let camptype=interraction.options.get('camptype').value;
            let url="https://www.camphub.in.th/"+camp;
            xray(url, {
                name:['.entry-title'],
                url:xray('.entry-title',['a@href'])
                })((err,data)=>{
                    interraction.reply("ค่าย "+camptype)
                    for(let i = 0; i<data.name.length;i++){
                        interraction.channel.send(String(i+1)+". "+data.name[i]+"\n"+data.url[i])}      
                
                }
                
            )
        }
        else if (interraction.commandName ==='trans'){
            let word=interraction.options.get("คำ").value;
            keyword=word.replaceAll(" ","-")
            let y=("https://dictionary.sanook.com/search/"+keyword);
            xray(y,'.rel-list','p')((o,meaning)=>{
                meaning=meaning.replaceAll("[","\n[")
                if (meaning===undefined || meaning==="" ){
                    interraction.reply("ไม่พบคำที่คุณต้องการ")
                }
                else{
                    interraction.reply(word +" หมายถึง ")
                    interraction.channel.send(meaning)
                }
                
            })
        }
    }
    
})


async function main(){
    const commands=[campcommand,transcommand];
    try{
        console.log("stated refreshing application (/) command.");
        await rest.put(Routes.applicationCommands(CLIENT_ID),{
            body:commands,
        })
        client.login(TOKEN);

    }catch(err){
        console.log(err);
    }
}

main();