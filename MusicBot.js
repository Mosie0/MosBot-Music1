const { Client, Util, Discord, version } = require('discord.js');
const { PREFIX } = require('./config');
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');

const client = new Client({ disableEveryone: true });

const youtube = new YouTube(GOOGLE_API_KEY);

const queue = new Map();

client.on('warn', console.warn);

client.on('error', console.error);


client.on("ready", async () => {
	console.log(`${client.user.username} is online on ${client.guilds.size} servers!`);
 	client.user.setActivity('Music', { type: "LISTENING" })
});

client.on('disconnect', () => console.log('I just disconnected, making sure you know, I will reconnect now...'));

client.on('reconnecting', () => console.log('I am reconnecting now!'));

client.on('message', async msg => { // eslint-disable-line
	if (msg.author.bot) return undefined;
	if (!msg.content.startsWith(PREFIX)) return undefined;

	const args = msg.content.split(' ');
	const searchString = args.slice(1).join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = queue.get(msg.guild.id);

	let command = msg.content.toLowerCase().split(' ')[0];
	command = command.slice(PREFIX.length);
	if(command === "ping") {
		const Discord = require('discord.js')
    const useruser = "Command Ran By: " + msg.author.username;
    const userurl = msg.author.avatarURL;
    let botembed = new Discord.RichEmbed()
        .setColor("#000FF")
        .setDescription(`<a:Dots:426956230582599690> Loading......`)
        .setTimestamp()
    msg.channel.send(botembed).then(msg =>{
        botembed.setColor("#000FF")
        botembed.setDescription(`:ping_pong: Pong! **\`${client.pings[0]}ms\`**`)
        botembed.setFooter(useruser, userurl)
        botembed.setTimestamp()
        msg.edit(botembed)
    })
	}else if(command === "stats") {
		const Discord = require('discord.js')
		const moment = require('moment');
require("moment-duration-format");
		const { version } = require('discord.js')
   const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
    let channelsize = client.channels.size;
    let guildsize = client.guilds.size;
    let usersize = client.users.size;
const embed = new Discord.RichEmbed()
.setColor(`#FF000`)
.setThumbnail(client.user.avatarURL)
.addField(`Memory Usage`, `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
.addField(`Ping`, `${client.pings[0]}ms`, true)
.addField(`Bot Version`, `2.0.0`, true)
.addField(`Uptime`, `${duration}`, true)
.addField(`Users`, `${usersize}`, true)
.addField(`Servers`, `${guildsize}`, true)
.addField(`Channels`, `${channelsize}`, true)
.addField(`Discord.js Version`, `v${version}`, true)
.addField(`Node Version`, `${process.version}`, true)
msg.channel.send(embed);
	}else
		if (command === 'play') {
		const Discord = require('discord.js');
		const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			return msg.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		}
		if (!permissions.has('SPEAK')) {
			return msg.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
			const Discord = require('discord.js');
			const addedtoembed = new Discord.RichEmbed()
			.setColor(`#FF000`)
				.setDescription(`<a:success:476629550797684736> Playlist: **${playlist.title}** has been added to the queue!`)
			return msg.channel.send(addedtoembed).then(msg => {msg.delete(10000).catch()})
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
					let index = 0;
					const Discord = require('discord.js');
					const Songselectembed = new Discord.RichEmbed()
						.setColor('#FF000')
						.setDescription(`__**Song selection:**__\n\n ${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}\n\nPlease provide a value to select one of the search results ranging from 1-10.`)
					msg.channel.send(Songselectembed).then(msg => {msg.delete(10000).catch()})
					// eslint-disable-next-line max-depth
					try {
						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 10000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						return msg.channel.send('No or invalid value entered, cancelling video selection.').then(msg => {msg.delete(10000).catch()})
					}
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return msg.channel.send('<a:XX:482868924573155349> I could not obtain any search results.').then(msg => {msg.delete(10000).catch()})
				}
			}
			return handleVideo(video, msg, voiceChannel);
		}
	} else if (command === 'skip') {
		const Discord = require('discord.js');
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!').then(msg => {msg.delete(10000).catch()})
		if (!serverQueue) return msg.channel.send('There is nothing playing that I could skip for you.').then(msg => {msg.delete(10000).catch()})
		serverQueue.connection.dispatcher.end(video);
		
		return undefined;


		
	} else if (command === 'stop') {
		const Discord = require('discord.js');
		const leaveembed = new Discord.RichEmbed()
			.setColor("#FF0000")
			.setDescription(`<a:XX:482868924573155349> Leaving Voice Chat, No More Songs :frowning:`)
			.setFooter("Command Ran By: " + msg.author.username, msg.author.avatarURL)
		msg.channel.send(leaveembed).then(msg => {msg.delete(10000).catch()})
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!').then(msg => {msg.delete(10000).catch()})
		if (!serverQueue) return msg.channel.send('There is nothing playing that I could stop for you.').then(msg => {msg.delete(10000).catch()})
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stop command has been used!');
		return undefined;




	} else if (command === 'volume') {
		const Discord = require('discord.js');
		if(!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.channel.send(`You need to have Manage Messages or Administrator for this command.`)
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!').then(msg => {msg.delete(10000).catch()})
		if (!serverQueue) return msg.channel.send('There is nothing playing.').then(msg => {msg.delete(10000).catch()})
		if (!args[1]) return msg.channel.send(`The current volume is: **${serverQueue.volume}**`).then(msg => {msg.delete(10000).catch()})
		serverQueue.volume = args[1];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
		return msg.channel.send(`I set the volume to: **${args[1]}**`).then(msg => {msg.delete(10000).catch()})
	} else if (command === 'np') {
		const Discord = require('discord.js');
		if (!serverQueue) return msg.channel.send('There is nothing playing.').then(msg => {msg.delete(10000).catch()})
		return msg.channel.send(`<a:DANCING:483264993618296832> Now playing: **${serverQueue.songs[0].title}**`).then(msg => {msg.delete(10000).catch()})
	} else if (command === 'queue') {
		const Discord = require('discord.js');
		if (!serverQueue) return msg.channel.send('There is nothing playing.').then(msg => {msg.delete(10000).catch()})
		return msg.channel.send(`
__**Song queue:**__

${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}

**Now playing:** ${serverQueue.songs[0].title}
		`).then(msg => {msg.delete(100000).catch()})
	} else if (command === 'pause') {
		const Discord = require('discord.js');
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.send('⏸ Paused the music for you!').then(msg => {msg.delete(100000).catch()})
		}
		return msg.channel.send('There is nothing playing.').then(msg => {msg.delete(100000).catch()})
	} else if (command === 'resume') {
		const Discord = require('discord.js');
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return msg.channel.send('▶ Resumed the music for you!').then(msg => {msg.delete(100000).catch()})
		}
		return msg.channel.send('There is nothing playing.').then(msg => {msg.delete(100000).catch()})
	}

	return undefined;
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(msg.guild.id);
			return msg.channel.send(`I could not join the voice channel: ${error}`).then(msg => {msg.delete(100000).catch()})
		}
	} else {
		const Discord = require('discord.js');
		const AddEmbed = new Discord.RichEmbed()
		.setColor(`#FF000`)
		.setDescription(`<a:success:476629550797684736> **${song.title}** has been added to the queue!`)
		serverQueue.songs.push(song);
		if (playlist) return undefined;
		else return msg.channel.send(AddEmbed).then(msg => {msg.delete(100000).catch()})
	}
	return undefined;
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.')
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
const Discord = require('discord.js');
let startembed = new Discord.RichEmbed()
.setColor('#FF000')
.setDescription(`<a:DANCING:483264993618296832> Start playing: **${song.title}** \n [Song Link](${song.url})`)
	serverQueue.textChannel.send(startembed).then(msg => {msg.delete(100000).catch()})
}


client.login(process.env.BOT_TOKEN);
