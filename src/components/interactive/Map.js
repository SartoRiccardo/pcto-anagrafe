import React from "react";
import {Map as LeafletMap, TileLayer} from "react-leaflet";

function Map(props) {
  const {zoom, children, center} = props;
  const size = {width: "100%", height: "100%"};
  const defaultCenter = [45.4275166, 10.9718752];  // Marconi

  return (
    <LeafletMap center={center || defaultCenter} zoom={zoom || 15} style={size}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
      />
      {children}
    </LeafletMap>
  );
}

export default Map;
