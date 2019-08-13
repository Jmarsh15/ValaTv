import React from 'react'
import SideBar from "./sidebar";
import { Link } from 'react-router-dom'
import {server_url} from "../utility";
import {BACKEND_API,GOOGLEANALYICS} from "../utility";
import ReactGA from 'react-ga';

class GameLive extends React.Component {
    state = {
        game_category: {
            img: null,
            game_title: null,
        },
        stream_entries: []
    }
    componentDidMount(){
      //TODO Call my API for current streamers and give it gameID to return only current live channels streaming that game
      // TODO Make an array of objects setting username,Title, thumbnail, and get users avatar from profile API call and users url for channel.
      //this.LoadStreams()
      this.gameTwitchAPI()
      ReactGA.initialize(GOOGLEANALYICS);
      var pageurl = window.location.href.split('/')
      var game = pageurl[4].split('%20').join(' ')
      ReactGA.pageview(game);
    }

    getViewerCount = (games) => {
      var order = []

      var pageurl = window.location.href.split('/')
      var xhr = new XMLHttpRequest();
      var url = BACKEND_API + "getcurrentviewers/?page=" + games;
      xhr.open("GET", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200 || xhr.status === 400) {
          var json = JSON.parse(xhr.responseText);
          var categories = this.state.stream_entries
          for (var i = 0; i < json.length; i++) {
            for (var y = 0; y < categories.length; y++) {
                  if (categories[y].user_name === json[i].page ) {
                    categories[y].viewer_count = json[i].viewer_count
                  }
                  else if (!categories[y].viewer_count) {
                    categories[y].viewer_count = 0
                  }
          }
        }
          categories = categories.sort(function(a, b){return b.viewer_count - a.viewer_count})
          this.setState({stream_entries:categories})
        }
      };
      xhr.send();
    }
    gameTwitchAPI = () => {
      var pageurl = window.location.href.split('/')
      var game = pageurl[4].split('%20').join(' ')
      var games = []
      var xhr = new XMLHttpRequest();
      var data = ''
      var url = 'https://api.twitch.tv/helix/games?name=' + game;
      xhr.open("GET", url, true);
      xhr.setRequestHeader("Client-ID", "i6ap8cz07np4bw33oeri8at8yzodxv");
      xhr.setRequestHeader("Accept", "application/vnd.twitchtv.v5+json");
      xhr.onreadystatechange = () => {
           if (xhr.readyState === 4 && xhr.status === 200 || xhr.status === 400) {
             var json = JSON.parse(xhr.responseText);
              var data = Object.assign({}, this.state.game_category)
              var thumbnail = json.data[0].box_art_url
              thumbnail = thumbnail.slice(0,-20)
              data.img = thumbnail + '181x243.jpg'
              data.game_title = json.data[0].name
              this.LoadStreams(json.data[0].id,thumbnail)

              this.setState({game_category:data})
           }
      };
      xhr.send();
    }

    LoadStreams = (gameId,gameart) => {
      var pageurl = window.location.href.split('/')
      var live = []
      var title = ''
      var channels = []
      var xhr = new XMLHttpRequest();
      var url = BACKEND_API +  "livechannels/";
      xhr.open("GET", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
      xhr.onreadystatechange = () => {
           if (xhr.readyState === 4 && xhr.status === 200 || xhr.status === 400) {
             var json = JSON.parse(xhr.responseText);
              for (var i = 0; i < json.length; i++) {
                if (json[i].game_id === gameId) {
                  var thumbnail = json[i].thumbnail_url
                  thumbnail = thumbnail.slice(0,-20)
                  if((json[i].title.indexOf('(\'') > -1) || (json[i].title.indexOf('("') > -1))
                  {
                    title = json[i].title.slice(2,-3)
                  }
                  else {
                    title =json[i].title

                  }
                  if((thumbnail.indexOf('(\'') > -1) || (thumbnail.indexOf('("') > -1))
                  {
                    thumbnail = thumbnail.slice(2,-3)
                  }
                  else {
                    thumbnail =thumbnail

                  }
                  channels.push([json[i].user_name])
                  const liveChannel = {
                    url: '/'+json[i].user_name + '/',
                    main_img: thumbnail + '310x176.jpg',
                    user_img: gameart +'47x47.jpg',
                    stream_title: title,
                    user_name: json[i].user_name
                  }
                  live.push(liveChannel)
                }
              }
              this.getViewerCount(channels)
              this.setState({stream_entries: live})
           }
      };

      xhr.send();
    };
    render() {
        return (
            <div>
                <div className="body-container container-fluid">
                    <div className="row">
                        <SideBar/>
                        <div className="col-md-11">
                            <div>
                                <div className="width-50 flout-left">
                                    <div className="flout-left">
                                        <button className={"img-button"}>
                                            <img alt={"game category"}
                                                src={this.state.game_category.img} className="img-responsive img-but"/>
                                        </button>
                                    </div>
                                    <div className="stream-headline">
                                        <h1 className="uppercase"
                                            style={{fontSize: '20px', color: '#fff', margin: 0, padding: 0}}>
                                            {this.state.game_category.game_title} </h1>
                                    </div>
                                </div>
                                <div className="width-50 flout-right">
                                    <div className="side-cate-head">
                                        <h1 className="uppercase">categories</h1>
                                    </div>
                                </div>
                            </div>
                            <div className="clearfix"/>
                            <hr/>
                            <div className="category-listing2">
                                <ul>
                                    {this.state.stream_entries.map((stream_entry, index) => {
                                        return (
                                            <li key={index}>
                                                <Link to={stream_entry.url}>
                                                    <img alt={"stream entry"}
                                                        src={stream_entry.main_img}
                                                         className="img-responsive img-thumbnail-live"/>
                                                </Link>
                                                <div>
                                                    <div className="flout-left m-r-20">
                                                        <img alt={"stream entry"}
                                                            src={stream_entry.user_img}
                                                             className="img-responsive img-gamethumbnail-live"/>
                                                    </div>
                                                    <div className='tw-ellipsis live-title'>
                                                        <gg>{stream_entry.stream_title}</gg>
                                                    </div>
                                                    <div className = 'tw-ellipsis live-username'>
                                                      <h6>{stream_entry.user_name}</h6>
                                                    </div>

                                                </div>
                                            </li>
                                        )
                                    })}

                                </ul>
                            </div>
                            <div className="footer-top-gap"/>
                        </div>
                        <div className="clearfix"/>
                    </div>
                </div>
            </div>
        )
    }
}

export default GameLive
