import React ,{Fragment}from 'react'
import { NavLink,Redirect} from "react-router-dom";
// import Popup from "reactjs-popup";
import {BACKEND_API,GOOGLEANALYICS,server_url} from "../utility";
import ReactGA from 'react-ga';
let temp_new_entry_option = {}

class UserSettings extends React.Component {
    constructor(props) {

        super(props)

        this.state = {
          current: null,
          winnerEmail:'',
          currentid: '',
          active_giveaway: [],
          past_winners: null,
          nowinner:[],
          giveawaysuccess: 'success',
          selectedFile: null,
          expire : '',
            edit_giveaway: '',
            update_giveaway: '',
            new_giveaway: '',
            new_entry_options: [],
            edit_social_connection: '',
            update_social_connection: '',
            edit_social_indexing : 0,
            social_connections: [{
                icon: 'fa fa-steam',
                label: 'steam',
                check_img: process.env.PUBLIC_URL + 'assets/images/tick.png',
                username: 'user name'
            }, {
                icon: 'fa fa-twitch',
                label: 'twitch',
                check_img: process.env.PUBLIC_URL + 'assets/images/tick.png',
                username: 'user name'
            }, {
                icon: 'fa fa-twitter',
                label: 'twitter',
                check_img: process.env.PUBLIC_URL + 'assets/images/tick.png',
                username: 'user name'
            }, {
                icon: 'fa fa-facebook',
                label: 'facebook',
                check_img: process.env.PUBLIC_URL + 'assets/images/tick.png',
                username: 'user name'
            }, {
                icon: 'fab fa-discord',
                label: 'discord',
                check_img: process.env.PUBLIC_URL + 'assets/images/tick.png',
                username: 'user name'
            }, {
                icon: 'fa fa-youtube-play',
                label: 'youtube',
                check_img: process.env.PUBLIC_URL + 'assets/images/tick.png',
                username: 'user name'
            },],
            user: {
                img: process.env.PUBLIC_URL + 'assets/images/user-img.png',
                name: '',
                type: '',
                founder: ''
            },
            select_stream_service: [{
                service: 'twitch'
            }, {
                service: 'Facebook gaming',
            }, {
                service: 'Youtube gaming',
            }, {
                service: 'Mixer'
            }],
            service_url: 'state url',
            entry_options: [{
                entry_color_class: 'discord-bg',
                entry_icon: 'fab fa-discord',
                entry_label: 'JOIN DISCORD',
                entry_url: ''
            }, {
                entry_color_class: 'twitch-bg',
                entry_icon: 'fa fa-twitch',
                entry_label: 'FOLLOW ON TWITCH',
                entry_url: ''
            }, {
                entry_color_class: 'youtube-bg',
                entry_icon: 'fa fa-youtube-play',
                entry_label: 'WATCH YOUTUBE VIDEO',
                entry_url: ''
            }, {
                entry_color_class: 'twitter-bg',
                entry_icon: 'fa fa-twitter',
                entry_label: 'RETWEET ON TWITTER',
                entry_url: ''
            }, {
                entry_color_class: 'facebook-bg',
                entry_icon: 'fa fa-facebook',
                entry_label: 'VISIT FACEBOOK PAGE',
                entry_url: ''
            }, {
                entry_color_class: 'steam-bg',
                entry_icon: 'fa fa fa-steam',
                entry_label: 'JOIN STEAM GROUP',
                entry_url: ''
            },
            {
                entry_color_class: 'bg-primary',
                entry_icon: 'fas fa-external-link-square-alt',
                entry_label: 'VISIT WEBSITE',
                entry_url: ''
            },],
            edit_giveaway_index: 0
        }
        this.handleChange = this.handleChange.bind(this)
    }

    openCity = (evt, cityName) => {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(cityName).style.display = "block";
        evt.currentTarget.className += " active";
    }

    onChangeInputUrl = (event) => {
    		this.setState({
    			service_url: event.target.value
    		})
  	}
    onChangeEditSocialCon = (e) => {
            this.setState({
                update_social_connection: e.target.value,
                edit_social_connection: e.target.value
            })
        }
    handleUpdateSocialCon = () => {
        let update_social = this.state.social_connections
        update_social = update_social.map((social, index) => {
            if (index === this.state.edit_social_indexing) {
                return {
                    ...social,
                    username: this.state.update_social_connection
                }
            }else {
                return social
            }
        })
        this.PostUsernames(update_social)

        this.setState({
            update_social_connection : '',
            edit_social_connection: '',
            social_connections: update_social
        })

    }
  	onChangeAddGiveaway = (e) => {
    		this.setState({
    			new_giveaway: e.target.value
    		})
  	}
  	onChangeEditGiveaway = (e) => {
    		this.setState({
    			edit_giveaway: e.target.value,
    			update_giveaway: e.target.value,
    		})
  	}

