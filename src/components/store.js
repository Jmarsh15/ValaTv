import React from 'react'
import {BACKEND_API,GOOGLEANALYICS} from "../utility";
import ReactGA from 'react-ga';

class Store extends React.Component {
  componentDidMount(){
        ReactGA.initialize(GOOGLEANALYICS);
        ReactGA.pageview('Store');
      }
    render() {
        return <h1>Add the store for premium and other stuff we will be selling</h1>
    }
}
export default Store
