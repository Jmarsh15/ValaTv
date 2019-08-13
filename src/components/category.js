import React from 'react'
import {Link} from 'react-router-dom'
import SideBar from './sidebar'
import {server_url} from "../utility";
import {BACKEND_API,GOOGLEANALYICS} from "../utility";
import ReactGA from 'react-ga';

class Category extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
        categories : []
    }
  }
    componentDidMount(){
          //TODO Call my API to get all live users. Loop through all current live stream data for games. Make a list of current games being streamed
          // TODO call twitch API for game name and thumbnail image. Make an array of objects for game name, id, img. https://dev.twitch.tv/docs/api/reference/#get-games
          this.LoadLiveChannel()
          ReactGA.initialize(GOOGLEANALYICS);
          ReactGA.pageview('categories');
        }
        getViewerCount = (games) => {
          var order = []

      		var pageurl = window.location.href.split('/')
      		var xhr = new XMLHttpRequest();
      		var url = BACKEND_API + "getcurrentviewers/?page=" + games;
      		xhr.open("GET", url, true);
      		xhr.setRequestHeader("Content-Type", "application/json");
      		xhr.onreadystatechange = () => {
      			if (xhr.readyState === 4 && xhr.status === 200 || xhr.status === 400) {
      				var json = JSON.parse(xhr.responseText);
              var categories = this.state.categories
              for (var i = 0; i < json.length; i++) {
                for (var y = 0; y < categories.length; y++) {
                      if (categories[y].url.slice(7) === json[i].page ) {
                        categories[y].viewer_count = json[i].viewer_count
                      }
                      else if (!categories[y].viewer_count) {
                        categories[y].viewer_count = 0
                      }
              }
            }
              categories = categories.sort(function(a, b){return b.viewer_count - a.viewer_count})
              this.setState({categories:categories})
      			}
      		};
      		xhr.send();
      	}
        gameTwitchAPI = (gameID) => {
          var games = []
          var names = []
          var xhr = new XMLHttpRequest();
          var data = ''
          var url = 'https://api.twitch.tv/helix/games?=' + gameID;
          xhr.open("GET", url, true);
          xhr.setRequestHeader("Client-ID", "i6ap8cz07np4bw33oeri8at8yzodxv");
          xhr.setRequestHeader("Accept", "application/vnd.twitchtv.v5+json");
          xhr.onreadystatechange = () => {
               if (xhr.readyState === 4 && xhr.status === 200 || xhr.status === 400) {
                 var json = JSON.parse(xhr.responseText);
                 var data = Object.assign({}, this.state.categories)
                 if (json.data.length) {
                   for (var i = 0; i < json.data.length; i++) {
                     var thumbnail = json.data[i].box_art_url
                     thumbnail = thumbnail.slice(0,-20)
                     names.push(json.data[i].name)
                     const game = {
                       img:thumbnail + '181x243.jpg',
                       url:'/games/'+ json.data[i].name
                     }
                     games.push(game)
                   }
                 }
                 this.getViewerCount(names)
                  this.setState({categories: games})
               }
          };
          xhr.send();
        }
      LoadLiveChannel = () =>{
        var games = ''
        var xhr = new XMLHttpRequest();
        var url = BACKEND_API +"livechannels/";
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        //xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
        xhr.onreadystatechange = () => {
             if (xhr.readyState === 4 && xhr.status === 200 || xhr.status === 400) {
               var json = JSON.parse(xhr.responseText);
               for (var i = 0; i < json.length; i++) {
                  if (!games.includes(json[i].game_id)) {
                    games = games +'&id='+ json[i].game_id
                  }
               }
               if (games != '') {
                 this.gameTwitchAPI(games)

               }
             }
        };
        xhr.send();
      };
    render() {
        return (
            <div>
                <div className="body-container container-fluid">
                    <div className="row">

                        <SideBar />

                        <div className="col-md-11">
                            <h1 className="uppercase" style={{fontSize: '30px', color: '#fff', margin: 0, padding: 0}}>categories</h1>
                            <hr />
                            <div className="category-listing">
                                <ul>
                                    {this.state.categories.map((category, index) => {
                                        return (
                                            <li key={index}>
                                                <Link to={category.url}>
                                                    <img alt={"category thumb"}
                                                        src={category.img} className="img-responsive img-but" />
                                                </Link>
                                            </li>

                                        )
                                    })}
                                </ul>
                            </div>
                            <div className="footer-top-gap" />
                        </div>
                    </div>
                    <div className="clearfix" />
                </div>
            </div>
        )
    }
}
export default Category
