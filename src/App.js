import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import Category from './components/category'
import FooterNav from './components/footer-nav'
import GameLive from './components/game-live'
import Giveaway from './components/giveaway'
import HeaderNav from './components/headernav'
import Home from './components/home'
import LiveStream from './components/live-stream'
import UserSettings from './components/user-settings'
import NotFound from './components/not-found'
import Community from './components/community'
import HowToWin from './components/howtowin'
import Rules from './components/rules'
import Support from './components/support'
import Store from './components/store'
import Splash from './components/splash'
import './App.css';

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            online_status: true,
            username: '',
            logged_in: false,

            avatar : ''
        }
    }
    onChange = () => {
        this.setState({
            online_status: !this.state.online_status,
            username: ''
        })
    }

    render() {
        return (
            <Router>
                <div>
                    <HeaderNav onClick = {this.onChange} online_status = {this.state.online_status} />
                        <Switch>
                            <Route exact  path="/" component={Home} />
                            <Route path={"/user:id/category"} component={Category} />
                            <Route path={"/category"} component={Category} />
                            <Route path={"/games/"} component={GameLive} />
                            <Route path={"/giveaway"} component={Giveaway} />
                            <Route path="/category" component={Category} />
                            <Route path="/giveaway/active" component={Giveaway} />
                            <Route path="/profile" component={UserSettings} />
                            <Route path="/community" component={Community} />
                            <Route path="/how-to-win" component={HowToWin} />
                            <Route path="/rules" component={Rules} />
                            <Route path="/support" component={Support} />
                            <Route path="/store" component={Store} />
                            <Route path="/redirect_uri" component={Home} />
                            <Route path="/splash" component={Splash} />


                              <Route exact path={'/:userName'}
                                     render = {() => <LiveStream online_status={this.state.online_status} />} />

                            <Route path={"/"}
                                   render = {() => <LiveStream online_status={this.state.online_status}/>}/>
                            <Route component={NotFound} />
                        </Switch>
                    <FooterNav />
                </div>
            </Router>
        );
    }
}

export default App
