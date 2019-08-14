import React from 'react'
import {Link} from 'react-router-dom'
import {server_url} from '../utility/index'
import {BACKEND_API} from "../utility";
class SideBar extends React.Component {
    state = {
        sidebar_icons: [
        //   {
        //     img: process.env.PUBLIC_URL + 'assets/images/img-1.png',
        //     url: '/sidebar_link'
        // }, {
        //     img: process.env.PUBLIC_URL + 'assets/images/img-1.png',
        //     url: '/sidebar_link'
        // }, {
        //     img: process.env.PUBLIC_URL + 'assets/images/img-1.png',
        //     url: '/sidebar_link'
        // }, {
        //     img: process.env.PUBLIC_URL + 'assets/images/img-1.png',
        //     url: '/sidebar_link'
        // }, {
        //     img: process.env.PUBLIC_URL + 'assets/images/img-1.png',
        //     url: '/sidebar_link'
        // },
      ]
    }
    LoadStreamers = () =>{
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
            if (json[i].featureType == 1) {
                type1.push(json[i])
              }
            else{
              type2.push(json[i])
            }
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
                  thumbnail = thumbnail + '107x97.jpg'
                  const data = {
                      img : thumbnail,
                      gameid : json[0].game_id,
                      url : '/'+list[i].User+'/'
                      }
                  live.push(data)

            }
          }.bind(this)
        xhr.send();
      }
      this.setState({sidebar_icons:live})
    }

    componentDidMount(){
      this.LoadStreamers()

    }
    render() {
        return (

                <div className="col-md-1 hide-side-bar">
                    <div className="live-stream">
                        <ul>
                            {this.state.sidebar_icons.map((sidebar_icon, index) => {
                                return (
                                    <li key={index}>
                                        <Link to={sidebar_icon.url}>
                                            <img alt={"side thumbnail"}
                                                src= {sidebar_icon.img}/>
                                        </Link>
                                    </li>

                                )
                            } )}
                        </ul>
                    </div>
                </div>
        )
    }
}

export default SideBar
