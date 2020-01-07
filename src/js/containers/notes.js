import React from "react";
import ReactDOM from "react-dom";
import { connect } from 'react-redux';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
const style = {
  marginTop: -10,
};
const cStyle = {
  height: 100,
  width: 100,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block',
};
//import DatePicker from 'react-datepicker';
//import { fetchReminders, addReminders } from '../actions';
//import moment from 'moment';
//import 'react-datepicker/dist/react-datepicker.css';

export default class Notes extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		   open: false,
		   disabled:true
		};
	}

	handleOpen = () => {
       this.setState({open: true});
    }

    handleClose = () => {
       this.setState({open: false, disabled: true});
    }

    handleChange = () => {
    	this.setState({
    		disabled: false
    	})
    }

    Node = (i) => {
    	return (<h1>Node {i}</h1>)
    }

    displayNotes() {
        let DOM = []
    	let i = 0;
        while (i < 5) {
            DOM.push(<Paper style={cStyle} zDepth={1} children={this.Node(i)}>
        </Paper>)
        	i++;
        }
        return DOM;
    }



	render() {
		const actions = [
	      <FlatButton
	        label="Cancel"
	        secondary={true}
	        onClick={this.handleClose}
	      />,
	      <FlatButton
	        label="Submit"
	        default={true}
	        disabled={this.state.disabled}
	        onClick={this.handleClose}
	      />,
	    ];
		return (
			<section class="notes module">
              <div class="alert alert-info reset alert-background">
                 <strong class="rem">NOTES</strong>
                  <FloatingActionButton class="pull-right" onClick={this.handleOpen}  mini={true} style={style} backgroundColor="#1B95E0">
                      <ContentAdd />
              </FloatingActionButton>
              </div>
              <Dialog
          title="Add a New Note"
          actions={actions}
          modal={true}
          open={this.state.open}
        >
          <TextField
      hintText="Write a Note"
      fullWidth={true} multiLine={true} onChange={this.handleChange}
    />
        </Dialog>	
        <Paper style={cStyle} zDepth={1} children={this.Node()}>
        </Paper>

        {this.displayNotes()}
            </section>
        
		)
	}
} 