    handleChooseEntry = (index) => {
    		this.setState({
    			new_giveaway: this.state.entry_options[index].entry_url
    		})
    		temp_new_entry_option = this.state.entry_options[index]
  	}
  	handleEditGiveaway = (url, index) => {
  		this.setState({
  			edit_giveaway: url,
  			edit_giveaway_index: index
  		})
  	}

    handleUpdateGiveaway = () => {
    		this.setState({
    			update_giveaway: '',
    			edit_giveaway: '',
    		})

  	}
    handlePreviewGiveaway = () => {
        let data = Object.assign({}, this.state.new_entry_options);
        data[this.state.edit_giveaway_index].entry_url =  this.state.update_giveaway
         window.open(data[0].entry_url, '_blank');
    }
    handleAddNewEntry = () => {
      var founder = this.state.user.founder
      var length = this.state.user.founder.length
      var entries = this.state.new_entry_options
      var not = 0
      var count = entries.filter((obj) => obj.entry_label === temp_new_entry_option.entry_label).length
       if (count === 0) {
        this.setState({
            new_giveaway: '',
        })
        this.state.new_entry_options.push(temp_new_entry_option)
      }
      else if (founder === true && count === 1) {
        this.setState({
            new_giveaway: '',
        })
        this.state.new_entry_options.push(temp_new_entry_option)
      }
      console.log(this.state.new_entry_options)
    }
    updateGiveaway = () => {
      var file = this.state.selectedFile
      var entries = ''
      var length = this.state.new_entry_options.length
      var expire = document.getElementById("enddate")
      var title = document.getElementById("title")
      var description = document.getElementById("description")
      expire = new Date(expire.value)
      var temp = new Date()

      if (file && length != 0 && title.value != '' && description.value != '') {
        for (var i = 0; i < length; i++) {
          entries += this.state.new_entry_options[i].entry_icon + '/' + this.state.new_entry_options[i].entry_label + '/' + this.state.new_entry_options[i].entry_url + ','

        }
        var formdata = new FormData();
        const gi = [1,2,3,4,5]

        formdata.append('title',title.value)
        formdata.append('expire',expire)
        formdata.append('description',description.value)
        formdata.append('entries',entries)
        formdata.append("file", file)
        formdata.append("id", this.state.currentid)


              var xhr = new XMLHttpRequest();
              var url = BACKEND_API +  "updategiveaway/";
              xhr.open("POST", url, true);
              xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token')
          )
              xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var json = JSON.parse(xhr.responseText);
                    this.setState({giveawaysuccess:json})
                  }
                }.bind(this)
              xhr.send(formdata);
      }
      else {
        console.log('something is either working right or not at all')
      }
    }
    handleStartGiveaway=() => {
      var file = this.state.selectedFile
      var entries = ''
      var length = this.state.new_entry_options.length
      var expire = document.getElementById("enddate")
      var title = document.getElementById("title")
      var description = document.getElementById("description")
      expire = new Date(expire.value)
      var temp = new Date()

      if (file && length != 0 && expire > temp && title.value != '' && description.value != '') {
        for (var i = 0; i < length; i++) {
          entries += this.state.new_entry_options[i].entry_icon + '/' + this.state.new_entry_options[i].entry_label + '/' + this.state.new_entry_options[i].entry_url + ','

        }
        var formdata = new FormData();
        const gi = [1,2,3,4,5]

        formdata.append('title',title.value)
        formdata.append('expire',expire)
        formdata.append('description',description.value)
        formdata.append('entries',entries)
        formdata.append("file", file)


              var xhr = new XMLHttpRequest();
              var url = BACKEND_API +  "giveaway/add-giveaway/";
              xhr.open("POST", url, true);
              xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token')
          )
              xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var json = JSON.parse(xhr.responseText);
                    this.setState({giveawaysuccess:json})
                  }
                }.bind(this)
              xhr.send(formdata);
      }
      else {
        alert("Something has been left empty")
      }

    }
    LoadProfile=() => {
      //TODO Load Image from AWS
      var xhr = new XMLHttpRequest();
      var url = BACKEND_API +  "profile/";
      xhr.open("GET", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader('Authorization', 'Token ' +  localStorage.getItem('token'))
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            var json = json[0]
            let data = Object.assign({}, this.state.social_connections);
            let user = Object.assign({}, this.state.user);
            data[0].username = json['steam']
            data[1].username = json['twitch']
            data[2].username = json['twitter']
            data[3].username = json['facebook']
            data[4].username = json['discord']
            data[5].username = json['youtube']
            if (json['img']) {
              var image = json['img'].split('/')
              user.img = BACKEND_API + 'static/profile/' + image[7]

            }
            user.name = localStorage.getItem('username')
            user.accountType = json['accountType']
            user.partnerType = json['partnerType']
            user.founder = json['founder']
            this.setState({data})
            this.setState({user})
          }
        }.bind(this);
      xhr.send();
    }
    componentDidMount(){
      if (localStorage.getItem('username') != null) {
        this.LoadProfile()
        ReactGA.initialize(GOOGLEANALYICS);
        ReactGA.pageview('Profile');
        this.LoadGiveway()
      }
  }

  renderRedirect = () => {
    if (this.props.username === undefined) {
      console.log('nooooooo')
      return <Redirect to='/' />
    }
   }
