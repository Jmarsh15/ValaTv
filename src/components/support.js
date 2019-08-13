import React from 'react'
import {BACKEND_API,GOOGLEANALYICS} from "../utility";
import ReactGA from 'react-ga';

class Support extends React.Component {
  componentDidMount(){
        ReactGA.initialize(GOOGLEANALYICS);
        ReactGA.pageview('Support');
      }
    render() {
        return <h1>Make a fourm for people to submit bugs or any other issues somebody is having plus our contact info.</h1>
    }
}
export default Support
