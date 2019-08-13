import React from 'react'
import {Link} from 'react-router-dom'
import {BACKEND_API,GOOGLEANALYICS} from "../utility";
import ReactGA from 'react-ga';
class Home extends React.Component {

    state = {
        stream_url: '/twitch_url',
        user_name: 'sleeplesselitetv',
        ads_channels: [{
            img: process.env.PUBLIC_URL + 'assets/images/img.png',
            url: '/user1/giveway'
        },{
            img: process.env.PUBLIC_URL + 'assets/images/img.png',
            url: '/user2/giveway'
        }],
        featured_channels: [

        ],
        browse_giveaways: [

      ]
    }
    LoadStreamers = () =>{
      var home = ''
      var type1 = []
      var type2 = []
      var xhr = new XMLHttpRequest();
      var url = BACKEND_API +  "featured_channels/";
      xhr.open("GET", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      //xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          //type 0 Homepage with evemt, 1- homepage without event, 2 featured channel
            var json = JSON.parse(xhr.responseText);
            for (var i = 0; i < json.length; i++) {
              if (json[i].featureType == 0) {
                home = json[i].twitchName
                var iframe = document.getElementById('video');
                iframe.src = iframe.src + json[i].twitchName;
                this.setState({stream_url:json[i].User})
              }
              else if (json[i].featureType == 1) {
                type1.push(json[i])
              }
              else{
                type2.push(json[i])
              }
            }
            if (home == '') {
              var max = type1.length
              max = Math.floor(Math.random() * Math.floor(max))
              var iframe = document.getElementById('video');
              iframe.src = iframe.src + json[max].twitchName;
              this.setState({stream_url:json[max].User})
              type1.splice(max, 1);
            }

            if (type1.length < 6) {
              type1 = type1.concat(type2)
            }
            this.LoadWebhooks(type1)
          }
        }.bind(this);
      xhr.send();
    }


    LoadWebhooks = (list) => {
      var live = []
      var xhr = new XMLHttpRequest();
      var thumbnail = ''
      for (var i = 0; i < list.length; i++) {
        var url = BACKEND_API +  "livechannels/?username=" +list[i].twitchName;
        xhr.open("GET", url, false);
        xhr.setRequestHeader("Content-Type", "application/json");
        //xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            if((json[0].thumbnail_url.indexOf('(\'') > -1) || (json[0].thumbnail_url.indexOf('("') > -1))
            {
              thumbnail = json[0].thumbnail_url.slice(2,-3)
            }
            else {
              thumbnail =json[0].thumbnail_url

            }
                  thumbnail = thumbnail.slice(0,-20)
                  thumbnail = thumbnail + '770x435.jpg'
                  const data = {
                      img : thumbnail,
                      gameid : json[0].game_id,
                      url : list[i].User
                      }
                  live.push(data)

            }
          }.bind(this)
        xhr.send();
      }
      this.setState({featured_channels:live})
    }
    LoadAdSense = () => {
      // TODO Load adsense ads
    }

    LoadGiveaways = () => {
      // TODO Load giveaways for the 4 featured locations on bottom of page
      var featured = []
      var ad = []
      var xhr = new XMLHttpRequest();
      var url = BACKEND_API +  "featured_giveaways/";
      xhr.open("GET", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      //xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            for (var i = 0; i < json.length; i++) {
              if (json[i].featureType === 1) {
                var image = json[i].image.split('/')
                const data = {
                  img : BACKEND_API + 'static/giveaway/' + image[7],
                  url : json[i].user
                  }
                  if (featured.length != 4) {
                    featured.push(data)
                  }
              }
              else if (json[i].featureType === 0) {
                var image = json[i].image.split('/')
                const data = {
                  img : BACKEND_API + 'static/giveaway/' + image[7],
                  url : json[i].user
                  }
                  if (ad.length != 2) {
                    ad.push(data)
                  }
              }
              }

            this.setState({browse_giveaways:featured})
            this.setState({ads_channels:ad})
          }
        }.bind(this)
      xhr.send();
    }


    componentDidMount(){
      //TODO Load two ads make an array of objects with the url and img.
      //TODO Load five featured channels make an array of objects with the url and img.
      // TODO Load the featured frontpage streamer twitch username and url
      // TODO Load google adsense
      // TODO Load 4 featured giveways make an array of objects with the url and img.
      this.LoadStreamers()
      this.LoadGiveaways()
      //this.LoadAds()
      this.LoadAdSense()
      ReactGA.initialize(GOOGLEANALYICS);
      ReactGA.pageview('homepage');
      (window.adsbygoogle = window.adsbygoogle || []).push({});

    }
    render() {
      const style = {
			display: 'block',
		};
        return (
            <div>
                <div className="body-container container-fluid">
                    <div id="gap">
                        <div className="row">
                            <div className="col-lg-5 col-md-5 col-sm-12">
                                <div className="col-md-12">
                                  <Link to={this.state.stream_url}>
                                    <div className="embed-responsive embed-responsive-16by9">
                                      <iframe id="video"className="embed-responsive-item"src="https://player.twitch.tv/?channel="></iframe>
                                    </div>
                                    <button className={ "front"}>

                                       </button>
                                </Link>
                                </div>
                            </div>
                            <div className="col-lg-7 col-md-7 col-sm-12">
                                {this.state.ads_channels.map((ads_channel, index) => {
                                    return (
                                        <div key={index} className="col-lg-6 col-md-6 col-sm-12">
                                            <Link to={ads_channel.url}>
                                                <img alt={"ads channel"} src={ads_channel.img}
                                                     className="home-first-row img-responsive img-but "/>
                                            </Link>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="row">
                        <h1 className="center">Featured Channels</h1>
                        <div className="featured-channels">
                            <ul className={"featured-channels-image"}>
                                {this.state.featured_channels.map((featured_channel, key) => {
                                    return (
                                        <li key={key}>
                                            <Link to={featured_channel.url}>
                                                <img alt={"featured channel"}
                                                    src={featured_channel.img} className="img-responsive img-but"/>
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="browse-channels">
                            <div className="col-md-12">
                                <Link to={"/category"}>
                                    <h1>Browse Channels</h1>
                                </Link>
                                <div className={"browse-channel-img"}>
                                  <ins className="adsbygoogle"
                                    style={style}
                                    data-adtest="on"
                                    >
                                  </ins>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="row" id="gap">
                        <div className="featured-giveaways col-md-12">
                            <h1 className="center">Featured Giveaways</h1>
                            {this.state.browse_giveaways.map((browse_giveaway, index) => {
                                return (
                                    <div key={index} className="col-lg-3 col-md-3 col-sm-12">
                                        <Link to={browse_giveaway.url}>
                                        <img alt={"browse giveaway"}
                                            src={browse_giveaway.img}
                                        className="img-responsive img-but"/>
                                        </Link>
                                    </div>
                                )
                            })}

                        </div>
                        <Link to={"/giveaway"}>
                        <h1 className="browse-giveaway-letter">Browse Giveaways</h1>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home