handleChange (event) {
  const _URL = window.URL || window.webkitURL;
		let img = new Image();
		const image_object = event.target.files[0] ;
		console.log(image_object)
		img.onload = function () {
			if (this.width === '450' && this.height === '300') {
        this.setState({selectedFile: image_object})

			} else {
				window.alert('You must only upload 450*300 image.')
			}
		};
		img.src = _URL.createObjectURL(image_object)
  }

  handleAvatarChange = (event) =>{

    var file = event.target.files[0]

    var formdata = new FormData();
    formdata.append("file", file)
          var xhr = new XMLHttpRequest();
          var url = BACKEND_API +  "uploaduseravatar/";
          xhr.open("POST", url, true);
          xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token')
      )
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var json = JSON.parse(xhr.responseText);
                let user = Object.assign({}, this.state.user);
                var image = json.split('/')
                user.img = BACKEND_API + 'static/profile/' + image[2]
                this.setState({user})
              }
            }.bind(this)
          xhr.send(formdata);
  }

  changePassword = () =>{
    //TODO fix change password on the backend
    var old = document.getElementById("oldpassword")
    var new1 = document.getElementById("newpassword1")
    var new2 = document.getElementById("newpassword2")

    var xhr = new XMLHttpRequest();
    var url = BACKEND_API +  'rest-auth/password/change/';
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
          var json = JSON.parse(xhr.responseText);
          console.log(json)
        }
      };
      const data = {
        new_password1: new1.value,
        new_password2: new2.value,
        old_password: old.value
      }
    xhr.send(data);
  }
  handleEditSocialCon = (e, connection, index) => {
    e.preventDefault()
    this.setState({
        edit_social_connection : connection,
        edit_social_indexing: index
    })
}


PostUsernames = (update_social) => {
  var connections = update_social
  var formdata = new FormData();
  formdata.append('steam',connections[0].username)
  formdata.append('twitch',connections[1].username)
  formdata.append('twitter',connections[2].username)
  formdata.append('facebook',connections[3].username)
  formdata.append("discord", connections[4].username)
  formdata.append("youtube", connections[5].username)
  var xhr = new XMLHttpRequest();
  var url = BACKEND_API +  'profile/';
  xhr.open("POST", url, true);
  xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var json = JSON.parse(xhr.responseText);

      }
    };
  xhr.send(formdata);
}

