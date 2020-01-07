import React from "react";
import ReactDOM from "react-dom";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Alert extends React.Component {
	constructor(props) {
      super(props);
      this.state = {
      	 showAlert: false,
      	 message: '',
      	 type: ''
      }
	}

	componentWillReceiveProps(nextState, prevState) {
    if (nextState.alert && nextState.alert.statusCode == 200) {
        this.setState({
        showAlert: true,
        message: nextState.alert.message,
        type: nextState.alert.type
      })

      setTimeout(() => {
        this.setState({
          showAlert: false,
          message: '',
          type: ''
        })
      }, 5000);
    }
	} 

	render() {
		return (
            <div class={this.state.showAlert ? `alert alert-${this.state.type} alert-res alert-animate animated lightSpeedIn` : `alert alert-${this.state.type} alert-res alert-animate hide`}>
              <strong>Success!</strong> {this.state.message}
            </div>
		)
	}
}

function mapStateToProps(state) {
  return {
  	alert: state.commonReducer
  }
}

export default connect(
  mapStateToProps, 
  {}
)(Alert)