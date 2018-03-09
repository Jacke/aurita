import * as React from 'react';
import {GoogleMap, withGoogleMap, withScriptjs, OverlayView, Marker, InfoWindow } from 'react-google-maps'
import { compose, 
         withProps, 
         withState, 
         withHandlers,
         withStateHandlers } from "recompose";
import { MapPosition } from '../model';
import HeatmapLayer from "react-google-maps/lib/components/visualization/HeatmapLayer";


interface GMapProps {
  onChange: any;
  localPosition: MapPosition;
  globalPosition: MapPosition;
  defaultLatLng: MapPosition;
  ref?:any;
  onMapMounted?:any;
  onToggleOpen?: any;
  isOpen?: any;
}
interface GMapState {localPosition: any; }

export const GOOGLE_MAP_URL = 'https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyBDdi6FWp1FF-aUJtE8DZyPJAlLtMMNwkE&libraries=visualization'

const getPixelPositionOffset = (width:any, height:any) => ({
  x: -(width / 2),
  y: -(height / 2),
})


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
        withStateHandlers(() => ({
          isOpen: false,
        }), {
          onToggleOpen: ({ isOpen }) => () => ({
            isOpen: !isOpen,
          })
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

 <OverlayView
      position={{ lat: -34.397, lng: 150.644 }}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      getPixelPositionOffset={getPixelPositionOffset}>
      <div style={{ background: `white`, border: `1px solid #ccc`, padding: 15 }}></div>
    </OverlayView>

    <Marker
      position={{ lat: -30.397, lng: 150.644 }}
      onClick={props.onToggleOpen}
    >
      {props.isOpen && <InfoWindow onCloseClick={props.onToggleOpen}>
        <b>Test</b>
      </InfoWindow>}
    </Marker>

                  <HeatmapLayer 
                    data = {[
                new google.maps.LatLng(37.782551, -122.445368),
                new google.maps.LatLng(37.782745, -122.444586),
                new google.maps.LatLng(37.782842, -122.443688),
                new google.maps.LatLng(37.782919, -122.442815),
                new google.maps.LatLng(37.782992, -122.442112),
                new google.maps.LatLng(36.783100, -120.441461)
                        ]}/>
            </GoogleMap>);
    return <MyGoogleMap/>;
  }
}