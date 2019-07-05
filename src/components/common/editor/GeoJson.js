import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { setNotification } from 'utils/notifications';

const Map = styled.div`
  width: 100%;
  height: 70vh;
  z-index: 1;
`;

class GeoJson extends Component {
  componentDidMount() {
    try {
      this.map = L.map('map', {
        center: [0, 0],
        zoom: 5,
        layers: [
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          })
        ]
      });

      const geoJsonData = JSON.parse(this.props.file.content);
      const geojsonLayer = L.geoJson(geoJsonData).addTo(this.map);

      this.map.fitBounds(geojsonLayer.getBounds());
    } catch (error) {
      setNotification({
        title: 'NOTE!',
        body: `Looks like invalid JSON string in <b>${this.props.file.filename}</b>`,
        type: 'error'
      });
    }
  }

  render() {
    return <Map id="map"/>;
  }
}

GeoJson.propTypes = {
  file: PropTypes.object
};

export default GeoJson;
