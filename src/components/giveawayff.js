import React from 'react'
import SideBar from "./sidebar";
import {server_url} from "../utility";
import {BACKEND_API} from "../utility";
class Giveaway extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
         featured_giveaways: [
           //{
        //     url: '',
        //     title: 'hyperex giveaway',
        //     img: process.env.PUBLIC_URL + 'assets/images/img5.png'
        // }, {
        //   url: '',
        //     title: 'hyperex giveaway',
        //     img: process.env.PUBLIC_URL + 'assets/images/img5.png'
        // }, {
        //   url: '',
        //     title: 'hyperex giveaway',
        //     img: process.env.PUBLIC_URL + 'assets/images/img5.png'
        // }, {
        //   url: '',
        //     title: 'hyperex giveaway',
        //     img: process.env.PUBLIC_URL + 'assets/images/img5.png'
        // }, {
        //   url: '',
        //     title: 'hyperex giveaway',
        //     img: process.env.PUBLIC_URL + 'assets/images/img5.png'
        // },
      ],
         other_giveaways: [
           //{
        //   url: '',
        //     img: process.env.PUBLIC_URL + 'assets/images/giveway1.png',
        //     title: 'giveaway title',
        //     username: 'username',
        //     game_img: process.env.PUBLIC_URL + 'assets/images/giveway.png'
        // }, {
        //   url: '',
        //     img: process.env.PUBLIC_URL + 'assets/images/giveway1.png',
        //     title: 'giveaway title',
        //     username: 'username',
        //     game_img: process.env.PUBLIC_URL + 'assets/images/giveway.png'
        // }, {
        //   url: '',
        //     img: process.env.PUBLIC_URL + 'assets/images/giveway1.png',
        //     title: 'giveaway title',
        //     username: 'username',
        //     game_img: process.env.PUBLIC_URL + 'assets/images/giveway.png'
        // }, {
        //   url: '',
        //     img: process.env.PUBLIC_URL + 'assets/images/giveway1.png',
        //     title: 'giveaway title',
        //     username: 'username',
        //     game_img: process.env.PUBLIC_URL + 'assets/images/giveway.png'
        // }, {
        //   url: '',
        //     img: process.env.PUBLIC_URL + 'assets/images/giveway1.png',
        //     title: 'giveaway title',
        //     username: 'username',
        //     game_img: process.env.PUBLIC_URL + 'assets/images/giveway.png'
        // }, {
        //   url: '',
        //     img: process.env.PUBLIC_URL + 'assets/images/giveway1.png',
        //     title: 'giveaway title',
        //     username: 'username',
        //     game_img: process.env.PUBLIC_URL + 'assets/images/giveway.png'
        // },
       ]
    }
  }
    LoadFeaturedGiveway= () => {
      let data = [];

  var xhr = new XMLHttpRequest();
  var url = BACKEND_API +  "featured_giveaways/";
  xhr.open("GET", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var json = JSON.parse(xhr.responseText);
        var type1 = [];
        for (var i = 0; i < json.length; i++) {
          var temp = json[i]
          if (temp['featureType'] == 0) {
            if (data.length < 6) {
              data.push(temp)

            }
          }
          if (temp['featureType'] >= 1) {
            type1.push(temp)
          }
        }
        if (data.length < 6 ) {
          for (i = 0; i < type1.length; i++) {
            if (data.length <6) {
              // TODO get random type1 from array without any repeating
              data.push(type1[i])

              //data.push(type1[Math.floor(Math.random() * (type1.length+1))])
              //data.push(type1[Math.floor(Math.random() * type1.length)])
            }
          }
          }
        this.loadGiveaway(data)

      }
    }
  xhr.send();

}
loadGiveaway = (data) => {
  var xhr = new XMLHttpRequest();
  var ids = ''
   for (var i = 0; i < data.length; i++) {

     ids += data[i].static_id
   }
   var temp = data[i]
   console.log('testin',data)
   console.log(ids)
  var give = []
  //var ids = [2,3,4,5,6,7]
  var url = BACKEND_API +  "giveaway/?ids=" + ids;
  xhr.open("GET", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var json = JSON.parse(xhr.responseText);
        console.log('Multiple Giveaways',json)
        for (var i = 0; i < json.length; i++) {
          var image = json[i].image.split('/')
          const giveaway = {
            img : BACKEND_API + 'static/giveaway/' + image[6],
            url : json[i].user,
            title : json[i].title,
            user: json[i].user,
            game_img : BACKEND_API + 'static/giveaway/' + image[6]
          }
          console.log(giveaway.img)
            give.push(giveaway)
      }
      this.setState({featured_giveaways:give})
    }

  }.bind(this)
  xhr.send();

}
componentDidMount(){
  // TODO Load 6 featured giveaways Make an array of objects using img,title and url.
  // TODO Load all other active giveaways make an array of objects using profile avatar, title, user_name, giveaway image and url.
  this.LoadFeaturedGiveway()
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
                                            <h1 className="center uppercase">{giveaway.title}</h1>
                                            <button className={"img-button"}>
                                                <img alt={"giveway thumb"}
                                                    src={giveaway.img} className="img-responsive"/>
                                            </button>
                                            <div className="center margin-top20">
                                                <button className="own-btn btn btn-blue btn-primary uppercase">Enter
                                                </button>
                                            </div>
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
                                                                <div className="flout-left full-w-left">
                                                                    <div className="flout-left">
                                                                        <button className={"img-button"}>
                                                                            <img alt={"other giveway"}
                                                                                src={other_giveaway.img}
                                                                                 className="img-responsive"/>
                                                                        </button>
                                                                    </div>
                                                                    <div className="flout-right side-past-date">
                                                                        <h1 className="mergin0 color-white bold uppercase">{other_giveaway.title}</h1>
                                                                        <h1 className="uppercase p-t10 mergin0">{other_giveaway.title}</h1>
                                                                        <br/>
                                                                        <button
                                                                            className="own-btn btn btn-blue btn-primary uppercase">Enter
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <div className="flout-right full-w-right">
                                                                    <button className={"img-button"}>
                                                                        <img alt={"other giveway"}
                                                                            src={other_giveaway.game_img}
                                                                             className="img-responsive"/>
                                                                    </button>
                                                                </div>
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
