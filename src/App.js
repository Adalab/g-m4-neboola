import React from 'react';
import Login from './components/Login';
import { Route, Switch } from 'react-router-dom';
import Profile from './components/Profile';
import Info from './components/Info';
import NewRequest from './components/NewRequest';
import './scss/App.scss';

class App extends React.Component {
  constructor(props) {
    super(props);

		this.state = {
			data: {},
			email: '',
      collapsaibleId: 'col-1',
      startDate:'',
      endDate:'',
      currentDay:'',
      comment:''
		}

		this.getEmail = this.getEmail.bind(this);
    this.getFetch = this.getFetch.bind(this);
    this.getUser = this.getUser.bind(this);
    this.deleteLS = this.deleteLS.bind(this);
    this.getDate = this.getDate.bind(this);
    this.getCurrentDate = this.getCurrentDate.bind(this);
  }
  componentDidMount(){
    this.getUser()
    this.getCurrentDate()
  }

  getUser(){
    const ls = JSON.parse(localStorage.getItem('User'));
    if(ls !== null){
      this.setState({
        email: ls.email,
        data:ls.data,
        startDate:ls.startDate,
        endDate:ls.endDate,
        comment:ls.comment
      })
    }
  }

  getCurrentDate(){
    const date = new Date();
    const year= date.getFullYear();
    let month= parseInt(date.getMonth())+1;
    let day= date.getDate();
    if (parseInt(day)< 10){
      day='0'+day
    }
    if (parseInt(month)< 10){
      month ='0'+ month
    }
    const currentDay=year + '-' + month + '-'+ day;
    console.log(currentDay)
    this.setState({
      currentDay:currentDay
    },() => {localStorage.setItem('User', JSON.stringify(this.state))})
  }

 handleCollapsable(event) {
    const newCollapsablesId = event.currentTarget.getAttribute('data-id');
    this.setState(prevState => {
      if (newCollapsablesId === prevState.collapsablesId) {
        return {
          collapsablesId: null
        }
      } else {
        return {
          collapsablesId: newCollapsablesId
        }
      }
    })
  }
	
	getEmail(event) {
		const newEmail = event.currentTarget.value;
		this.setState({
			email: newEmail
		},() => {localStorage.setItem('User', JSON.stringify(this.state))});
	}

	getFetch() {
		const ENDPOINT = 'https://neboola-holidays-api.herokuapp.com/open/users/';
		console.log(ENDPOINT + this.state.email);
		fetch(ENDPOINT + this.state.email)
		.then(response =>response.json())
    .then(data =>  
      this.setState({
      data: data
    },
    () => {
      localStorage.setItem('User', JSON.stringify(this.state))
    }
    
    ))
    .catch(error => { console.log(error)});
  }
  deleteLS() {
    localStorage.removeItem('User');
    this.setState({
      data: {},
      email: ''
    })
  }
  getDate(event){
    const dateInput = event.currentTarget.value;
    const nameDateState =event.currentTarget.name;
    this.setState({
      [nameDateState]:dateInput
    },() => {
      localStorage.setItem('User', JSON.stringify(this.state))
    })
  }

  render() {
		const {email, data, startDate, endDate, currentDay, comment} = this.state;
    return (
      <div className="app">
        <Switch>
	        <Route exact path="/" render={
						() => {
							return(
								<Login 
									getEmail = {this.getEmail}
									email = {email}
									getFetch = {this.getFetch}
								/>
							);
						}}
					/>
          <Route exact path="/profile" render={
						() => {
							return (
							<Profile 
                getEmail = {this.getEmail}
                getFetch = {this.getFetch}
                email = {email}
                data={data}
                deleteLS={this.deleteLS}
							/>
							)
						}} 
					/>
          <Route exact path="/profile/new-request" render={
						() => {
							return(
							<NewRequest 
								email = {email}
                getDate ={this.getDate}
                startDate={startDate}
                endDate={endDate}
                currentDay={currentDay}
                comment ={comment}
							/>
						);
						}
					}
					/>
					<Route exact path="/profile/info" render={
						() => {
							return(
							<Info 
								email = {email}
								handleCollapsable={this.handleCollapsable}
							/>
						);
						}
					}
					/>
        </Switch>
      </div>
    );
  }
}

export default App;
