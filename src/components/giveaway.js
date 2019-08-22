import React from 'react'
import {Suspense, lazy } from 'react';
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
         other_giveaways: [],
         total:0,
         currentCount:0,
         isFetching:false
    }
  }
  LoadFeaturedGiveaways = () => {
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
           for (var i = 0; i < 6; i++) {
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
           // this.getProfile(featured)
        }
      }.bind(this)
    xhr.send();
  }
  LoadGiveawaysCount = () => {
    var other = []
    var profile = ''
    var usernames = null
    var xhr = new XMLHttpRequest();
    var url = BACKEND_API +  "activegiveawayscount/";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    //xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
          var json = JSON.parse(xhr.responseText);
          this.setState({total : json})
        }
      }.bind(this)
    xhr.send();
  }
  LoadGiveaways = () => {
    var other = []
    var profile = ''
    var usernames = null
    var xhr = new XMLHttpRequest();
    var current = this.state.currentCount
    console.log(current)

    if (current + 3 <= this.state.total) {
      var end = current + 3

      this.setState({currentCount:end})
    }
    else {
      var end = this.state.total
      this.setState({currentCount:end})
    }

    var url = BACKEND_API +  "loadallactivegiveaways/?start=" + current+ '88888'+end;
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
                other.push(data)
           }
           //this.setState({featured_giveaways:featured})
           this.getProfile(other)
        }
      }.bind(this)
    xhr.send();
  }

  getProfile = (other) => {
    var state = other
    var other = this.state.other_giveaways
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
             other.push(data)
          }
        }.bind(this)
      xhr.send();
    }

    this.setState({other_giveaways:other})

  }
componentDidMount(){
  // TODO Load 6 featured giveaways Make an array of objects using img,title and url.
  // TODO Load all other active giveaways make an array of objects using profile avatar, title, user_name, giveaway image and url.
  this.LoadFeaturedGiveaways()
  this.LoadGiveawaysCount()
  this.LoadGiveaways()
  window.addEventListener('scroll', this.loadOnScroll);
  ReactGA.initialize(GOOGLEANALYICS);
  ReactGA.pageview('Giveaways');
}
loadOnScroll = (e) =>{
    //If all the content loaded
    if(this.state.currentCount == this.state.total) return;
    //Get div at the bottom of the content
    var el = document.getElementById('content-end');

    var rect = el.getBoundingClientRect();
    var isAtEnd = (
        // rect.top >= 0 &&
        // rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );

    //User at the end of content. load more content
    if(isAtEnd){
      //User at the end of content. load more content
      if(!this.state.isFetching){

        this.setState({isFetching:true});

        //get content from server
        setTimeout(() => {
          var count = this.state.currentCount + this.state.offset
          if(this.state.currentCount !== this.state.total){
            this.LoadGiveaways()
            this.setState({
              isFetching:false,
            })
          }
        }, 100);
      }
    }
  }
  componentWillUnmount(){
  window.removeEventListener('scroll', this.loadOnScroll);
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
                                                    { /* Start load more content when this div is visible*/
                                                    (this.state.currentCount !== this.state.total)?
                                                    <div id="content-end" >
                                                      Please wait. Loading...
                                                    </div>: null
                                                  }
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
