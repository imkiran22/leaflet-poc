import React from "react";
import ReactDOM from "react-dom";
import { Route, Link, withRouter } from 'react-router-dom';
//import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchReminders } from '../actions';
import CreateEditReminder from './createEditReminder';


@withRouter
class Reminder extends React.Component {
	//timeDelay = null;
	constructor(props) {
		super(props);
		this.state = {reminder: [], showAddBtn: true};
		//console.log(this.props);
		this.props.fetchReminders();
	}

	componentDidUpdate(prevProps) {
	    if (this.props.location !== prevProps.location) {
	      this.onRouteChanged();
	    }
    }

    onRouteChanged() {
       const location = this.props.location.pathname;
       if (location === '/reminders/add' || location.startsWith('/reminders/')) {
       	  this.setState({
       	  	showAddBtn: false
       	  })
       } else {
       	  this.setState({
       	  	showAddBtn: true
       	  })
       }
    }

    componentWillReceiveProps(next) {
    	//console.log(next);
    	this.setState({
    		reminder: next.reminder || []
    	})
    }

    componentDidMount() {
    	this.onRouteChanged();
    }

	render() {
		if (this.state.reminder) {
			return (
			<section class="reminder-container">
			<div class="alert alert-info reset alert-background">
                 <strong class="rem">REMINDERS</strong>
            </div>
			<p class={this.state.showAddBtn ? 'add' : 'add hide'}>
			  <Link to="/reminders/add"><button class="btn btn-sm btn-info">ADD REMINDER</button></Link>
			</p>
			<br/>
			    <article class={this.state.showAddBtn ? 'reminders-section' : 'reminders-section hide'}>
		                  {this.state.reminder.map((obj, index) => {
		                  	return (
                                    <div class="well" key={index}>
									  <Link to={`/reminders/${obj.id}`}><p>{obj.title}</p></Link>
									</div>
		                  		)
		                  })}
	             </article>
                 <Route exact path="/reminders/:id" component={CreateEditReminder}></Route>
             </section>
		   )
		}
		
	}
}

function mapStateToProps(state) {
  return {
  	reminder: state.reminderReducer
  }
}


export default connect(
  mapStateToProps, 
  {fetchReminders}
)(Reminder)