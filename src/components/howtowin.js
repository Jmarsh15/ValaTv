import React from 'react'
import {BACKEND_API,GOOGLEANALYICS} from "../utility";
import ReactGA from 'react-ga';

class HowToWin extends React.Component {
  componentDidMount(){
    ReactGA.initialize(GOOGLEANALYICS);
    ReactGA.pageview('HowToWin');
  }
    render() {
        return <h1>Legal stuff that needs to be added</h1>
    }
}
export default HowToWin
