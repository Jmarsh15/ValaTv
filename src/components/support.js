import React from 'react'
import {BACKEND_API,GOOGLEANALYICS} from "../utility";
import ReactGA from 'react-ga';
import { Redirect } from 'react-router-dom'

class Support extends React.Component {
  renderRedirect = () => {
    var url = 'https://valatv.freshdesk.com/support/tickets/new'
    window.open(url, '_blank');
}
  componentDidMount(){
    this.renderRedirect()
        ReactGA.initialize(GOOGLEANALYICS);
        ReactGA.pageview('Support');
      }
    render() {
      return <Redirect to='/' />
    }
}
export default Support
