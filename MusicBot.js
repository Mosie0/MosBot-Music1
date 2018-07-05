const { Client, Util } = require('discord.js');
const { PREFIX, GOOGLE_API_KEY } = require('./config');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');


const client = new Client({ disableEveryone: true });

const youtube = new YouTube(GOOGLE_API_KEY);

const queue = new Map();

client.on('warn', console.warn);

client.on('error', console.error);

client.on("ready", async ()  => {
	console.log(`${client.user.username} is online on ${client.guilds.size} servers!`);
	client.user.setGame(`Being ` + `${client.user.username} ` + `Serving: ${client.guilds.size} Servers`, "https://www.twitch.tv/superchiefyt");
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

	    if (command === 'play') {
		let red = "#FF0000";
		const Discord = require('discord.js');
		const novoiceembed = new Discord.RichEmbed()
		.setColor(red)
		.setDescription(`Sorry ${msg.author} But you need to be in a Voice Chat!`)
// ==========================================================================================================================================
		const cantconnectembed = new Discord.RichEmbed()
		.setColor(red)
		.setDescription(``)
// ============================================================================================================================================
		const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.send(novoiceembed);
// ============================================================================================================================================
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			return msg.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		}
		if (!permissions.has('SPEAK')) {
			return msg.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
		}
// ============================================================================================================================================
		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist =  youtube.getPlaylist(url);
			const videos =  playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 =  youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				 handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
			const Discord = require('discord.js');
			const NewSongQueue = new Discord.RichEmbed()
			.setColor(bot.user.role.color(' '))
			return msg.channel.send(`✅ Playlist: **${playlist.title}** has been added to the queue!`);
		} else {
			try {
				var video =  youtube.getVideo(url);
			} catch (error) {
				try {
					var videos =  youtube.searchVideos(searchString, 10);
					let index = 0;
					const Discord = require('discord.js');
					const Songselectembed = new Discord.RichEmbed()
					.setColor('#FF000')
					.setDescription(`__**Song selection:**__\n\n${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}\n\nPlease provide a value to select one of the search results ranging from 1-10.`)
					msg.channel.send(Songselectembed);
					// eslint-disable-next-line max-depth
					try {
						var response =  msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 10000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						return msg.channel.send('No or invalid value entered, cancelling video selection.');
					}
					const videoIndex = parseInt(response.first().content);
					var video =  youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return msg.channel.send('🆘 I could not obtain any search results.');
				}
			}
			return handleVideo(video, msg, voiceChannel);
		}
	} else if (command === 'skip') {
		const Discord = require('discord.js');
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing that I could skip for you.');
		serverQueue.connection.dispatcher.end(video);
		return undefined;
	} else if (command === 'stop') {
		const Discord = require('discord.js');
		const leaveembed = new Discord.RichEmbed()
			.setColor("#FF0000")
			.setDescription(`❌ Leaving Voice Chat, No More Songs :frowning:`)
			.setFooter("Command Ran By: " + msg.author.username, msg.author.avatarURL)
		msg.channel.send(leaveembed);
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing that I could stop for you.');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stop command has been used!');
		return undefined;
	} else if (command === 'volume') {
		const Discord = require('discord.js');
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
		if (!args[1]) return msg.channel.send(`The current volume is: **${serverQueue.volume}**`);
		serverQueue.volume = args[1];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
		return msg.channel.send(`I set the volume to: **${args[1]}**`);
	} else if (command === 'np') {
		const Discord = require('discord.js');
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
		return msg.channel.send(`🎶 Now playing: **${serverQueue.songs[0].title}**`);
	} else if (command === 'queue') {
		const Discord = require('discord.js');
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
		return msg.channel.send(`
__**Song queue:**__

${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}

**Now playing:** ${serverQueue.songs[0].title}
		`);
	} else if (command === 'pause') {
		const Discord = require('discord.js');
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.send('⏸ Paused the music for you!');
		}
		return msg.channel.send('There is nothing playing.');
	} else if (command === 'resume') {
		const Discord = require('discord.js');
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return msg.channel.send('▶ Resumed the music for you!');
		}
		return msg.channel.send('There is nothing playing.');
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
			return msg.channel.send(`I could not join the voice channel: ${error}`);
		}
	} else {
		const AddEmbed = new Discord.RichEmbed()
		.setColor(`#FF000`)
		.setDescription(`✅ **${song.title}** has been added to the queue!`)
		serverQueue.songs.push(song);
		if (playlist) return undefined;
		else return msg.channel.send(AddEmbed);
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
.setDescription(`🎶 Start playing: **${song.title}**`)
	serverQueue.textChannel.send(startembed);
}

client.login(process.env.BOT_TOKEN);