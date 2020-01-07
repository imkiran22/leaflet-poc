import $ from 'jquery'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css';
import '../scss/main.scss';
import 'babel-polyfill';
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
//import { ConnectedRouter } from 'react-router-redux';
import { BrowserRouter, Route, browserHistory } from 'react-router-dom';
import store, { history } from './Store'
import App from './App';

ReactDOM.render(<Provider store = {store}>
        <BrowserRouter>
          <div>
	        <MuiThemeProvider><App/></MuiThemeProvider>
	      </div>
        </BrowserRouter>
	</Provider>, document.getElementById('root'));
