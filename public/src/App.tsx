import * as React from 'react';
import './App.css';
import GMap from './components/GMap'
import axios from 'axios';
//import * as WebSocket from 'ws'
import { connect } from 'react-redux';
import { fetchPositionAction, setNewMapPosition } from './api/map_position/fetchPosition';
import { PositionEntityContainer, MapPosition } from './model';

const defaultLatLng:MapPosition = {lat: -25.363, lng: 131.044};

interface State { mapPositions: PositionEntityContainer }
interface Props {
  fetchMembers: () => void;
  setNewMapPosition: (position: PositionEntityContainer) => void;
  mapPositions : PositionEntityContainer; 
}

const mapStateToProps = ((state: State) => {
  console.log('state', state);
  return { mapPositions: state.mapPositions }
});

const mapDispatchToProps = (dispatch: ((fn: any) => void)) => ({
  fetchMembers: () => dispatch(fetchPositionAction()),
  setNewMapPosition: (position: PositionEntityContainer) => dispatch(setNewMapPosition(position)),
});

class App extends React.Component<Props, State> {
  connection: any;

  constructor(props: Props) {
    super(props);
    this.props.fetchMembers();
    if (WebSocket == undefined) {
      const WebSocket = {}; 
      console.log('Fallback for jest', WebSocket);
    } else {
      this.connection = new WebSocket('ws://localhost:9000/stream');
      this.connection.onmessage = (evt: any) => { 
        let newPosition:MapPosition = JSON.parse(evt.data)
        // Update position from websocket only if client has the old position
        if (this.props.mapPositions.localPosition.lat != newPosition.lat && this.props.mapPositions.localPosition.lng != newPosition.lng) {
          this.props.setNewMapPosition({localPosition: {lat: newPosition.lat, lng: newPosition.lng},
                        globalPosition: {lat: newPosition.lat, lng: newPosition.lng} })          
        }
      };    
    }
  }

  componentDidMount() {
    return axios.get(`/api/v1/mapPosition`)
      .then(res => {
        this.props.setNewMapPosition({localPosition: res.data, globalPosition: res.data })          
      }).catch(error => {
        console.log(error);
      });
  }

  handleSave = (e: React.MouseEvent<HTMLElement>) => {
    this.connection.send(JSON.stringify(this.props.mapPositions.localPosition));
    axios.post(`/api/v1/mapPosition/${this.props.mapPositions.localPosition.lat}/${this.props.mapPositions.localPosition.lng}`, {})
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  handleDefault = (e: React.MouseEvent<HTMLElement>) => {
    this.props.setNewMapPosition({localPosition: defaultLatLng, globalPosition: defaultLatLng })          
  }
  _onChange = (e: MapPosition) => {
    let newState = Object.assign({}, this.props.mapPositions, {localPosition: e });
    this.props.setNewMapPosition(newState)  
  }


  render() {
    console.log('this.props.globalPosition', this.props);
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
          globalPosition={this.props.mapPositions.globalPosition}
          localPosition={this.props.mapPositions.localPosition}
          defaultLatLng={defaultLatLng} />
        <p className="App-intro"></p>
      </div>
    );
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);