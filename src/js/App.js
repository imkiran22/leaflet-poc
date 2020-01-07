import React from "react";
import ReactDOM from "react-dom";
import { Route, Link, Switch, withRouter } from 'react-router-dom';
import Reminder from './containers/reminder';
import Todo from './containers/todo';
import Status from './containers/status';
import Notes from './containers/notes';
import store from './Store';
import Alert from './common/Alert';
import $ from 'jquery';
import Audio from './common/Audio';
import Leaflet from './components/Leaflet';
import header from '../asset/header.png';
@withRouter
export default class App extends React.Component {
   timeDelay = null;
   constructor(props) {
     super(props);
     this.notifyMe();
     console.log('STORE', store.getState());//
     this.state = {expand: false, radius: ''};//?
     //store.dispatch();
     // store.subscribe(function(state) {
     //    console.log('STATE', state);
     // })
   }

   notifyMe() {
      // Let's check if the browser supports notifications
      if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
      }
      // Let's check whether notification permissions have already been granted
      else if (Notification.permission === "granted") {
        
      }
      // Otherwise, we need to ask the user for permission
      else if (Notification.permission !== "denied") {
        Notification.requestPermission(function (permission) {
          // If the user accepts, let's create a notification
          if (permission === "granted") {
            console.log(Notification.permission);
            // var notification = new Notification("Hi there!");
            // var notification = new Notification(obj.title, {body: obj.desc});
            // notification.title = obj.title;
            // notification.body = obj.desc;
          }
        });
      }
      // At last, if the user has denied notifications, and you 
      // want to be respectful there is no need to bother them any more.
    }

   collapse(bool) {
     const mainView = document.querySelector('section.main-view');
     const sideNav = document.querySelector('section.side-nav');
     const anchor = $(sideNav).find('nav a');
     //const collapseBtn = document.getElementById('collapse');

     this.setState({
        expand:bool
     })

     if (bool) {
       sideNav.className = sideNav.className + ' width0';
       mainView.className = mainView.className + ' left0';
       anchor.addClass('reset');
       mainView.style.width = '100%';
       //collapseBtn.style.display = 'block';
       return;
     } 
     sideNav.className = sideNav.className.replace('width0', '');
     mainView.className = mainView.className.replace('left0', '');
     anchor.removeClass('reset');
     mainView.style.width = '93%';
     //collapseBtn.style.display = 'none';
   }

   componentDidMount() {
  
   }

   componentDidUpdate(prevProps) {
      if (this.props.location !== prevProps.location) {
        //this.onRouteChanged();
      }
    }

    onRouteChanged() {
       let location = this.props.location.pathname;
       if (location.startsWith('/reminders') || location === '/') {
          location = '/reminders';
       }
       const DOM = $('section.side-nav');
       DOM.find('nav a').removeClass('active');
       DOM.find(`nav a[href='${location}']`).addClass('active');
    }



   componentWillUnMount() {
      //clearInterval(this.timeDelay);
   }

   showShipper() {
     console.log('VAL', this.state.shipper);
   }

   render() {
     return (
       <section>
         <section class="pad-0">
          <img class="width-100" src={header} alt="fourkites inc"/>
         </section>
      <div id="wrapper">
        <section class="main-view">
          <main>
          <Switch>
           <Route exact path="/" render = {(props) => <Leaflet {...props} radius={this.state.radius}/>}></Route>
           <Route exact path="/leaflet" render = {(props) => <Leaflet {...props} radius={this.state.radius}/>}></Route>
           </Switch>
          </main>
        </section>
      </div>  
      </section>
     );
   }
}
