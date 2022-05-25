// @flow
import React from 'react';
import {Component} from 'react';

import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import L from 'leaflet'
import 'leaflet-defaulticon-compatibility';
import styled from 'styled-components'

//Setting the width and height of the map.
const Wrapper = styled.div`width: ${props => props.width}; height: ${props => props.height}; position: relative; left: 300px;`

//Defining the Map used for the hosts who want to update the coordinates of the room.
class EditMap extends Component{

    constructor(props){
        super(props)

        this.onMapClick = this.onMapClick.bind(this)
        this.popupPop = this.popupPop.bind(this)
    }

    //Whenever a host clicks on the map a popup is created showing the coordinates he specified.
    onMapClick(e) {
         
        let popup = L.popup();

        popup
        .setLatLng(e.latlng)
        .setContent("You have specified the new location of this room at " + e.latlng.toString())
        .openOn(this.map);
         
        this.props.form_state.handleGeoChange(e.latlng) 
    }

    //Whenever the mouse enters the map, a marker shows up showing the last specified location of the room.
    popupPop(e){

        let marker = L.marker([this.props.form_state.lat, this.props.form_state.lng]).addTo(this.map);
        marker.bindPopup("This is the room's current location.").openPopup();

    }
    
    //Defining the map's information.
    componentDidMount(){

        
        this.map = L.map('map',{center:[37.98,23.72],zoom:6,zoomControl:false})
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map)

        
        this.map.on('click', this.onMapClick);
        this.map.on('mouseover', this.popupPop);        
    }

    //Rendering the map.
    render(){
        return(<Wrapper width="600px" height="400px" id="map" />  )
    }


}

export default EditMap