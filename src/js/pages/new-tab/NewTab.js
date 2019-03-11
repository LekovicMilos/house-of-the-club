import React, {Component} from 'react';
import {hot} from 'react-hot-loader';
import './NewTab.css';
import { listUsers, listEpics, searchStories, getEpics } from '../../api/fetch.js';
import { getRandomPhotos } from '../../api/imageFetch.js';
import { storiesInDevMapper, dueDatesMapper, storyPointsMapper, randomPhotosMapper } from '../../lib/mapper.js';
import moment from 'moment';
import { restoreFromStorage, saveToStorage } from '../../api/storage.js'
import ApiKeyCollector from '../api-key-collector';

class NewTab extends Component {
	constructor(props) {
		super(props);
		this.state = {
		  name: '',
		  storiesInDev: [],
			username: '',
			storyPoints: [],
			dueDates: [],
			randomPhotos: [],
			date: '',
			randomNumber: this.getRandomInt(0, 19)
		}
	}
	componentDidMount() {
		this.getStorage();
	}
	
	getStorage = async () => {
		await restoreFromStorage().then((json) => {
			const { api_key } = json;
			this.setState({
				token: api_key
			});
			const isAtLeastADayAgo = this.isADayAgo();
			if (!isAtLeastADayAgo && json.randomPhotos.length !== 0 && json.date !== '') {
				this.setState({
					date: json.date,
					randomPhotos: json.randomPhotos
				});
			} else {
				this.getPhoto();
			}
			return api_key;
		}).then(() => {
			if (this.state.token) {
				listEpics(this.state.token).then(resp => this.resetToken(resp));
				this.getProfileName(this.state.token);
				this.getEpicsStats(this.state.token);
			}
		})
	}

	resetToken = response => {
		if (response.status === 401) {
			this.setState({token: null});
		}
	}
	
	getProfileName = (token) => {
		listUsers(token).then(json => {
		  this.setState({
				name: json[0].profile.name,
				username: json[0].profile.mention_name
		  })
		}).then(() => this.getStoriesInDev(token));
	}

	setPhotos = (json) => {
		const randomPhotos = randomPhotosMapper(json.hits);
		const date = moment().format('YYYY MM DD');
		const newOptions = Object.assign({}, {
			...this.state.api_key,
			randomPhotos,
			date
		});
		this.setState({
			randomPhotos: randomPhotos,
			date
		})
		saveToStorage(newOptions);
	}
	
	getPhoto = () => {
		getRandomPhotos().then(json => {
			this.setPhotos(json);
		});
	}

	getEpicsStats = (token) => {
		getEpics(token).then(json => {
		  const storyPoints = storyPointsMapper(json);
		  this.setState({
				storyPoints
		  })
		});
	}
	
	getStoriesInDev = (token) => {
		searchStories(`owner:${this.state.username}`, token).then(json => {
			const dueDates = dueDatesMapper(json.data);
			const storiesInDev = storiesInDevMapper(json.data);
			this.setState({
				storiesInDev,
				dueDates
			})
		});
	}

	getRandomInt = (min, max) => {
    min = Math.ceil(min);
		max = Math.floor(max);
		const result = Math.floor(Math.random() * (max - min + 1)) + min;
    return result;
	}

	isADayAgo = () => {
		let yesterday = moment().subtract(1, 'days').format('YYYY MM DD');
		if (this.state.date === '') {
			return true;
		} else {
			return moment(this.state.date).isBefore(moment(yesterday));
		}
	}
	  
	render() {
		const { storiesInDev, dueDates, storyPoints, randomPhotos, token, randomNumber } = this.state;

		return (
		  <div className='App'>
			  {randomPhotos.length > 0 && <div className="background" style={{backgroundImage: `url(${randomPhotos[randomNumber].photo})`}}></div>}
				{token ? (
					<div>
						<div className="welcome">Hello{this.state.name && `, ${this.state.name}`}!</div>
						<h2>
						<small>TODAY'S WORK</small>
						{storiesInDev && storiesInDev.slice(0, 2).map((story, i) => (
							<div key={`story-${i}`}>
							{i !== 0 && storiesInDev.length !== 1 && <div className="and">and</div>}
							<a href={story.app_url} target="_blank">{story.name}</a>
							</div>
						))}
						</h2>
						{randomPhotos.length > 0 && (
							<div className="photo-info">
								<a href={randomPhotos[randomNumber].photoLink} target="_blank">Photo from Pixabay</a>
							</div>
						)}
						{storyPoints && (
							<div className="story-points">
							<h4>Epic points completion</h4>
							{storyPoints.slice(0, 4).map((epic, i) => (
								<div key={`epic-${i}`}><span>{epic.name}</span> {epic.num_points_done}/{epic.num_points}</div>
							))}
							</div>
						)}
						{dueDates && (
							<div className="due-dates">
							{dueDates.slice(0, 3).map((story, i) => (
							<a href={story.app_url} target="_blank" key={`dueDate-${i}`}><span>{story.name}</span> {moment(story.deadline).format("MMM D")}</a>
							))}
							<h4>Upcoming Due Dates</h4>
							</div>
						)}
					</div>
				) : (
					<ApiKeyCollector api_key={token} />
				)}
		  </div>
		);
	}
}

export default hot(module)(NewTab);
