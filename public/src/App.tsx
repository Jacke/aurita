import * as React from 'react';
import './App.css';
import GMap from './GMap'
import axios from 'axios';
//import * as WebSocket from 'ws'

export interface MapPosition {
    lat: number;
    lng: number;
}
const defaultLatLng:MapPosition = {lat: -25.363, lng: 131.044}

interface State {
  localPosition: MapPosition;
  globalPosition: MapPosition;
}
interface Props {}

class App extends React.Component<Props, State> {
  connection: any;

  constructor(props: any) {
    super(props);
    this.state = {localPosition: {lat: 0, lng: 0}, globalPosition: {lat: 0, lng: 0} };
    if (WebSocket == undefined) {
      const WebSocket = {}; 
      console.log('Fallback for jest', WebSocket);
    } else {
      this.connection = new WebSocket('ws://localhost:9002/stream');
      this.connection.onmessage = (evt:any) => { 
        let newPosition:MapPosition = JSON.parse(evt.data)
        // Update position from websocket only if client has the old position
        if (this.state.localPosition.lat != newPosition.lat && this.state.localPosition.lng != newPosition.lng) {
          this.setState({localPosition: {lat: newPosition.lat, lng: newPosition.lng},
                        globalPosition: {lat: newPosition.lat, lng: newPosition.lng} });
        }
      };    
    }
  }

  componentDidMount() {
    return axios.get(`/api/v1/mapPosition`)
      .then(res => {
        this.setState({localPosition: res.data, globalPosition: res.data });
      }).catch(error => {
        console.log(error);
      });
  }

  handleSave = (e: any) => {
    this.connection.send(JSON.stringify(this.state.localPosition));
    axios.post(`/api/v1/mapPosition/${this.state.localPosition.lat}/${this.state.localPosition.lng}`, {})
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  handleDefault = (e: any) => this.setState(prevState => ({localPosition: defaultLatLng, globalPosition: defaultLatLng }))
  _onChange = (e: MapPosition) => this.setState({localPosition: e })


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src='/assets/images/4d7.png' className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Aurita</h1>
          <button onClick={this.handleDefault}>
            Default position
          </button>
          <button onClick={this.handleSave}>
            Save current
          </button>                    
        </header>
        <GMap 
          onChange={this._onChange} 
          globalPosition={this.state.globalPosition}
          localPosition={this.state.localPosition}
          defaultLatLng={defaultLatLng} />
        <p className="App-intro"></p>
      </div>
    );
  }
}

export default App;
