import React, {Component} from 'react';
import {hot} from 'react-hot-loader';
import {restoreFromStorage, saveToStorage} from '../../api/storage';
import './ApiKeyCollector.css';

class ApiKeyCollector extends Component {
	constructor(props) {
		super(props);
		this.state = {
			api_key: props.api_key,
			submitted: false
		}
	}
	componentDidMount() {
	}

	getStorage = async () => {
		return await restoreFromStorage().then((json) => {
			const { api_key } = json;
			return api_key;
		})
	}

	handleChange = (event) => {
		this.setState({api_key: event.target.value});
	  }
	

	handleOnClick = () => {
		const newOptions = Object.assign({}, {
			api_key: this.state.api_key,
		});
		this.setState({submitted: true});
		saveToStorage(newOptions);
	}

	render() {
		const { api_key, submitted } = this.state;
		return (
			<div>
				<h1>Enter your Clubhouse API KEY</h1>
				<input placeholder="Your API key" value={api_key ? api_key : ''} onChange={this.handleChange}></input>
				<button onClick={this.handleOnClick}>Apply</button>
				{submitted && <h3>Registered! You will get everything with the next new tab!</h3>}
			</div>
		);
	}
}

export default hot(module)(ApiKeyCollector);