LoadGiveway = () => {
  var pageurl = window.location.href.split('/')
  var currentgiveaway = []
  var past = []
  var nowinner = []
  var xhr = new XMLHttpRequest();
  var url = BACKEND_API + "usergiveaway/?user=" + localStorage.getItem('username');
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
          if (expired < current && json[i].winner != null) {
            var image = json[i].winneravatar.split('/')
            var expire = json[i].expire.split('T')

            const data = {
                img: BACKEND_API + 'static/profile/' + image[7],
                username: json[i].winner,
                title: json[i].title,
                date: expire[0]
            }
            past.push(data)

          }
          else if (expired < current && json[i].winner === null) {
            console.log(json[i])
            var image = json[i].image.split('/')
            var expire = json[i].expire.split('T')
            const data = {
                img: BACKEND_API + 'static/giveaway/' + image[7],
                title: json[i].title,
                date: expire[0]
            }
            nowinner.push(data)
          }
          // else {
          //   var image = json[i].image.split('/')
          //   var expire = json[i].expire.split('T')
          //   this.setState({selectedFile :BACKEND_API + 'static/giveaway/' + image[7]})
          //   this.setState({expire:json[i].expire.slice(0, -4)})
          //
          //   this.setState({current:'77'})
          //
          // }

          if (this.state.expire != '') {
            this.setState({currentid:json[i].static_id})
            var expire = document.getElementById("enddate")
            console.log(this.state.expire)
            expire.value = this.state.expire
            var title = document.getElementById("title")
            title.value = json[i].title
            var des = document.getElementById("description")
            des.value = json[i].description.toString()
            var entries = json[i].entries.split(',')
            var temp=[]
  					for (var i = 0; i < entries.length - 1; i++) {
  						//usernames.push(entries[i].split(' ').splice(-1))
  						temp.push(entries[i].split('/'))

  					}
  					var entries = []
  					for (var i = 0; i < temp.length; i++) {
              var split = temp[i][0].split('-')
              console.log(split)
              if (split[1]==='external') {
                split = 'bg-primary'
              }
              else {
                split = split[1]+('-bg')
              }
  						const entry = {
                entry_color_class:split,
  							entry_icon: temp[i][0],
  							entry_label: temp[i][1],
  							entry_url: temp[i][2]

  						}
  						entries.push(entry)
  					}
            this.setState({new_entry_options:entries})
          }


    }

  }

    }
    if (this.state.current === null) {
      var expire = document.getElementById("enddate")
      expire.value = ''
      var title = document.getElementById("title")
      title.value = ''
      var des = document.getElementById("description")
      des.value = ''
    }
    this.setState({nowinner:nowinner})
    this.setState({past_winners:past})

  }.bind(this)

  xhr.send()
}

rollGiveaway = () => {
  //TODO Load Image from AWS
  var xhr = new XMLHttpRequest();
  console.log('test')
  var url = BACKEND_API +  "findwinner/";
  xhr.open("GET", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader('Authorization', 'Token ' +  localStorage.getItem('token'))
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var json = JSON.parse(xhr.responseText);
        console.log(json)
      }
    }.bind(this);
  xhr.send();
}


