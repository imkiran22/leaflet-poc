import axios from "axios";

export function fetchReminders() {
	//const URL = 'reminderList.json';
	return {
		type: 'FETCH_REMINDERS',
		payload: /*axios.get(URL)*/JSON.parse(localStorage.getItem('reminders') || '[]')
	}
}


export function addReminders(obj) {
	let data = JSON.parse(localStorage.getItem('reminders') || '[]');
    data.push(obj);
    localStorage.setItem('reminders', JSON.stringify(data));
    return {
		type: 'FETCH_REMINDERS',
		payload: data
	}
}

export function displayAlert(message) {
	return {
		type: 'DISPLAY_ALERT',
		payload: message
	}
}

export function playAudio() {
	return {
		type: 'PLAY_AUDIO',
		payload: true
	}
}