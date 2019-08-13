import React from 'react'
import {Link } from 'react-router-dom'
import SideBar from "./sidebar";
import {server_url} from "../utility";
//import * as qs from 'query-string';
import {BACKEND_API} from "../utility";
class LiveStream extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
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

        ads_channels : [{
            img: server_url+process.env.PUBLIC_URL + 'assets/images/img3.jpg',
            url: '/ads-channel1'
        },{
            img: server_url+process.env.PUBLIC_URL + 'assets/images/img3.jpg',
            url: '/ads-channel2'
        }],
        giveaway_header_title: '',
        giveaway_description :  '',
        giveaway_image: '',
        giveaway_total_entries: 0,
        giveaway_timeleft: '',
        game_entry: {
            game_thumb: null,
            user: '',
            game: '',
            title: '',
            viewers: '0',
            coins: 0,
            coins_per_minute: '+20',
            live_stream_ads_img: server_url+process.env.PUBLIC_URL + 'assets/images/img3.jpg'
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
            box_image: server_url+process.env.PUBLIC_URL + 'assets/images/leable-icon.png',
            coin_amount: '123'
        }, {
            icon: 'fa fa-twitter',
            label: 'follow sleepless elite on facebook',
            box_image: server_url+process.env.PUBLIC_URL + 'assets/images/leable-icon.png',
            coin_amount: '123'
        }, {
            icon: 'fa fa-twitch',
            label: 'follow sleepless elite on twitch',
            box_image: server_url+process.env.PUBLIC_URL + 'assets/images/leable-icon.png',
            coin_amount: '123'
        }, {
            icon: 'fa fa-youtube-play',
            label: 'follow sleepless elite on youtube',
            box_image: server_url+process.env.PUBLIC_URL + 'assets/images/leable-icon.png',
            coin_amount: '123'
        }, {
            icon: 'fa fa-steam',
            label: 'follow sleepless elite on Steam',
            box_image: server_url+process.env.PUBLIC_URL + 'assets/images/leable-icon.png',
            coin_amount: '123'
        },],
        bonus_coins_title : 'bonus entries',
        bonus_coins_footer: 'use loyalty coins for more entries',
        bonus_coins_footer_coins: '123456789',
        bonus_coins: [{
            icon: 'fa fa-facebook',
            label: 'follow sleepless elite on facebook',
            box_image: server_url+process.env.PUBLIC_URL + 'assets/images/leable-icon.png',
            coin_amount: '123'
        }, {
            icon: 'fa fa-twitter',
            label: 'follow sleepless elite on facebook',
            box_image: server_url+process.env.PUBLIC_URL + 'assets/images/leable-icon.png',
            coin_amount: '123456'
        }, {
            icon: 'fa fa-twitch',
            label: 'follow sleepless elite on twitch',
            box_image: server_url+process.env.PUBLIC_URL + 'assets/images/leable-icon.png',
            coin_amount: '123'
        }, {
            icon: 'fa fa-youtube-play',
            label: 'follow sleepless elite on youtube',
            box_image: server_url+process.env.PUBLIC_URL + 'assets/images/leable-icon.png',
            coin_amount: '123'
        }, {
            icon: 'fa fa-steam',
            label: 'follow sleepless elite on Steam',
            box_image: server_url+process.env.PUBLIC_URL + 'assets/images/leable-icon.png',
            coin_amount: '123'
        },]
    }
    this.componentGracefulUnmount = this.componentGracefulUnmount.bind(this)
    this.LoadGiveway = this.LoadGiveway.bind(this)
  }
  componentGracefulUnmount(){
            this.setState({mounted: false});

            window.removeEventListener('beforeunload', this.componentGracefulUnmount);
            this.PostCoins()
        }
    LoadGiveway= () => {
      var pageurl = window.location.href.split('/')
      var temp = []
      var icon = []
      var usernames = []
      var label = []
      var host = []
      var pastwinners = []
      var xhr = new XMLHttpRequest();
      var url = BACKEND_API +  "usergiveaway/?user=" + pageurl[3];
      xhr.open("GET", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          var json = JSON.parse(xhr.responseText);
          var d = new Date();
          var n = d.getUTCDate();

          if (json.length != 0) {
          for (var i = 0; i < json.length; i++) {
            var day = json[i].expire.split('-')
          if (day[2] >= n) {
              var entries = json[i].entries.split(',')
              for (var x = 0; x < entries.length - 1; x++) {
                //usernames.push(entries[i].split(' ').splice(-1))
                temp.push(entries[x].split('/'))
              }
              var entries = []
              for (var y = 0; y < temp.length; y++) {
               const entry = {
                 icon: temp[y][0],
                 label: temp[y][1] ,
                 box_image: server_url + 'assets/images/leable-icon.png',
                 coin_amount: '123',
                 username: temp[y][2]
              }
              entries.push(entry)
              }
               var image = json[i].image.split('/')
               var expire = this.calculateCountdown(json[i].expire)
               this.setState({giveaway_entries:entries})
              this.setState({giveaway_header_title:json[i].title})
              this.setState({giveaway_description:json[i].description})
              this.setState({giveaway_image:BACKEND_API + 'static/giveaway/' + image[7]})
              this.setState({giveaway_total_entries: json[i].totalentries})
              this.setState({giveaway_timeleft:json[i].expire})
              this.interval = setInterval(() => {
                const date = this.calculateCountdown(this.state.giveaway_timeleft);
                date ? this.setState(date) : this.stop();
              }, 1000);
            }
            else {
              //TODO add to recent winners
              const past = {
                img: server_url+process.env.PUBLIC_URL + 'assets/images/thumb-img.png',
                //username: json[i].winner,
                username:'temp',
                title: json[i].title,
                date: 'DATE ' + json[i].expire
              }
              pastwinners.push(past)
              this.setState({past_winner_status : true})
              this.setState({past_winners: pastwinners})
            }


        }
      }
      else {
        this.setState({active_giveaway: !this.state.active_giveaway})
      }
    }

        }.bind(this)
      xhr.send()
    }
    increasegold = () =>{
      var data = Object.assign({}, this.state.game_entry)
      if (this.state.time == 20) {
        this.setState({time : 0})
        this.PostCoins()
      }
      else {
        this.setState({time : this.state.time + 1})
      }
      data.coins += 20
      this.setState({game_entry: data})
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
    LoadProfile(){
      //TODO Load Image from AWS
      var pageurl = window.location.href.split('/')
      var temp = ''
      var lcoins = []
      var host = []
      var xhr = new XMLHttpRequest();
      var url = BACKEND_API +  "coins/?host=" + pageurl[3];
      xhr.open("GET", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          this.setState({host:pageurl[3]})

            var json = JSON.parse(xhr.responseText);
            var data = Object.assign({}, this.state.game_entry)
            if (json.length != 0) {
              data.coins = json[0].loyalty_coins
              this.setState({game_entry: data})
              this.setState({static_id:json[0].static_id})
            }

          }
        }.bind(this);
      var data = {
        host:pageurl[3]
      }
      host.push(data)
      //xhr.send(JSON.stringify(host));
      xhr.send()

    }
    setTimer = () =>{
      // TODO check if stream is live and if live set timer if not do not set timer
      this.timerID = setInterval(
      () => this.increasegold(),
      60000
      );
    }
    setProgressTimer = () => {
  		 setInterval(
  			() =>{
          const limit_progress_value = this.state.progress_value
  				if (limit_progress_value >= 100) {
  					this.setState({
  						progress_value: 1
  					})
  				}
          else {
            this.setState({
              progress_value: limit_progress_value+1
            })
          }
  			},
  			600
  		)
  	}
    componentDidMount(){
      // TODO Load two ads make an array of objects with the url and img.
      // TODO Call API to get stream name, username, game, title, get viewers from google analyics, set srcurl with username for both chat and video
      // TODO Call API to get users coins and entries on current active giveaway.
      // TODO Load giveaway img, total entires, time left/time to end of giveaway, description, all entries and tokens earned per entry
      // TODO Load all past giveaway winners
      this.LoadProfile()
      this.LoadStream()
      this.LoadGiveway()
      this.LoadAds()
      this.setProgressTimer()
      window.addEventListener('beforeunload', this.componentGracefulUnmount);
    }

    LoadAds = () => {
      //TODO Load Image from AWS
      var xhr = new XMLHttpRequest();
      var url = BACKEND_API +  "coins/";
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

    LoadStream= function() {
      var pageurl = window.location.href.split('/')
      var temp = ''
      var lcoins = []
      var host = []
      var iframe = ''
      var xhr = new XMLHttpRequest();
      var url = BACKEND_API +  "livechannels/?username=" + pageurl[3].toLowerCase();
      xhr.open("GET", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
      xhr.onreadystatechange = () => {
           if (xhr.readyState === 4 && xhr.status === 200 || xhr.status === 400) {
             var json = JSON.parse(xhr.responseText);

             if (json.length != 0) {
               var data = Object.assign({}, this.state.game_entry)
               data.user = pageurl[3]
               if((json[0].title.indexOf('(\'') > -1) || (json[0].title.indexOf('("') > -1))
               {
                 data.title = json[0].title.slice(2,-3)
               }
               else {
                 data.title =json[0].title

               }
               this.gameTwitchAPI(json[0].game_id)
               this.setState({game_entry: data})
               this.setTimer()
               iframe = document.getElementById('video');
               iframe.src = iframe.src + pageurl[3];
               iframe = document.getElementById('chat');
               iframe.src = iframe.src + pageurl[3] +'/chat?darkpopout';

             }
             else {
               //Set the prop to offline
               this.setState({
                 online_status: !this.state.online_status
               })
             }
           }
      };
      var data = {
        host:pageurl[3].toLowerCase(),
      }
      host.push(data)
      xhr.send();

    }.bind(this);

    componentWillMount(){
            this.setState({mounted: true})
        }
    PostCoins = () => {
      var pageurl = window.location.href.split('/')
      var temp = ''
      var lcoins = []
      var host = []
      var xhr = new XMLHttpRequest();
      var url = BACKEND_API +  "coins/";
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
      xhr.onreadystatechange = () => {
           if (xhr.readyState === 4 && xhr.status === 200 || xhr.status === 400) {
             var json = JSON.parse(xhr.responseText);
             if (json != 0) {
               this.setState({static_id:json})
             }
           }
      }
      var data = {
        loyalty_coins:this.state.game_entry.coins,
        static_id:this.state.static_id,
        host:this.state.host
      }
      host.push(data)
      xhr.send(JSON.stringify(host));
    }
    componentWillUnmount(){
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
             thumbnail = thumbnail.slice(0,-20)
             data.game_thumb = thumbnail + '68x98.jpg'
             this.setState({game_entry: data})
           }
         };
      xhr.send();
    }

