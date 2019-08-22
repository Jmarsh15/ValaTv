import React, {Fragment} from 'react'
import {NavLink} from 'react-router-dom'
import {connect} from "react-redux";
import * as actions from '../redux/actions/authActions'
import {BACKEND_API} from "../utility";

class  Splash extends React.Component{
	constructor(props) {
		super(props)
		this.state = {
		launchdate: '2019-09-27T01:00:00Z',
		days: 0,
		hours: 0,
		min: 0,
		sec: 0,
		texttextemail: '',
		textpassword: '',
		textfirst: '',
		textlast: '',
		textusername: '',
		textpass: '',
		textpassC: '',
		login_username: '',
		avatar:'',
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

	componentDidMount(){
		this.interval = setInterval(() => {
			const date = this.calculateCountdown(this.state.launchdate);
			date ? this.setState(date) : this.stop();
		}, 1000);
	}
	stop() {
		clearInterval(this.interval);
	}
	componentWillUnmount() {
		this.stop();
	}
	addLeadingZeros(value) {
     value = String(value);
     while (value.length < 2) {
       value = '0' + value;
     }
     return value;
   }
	 handleFounderRegister = () => {
		 console.log('hi')
 		if (this.state.textpass === this.state.textpassC && this.state.textemail !== '' && this.state.textuser !== '' && this.state.textpass !== '' && this.state.textpassC !== '') {
			var founder = 'True'
 			this.props.authSignUp(this.state.textusername,this.state.textemail,this.state.textpass, this.state.textpassC ,this.state.textfirst,this.state.textlast,founder)
 			this.setState({textusername:'',textusername:'',textpass:'',textpassC:'',textfirst:'',textlast:'',textemail:''})

 		}
 	}
	preventLink = (e) => {
		e.preventDefault()
	}
	onChangeInputEmail = (event) => {
		this.setState({
			textemail: event.target.value
		})
	}
	onChangeInputPassword = (event) => {
		this.setState({
			textpassword: event.target.value
		})
	}
	onChangeInputFirst = (event) => {
		this.setState({
			textfirst: event.target.value
		})
	}
	onChangeInputLast = (event) => {
		this.setState({
			textlast: event.target.value
		})
	}
	onChangeInputUsername = (event) => {
		this.setState({
			textusername: event.target.value
		})
	}
	onChangeInputPassword1 = (event) => {
		this.setState({
			textpass: event.target.value
		})
	}
	onChangeInputPassword2 = (event) => {
		this.setState({
			textpassC: event.target.value
		})
	}
	render() {
		return (
			<div className="App">
				<div className="logo">
					<img src={process.env.PUBLIC_URL + '/assets/images/logo.png'} alt=""/>
				</div>
				<div className="header-sign-up">
					<div className="header-welcome">
						<span>Welcome </span>to an innovative concept that will completely change the streaming industry as we know it. Content creators have long struggled to find dependable ways of
						growing their viewership, and as the
						industry has grown more crowded, this has gotten even more difficult.
					</div>
					<div className="sign-up-button-header">
						<div className="btn-bg">

						</div>
						<div className="btn-container">
							<button className={"signup-btn"} data-toggle="modal"
											data-target="#foundersignup_id">
								<span>signup</span><br/>
								now for free <br/>
								<hr className="sign-up-line">
								</hr>
							</button>
						</div>

					</div>
				</div>
				<div className="description capital-text">
					<img src={process.env.PUBLIC_URL + '/assets/images/logo.png'} alt=""/>
						takes a novel approach to using viewer incentives and audience pooling to actively grow your Twitch stream and social media followers, and expand your reach as a content creator.

				</div>
				<div className="launches-in capital-text">
					<div className={"launch-title"}>launches in</div>
					<div className={"launch-time"}>{this.addLeadingZeros(this.state.days)}:{this.addLeadingZeros(this.state.hours)}:{this.addLeadingZeros(this.state.min)}:{this.addLeadingZeros(this.state.sec)}</div>
				</div>
				<div className="information">
					<div className="works-container">
						<div className="info-title font-30">
							how does it work?
						</div>
						<div className="works-details font-30">
							Once you register and link your accounts, you’ll be able to use giveaways and
							incentives to encourage viewers to not only follow your channel and social media, but to actively engage with your stream as well. It’s adaptive in nature, with new
							features to be continuously added as the
							industry changes in the future so you’ll always be ahead of the game.
						</div>
					</div>
					<div className="founders-container">
						<div className="info-title font-30">
							founders
						</div>
						<div className="founder-details font-30">
							As one of the initial users on the site,
							you’ll be part of the Founders group,
							which will give you a leg up on content creators who sign up after launch.
							Founders are given extra benefits which you can use to grow your reach as a streamer:
						</div>
						<ul className="founder-lists">
							<li>- <span>Early Access to new features</span></li>
							<li>- <span>Extra giveaway options</span></li>
							<li>- <span>Eligible for featured streams</span></li>
							<li>- <span>Eligible for free giveaway items</span></li>
							<li>- <span>Promoted Giveaways/Streams</span></li>
						</ul>
					</div>

				</div>
				<div className="bottom-signup">
					<div className="btn-bg">

					</div>
					<div className="btn-container">
						<button className={"signup-btn"} data-toggle="modal"
										data-target="#foundersignup_id">
							<span>signup</span><br/>
							now for free <br/>
							<hr className="sign-up-line">
							</hr>
						</button>
					</div>
				</div>
				<div className="modal fade" id="foundersignup_id" tabIndex="-1" role="dialog"
				     aria-labelledby="myModalLabel">
					<div className="modal-dialog" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<button type="button" className="close" data-dismiss="modal"
								        aria-label="Close"><span
									aria-hidden="true">&times;</span></button>
								<h4 className="modal-title" id="myModalLabel">
									Sign Up</h4>
							</div>
							<div className="modal-body">
								<div className="md-form mb-5">
									<i className="fas fa-envelope prefix grey-text"></i>
									<input value={this.state.textfirst} onChange={this.onChangeInputFirst}
									       className="selectedtext form-control form-own full-w" type="text"/>
									<label data-error="wrong" data-success="right"
									       htmlFor="defaultForm-email">First</label>
									<input value={this.state.textlast} onChange={this.onChangeInputLast}
									       className="selectedtext form-control form-own full-w" type="text"/>
									<label data-error="wrong" data-success="right"
									       htmlFor="defaultForm-email">Last</label>
									<input value={this.state.textemail} onChange={this.onChangeInputEmail}
									       className="selectedtext form-control form-own full-w" type="email"/>
									<label data-error="wrong" data-success="right"
									       htmlFor="defaultForm-email">Email</label>
									<input value={this.state.textusername} onChange={this.onChangeInputUsername}
									       className="selectedtext form-control form-own full-w" type="text"/>
									<label data-error="wrong" data-success="right"
									       htmlFor="defaultForm-email">Username</label>
									<input value={this.state.textpass} onChange={this.onChangeInputPassword1}
									       className="selectedtext form-control form-own full-w" type="password"/>
									<label data-error="wrong" data-success="right"
									       htmlFor="defaultForm-email">Password</label>
									<input value={this.state.textpassC} onChange={this.onChangeInputPassword2}
									       className="selectedtext form-control form-own full-w" type="password"/>
									<label data-error="wrong" data-success="right"
									       htmlFor="defaultForm-email">Password</label>
								</div>

							</div>
							<div className="modal-footer">
								<button onClick={this.handleFounderRegister}
								        type="button"
								        data-dismiss="modal"
								        className="btn btn-primary">
									Sign Up
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

const matStateToProps = state => {
	return {
		token: state.auth.token,
		username: state.auth.username
	}
}
const mapDispatchToProps = dispatch => {
	return {
		authSignUp: (username, email, password1, password2,first,last,founder) => dispatch(actions.authSignUp(username, email, password1, password2,first,last,founder))
	}
}
export default connect(matStateToProps, mapDispatchToProps)(Splash);
