import React, { Component } from 'react';
import WorldMap from './components/WorldMap.js'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Map quiz</h1>
        </header>
        <WorldMap className="center"></WorldMap>
      </div>
    );
  }
}

export default App;
