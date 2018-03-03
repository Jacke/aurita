import * as React from 'react';
import {GoogleMap, withGoogleMap, withScriptjs} from 'react-google-maps'
import {MapPosition} from './App';
import { compose, 
         withProps, 
         withState, 
         withHandlers } from "recompose";
interface GMapProps {
  onChange: any;
  localPosition: MapPosition;
  globalPosition: MapPosition;
  defaultLatLng: MapPosition;
  ref?:any;
  onMapMounted?:any;
}
interface GMapState {localPosition: any}

export const GOOGLE_MAP_URL = 'https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyBDdi6FWp1FF-aUJtE8DZyPJAlLtMMNwkE'

export default class GMap extends React.Component<GMapProps, GMapState> {
  constructor(props: GMapProps) {
    super(props);
    this.state = {localPosition: this.props.defaultLatLng};
  }   
  shouldComponentUpdate(nextProps: GMapProps, nextState: GMapState) {
    if ((nextProps.globalPosition == this.props.defaultLatLng && nextProps.localPosition == this.props.defaultLatLng) 
      || nextProps.globalPosition != this.props.globalPosition) {
      return true;
    }
    return false;
  }

  render() {
    const MyGoogleMap:React.ComponentClass<any> = compose<GMapProps, GMapState>(
        withProps({
          googleMapURL: GOOGLE_MAP_URL,
          loadingElement: <div style={{ height: `100%` }} />,
          containerElement: <div style={{ height: `400px` }} />,
          mapElement: <div style={{ height: `100%` }} />,
          onChange: this.props.onChange
        }),
        withState('position', 'onChange',  this.state.localPosition),
        withHandlers(() => {
          const refs = { map: undefined, }
          return {
            onMapMounted: () => (ref:any) => { refs.map = ref },
            onChange: (props: GMapProps) => () => {
                const map:any = refs.map
                let lat = map.getCenter().lat()
                let lng = map.getCenter().lng()
                this.props.onChange({lat, lng})
              }      
          }
          }),
          withScriptjs,
          withGoogleMap)(props =>  
            <GoogleMap
                defaultCenter={this.props.globalPosition}
                defaultZoom={3}
                onCenterChanged={props.onChange}
                ref={props.onMapMounted}        
                options={{disableDefaultUI: true}}>
            </GoogleMap>);
    return <MyGoogleMap/>;
  }
}