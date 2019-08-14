import React from 'react'
import SideBar from "./sidebar";
import {server_url} from "../utility";
import {BACKEND_API,GOOGLEANALYICS} from "../utility";
import ReactGA from 'react-ga';
import {Link} from 'react-router-dom'
class Giveaway extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
         featured_giveaways: [],
         other_giveaways: []
    }
  }
  LoadGiveaways = () => {
    // TODO Load giveaways for the 4 featured locations on bottom of page
    var featured = []
    var profile = ''
    var usernames = null
    var xhr = new XMLHttpRequest();
    var url = BACKEND_API +  "featured_giveaways/";
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    //xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
          var json = JSON.parse(xhr.responseText);
           for (var i = 0; i < json.length; i++) {
             var image = json[i].image.split('/')
             if (usernames === null) {
               usernames = json[i].user
             }
             else {
               usernames +=  ',' + json[i].user
             }

            const data = {
              url : json[i].user,
              title : json[i].title,
              username:json[i].user,
              img:BACKEND_API + 'static/giveaway/' + image[7]
              }
                featured.push(data)

           }
           this.setState({featured_giveaways:featured})
           this.getProfile(featured)
        }
      }.bind(this)
    xhr.send();
  }

  getProfile = (other) => {
    var state = other
    var featured = []
    var json = ''
    var xhr = new XMLHttpRequest();
    for (var i = 0; i < state.length; i++) {
      var url = BACKEND_API +  "getuserprofile/?username=" + state[i].username.toLowerCase();
      xhr.open("GET", url, false);
      xhr.setRequestHeader("Content-Type", "application/json");
      //xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
           json = xhr.responseText
           var image = json.split('/')
           const data = {
             game_img : BACKEND_API + 'static/profile/' + image[2],
             url : state[i].url,
             title : state[i].title,
             username:state[i].username,
             img:state[i].img
             }
             featured.push(data)
          }
        }.bind(this)
      xhr.send();
    }
    this.setState({other_giveaways:featured})

  }
componentDidMount(){
  // TODO Load 6 featured giveaways Make an array of objects using img,title and url.
  // TODO Load all other active giveaways make an array of objects using profile avatar, title, user_name, giveaway image and url.
  this.LoadGiveaways()
  ReactGA.initialize(GOOGLEANALYICS);
  ReactGA.pageview('Giveaways');
}

    render() {
        return (
            <div>
                <div className="body-container container-fluid">
                    <div className="row">
                        <SideBar/>

                        <div className="col-md-11">
                            <div className="col-md-12 mar-bot30">
                                <h1 className="uppercase center" style={{fontSize: '30px', color: '#fff'}}>featured
                                    giveaways</h1>
                                {this.state.featured_giveaways.map((giveaway, index) => {
                                    return (
                                        <div key={index} className="col-lg-4 col-md-4 col-md-12">
                                          <Link to={giveaway.url}>
                                            <h1 className="center uppercase margin-top20">{giveaway.title}</h1>
                                            <button className={"img-button"}>
                                                <img alt={"giveway thumb"}
                                                    src={giveaway.img} className="img-responsive"/>
                                            </button>
                                            <div className="center margin-top20 ">
                                                <button className="own-btn btn btn-blue btn-primary uppercase margin-bottom20">Enter
                                                </button>
                                            </div>
                                          </Link>
                                        </div>

                                    )
                                })}
                                <div className="center-box padding-top20">
                                    <div className="col-md-12 col-lg-12 col-sm-12 margin-top20">
                                        <h1 className="uppercase center"
                                            style={{fontSize: '30px', color: '#fff', paddingTop: '30px'}}>other
                                            giveaways</h1>
                                        <div className="bg-black">
                                            <div className="past-winners">
                                                <ul>
                                                    {this.state.other_giveaways.map((other_giveaway, index) => {
                                                        return (
                                                            <li key={index}>
                                                              <Link to={other_giveaway.url}>
                                                                <div className="flout-left full-w-left">
                                                                    <div className="flout-left">
                                                                        <button className={"img-button"}>
                                                                            <img alt={"othergiveaway"}
                                                                                src={other_giveaway.game_img}
                                                                                 className="img-responsive profile-othergiveaway"/>
                                                                        </button>
                                                                    </div>
                                                                    <div className="flout-right side-past-date">
                                                                        <h1 className="mergin0 color-white bold uppercase">{other_giveaway.title}</h1>
                                                                        <h1 className="uppercase p-t10 mergin0">{other_giveaway.title}</h1>
                                                                        <br/>
                                                                        <button
                                                                            className="own-btn btn btn-blue uppercase">Enter
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <div className="flout-right full-w-right">
                                                                    <button className={"img-button"}>
                                                                        <img alt={"other giveway"}
                                                                            src={other_giveaway.img}
                                                                             className="img-responsive othergiveaway"/>
                                                                    </button>
                                                                </div>
                                                              </Link>
                                                            </li>

                                                        )
                                                    })}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="clearfix"/>
                </div>
            </div>
        )
    }
}

export default Giveaway
