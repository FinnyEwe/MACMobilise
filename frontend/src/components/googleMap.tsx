import React from "react";
import GoogleMapReact from 'google-map-react';

const AnyReactComponent: any = ({ text }: { text: string }) => <div>{text}</div>;

export default function SimpleMap(){
  const defaultProps = {
    center: {
      lat: -37.840935,
      lng: 144.946457
    },
    zoom: 11
  };

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '100%', width: '80%' }} className="rounded overflow-hidden" >
      <GoogleMapReact
        bootstrapURLKeys={{ key: "" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}

      >
        <AnyReactComponent
          lat={-37.840935}
          lng={144.946457}
          text="My Marker"
        />
      </GoogleMapReact>
    </div>
  );
}