testingAPIs = () => {
  var xhr = new XMLHttpRequest();
  var url = BACKEND_API +  "test/";
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
                <iframe id="video"className="embed-responsive-item"src="https://player.twitch.tv/?channel="></iframe>
              </div>
              <div className="col-md-7 col-sm-12 padding-top20">
                  <div className="col-md-2 gutter mo-de-img">
                      <button className={"img-button"}>
                      <img alt={"game thumbnail"}
                        id = 'thumbnail'
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
                <div style={{fontSize: '16px'}}><span style={{fontSize: '20px'}}><i
                  className="fa fa-database database" aria-hidden="true"/></span> <span
                  className="border-yellow">{this.state.game_entry.coins}</span></div>
                <div className="progr padding-top20">
                  <ul>
                    <li className="progress-li">
                      <div className="progress">
                        <div className="progress-bar" role="progressbar" style={{width: this.state.progress_value+'%'}} />
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
                    id = 'thumbnail'
                      src={this.state.giveaway_image}
                       className="img-responsive img-but"/></div>
                <div className="col-lg-6 col-md-6 col-sm-12 center">
                  <div className="own-btn btn btn-blue btn-primary uppercase">entries: {this.state.giveaway_total_entries}</div>
                  <div className="own-btn btn btn-blue btn-primary uppercase">Time Left:  {this.state.days}d {this.state.hours}h {this.state.min}m {this.state.sec}s
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
                          </li>

                        )
                      })}
                    </ul>
                    <div className="flout-left">
                      <p className="text-but">{this.state.complete_coin_footer}</p></div>
                    <div className="flout-right">
                      <div className="bot-listing">
                        <ul>
                          <li><i className="fa fa-database database" aria-hidden="true"/>
                          </li>
                          <li className="bg-gray">{this.state.complete_coin_footer_coins}</li>
                          <li>
                            <button
                              className="own-btn btn btn-gray btn-primary uppercase"
                              onClick={this.testingAPIs}>Enter

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
                          <li><i className="fa fa-database database" aria-hidden="true"/>
                          </li>
                          <li className="bg-gray">{this.state.bonus_coins_footer_coins}</li>
                          <li>
                            <button
                              className="own-btn btn btn-gray btn-primary uppercase"
                              onClick={this.gettestingAPIs}>Enter
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
                      <iframe title = "Chat" id= "chat" src="https://www.twitch.tv/embed/" frameBorder="0" scrolling="no" height="800" width="350" theme = "dark"/>
                </div>
                <div className="clearfix"/>
              </div>
              :
              <div>
                  <img alt={"background"}
                      src={server_url+process.env.PUBLIC_URL + 'assets/images/img5.png'}
                       className="img-responsive img-but padding-top20 p-b20"/>
                  <img alt={"background"}
                       src={server_url+process.env.PUBLIC_URL + 'assets/images/img5.png'}
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
