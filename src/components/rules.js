import React from 'react'
import {BACKEND_API,GOOGLEANALYICS} from "../utility";
import ReactGA from 'react-ga';

class Rules extends React.Component {
  componentDidMount(){
        ReactGA.initialize(GOOGLEANALYICS);
        ReactGA.pageview('Rules');
      }
    render() {
        return <h1>Need to add Rules</h1>
    }
}
export default Rules
