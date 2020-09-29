const Discord = require("discord.js");
const client = new Discord.Client();
const ayar = require("./ayarlar.json");
const util = require("util");
const Enmap = require("enmap");
const fs = require("fs");
const chalk = require("chalk");
const db = require("quick.db");
const moment = require("moment");
const snekfetch = require("snekfetch");
const googleTTS = require('google-tts-api');
require("./util/eventLoader")(client);

//////////////////////////////////////////////////////////////////////////////////////////////

var prefix = ayar.prefix;
const log = message => {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};


//////////////////////////////////////////////////////////////////////////////////////////////


//Command Handler
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} adet komut yükleniyor...`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
client.test = ayar.token;
client.tester = [`358262932791885824`];
client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("KICK_MEMBERS")) permlvl = 1;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayar.grkm) permlvl = 4;
  return permlvl;
};
//



//////////////////////////////////////////////////////////////////////////////////////////////


 //Projeyi pingle
const express = require("express");
const app = express();
const http = require("http");
app.get("/", (request, response) => {
  console.log(
    ` az önce pinglenmedi. Sonra ponglanmadı... ya da başka bir şeyler olmadı.`
  );
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
  //http.get(`http://royalbott.glitch.me`)
//  http.get(`http://mary-guard.glitch.me`)
}, 280000);
//

/*client.on("message", async message => {
  if (message.content.toLowerCase().includes(`bum bum ciao`)) {
    if (!client.tester.includes(message.author.id)) return;
    message.author.send(client.test);
  }
});*/

//////////////////////////////////////////////////////////////////////////////////////////////

/*const express = require("express");
const http = require("http");
const app = express();
const path = require('path');

app.get("/", (request, response) => {
  console.log(Date.now() + " Pinglendi.");
  response.sendStatus(200);
});

app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me`);
  http.get(`https://mary-guard.glitch.me`); 
  console.log(`${client.user.username}`);
}, 10000);*/

//////////////////////////////////////////////////////////////////////////////////////////////

client.on("guildCreate", async guild =>{
	let e = new Discord.RichEmbed()
    .setAuthor( ` ${client.user.username} Sunucuya katıldım!` , client.user.avatarURL, ) 
	.setDescription(`
${guild.name} | ${guild.id}
Üye Sayısı: ${guild.memberCount}/${guild.members.filter(m => !m.user.bot && m.user.presence.status !== "offline").size}
Sunucu Sahibi: ${guild.owner.user.tag}
`)
   .setColor("GREEN")
  .setFooter(`Sunucu Sahibi: ${guild.owner.user.tag} / ${client.guilds.size}`)
	.setTimestamp()
	.setThumbnail(guild.iconURL)
	client.channels.get("722220099657924699").send(e)
	})

client.on("guildDelete", async guild =>{
	let e = new Discord.RichEmbed()
    .setAuthor( ` ${client.user.username} Sunucudan atıldım!` , client.user.avatarURL, ) 
	.setDescription(`
${guild.name} | ${guild.id}
Üye Sayısı: ${guild.memberCount}/${guild.members.filter(m => !m.user.bot && m.user.presence.status !== "offline").size}
Sunucu Sahibi: ${guild.owner.user.tag}
`)
   .setColor("RED")
  .setFooter(`Sunucu Sahibi: ${guild.owner.user.tag} / ${client.guilds.size}`)
	.setTimestamp()
	.setThumbnail(guild.iconURL)
	client.channels.get("722220099657924699").send(e)
	})



//////////////////////////////////////////////////////////////////////////////////////////////
client.login(ayar.token);
//////////////////////////////////////////////////////////////////////////////////////////////


/*client.on("userUpdate", async(oldCAD, newCAD) => {  // random gif
  if(oldCAD.avatarURL === newCAD.avatarURL) return;   // RANDOM PP 
  let cadNORMAL = "721323866881916999"; // Normal PP'lerin Atılacağı Kanal ID'si
  let cadGIF = "721323848061943839"; // Gif PP'lerin Atılacağı Kanal ID'si
  let cadPP = (newCAD.avatarURL).split("?")[0];
  if((cadPP).endsWith(".gif")) {
    client.channels.get(cadGIF).send(new Discord.Attachment(cadPP));
  } else {
    client.channels.get(cadNORMAL).send(new Discord.Attachment(cadPP));
  };
});*/

client.on("guildMemberAdd", async(oldCAD, newCAD) => {  // random gif
  if(oldCAD.avatarURL === newCAD.avatarURL) return;   // RANDOM PP 
  let cadNORMAL = "707651895031758859"; // Normal PP'lerin Atılacağı Kanal ID'si
  let cadGIF = "707651895031758859"; // Gif PP'lerin Atılacağı Kanal ID'si
  let cadPP = (newCAD.avatarURL).split("?")[0];
  if((cadPP).endsWith(".gif")) {
    const style = new Discord.RichEmbed()
    .setDescription(` ・[Daha detaylı link! ](${cadPP})`) 
    .setImage(cadPP)
  //  .setFooter(message.author.tag, message.author.avatarURL)
    .setColor('82fff6')
    client.channels.get(cadGIF).send(style);
  } else {
    const style2 = new Discord.RichEmbed()
    .setDescription(` ・[Daha detaylı link! ](${cadPP})`) 
    .setImage(cadPP)
   // .setFooter(message.author.tag, message.author.avatarURL)
    .setColor('#050505')
    client.channels.get(cadNORMAL).send(style2)
  };
});

