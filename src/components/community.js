import React from 'react'
import {BACKEND_API,GOOGLEANALYICS} from "../utility";
import ReactGA from 'react-ga';
class Community extends React.Component {
  componentDidMount(){
        ReactGA.initialize(GOOGLEANALYICS);
        ReactGA.pageview('Community');
      }
    render() {
        return <h1>Need to add stuff here</h1>
    }
}
export default Community
