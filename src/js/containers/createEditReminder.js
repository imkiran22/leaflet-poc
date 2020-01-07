import React from "react";
import ReactDOM from "react-dom";
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import { fetchReminders, addReminders, displayAlert } from '../actions';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

class CreateEditReminder extends React.Component {
   reminderId = null;
   constructor(props) {
     super(props);
     this.state = {
   	 	reminderTitle: '',
   	 	lastCutoffTime: moment(),
   	 	title: '',
     	desc: ''
   	 };
   }

   componentDidMount() {
   	 this.triggerRouteChange(this.props);
   }

   setTitle() {
   	 return this.reminderId == 'add' ? 'ADD' : 'EDIT'; 
   }

   addMode() {
     this.setState({
	      reminderTitle: this.reminderId == 'add' ? 'ADD' : 'EDIT',
	   	 	lastCutoffTime: moment(),
	   	 	title: '',
	     	desc: ''
	  })
   }

   editMode() {
	    const reminderObj = this.props.reminder.filter((obj) => {
	   	 	return obj.id == this.reminderId;
	   	 })[0];
	   	if (reminderObj && Object.keys(reminderObj).length) {
	   	 	this.setState({
		   	 	lastCutoffTime: moment(new Date(reminderObj.lastCutoffTime)),
		   	 	title: reminderObj.title || '',
		     	desc: reminderObj.desc || ''
	   	 	})
	   	 }
   }

   triggerRouteChange(nextState) {
   	 const id = nextState.match && nextState.match.params && nextState.match.params.id ? nextState.match.params.id : null;
   	 this.reminderId = id;
   	 if (this.reminderId == 'add') {
   	 	this.addMode();
   	 } else {
   	 	this.editMode();
   	 }
   }

   handleChange(key, ev) {
   	 //console.log(ev);
   	 var obj = {};
   	 if (key ===  'lastCutoffTime') {
   	 	obj[key] = ev;
   	 } else {
   	 	obj[key] = ev.target && ev.target.value;
   	 }
   	 this.setState(obj);
   }

   componentWillReceiveProps(nextState, prevState) {
   	 //console.log(this.props);
   	 if (nextState.match.params.id != this.reminderId) {
   	 	this.triggerRouteChange(nextState);
   	 }
   }

   handleSubmit(ev) {
     ev.preventDefault();
     console.log(this.state);
     let date = new Date();
     let obj = {
        "id": date.valueOf(),
        "title": this.state.title,
        "desc": this.state.desc,
        "lastCutoffTime": this.state.lastCutoffTime.toString(),
        "createdTime": date.toString()
     };
     this.props.addReminders(obj);
     this.props.displayAlert({message: 'ADDED IN LOCAL STORAGE', statusCode: 200, type: 'success'});
     this.addMode();
     this.props.history.push('/reminders');
   }

   render() {
     return (
        <article class="create-reminder">
	        <h1>{this.state && this.state.reminderTitle ? this.state.reminderTitle : 'ADD'} REMINDER</h1>
	        <form name="create-edit-reminder" onSubmit={this.handleSubmit.bind(this)}>
			    <div class="form-group">
			      <label for="title">Title:</label>
			      <input type="text" class="form-control" id="title" placeholder="Enter title" name="title" value={this.state.title} onChange={this.handleChange.bind(this, 'title')} required/>
			    </div>
			    <div class="form-group">
			      <label for="desc">Desc:</label>
			      <textarea class="form-control" id="desc" placeholder="Enter description" name="desc" value={this.state.desc} onChange={this.handleChange.bind(this, 'desc')} required/>
			    </div>
			    <div class="form-group">
			      <label>Select a time</label>
                   <DatePicker required 
                        className="form-control width-200" 
					    selected={this.state && this.state.lastCutoffTime ? this.state.lastCutoffTime : moment()}
					    onChange={this.handleChange.bind(this, 'lastCutoffTime')}
					    showTimeSelect
					    timeFormat="HH:mm:ss"
					    timeIntervals={1}
					    dateFormat="LLL"
					/>
			    </div>
			    <button class="btn btn-default">Submit</button>
	        </form>
        </article>
     );
   }
}

function mapStateToProps(state) {
  return {
  	reminder: state.reminderReducer
  }
}

export default connect(mapStateToProps, {fetchReminders, addReminders, displayAlert})(CreateEditReminder)
