import React, { Component } from 'react';
import firebase from './firebase';
import './App.css';
import Weather from "./components/Weather.js";


const API_KEY = "32853ecb0236dbf633462c2c86626029"; //weather
// const API_KEY2 = "AIzaSyBsBVRAi5jeJZ013mXKIxde_wZretysOUk"; //youtube

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      bookmarks: [], //bookmarks props
      userInput: '', //bookmark props
      city: undefined, //weather proprs
      country: undefined, //weather props
      temperature: undefined, //weather props
      description: undefined, //weather props
      wikiSearchReturnValues: [], //wiki props
      wikiSearchTerms: '', //wiki props
    };
  }

  
  componentDidMount(){
    const dbRef = firebase.database().ref(); //bookmark database
    dbRef.on('value', (response) => {
      const newState = []
      const data = response.val();
      for (let key in data) {
        newState.push({
          title: data[key],
        id: key,
      });
    }
    
    this.setState({
      bookmarks: newState,
    });
  });
}

handleChange = (event) => { //alert react to changes/update bookmark input
  this.setState({
    [event.target.name]: event.target.value
  })
};

handleClick = (event) => { // submit userinput to bookmark database, clear string
  event.preventDefault();
  const dbRef = firebase.database().ref();
  dbRef.push(this.state.userInput);
  this.setState({
    userInput: '',
  });
};

deleteBookmark = (bookmarkId) => { // tell firebase to delete bookmark based on unique ID
  const dbRef = firebase.database().ref();
  dbRef.child(bookmarkId).remove();
}

getWeather = async(e) => { // weather widgit
  e.preventDefault();
  const api_call = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=toronto,canada&APPID=${API_KEY}&units=metric`); //fetch toronto weather from api
  const data = await api_call.json(); //api call response stored in variable
  this.setState({
    city: data.name,
    country: data.sys.country,
    temperature: data.main.temp,
    description: data.weather[0].description
  })
}

//this wikipedia component's method was largely taken and tweaked from youtube video "making wikipedia api call with react"

changeWikiSearchTerms = (e) => { //alert react to changes/update wiki input
  this.setState({
    wikiSearchTerms: e.target.value
  });
}

useWikiSearchEngine = (e) => {
  e.preventDefault();

  const pointerToThis = this; 
  let url = "https://en.wikipedia.org/w/api.php"
  let params = {
    action: 'query',
    list: 'search',
    srsearch: this.state.wikiSearchTerms,
    format: 'json', 
  };
  url = url + '?origin=*';
  Object.keys(params).forEach((key) => {
    url += "&" + key + "=" + params[key];
  });

  fetch(url)
    .then(
      function (response) {
        return response.json();
      }
    )
    .then(
      function (response) {
    
        for (let key in response.query.search) {
          pointerToThis.state.wikiSearchReturnValues.push({
            queryResultPageFullURL: 'no link',
            queryResultPageID: response.query.search[key].pageid,
            queryResultPageTitle: response.query.search[key].title,
            queryResultPageSnippet: response.query.search[key].snippet
          });
        } 
      }
    )
    .then(
      function (response) {
        for (let key2 in pointerToThis.state.wikiSearchReturnValues) {
          let page = pointerToThis.state.wikiSearchReturnValues[key2];
          let pageID = page.queryResultPageID;
          let urlForRetrievingPageURLByPageID = `https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=info&pageids=${pageID}&inprop=url&format=json`;

          fetch(urlForRetrievingPageURLByPageID)
            .then(
              function (response) {
                return response.json()
              }
            )
            .then(
              function (response) {
      
                page.queryResultPageFullURL = response.query.pages[pageID].fullurl;

                pointerToThis.forceUpdate();
              }
            )
        }
      }
    )
}

render() {
  let wikiSearchResults = [];
  console.log(this.state.wikiSearchReturnValues);

  for (let key3 in this.state.wikiSearchReturnValues) {
    wikiSearchResults.push(
      <div className="searchResult" key={key3}>
        <h3><a href={this.state.wikiSearchReturnValues[key3].queryResultPageFullURL}>{this.state.wikiSearchReturnValues[key3].queryResultPageTitle}</a></h3>
        <p className="wikiDescription" dangerouslySetInnerHTML={{__html: this.state.wikiSearchReturnValues[key3].queryResultPageSnippet}}></p>      
    </div>
    )
  }

  return (
    <div className="App">
      <h1>Blog Research Dashboard</h1>


      <div className="bookmarks">
          <form>
            <input
              type="text"
              value={this.state.userInput}
              name="userInput"
              onChange={this.handleChange}
            />
            <button onClick={this.handleClick}>add link</button>
          </form>
          <ul>
            {this.state.bookmarks.map((bookmark) => {
              return (
              <li key={bookmark.id}>
                <a href={bookmark.title}>{bookmark.title}</a>
                <button onClick={() => this.deleteBookmark(bookmark.id)}>Delete</button>
              </li>
            );
            })}
          </ul>
      </div>


      <div className="torontoWeather">
        <form onSubmit={this.getWeather}>
          <button>get weather</button>
        </form>
          <Weather
            temperature={this.state.temperature}
            city={this.state.city}
            country={this.state.country}
            description={this.state.description}
        />
      </div>
      
      <div className="wikipedia"> 
        <form action="">
          <input type="text" value={this.state.wikiSearchTerms} onChange={this.changeWikiSearchTerms} placeholder='search wiki articles'/>
          <button type='submit' onClick={this.useWikiSearchEngine}>search</button>
        </form>
        {wikiSearchResults}
      </div>

    </div>
    );   
  };

};
export default App;