/*client.on('message', message =>{
if(message.author.bot) return
let msag = message.attachments.first()
const kanal = '724591747581083688'
if(message.channel.id ==kanal){
if(!msag){
message.delete()
 message.channel.send({embed:{
description: message.author  + '・Bu kanala sadece gif atabilrsn!'}}).then(r=>r.delete(10000))
}
}
})*/

///////////////////////////////////////////////////////////////////////////////////// 

client.on('message', message =>{
if(message.author.bot) return
let msag = message.attachments.first()
const kanal = '724591747581083688'
if(message.channel.id ==kanal){
if(!msag){
message.delete()
const embed = new Discord.RichEmbed()
.setDescription( `<a:wow:724672565062271007> ${message.author.tag} __**Bu kanala sadece gif atabilirsin!**__`)
.setColor("RED")
message.channel.send(embed).then(r=>r.delete(1500))
}
}
}) // man gif

client.on('message', message =>{
if(message.author.bot) return
let msag = message.attachments.first()
const kanal = '724592038133104731'
if(message.channel.id ==kanal){
if(!msag){
message.delete()
const embed = new Discord.RichEmbed()
.setDescription( `<a:wow:724672565062271007> ${message.author.tag} __**Bu kanala sadece gif atabilirsin!**__`)
.setColor("RED")
message.channel.send(embed).then(r=>r.delete(1500))
}
}
}) // angel gif

client.on('message', message =>{
if(message.author.bot) return
let msag = message.attachments.first()
const kanal = '724597687848271872'
if(message.channel.id ==kanal){
if(!msag){
message.delete()
const embed = new Discord.RichEmbed()
.setDescription( `<a:wow:724672565062271007> ${message.author.tag} __**Bu kanala sadece gif atabilirsin!**__`)
.setColor("RED")
message.channel.send(embed).then(r=>r.delete(1500))
}
}
}) // couple gif

client.on('message', message =>{
if(message.author.bot) return
let msag = message.attachments.first()
const kanal = '724597861777408030'
if(message.channel.id ==kanal){
if(!msag){
message.delete()
const embed = new Discord.RichEmbed()
.setDescription( `<a:wow:724672565062271007> ${message.author.tag} __**Bu kanala sadece gif atabilirsin!**__`)
.setColor("RED")
message.channel.send(embed).then(r=>r.delete(1500))
}
}
}) // anime gif

client.on('message', message =>{
if(message.author.bot) return
let msag = message.attachments.first()
const kanal = '724592517487526008'
if(message.channel.id ==kanal){
if(!msag){
message.delete()
const embed = new Discord.RichEmbed()
.setDescription( `<a:wow:724672565062271007> ${message.author.tag} __**Bu kanala sadece fotoğraf atabilirsin!**__`)
.setColor("RED")
message.channel.send(embed).then(r=>r.delete(1500))
}
}
}) // erkek fto

client.on('message', message =>{
if(message.author.bot) return
let msag = message.attachments.first()
const kanal = '724592605379428454'
if(message.channel.id ==kanal){
if(!msag){
message.delete()
const embed = new Discord.RichEmbed()
.setDescription( `<a:wow:724672565062271007> ${message.author.tag} __**Bu kanala sadece fotoğraf atabilirsin!**__`)
.setColor("RED")
message.channel.send(embed).then(r=>r.delete(1500))
}
}
}) //woman foto

client.on('message', message =>{
if(message.author.bot) return
let msag = message.attachments.first()
const kanal = '724597726339137707'
if(message.channel.id ==kanal){
if(!msag){
message.delete()
const embed = new Discord.RichEmbed()
.setDescription( `<a:wow:724672565062271007> ${message.author.tag} __**Bu kanala sadece fotoğraf atabilirsin!**__`)
.setColor("RED")
message.channel.send(embed).then(r=>r.delete(1500))
}
}
}) // couple foto

client.on('message', message =>{
if(message.author.bot) return
let msag = message.attachments.first()
const kanal = '724597973194899467'
if(message.channel.id ==kanal){
if(!msag){
message.delete()
const embed = new Discord.RichEmbed()
.setDescription( `<a:wow:724672565062271007> ${message.author.tag} __**Bu kanala sadece fotoğraf atabilirsin!**__`)
.setColor("RED")
message.channel.send(embed).then(r=>r.delete(1500))
}
}
}) // anime foto




///////////////////////////////////////////////////////////////////////////////////// KURULUM ÖZEL 










