import React from 'react';
import {Provider} from 'react-redux';
import  App  from './App';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import store from './store';
import StatusBar from './statusBar';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#cc0000',
    accent: '#cc0000',
  }
};

export default class RootComp extends React.Component {
  constructor() {
    super();
  };
  render() {
    return (
      <Provider store={store}>
      <PaperProvider theme={theme}>
      <StatusBar backgroundColor="#cc0000" />
        <App />
      </PaperProvider>

      </Provider>
    );
  }
}