showContactInfo = (index) => {
  var xhr = new XMLHttpRequest();
  let data = Object.assign({}, this.state.past_winners);
  var url = BACKEND_API +  "getemail/?username=" + data[index].username;
  xhr.open("GET", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader('Authorization', 'Token ' +  localStorage.getItem('token'))
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var json = JSON.parse(xhr.responseText);
        console.log(json)
        this.setState({winnerEmail:json[0].email})
        console.log(json[0].email)
        window.location.href = "mailto:" + json[0].email;

      }
    }.bind(this);
  xhr.send();
}
    render() {
        return (
            <div>
            {
              localStorage.getItem('username') === null ?
              this.renderRedirect()
              :
                <div className="container-fluid user-settings-container">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12">
                            <div className="tab">
                                <button className="tablinks active" onClick={e => this.openCity(e, 'settings')}
                                        id="defaultOpen">settings
                                </button>
                                <button className="tablinks" onClick={e => this.openCity(e, 'giveaways')}>giveaways
                                </button>
                                <button className="tablinks" onClick={e => this.openCity(e, 'partner')}>become partner
                                </button>
                                <button className="tablinks" onClick={e => this.openCity(e, 'portal')}>Partner Portal
                                </button>
                            </div>
                            {/*settings tab*/}
                            <div id="settings" className="tabcontent">
                                <h1>User settings</h1>

                                <div className="user-box">
                                    <div className="flout-left">
                                      <div class="img-but img-responsive">
                                        <img class="object-fit-cover" src={this.state.user.img}/>
                                      </div>

                                        <div>
                    <span className="own-btn upload-but avter-but btn-file">
                      UPLOAD NEW AVATAR <input type="file" onChange={this.handleAvatarChange}/>
                    </span>
                                        </div>
                                    </div>
                                    <div className="flout-left">
                                        <div className="user-side-text">
                                            <h2>Username: {this.state.user.name}</h2>
                                            <h4>Account Type: {this.state.user.accountType}</h4>
                                            <h4>Partner Type: {this.state.user.partnerType}</h4>
                                        </div>
                                    </div>
                                </div>
                                <form className="form-horizontal">
                                    <div className="clearfix"/>

                                    <div className="clearfix"/>
                                    <h2>socials connections</h2>
                                    <hr/>
                                      <div className="user-but-list">
                                          <ul>
                                              {this.state.social_connections.map((connection, index) => {
                                                  return (
                                                      <li key={index}>
                                                          <button className="own-btn btn btn-blue btn-primary uppercase"
                                                                  data-toggle={"modal"}
                                                                  data-target={"#social_connection_modal"}
                                                                  onClick={(e) => this.handleEditSocialCon(e, connection.username, index) }>
                                                              <span>
                                                                  <i className={connection.icon}
                                                                       aria-hidden="true"/>
                                                              </span>
                                                              {connection.label}
                                                          </button>
                                                          <span> <span>
                                                              <img src={connection.check_img} alt={"check"}
                                                                  className="img-responsive"/>
                                                          </span> {connection.username}</span>
                                                      </li>
                                                  )
                                              })}
                                          </ul>
                                      </div>
                                </form>
                            </div>
                            {/*giveways tab*/}
                            <div id="giveaways" className="tabcontent">
                              {
                                this.state.current != null ?
                                <Fragment>

                                <h1>giveaways</h1>
                                  <Fragment>
                                  <div className="user-box">
                                      <h2>Update Current Giveaway</h2>
                                      <hr/>
                                      <div>
                                        <div class="img-but img-responsive ">
                                          <img class="object-fit-cover" src={this.state.selectedFile}/>
                                        </div>
                                        <span className="own-btn upload-but btn-file">
                                          upload featured image
                                            <input type="file"onChange={this.handleChange} alt="an image"id = 'giveawayimage'/>
                                        </span> <span className="sm-text">450 x 300</span>
                                      </div>
                                  </div>
                                  <div className="clearfix"/>
                                  <br/>

                                  <div className="form-horizontal">
                                    <div className="form-group">
                                        <label className="col-sm-4 col-md-3 col-lg-2 control-label">Title</label>
                                        <div className="col-sm-8 col-md-9 col-lg-10">
                                            <input type="text" className="form-control form-own2 full-text-area"id="title"/>
                                        </div>
                                    </div>
                                      <div className="form-group">
                                          <label className="col-sm-12 col-md-3 col-lg-2 control-label">Description</label>
                                          <div className="col-sm-12 col-md-9 col-lg-10">
                                              <textarea className="form-control form-own2 full-text-area" rows={3}
                                                        id="description" defaultValue={""}/>
                                          </div>
                                      </div>
                                      <div className="form-group">
                                          <label className="col-sm-4 col-md-3 col-lg-2 control-label">End Date</label>
                                          <div className="col-sm-8 col-md-9 col-lg-10">
                                              <input className="form-control date-input full-text-area" id="enddate"
                                                type="datetime-local"
                                                name="meeting-time"
                                                />
                                          </div>
                                      </div>
                                      <div className="clearfix"/>
                                      <h1>Entry Options </h1>
                                      <br/>
                                      <div className="" style={{display: 'flex'}}>
                                          <div className="Entry-list" style={{width: '100%'}}>
                                                  {this.state.new_entry_options && this.state.new_entry_options.map((entry_option, index) => {
                                                      return (
                                                          <div className={"col-md-6"} key={index}>
                                                              <div className={entry_option.entry_color_class + " entry-listing color-white"}>
                                                                  <div className="Entry-list-icon"><i
                                                                      className={entry_option.entry_icon}
                                                                      aria-hidden="true"/></div>
                                                                  <div
                                                                      className="title-entry">{entry_option.entry_label}
                                                                  </div>
                                                                  <div className="entry-link">
                                                                      <button className="entry-url-edit-btn"
                                                                              onClick={() => {
                                                                                  this.handleEditGiveaway(entry_option.entry_url, index)
                                                                              }}
                                                                              data-toggle="modal"
                                                                              data-target="#edit_giveaway_modal"
                                                                      >Edit
                                                                      </button>
                                                                  </div>
                                                              </div>
                                                          </div>
                                                      )
                                                  })}
                                          </div>
                                      </div>
                                      <div className="col-md-6">
                                          <button type={"button"}
                                                  className="add-btn own-btn btn btn-blue btn-primary uppercase"
                                                  data-toggle="modal" data-target="#add_giveaway_modal">
                                              Add Entry
                                          </button>
                                      </div>
                                      <div className="col-md-6">
                                          <button onClick={this.updateGiveaway}
                                                  className="start-btn own-btn btn btn-blue btn-primary uppercase"
                                                  >update giveaway
                                          </button>
                                      </div>

                                  </div>
                                  </Fragment>
                                  <div className="past-winners">
                                    <ul>
                                        <h3>Completed Giveaways  - Please Select Winner</h3>

                                      {this.state.nowinner.map((past_winner, index) => {
                                        return (
                                          <li key={index}>
                                            <div className="flout-left">
                                              <button>
                                              <div className="flout-left">
                                                <img alt={"past winner"}
                                                     src={past_winner.img}
                                                     className="past-winner"/>
                                              </div>
                                              <div className="flout-right side-past-date">
                                                <h2 className="color-blue uppercase">{past_winner.username}</h2>
                                                <h4 className="uppercase">{past_winner.title}</h4>
                                              </div>
                                              </button>
                                            </div>
                                            <div
                                              className="flout-right padding-top20">{past_winner.date}</div>
                                          </li>
                                        )
                                      })}
                                        <h3>past giveaways</h3>

                                      {this.state.past_winners.map((past_winner, index) => {
                                        return (
                                          <li key={index}>

                                            <div className="flout-left">
                                              <button onClick = {e => this.showContactInfo(index)}>

                                              <div className="flout-left">
                                                <img alt={"past winner"}
                                                     src={past_winner.img}
                                                     className="past-winner"/>
                                              </div>
                                              <div className="flout-right side-past-date">
                                                <h2 className="color-blue uppercase">{past_winner.username}</h2>
                                                <h4 className="uppercase">{past_winner.title}</h4>
                                              </div>
                                              </button>
                                            </div>
                                            <div
                                              className="flout-right padding-top20">{past_winner.date}</div>
                                          </li>
                                        )
                                      })}

                                    </ul>
                                  </div>
                                  </Fragment>
                                  :
                                <Fragment>
                                <h1>giveaways</h1>
                                <div className="user-box">
                                    <h2>Create Giveaway</h2>
                                    <hr/>
                                    <div>
                                      <div class="giveawayimagefile">
                                        <img src={this.state.selectedFile}/>
                                      </div>
                                      <span className="own-btn upload-but btn-file">
                                        upload featured image
                                          <input type="file"onChange={this.handleChange} alt="an image"id = 'giveawayimage'/>
                                      </span> <span className="sm-text">450 x 300</span>
                                    </div>
                                </div>
                                <div className="clearfix"/>
                                <br/>

                                <div className="form-horizontal">
                                  <div className="form-group">
                                      <label className="col-sm-4 col-md-3 col-lg-2 control-label">Title</label>
                                      <div className="col-sm-8 col-md-9 col-lg-10">
                                          <input type="text" className="form-control form-own2 full-text-area"id="title"/>
                                      </div>
                                  </div>
                                    <div className="form-group">
                                        <label className="col-sm-12 col-md-3 col-lg-2 control-label">Description</label>
                                        <div className="col-sm-12 col-md-9 col-lg-10">
                                            <textarea className="form-control form-own2 full-text-area" rows={3}
                                                      id="description" defaultValue={""}/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-4 col-md-3 col-lg-2 control-label">End Date</label>
                                        <div className="col-sm-8 col-md-9 col-lg-10">
                                            <input className="form-control date-input full-text-area" id="enddate"
                                              type="datetime-local"
                                              name="meeting-time"
                                              />
                                        </div>
                                    </div>
                                    <div className="clearfix"/>
                                    <h1>Entry Options </h1>
                                    <br/>
                                    <div className="" style={{display: 'flex'}}>
                                        <div className="Entry-list" style={{width: '100%'}}>
                                                {this.state.new_entry_options && this.state.new_entry_options.map((entry_option, index) => {
                                                    return (
                                                        <div className={"col-md-6"} key={index}>
                                                            <div className={entry_option.entry_color_class + " entry-listing color-white"}>
                                                                <div className="Entry-list-icon"><i
                                                                    className={entry_option.entry_icon}
                                                                    aria-hidden="true"/></div>
                                                                <div
                                                                    className="title-entry">{entry_option.entry_label}
                                                                </div>
                                                                <div className="entry-link">
                                                                    <button className="entry-url-edit-btn"
                                                                            onClick={() => {
                                                                                this.handleEditGiveaway(entry_option.entry_url, index)
                                                                            }}
                                                                            data-toggle="modal"
                                                                            data-target="#edit_giveaway_modal"
                                                                    >Edit
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <button type={"button"}
                                                className="add-btn own-btn btn btn-blue btn-primary uppercase"
                                                data-toggle="modal" data-target="#add_giveaway_modal">
                                            Add Entry
                                        </button>
                                    </div>
                                    <div className="col-md-6">
                                        <button onClick={this.handleStartGiveaway}
                                                className="start-btn own-btn btn btn-blue btn-primary uppercase" data-toggle="modal"
                                                data-target = "#giveaway_success_modal">start giveaway
                                        </button>
                                    </div>

                                </div>
                                <div className="past-winners">
                                  <ul>
                                      <h3>Completed Giveaways  - Please Select Winner</h3>

                                    {this.state.nowinner.map((past_winner, index) => {
                                      return (
                                        <li key={index}>
                                          <div className="flout-left">
                                            <button data-target = '#current_giveaway_modal' data-toggle="modal" >
                                            <div className="flout-left">
                                              <img alt={"past winner"}
                                                   src={past_winner.img}
                                                   className="past-winner"/>
                                            </div>
                                            <div className="flout-right side-past-date">
                                              <h2 className="color-blue uppercase">{past_winner.username}</h2>
                                              <h4 className="uppercase">{past_winner.title}</h4>
                                            </div>
                                            </button>
                                          </div>
                                          <div
                                            className="flout-right padding-top20">{past_winner.date}</div>
                                        </li>
                                      )
                                    })}
                                  </ul>
                                </div>
                                </Fragment>
                              }
                            </div>
                            {/*partner tab*/}
                            <div id="partner" className="tabcontent">
                                <h1>become partner</h1>
                            </div>
                            <div id="portal" className="tabcontent">
                                <h1>Partner Portal</h1>
                            </div>
                        </div>
                        <div className="footer-top-gap"/>
                    </div>
                </div>
              }

                <div className="modal fade" id="edit_giveaway_modal" tabIndex="-1" role="dialog"
                     aria-labelledby="myModalLabel">
                    <div className={"modal-dialog"} role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button
                                onClick= {this.handleClose}
                                type="button" className="close"
                                        data-dismiss="modal"
                                        aria-label="Close">
                                            <span
                                                aria-hidden="true">&times;</span>
                                </button>
                                <h4 className="modal-title" id="myModalLabel">
                                    Editing giveaway</h4>
                            </div>
                            <div className="modal-body">
                                <div className="form-container">
                                    <label
                                        className="col-sm-5 col-md-5 col-lg-5 control-label">
                                        Change giveaway</label>
                                    <div
                                        className="col-sm-7 col-md-7 col-lg-7">
                                        <input type="text"
                                               onChange={this.onChangeEditGiveaway}
                                               name={"update_giveaway"}
                                               value={
											       this.state.update_giveaway !== this.state.edit_giveaway ?
												       this.state.edit_giveaway :
												       this.state.update_giveaway}

                                               className="form-control form-own"/>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">

                                    <button type="button"
                                    onClick={this.handlePreviewGiveaway}
                                            className=" btn btn-default">
                                        Preview
                                    </button>
                                <button
                                    onClick={this.handleUpdateGiveaway}
                                    type="button"
                                    data-dismiss="modal"
                                    className="btn btn-primary">
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/*editing giveaway modal part end*/}

                {/*adding giveaway modal part*/}
                <div className="modal fade" id="add_giveaway_modal" tabIndex="-1" role="dialog"
                     aria-labelledby="myModalLabel">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal"
                                        aria-label="Close"><span
                                    aria-hidden="true">&times;</span></button>
                                <h4 className="modal-title" id="myModalLabel">
                                    Adding new entry</h4>
                            </div>
                            <div className="modal-body">
                                <div className="form-container" style={{flexWrap: "wrap"}}>
                                    {
                                        this.state.entry_options.map((entry_option, index) => {
                                            return (
                                                <button key={index}
                                                        onClick={() => this.handleChooseEntry(index)}
                                                        className={"entry-box " + entry_option.entry_color_class}
                                                        style={{border: 'none'}}>

                                                    <div style={{textAlign: 'center'}}>
                                                        <i className={entry_option.entry_icon}
                                                           aria-hidden="true"/> <br/>
                                                        {entry_option.entry_label}
                                                    </div>

                                                </button>
                                            )
                                        })
                                    }

                                </div>
                            </div>
                            <div className="modal-footer">
                                <button onClick={this.handleAddNewEntry}
                                        type="button"
                                        data-dismiss="modal"
                                        className="btn btn-primary">
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* adding giveaway modal part end */}
                {/* ===============  social connection modal*/}
                                <div className="modal fade" id="social_connection_modal" tabIndex="-1" role="dialog"
                                     aria-labelledby="myModalLabel">
                                    <div className={"modal-dialog"} role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <button type="button" className="close"
                                                        data-dismiss="modal"
                                                        aria-label="Close">
                                                            <span aria-hidden="true">&times;</span></button>
                                                <h4 className="modal-title" id="myModalLabel">
                                                    Editing Social Connection</h4>
                                            </div>
                                            <div className="modal-body">
                                                <div className="form-container">
                                                    <label
                                                        className="col-sm-5 col-md-5 col-lg-5 control-label">
                                                        Update Social Connection
                                                    </label>
                                                    <div
                                                        className="col-sm-7 col-md-7 col-lg-7">
                                                        <input type="text"
                                                               onChange={this.onChangeEditSocialCon}
                                                               name={"update_social_connection"}
                                                               value={
                                                                   this.state.update_social_connection !== this.state.edit_social_connection ?
                                                                       this.state.edit_social_connection :
                                                                       this.state.update_social_connection}
                                                               className="form-control form-own"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button
                                                    onClick={this.handleUpdateSocialCon}
                                                    type="button"
                                                    data-dismiss="modal"
                                                    className="btn btn-primary">
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            {/*    ===============  social connection modal*/}
                            {/* ===============  Giveaway Success modal*/}
                                            <div className="modal fade" id="giveaway_success_modal" tabIndex="-1" role="dialog"
                                                 aria-labelledby="myModalLabel">
                                                <div className={"modal-dialog"} role="document">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <button type="button" className="close"
                                                                    data-dismiss="modal"
                                                                    aria-label="Close">
                                                                        <span aria-hidden="true">&times;</span></button>
                                                            <h4 className="modal-title" id="myModalLabel">
                                                                Giveaway</h4>
                                                        </div>
                                                        <div className="modal-body">
                                                            <div className="form-container">
                                                                <div
                                                                    className="col-sm-7 col-md-7 col-lg-7">
                                                                    <input type="text"
                                                                           name={"update_social_connection"}
                                                                           value={
                                                                               this.state.giveawaysuccess}
                                                                           className="form-control form-own"/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button
                                                                type="button"
                                                                data-dismiss="modal"
                                                                className="btn btn-primary">
                                                                Okay
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        {/*    ===============  Giveaway Success modal*/}
                                        {/* ===============  Current Giveaway modal*/}
                                                        <div className="modal fade" id="current_giveaway_modal" tabIndex="-1" role="dialog"
                                                             aria-labelledby="myModalLabel">
                                                            <div className={"modal-dialog"} role="document">
                                                                <div className="modal-content">
                                                                    <div className="modal-header">
                                                                        <button type="button" className="close"
                                                                                data-dismiss="modal"
                                                                                aria-label="Close">
                                                                                    <span aria-hidden="true">&times;</span></button>
                                                                        <h4 className="modal-title" id="myModalLabel">
                                                                            Giveaway</h4>
                                                                    </div>
                                                                    <div className="modal-body">
                                                                        <div className="form-container">
                                                                            <div
                                                                                className="col-sm-7 col-md-7 col-lg-7">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick = {this.rollGiveaway}
                                                                                    className="btn btn-primary">
                                                                                    Roll Giveaway
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="modal-footer">
                                                                        <button
                                                                            type="button"
                                                                            data-dismiss="modal"
                                                                            className="btn btn-primary">
                                                                            Okay
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    {/*    ===============  Current Giveaway modal*/}

            </div>
        )
    }
}

export default UserSettings
