import React from "react";
import ReactDOM from "react-dom";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Audio extends React.Component {
	constructor(props) {
      super(props);
      this.state = {};
	}

  componentWillReceiveProps(nextState, prevState) {
      if (nextState.playAudio === true) {
        const AUDIO = ReactDOM.findDOMNode(this);
        AUDIO.play();   
      }
  }


	render() {
		return (
        <audio controls>
          <source src="https://www.soundjay.com/misc/coin-drop-3.mp3
        " type="audio/mpeg"/>
          Your browser does not support the audio element.
        </audio>
		)
	}
}

function mapStateToProps(state) {
  return {
  	playAudio: state.commonReducer
  }
}

export default connect(
  mapStateToProps, 
  {}
)(Audio)