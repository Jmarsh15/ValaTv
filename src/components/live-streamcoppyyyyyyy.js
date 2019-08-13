import React from 'react'
import {Link} from 'react-router-dom'
import SideBar from "./sidebar";
// import * as qs from 'query-string';
import {BACKEND_API, server_url,GOOGLEANALYICS} from "../utility";
import ReactGA from 'react-ga';

class LiveStream extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			gameType :false,
			loyalty_coins : 0,
			global_coins: 0,
			days: 0,
			hours: 0,
			min: 0,
			sec: 0,
			giveaway_entries: [],
			time: null,
			past_winner_status: false,
			giveaway_credits: '',
			timerID: '',
			static_id: 0,
			mounted: false,
			host: null,
			progress_timerId: '',
			progressCount: 0,
			progress_value: 0,
			loaded_stream: null,
			online_status: this.props.online_status,
			active_giveaway: true,
			ads_channels: [
				{
					img: server_url + process.env.PUBLIC_URL + 'assets/images/img3.jpg',
					url: '/ads-channel1'
				}, {
					img: server_url + process.env.PUBLIC_URL + 'assets/images/img3.jpg',
					url: '/ads-channel2'
				}],
			giveaway_header_title: '',
			giveaway_description: '',
			giveaway_image: '',
			giveaway_total_entries: 0,
			giveaway_timeleft: '',
			giveaway_id:0,
			giveaway_user_entered:'',
			game_entry: {
				game_thumb: null,
				user: '',
				game: '',
				title: '',
				viewers: '0',
				coins: 0,
				coins_per_minute: '+20',
				live_stream_ads_img: server_url + process.env.PUBLIC_URL + 'assets/images/img3.jpg'
			},
			past_winners: [
				//  {
				//     img: server_url+process.env.PUBLIC_URL + 'assets/images/thumb-img.png',
				//     username: 'username',
				//     title: 'giveaway title',
				//     date: 'DATE'
				// },
				//     {
				//         img: server_url+process.env.PUBLIC_URL + 'assets/images/thumb-img.png',
				//         username: 'username',
				//         title: 'giveaway title',
				//         date: 'DATE'
				//     },
				//     {
				//         img: server_url+process.env.PUBLIC_URL + 'assets/images/thumb-img.png',
				//         username: 'username',
				//         title: 'giveaway title',
				//         date: 'DATE'
				//     },
				//     {
				//         img: server_url+process.env.PUBLIC_URL + 'assets/images/thumb-img.png',
				//         username: 'username',
				//         title: 'giveaway title',
				//         date: 'DATE'
				//     },
				//     {
				//         img: server_url+process.env.PUBLIC_URL + 'assets/images/thumb-img.png',
				//         username: 'username',
				//         title: 'giveaway title',
				//         date: 'DATE'
				//     }
			],
			complete_coin_title: 'Complete actions for 10,0000 bonus entries',
			complete_coin_footer: 'use loyalty coins for more entries',
			complete_coin_footer_coins: '1234',
			complete_coins: [{
				icon: 'fa fa-facebook',
				label: 'follow sleepless elite on facebook',
				box_image: server_url + process.env.PUBLIC_URL + 'assets/images/leable-icon.png',
				coin_amount: '123'
			}, {
				icon: 'fa fa-twitter',
				label: 'follow sleepless elite on facebook',
				box_image: server_url + process.env.PUBLIC_URL + 'assets/images/leable-icon.png',
				coin_amount: '123'
			}, {
				icon: 'fa fa-twitch',
				label: 'follow sleepless elite on twitch',
				box_image: server_url + process.env.PUBLIC_URL + 'assets/images/leable-icon.png',
				coin_amount: '123'
			}, {
				icon: 'fa fa-youtube-play',
				label: 'follow sleepless elite on youtube',
				box_image: server_url + process.env.PUBLIC_URL + 'assets/images/leable-icon.png',
				coin_amount: '123'
			}, {
				icon: 'fa fa-steam',
				label: 'follow sleepless elite on Steam',
				box_image: server_url + process.env.PUBLIC_URL + 'assets/images/leable-icon.png',
				coin_amount: '123'
			},],
			bonus_coins_title: 'bonus entries',
			bonus_coins_footer: 'use global coins for more entries',
			bonus_coins_footer_coins: '123456789',
			bonus_coins: [
			// 	{
			// 	icon: 'fa fa-facebook',
			// 	label: 'follow sleepless elite on facebook',
			// 	box_image: server_url + process.env.PUBLIC_URL + 'assets/images/leable-icon.png',
			// 	coin_amount: '123'
			// }, {
			// 	icon: 'fa fa-twitter',
			// 	label: 'follow sleepless elite on twitter',
			// 	box_image: server_url + process.env.PUBLIC_URL + 'assets/images/leable-icon.png',
			// 	coin_amount: '123456'
			// }, {
			// 	icon: 'fa fa-twitch',
			// 	label: 'follow sleepless elite on twitch',
			// 	box_image: server_url + process.env.PUBLIC_URL + 'assets/images/leable-icon.png',
			// 	coin_amount: '123'
			// }, {
			// 	icon: 'fa fa-youtube-play',
			// 	label: 'follow sleepless elite on youtube',
			// 	box_image: server_url + process.env.PUBLIC_URL + 'assets/images/leable-icon.png',
			// 	coin_amount: '123'
			// }, {
			// 	icon: 'fa fa-steam',
			// 	label: 'follow sleepless elite on Steam',
			// 	box_image: server_url + process.env.PUBLIC_URL + 'assets/images/leable-icon.png',
			// 	coin_amount: '123'
			// },
		]
		}
		this.componentGracefulUnmount = this.componentGracefulUnmount.bind(this)
		this.LoadGiveway = this.LoadGiveway.bind(this)
	}

	componentGracefulUnmount() {
		this.setState({mounted: false});

		window.removeEventListener('beforeunload', this.componentGracefulUnmount);
		this.PostCoins()
	}

	getProfileImage = () => {
		let data = Object.assign({}, this.state.past_winners);
		var temp = []
		for (var i = 0; i < data.length; i++) {
			temp.push(data[i].username)
		}
		//TODO Load Image from AWS
		var xhr = new XMLHttpRequest();
		var url = BACKEND_API +  "profile/?username=" + temp;
		xhr.open("GET", url, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.setRequestHeader('Authorization', 'Token ' +  localStorage.getItem('token'))
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
					var json = JSON.parse(xhr.responseText);
					for (var i = 0; i < json.length; i++) {
						if (json[i]['img']) {
							var image = json[i]['img'].split('/')
							data[i].img = BACKEND_API + 'static/profile/' + image[7]

						}
					data[i].username = json[i]['username']
					}
					console.log(data)
					this.setState({past_winners:data})

				}
			}.bind(this);
		xhr.send();
	}
	LoadGiveway = () => {
		var pageurl = window.location.href.split('/')
		var temp = []
		var icon = []
		var usernames = []
		var label = []
		var host = []
		var past = []
		var xhr = new XMLHttpRequest();
		var url = BACKEND_API + "usergiveaway/?user=" + pageurl[3];
		xhr.open("GET", url, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				var json = JSON.parse(xhr.responseText);
				if (json.length != 0) {
					for (var i = 0; i < json.length; i++) {
					var expired = new Date(json[i].expire)
					var current = new Date()
						if (expired < current) {
							this.setState({past_winner_status:true})
							var image = json[i].image.split('/')
							var expire = json[i].expire.split('T')
							const data = {
					        img: BACKEND_API + 'static/giveaway/' + image[7],
									//TODO get actual userName
					        username: json[i].winner,
									//TODO get avatar
					        title: json[i].title,
					        date: expire[0]
							}
							past.push(data)
						}

				else {
					if (json[i].user != 'bonus') {
						var entries = json[i].entries.split(',')
						for (var y = 0; y < entries.length - 1; y++) {
							//usernames.push(entries[i].split(' ').splice(-1))
							temp.push(entries[y].split('/'))

						}

						var entries = []
						for (var x = 0; x < temp.length; x++) {
							const entry = {
								icon: temp[x][0],
								label: temp[x][1],
								box_image: server_url + 'assets/images/leable-icon.png',
								coin_amount: 100,
								username: temp[x][2]
							}
							entries.push(entry)
						}
					var image = json[i].image.split('/')
					var expire = this.calculateCountdown(json[i].expire)
					this.setState({giveaway_id:json[i].static_id})
					this.setState({giveaway_entries: entries})
					this.setState({giveaway_header_title: json[i].title})
					this.setState({giveaway_description: json[i].description})
					this.setState({giveaway_image: BACKEND_API + 'static/giveaway/' + image[7]})
					this.setState({giveaway_timeleft: json[i].expire})
					this.interval = setInterval(() => {
						const date = this.calculateCountdown(this.state.giveaway_timeleft);
						date ? this.setState(date) : this.stop();
					}, 1000);
					this.LoadEntries()
				}else {
					var bonustemp = []
					var bonusentries = json[i].entries.split(',')
					for (var y = 0; y < bonusentries.length - 1; y++) {
						//usernames.push(entries[i].split(' ').splice(-1))
						bonustemp.push(bonusentries[y].split('/'))

					}

					var bonusentries = []
					for (var w = 0; w < bonustemp.length; w++) {
						const entry = {
							icon: bonustemp[w][0],
							label: bonustemp[w][1],
							box_image: server_url + 'assets/images/leable-icon.png',
							coin_amount: 100,
							username: bonustemp[w][2]
						}
						bonusentries.push(entry)
					}
					this.setState({bonus_coins:bonusentries})
				}

				}

			}

		} if(this.state.giveaway_id === 0) {
					this.setState({active_giveaway: !this.state.active_giveaway})
				}
				this.setState({past_winners:past})

			}
		}.bind(this)

		xhr.send()
	}
	increasegold = () => {
		if (this.state.time == 20) {
			this.setState({time: 0})
			this.PostCoins()
		} else {
			this.setState({time: this.state.time + 1})
		}
		if (this.state.gameType != true) {
			this.setState({loyalty_coins: this.state.loyalty_coins + 20})
		}
		else{
			this.setState({global_coins: this.state.global_coins + 20})
		}
	}

	calculateCountdown(endDate) {
		let diff = (Date.parse(new Date(endDate)) - Date.parse(new Date())) / 1000;

		// clear countdown when date is reached
		if (diff <= 0) return false;

		const timeLeft = {
			years: 0,
			days: 0,
			hours: 0,
			min: 0,
			sec: 0,
			millisec: 0,
		};

		// calculate time difference between now and expected date
		if (diff >= (365.25 * 86400)) { // 365.25 * 24 * 60 * 60
			timeLeft.years = Math.floor(diff / (365.25 * 86400));
			diff -= timeLeft.years * 365.25 * 86400;
		}
		if (diff >= 86400) { // 24 * 60 * 60
			timeLeft.days = Math.floor(diff / 86400);
			diff -= timeLeft.days * 86400;
		}
		if (diff >= 3600) { // 60 * 60
			timeLeft.hours = Math.floor(diff / 3600);
			diff -= timeLeft.hours * 3600;
		}
		if (diff >= 60) {
			timeLeft.min = Math.floor(diff / 60);
			diff -= timeLeft.min * 60;
		}
		timeLeft.sec = diff;

		return timeLeft;
	}

	stop() {
		clearInterval(this.interval);
	}

	addLeadingZeros(value) {
		value = String(value);
		while (value.length < 2) {
			value = '0' + value;
		}
		return value;
	}

	LoadProfile() {
		//TODO Load Image from AWS
		if (this.state.gameType != true) {
			var pageurl = window.location.href.split('/')
			var xhr = new XMLHttpRequest();
			var url = BACKEND_API + "coins/?host=" + pageurl[3] ;
			xhr.open("GET", url, true);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4 && xhr.status === 200) {
					this.setState({host: pageurl[3]})
					var json = JSON.parse(xhr.responseText);
					var data = Object.assign({}, this.state.loyalty_coins)
					if (json.length != 0) {
						data = json[0].loyalty_coins
						this.setState({loyalty_coins: data})
						this.setState({static_id: json[0].static_id})

					}

				}
			}.bind(this);
			xhr.send()
		}else {
			var xhr = new XMLHttpRequest();
			var url = BACKEND_API + "globalcoins/";
			xhr.open("GET", url, true);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4 && xhr.status === 200) {
					var json = JSON.parse(xhr.responseText);
					if (json.length != 0) {
						this.setState({global_coins: json[0].global_coins})
					}

				}
			}.bind(this);
			xhr.send()
		}


	}

	setTimer = () => {
		// TODO check if stream is live and if live set timer if not do not set timer
		this.timerID = setInterval(
			() => this.increasegold(),
			60000
		);
	}
	setProgressTimer = () => {
		setInterval(
			() => {
				const limit_progress_value = this.state.progress_value
				if (limit_progress_value >= 100) {
					this.setState({
						progress_value: 1
					})
				} else {
					var d = Date(Date.now());
					//console.log(d.toString(),limit_progress_value)
					this.setState({
						progress_value: limit_progress_value + 1
					})
				}
			},
			600
		)
	}

	componentDidMount() {
		// TODO Load two ads make an array of objects with the url and img.
		// TODO Call API to get stream name, username, game, title, get viewers from google analyics, set srcurl with username for both chat and video
		// TODO Call API to get users coins and entries on current active giveaway.
		// TODO Load giveaway img, total entires, time left/time to end of giveaway, description, all entries and tokens earned per entry
		// TODO Load all past giveaway winners
		this.chackGameChannel()
		this.LoadGiveway()
		this.LoadAds()
		this.setProgressTimer()
		window.addEventListener('beforeunload', this.componentGracefulUnmount);
		ReactGA.initialize(GOOGLEANALYICS);
		var pageurl = window.location.href.split('/')
		ReactGA.pageview(pageurl[3]);
	}

	LoadFeaturedGameStreamers = () =>{
		var pageurl = window.location.href.split('/')
		var home = ''
		var type1 = []
		var xhr = new XMLHttpRequest();
		var url = BACKEND_API +  "featured_game_channels/?game=" + pageurl[3];
		xhr.open("GET", url, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				//type 0 Homepage with evemt, 1- homepage without event, 2 featured channel
					var json = JSON.parse(xhr.responseText);
					if (json.length != 0 ) {
						this.setTimer()
						this.setState({gameType:true})
					for (var i = 0; i < json.length; i++) {
						//TODO figure out the manual titles for game channels
						// var data = Object.assign({}, this.state.game_entry)
						// data.title = json[i].title
						// this.setState({game_entry:data})
						if (json[i].featureType == 0) {
							home = json[i].twitchName
							var iframe = document.getElementById('video');
							iframe.src = iframe.src + json[i].twitchName;
							iframe = document.getElementById('chat');
							iframe.src = iframe.src + pageurl[3] + '/chat?darkpopout';
							this.setState({stream_url:json[i].User})
						}
						else if (json[i].featureType == 1) {
							type1.push(json[i])
						}
					}
					if (home == '') {
						var max = type1.length
						max = Math.floor(Math.random() * Math.floor(max))
						var iframe = document.getElementById('video');
						iframe.src = iframe.src + json[max].twitchName;
						iframe = document.getElementById('chat');
						iframe.src = iframe.src + pageurl[3] + '/chat?darkpopout';
					}
					this.LoadProfile()
				}
				else {
					this.setState({
						online_status: !this.state.online_status
					})
				}
				}
			}.bind(this);
		xhr.send();
	}

	chackGameChannel = () => {
		//TODO Load Image from AWS

		var pageurl = window.location.href.split('/')
		var xhr = new XMLHttpRequest();
		var url = BACKEND_API + "profile/?username=" + pageurl[3];
		xhr.open("GET", url, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				this.setState({host: pageurl[3]})
				var json = JSON.parse(xhr.responseText);
				if (json.length != 0) {
					if (json[0].accountType != 'game') {
						this.LoadProfile()
						this.LoadStream()
					}
					else {
						this.LoadFeaturedGameStreamers()
						this.setState({gameType : true})
						var data = Object.assign({}, this.state.game_entry)
						data.game= pageurl[3]
						data.game_thumb = "https://static-cdn.jtvnw.net/ttv-boxart/Apex%20Legends-68x98.jpg"
						this.setState({game_entry: data})
					}

				}

			}
		}.bind(this);
		xhr.send()
	}

	LoadAds = () => {
		//TODO Load Image from AWS
		var xhr = new XMLHttpRequest();
		var url = BACKEND_API + "coins/";
		xhr.open("GET", url, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				var json = JSON.parse(xhr.responseText);

			}

		}//.bind(this);
		xhr.send()
	}

	LoadStream = function () {
		var pageurl = window.location.href.split('/')
		var temp = ''
		var lcoins = []
		var host = []
		var iframe = ''
		var xhr = new XMLHttpRequest();
		var url = BACKEND_API + "livechannels/?username=" + pageurl[3].toLowerCase();
		xhr.open("GET", url, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4 && xhr.status === 200 || xhr.status === 400) {
				var json = JSON.parse(xhr.responseText);
				if (json.length != 0) {
					var data = Object.assign({}, this.state.game_entry)
					data.user = pageurl[3]
					if ((json[0].title.indexOf('(\'') > -1) || (json[0].title.indexOf('("') > -1)) {
						data.title = json[0].title.slice(2, -3)
					} else {
						data.title = json[0].title

					}
					this.gameTwitchAPI(json[0].game_id)
					this.setState({game_entry: data})
					this.setTimer()
					iframe = document.getElementById('video');
					iframe.src = iframe.src + pageurl[3];
					iframe = document.getElementById('chat');
					iframe.src = iframe.src + pageurl[3] + '/chat?darkpopout';

				} else {
					//Set the prop to offline
					this.setState({
						online_status: !this.state.online_status
					})
				}
			}
		};
		var data = {
			host: pageurl[3].toLowerCase(),
		}
		host.push(data)
		xhr.send();

	}.bind(this);

	componentWillMount() {
		this.setState({mounted: true})
	}

	PostCoins = () => {
		if (this.state.gameType != true) {
			var pageurl = window.location.href.split('/')
			var temp = ''
			var lcoins = []
			var host = []
			var xhr = new XMLHttpRequest();
			var url = BACKEND_API + "coins/";
			xhr.open("POST", url, true);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4 && xhr.status === 200 || xhr.status === 400) {
					var json = JSON.parse(xhr.responseText);
					if (json != 0) {
						this.setState({static_id: json})
					}
				}
			}
			var data = {
				loyalty_coins: this.state.loyalty_coins,
				static_id: this.state.static_id,
				host: this.state.host
			}
			host.push(data)
			xhr.send(JSON.stringify(host));
		}else {
			var temp = ''
			var host = []
			var xhr = new XMLHttpRequest();
			var url = BACKEND_API + "globalcoins/";
			xhr.open("POST", url, true);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4 && xhr.status === 200 || xhr.status === 400) {
					var json = JSON.parse(xhr.responseText);
					if (json != 0) {
					}
				}
			}
			var data = {
				globalcoins: this.state.global_coins,
			}
			host.push(data)
			xhr.send(JSON.stringify(host));
		}

	}

	componentWillUnmount() {
		clearInterval(this.timerID);
		clearInterval(this.progress_timerId);
		this.componentGracefulUnmount()
		this.stop();
	}

	gameTwitchAPI = (gameID) => {
		var xhr = new XMLHttpRequest();
		var data = ''
		var url = 'https://api.twitch.tv/helix/games?id=' + gameID;
		xhr.open("GET", url, true);
		xhr.setRequestHeader("Client-ID", "i6ap8cz07np4bw33oeri8at8yzodxv");
		xhr.setRequestHeader("Accept", "application/vnd.twitchtv.v5+json");
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4 && xhr.status === 200 || xhr.status === 400) {
				var json = JSON.parse(xhr.responseText);
				var data = Object.assign({}, this.state.game_entry)
				data.game = json.data[0].name
				var thumbnail = json.data[0].box_art_url
				thumbnail = thumbnail.slice(0, -20)
				data.game_thumb = thumbnail + '68x98.jpg'
				this.setState({game_entry: data})
			}
		};
		xhr.send();
	}

	testingAPIs = () => {
		var xhr = new XMLHttpRequest();
		var url = BACKEND_API + "test/";
		xhr.open("GET", url, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4 && xhr.status === 200 || xhr.status === 400) {
				var json = JSON.parse(xhr.responseText);
			}
		};
		xhr.send();
	}

	LoadEntries = () =>{
		var xhr = new XMLHttpRequest();
		var url = BACKEND_API + "giveawayentries/?giveaway=" + this.state.giveaway_id;
		xhr.open("GET", url, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4 && xhr.status === 200 || xhr.status === 400) {
				var json = JSON.parse(xhr.responseText);
				try {
					var entered = json[0].giveaway_entries
					this.setState({giveaway_user_entered:entered})
					this.setState({giveaway_total_entries:json[0].credits})
					if (entered) {
						entered = entered.split(',')
						let data = Object.assign({}, this.state.giveaway_entries);
						for (var i = 0; i < entered.length -1; i++) {
							data[entered[i]].box_image = server_url + 'assets/images/img-4.jpg'
							data[entered[i]].coin_amount = ''
						}
					}
				} catch (e) {
				} finally {

				}
			}
		};
		xhr.send();
	}

	markGiveawayEntries = (index,coins) => {
		var entries = this.state.giveaway_user_entered
		if (!entries) {
			entries = index + ','
		}
		else {
			entries += index+','

		}
		var entered = entries.split(',')
		if (entered.length - 1 === this.state.giveaway_entries.length) {
			coins = coins + 10000
		}
	  var formdata = new FormData();
	  formdata.append("entries", entries)
		formdata.append('credits',coins)
		formdata.append("id", this.state.giveaway_id)
	  var xhr = new XMLHttpRequest();
	  var url = BACKEND_API +  "giveawayentries/";
	  xhr.open("POST", url, true);
	  xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
	  xhr.onreadystatechange = function () {
	    if (xhr.readyState === 4 && xhr.status === 200) {
	        var json = JSON.parse(xhr.responseText);
					console.log('markGiveawayEntries')
					this.setState({giveaway_user_entered:entries})
					this.LoadEntries()
	      }
	    }.bind(this)
	  xhr.send(formdata);
	}

	postUserEntries = (coins) => {
	  var formdata = new FormData();
		formdata.append("entries", this.state.giveaway_user_entered)
		formdata.append("id", this.state.giveaway_id)
		formdata.append('credits',coins)
	  var xhr = new XMLHttpRequest();
	  var url = BACKEND_API +  "giveawayentries/";
	  xhr.open("POST", url, true);
	  xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
	  xhr.onreadystatechange = function () {
	    if (xhr.readyState === 4 && xhr.status === 200) {
	        var json = JSON.parse(xhr.responseText);
					this.setState({giveaway_total_entries:json[0].credits})
					this.LoadEntries()
	      }
	    }.bind(this)
	  xhr.send(formdata);
	}

	postLoyaltyEntries = () =>{
		if (this.state.gameType != true) {
			var coins = document.getElementById("loyaltyCoins")
			if (coins.value <= this.state.loyalty_coins) {
				// this.setState({giveaway_total_entries : this.state.giveaway_total_entries + coins.value})
				// var formdata = new FormData();
				// formdata.append("total", coins.value)
				// formdata.append("id", this.state.giveaway_id)
				// var xhr = new XMLHttpRequest();
				// var url = BACKEND_API +  "totalentries/";
				// xhr.open("POST", url, true);
				// xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
				// xhr.onreadystatechange = function () {
				// 	if (xhr.readyState === 4 && xhr.status === 200) {
				// 			var json = JSON.parse(xhr.responseText);
				// 			this.setState({giveaway_total_entries:json})
				 			this.setState({loyalty_coins: this.state.loyalty_coins - coins.value})
							this.postUserEntries(coins.value)
							coins.value = 0

					//	}
			//		}.bind(this)
			//	xhr.send(formdata);
			}
			else {
				alert('You dont have enough Loyalty Coins')
				var coins = document.getElementById("loyaltyCoins")
				coins.value = this.state.loyalty_coins
			}
		}else {
			var coins = document.getElementById("loyaltyCoins")
			if (coins.value <= this.state.global_coins) {
				this.setState({giveaway_total_entries : this.state.giveaway_total_entries + coins.value})
				// var formdata = new FormData();
				// formdata.append("total", coins.value)
				// formdata.append("id", this.state.giveaway_id)
				// var xhr = new XMLHttpRequest();
				// var url = BACKEND_API +  "totalentries/";
				// xhr.open("POST", url, true);
				// xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
				// xhr.onreadystatechange = function () {
				// 	if (xhr.readyState === 4 && xhr.status === 200) {
				// 			var json = JSON.parse(xhr.responseText);
				// 			this.setState({giveaway_total_entries:json})
				 			this.setState({global_coins: this.state.global_coins - coins.value})
							this.postUserEntries(coins.value)
							coins.value = 0

				//		}
				//	}.bind(this)
			//	xhr.send(formdata);
			}
			else {
				alert('You dont have enough Global Coins')
				var coins = document.getElementById("loyaltyCoins")
				coins.value = this.state.global_coins
			}
		}


	}


	//Join entry function
	handleJoinEntry = (entry_link,username,index,coins)=> {
		var entered = this.state.giveaway_user_entered
		let data = ''
		let found = false
		let url = ''
		try {
			entered = entered.split(',')
			if (!entered.includes(index.toString())) {
				switch(entry_link) {
			case 'JOIN DISCORD':
			url = 'https://discord.gg/9pnykXs';
			window.open(url, '_blank');
			var entries = this.state.giveaway_entries
			data = Object.assign({}, this.state.giveaway_entries);
			data[index].box_image = server_url + 'assets/images/img-4.jpg'
			data[index].coin_amount = ''
			this.setState(data)
			this.markGiveawayEntries(index,coins)

				// code block
				break;
			case 'FOLLOW ON TWITCH':
			var entries = this.state.giveaway_entries
			data = Object.assign({}, this.state.giveaway_entries);
			data[index].box_image = server_url + 'assets/images/img-4.jpg'
			data[index].coin_amount = ''
			this.setState(data)
				this.markGiveawayEntries(index,coins)

				// code block
				break;
			case 'WATCH YOUTUBE VIDEO':
			url = 'https://discord.gg/9pnykXs';
			window.open(url, '_blank');
			var entries = this.state.giveaway_entries
			data = Object.assign({}, this.state.giveaway_entries);
			data[index].box_image = server_url + 'assets/images/img-4.jpg'
			data[index].coin_amount = ''
			this.setState(data)
				this.markGiveawayEntries(index,coins)

				// code block
			break;
			case 'RETWEET ON TWITTER':
			var entries = this.state.giveaway_entries
			data = Object.assign({}, this.state.giveaway_entries);
			data[index].box_image = server_url + 'assets/images/img-4.jpg'
			data[index].coin_amount = ''
			this.setState(data)
				this.markGiveawayEntries(index,coins)

						// code block
				break;
			case 'VISIT FACEBOOK PAGE':
			var entries = this.state.giveaway_entries
			data = Object.assign({}, this.state.giveaway_entries);
			data[index].box_image = server_url + 'assets/images/img-4.jpg'
			data[index].coin_amount = ''
			this.setState(data)
				this.markGiveawayEntries(index,coins)

				// code block
				break;
			case 'JOIN STEAM GROUP':
			var entries = this.state.giveaway_entries
			data = Object.assign({}, this.state.giveaway_entries);
			data[index].box_image = server_url + 'assets/images/img-4.jpg'
			data[index].coin_amount = ''
			this.setState(data)
				this.markGiveawayEntries(index,coins)
				break;
			case 'VISIT WEBSITE':

				url = 'https://' + username;
				window.open(url, '_blank');
				var entries = this.state.giveaway_entries
				data = Object.assign({}, this.state.giveaway_entries);
				data[index].box_image = server_url + 'assets/images/img-4.jpg'
				data[index].coin_amount = ''
				this.setState(data)
				this.markGiveawayEntries(index,coins)

			 break;
			default:
				// code block
		}
			}
		} catch (e) {
			switch(entry_link) {
		case 'JOIN DISCORD':
		url = 'https://discord.gg/9pnykXs';
		window.open(url, '_blank');
		var entries = this.state.giveaway_entries
		data = Object.assign({}, this.state.giveaway_entries);
		data[index].box_image = server_url + 'assets/images/img-4.jpg'
		data[index].coin_amount = ''
		this.setState(data)
			this.markGiveawayEntries(index,coins)

			// code block
			break;
		case 'FOLLOW ON TWITCH':
		var entries = this.state.giveaway_entries
		data = Object.assign({}, this.state.giveaway_entries);
		data[index].box_image = server_url + 'assets/images/img-4.jpg'
		data[index].coin_amount = ''
		this.setState(data)
			this.markGiveawayEntries(index,coins)

			// code block
			break;
		case 'WATCH YOUTUBE VIDEO':
		var entries = this.state.giveaway_entries
		data = Object.assign({}, this.state.giveaway_entries);
		data[index].box_image = server_url + 'assets/images/img-4.jpg'
		data[index].coin_amount = ''
		this.setState(data)
			this.markGiveawayEntries(index,coins)

			// code block
		break;
		case 'RETWEET ON TWITTER':
		var entries = this.state.giveaway_entries
		data = Object.assign({}, this.state.giveaway_entries);
		data[index].box_image = server_url + 'assets/images/img-4.jpg'
		data[index].coin_amount = ''
		this.setState(data)
			this.markGiveawayEntries(index,coins)
					// code block
			break;
		case 'VISIT FACEBOOK PAGE':
		var entries = this.state.giveaway_entries
		data = Object.assign({}, this.state.giveaway_entries);
		data[index].box_image = server_url + 'assets/images/img-4.jpg'
		data[index].coin_amount = ''
		this.setState(data)
			this.markGiveawayEntries(index,coins)

			// code block
			break;
		case 'JOIN STEAM GROUP':
		var entries = this.state.giveaway_entries
		data = Object.assign({}, this.state.giveaway_entries);
		data[index].box_image = server_url + 'assets/images/img-4.jpg'
		data[index].coin_amount = ''
		this.setState(data)
				this.markGiveawayEntries(index,coins)
			break;
		case 'VISIT WEBSITE':

			url = 'https://' + username;
			window.open(url, '_blank');
			var entries = this.state.giveaway_entries
			data = Object.assign({}, this.state.giveaway_entries);
			data[index].box_image = server_url + 'assets/images/img-4.jpg'
			data[index].coin_amount = ''
			this.setState(data)
			this.markGiveawayEntries(index,coins)

		 break;
		default:
			// code block
		}
		}


	}
	render() {
		const countDown = this.state;

		return (
			<div>
				<div className="body-container container-fluid">
					<div className="row">
						<SideBar/>
						<div className="col-md-9">
							{
								this.state.online_status ? <div className={"live-stream-featured-links row"}>
									<div className="col-md-8 bg-gray mar-bot30 gutter">
										<div className="embed-responsive embed-responsive-16by9">
											<iframe id="video" className="embed-responsive-item"
											        src="https://player.twitch.tv/?channel="></iframe>
										</div>
										<div className="col-md-7 col-sm-12 padding-top20">
											<div className="col-md-2 gutter mo-de-img">
												<button className={"img-button"}>
													<img alt={"game thumbnail"}
													     id='thumbnail'
													     src={this.state.game_entry.game_thumb}
													     className="img-responsive m-b-30"/>
												</button>
											</div>
											<div className="col-md-10 uppercase font-normal">
												<div>
													<h3 className=" border-bottom">{this.state.game_entry.title}</h3>
													<h2 className=" color-blue gutter">{this.state.game_entry.user}</h2>
													<h4 className="gutter">{this.state.game_entry.game}</h4>
													<h5>viewers | {this.state.game_entry.viewers}</h5>
												</div>
											</div>
											<div className="clearfix"/>
										</div>
										<div className="col-md-5 col-sm-12 padding-top20">
											{
												this.state.gameType === true ?
												<div style={{fontSize: '16px'}}><span style={{fontSize: '20px'}}><i
													className="fa fa-database database" aria-hidden="true"/></span> <span
													className="border-yellow">{this.state.global_coins}</span></div>
											:
											<div style={{fontSize: '16px'}}><span style={{fontSize: '20px'}}><i
												className="fa fa-database database" aria-hidden="true"/></span> <span
												className="border-yellow">{this.state.loyalty_coins}</span></div>
											}
											<div className="progr padding-top20">
												<ul>
													<li className="progress-li">
														<div className="progress">
															<div className="progress-bar" role="progressbar"
															     style={{width: this.state.progress_value + '%'}}/>
														</div>
													</li>
													<li style={{fontSize: '16px'}}><i
														className="fa fa-database database"
														aria-hidden="true"/></li>
													<li>{this.state.game_entry.coins_per_minute}</li>
												</ul>
											</div>
											<div className="clearfix"/>
										</div>
									</div>
									<div className="col-md-4 live-stream-ads">
										{this.state.ads_channels.map((ads_channel, index) => {
											return (
												<Link key={index} to={ads_channel.url}>
													<img alt={"ads channel"}
													     src={ads_channel.img}
													     className="img-responsive img-but"/>
												</Link>
											)
										})}
									</div>
								</div> : <div></div>
							}

							<div className="  m-b-30" style={{display: 'flex', position: 'relative'}}>
								{
									this.state.active_giveaway ?
										<div className="col-lg-7 col-md-12  bg-gray p-t20">
											<h1 className="uppercase p-t-15">{this.state.giveaway_header_title}</h1>
											<div className="col-lg-6 col-md-6 col-sm-12">
												<img alt={"thumbnail"}
												     id='thumbnail'
												     src={this.state.giveaway_image}
												     className="img-responsive img-but"/></div>
											<div className="col-lg-6 col-md-6 col-sm-12 center">
												<div
													className="own-btn btn btn-blue btn-primary uppercase">entries: {this.state.giveaway_total_entries}</div>
												<div className="own-btn btn btn-blue btn-primary uppercase">Time
													Left: {this.state.days}d {this.state.hours}h {this.state.min}m {this.state.sec}s
												</div>
												<p className="uppercase padding-top20">{this.state.giveaway_description}</p>
											</div>
											<div className="col-md-12"><p
												className="center padding-top20 uppercase">{this.state.complete_coin_title}</p>
											</div>
											<div className="col-md-12 bg-black dis-inline ">
												<div className="hyperex padding-top20">
													<ul>
														{this.state.giveaway_entries.map((complete_coin, index) => {
															return (
																<li key={index}>
																	<button   className={"btn-bg-trans btn_join_entry"}
																	          onClick={() => this.handleJoinEntry(complete_coin.label,complete_coin.username,index,complete_coin.coin_amount)}>
																	<div className="flout-left s-f">

							                                                  <span>
						                                                         <i className={complete_coin.icon}
						                                                         aria-hidden="true"/>
							                                                  </span>
																																{complete_coin.label}


																	</div>
																	<div className="flout-right s-f bg-gray">
																		<div>
																			<button className={"img-button"}>
																				<img alt={"box thumbnail"}
																				     src={complete_coin.box_image}
																				     className="img-responsive leable-img"/>
																			</button>
																			{complete_coin.coin_amount}
																		</div>
																	</div>
																	</button>
																</li>

															)
														})}
													</ul>
													<div className="flout-left">
														<p className="text-but">{this.state.complete_coin_footer}</p>
													</div>
													<div className="flout-right">
														<div className="bot-listing">
															<ul>
																<li><i className="fa fa-database database"
																       aria-hidden="true"/>
																</li>
																<input type = 'number'className="bg-gray" id = 'loyaltyCoins'></input>
																<li>
																	<button
																		className="own-btn btn btn-gray btn-primary uppercase"
																		onClick={this.postLoyaltyEntries}>Enter

																	</button>
																</li>
															</ul>
														</div>
													</div>
												</div>
											</div>
											<div className="col-md-12"><p
												className="center padding-top20 uppercase">{this.state.bonus_coins_title}</p>
											</div>
											<div className="col-md-12 bg-black dis-inline mar-bot30">
												<div className="hyperex padding-top20">
													<ul>
														{this.state.bonus_coins.map((bonus_coin, index) => {
															return (
																<li key={index}>
																	<div className="flout-left s-f">
                                                  <span>
                                                      <i className={bonus_coin.icon}
                                                         aria-hidden="true"/>
                                                  </span>
																		{bonus_coin.label}
																	</div>
																	<div className="flout-right s-f bg-gray">
																		<div>
																			<button className={"img-button"}>
																				<img alt={"box thumbnail"}
																				     src={bonus_coin.box_image}
																				     className="img-responsive leable-img"/>
																			</button>
																			{bonus_coin.coin_amount}
																		</div>
																	</div>
																</li>
															)
														})}
													</ul>
													<div className="flout-left"><p
														className="text-but">{this.state.bonus_coins_footer}</p></div>
													<div className="flout-right">
														<div className="bot-listing">
															<ul>
																<li><i className="fa fa-database database"
																       aria-hidden="true"/>
																</li>
																<input type = 'number'className="bg-gray" id = 'globalCoins'></input>
																<li>
																	<button
																		className="own-btn btn btn-gray btn-primary uppercase"
																		onClick={this.postGlobalEntries}>Enter

																	</button>
																</li>
															</ul>
														</div>
													</div>
												</div>
											</div>
										</div> :
										''
								}

								{
									this.state.past_winner_status ?
										<div className="col-lg-5 col-md-12 col-sm-12 bg-gray p-b20 p-t20">
											<h1 className="uppercase center">past winners</h1>
											<div className="bg-black">
												<div className="past-winners">
													<ul>
														{this.state.past_winners.map((past_winner, index) => {
															return (
																<li key={index}>
																	<div className="flout-left">
																		<div className="flout-left">
																			<img alt={"past winner"}
																			     src={past_winner.img}
																			     className="img-responsive"/>
																		</div>
																		<div className="flout-right side-past-date">
																			<h2 className="color-blue uppercase">{past_winner.username}</h2>
																			<h4 className="uppercase">{past_winner.title}</h4>
																		</div>
																	</div>
																	<div
																		className="flout-right padding-top20">{past_winner.date}</div>
																</li>
															)
														})}

													</ul>
												</div>
											</div>
										</div> :
										''
								}

							</div>
						</div>
						<div className={"col-md-2 " + (this.state.online_status ? '' : 'bg-gray')}>
							<div className="">
								{
									this.state.online_status ?
										<div>
											<div className="chat-bg">
												<iframe title="Chat" id="chat" src="https://www.twitch.tv/embed/"
												        frameBorder="0" scrolling="no" height="800" width="350"
												        theme="dark"/>
											</div>
											<div className="clearfix"/>
										</div>
										:
										<div>
											<img alt={"background"}
											     src={server_url + process.env.PUBLIC_URL + 'assets/images/img5.png'}
											     className="img-responsive img-but padding-top20 p-b20"/>
											<img alt={"background"}
											     src={server_url + process.env.PUBLIC_URL + 'assets/images/img5.png'}
											     className="img-responsive img-but p-b20"/>
										</div>
								}
							</div>
						</div>
					</div>
					<div className="clearfix"/>
				</div>
			</div>
		)
	}
}

export default LiveStream
