// // @flow

// import london_postcodes from "./json/Pts_of_Interest.json";

// export default class SampleComponent extends Component {
//   state = {
//     lat: 51.505,
//     lng: -0.09,
//     zoom: 12
//   };

//   geoJSONStyle() {
//     return {
//       color: "#1f2021",
//       weight: 1,
//       fillOpacity: 0.5,
//       fillColor: "#fff2af"
//     };
//   }

//   onEachFeature(feature, layer) {
//     const popupContent = ` <Popup><p>Customizable Popups <br />with feature information.</p><pre>Borough: <br />${feature.properties.name}</pre></Popup>`;
//     layer.bindPopup(popupContent);
//   }

//   render() {
//     console.log(london_postcodes.length);
//     const position = [this.state.lat, this.state.lng];
//     return (
//       <Map
//         center={position}
//         zoom={this.state.zoom}
//         style={{ width: "500px", height: "600px" }}
//       >
//         <TileLayer
//           attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         <GeoJSON
//           data={london_postcodes}
//           style={this.geoJSONStyle}
//           onEachFeature={this.onEachFeature}
//         />
//       </Map>
//     );
//   }
// }

// // import React, { Component } from "react";
// // import { Map, TileLayer, GeoJSON } from "react-leaflet";
// // import "leaflet/dist/leaflet.css";

// // import "leaflet-defaulticon-compatibility.css";
// // import * as L from "leaflet";
// // import "leaflet-defaulticon-compatibility";
// // const dummyGeoJson = {
// //   type: "FeatureCollection",
// //   features: [
// //     {
// //       type: "Feature",
// //       properties: {},
// //       geometry: {
// //         type: "Point",
// //         coordinates: [16.959285736083984, 52.40472293138462]
// //       }
// //     }
// //   ]
// // };

// // class SampleComponent extends React.Component {
// //   componentDidMount() {
// //     this.map = L.map("map", {
// //       center: [51.9194, 19.1451],
// //       zoom: 6
// //     });

// //     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
// //       maxZoom: 20
// //     }).addTo(this.map);
// //     var geoJsonLayer = L.geoJSON().addTo(this.map);
// //     geoJsonLayer.addData(dummyGeoJson);
// //   }

// //   render() {
// //     return <Wrapper width="100%" height="800px" id="map" />;
// //   }
// // }

import React from "react";
import * as L from "leaflet";
import dat1 from "./json/gdata.json";
import dat3 from "./json/Country_Boundary.json";
import dat5 from "./json/Pts_of_Interest.json";
import dat4 from "./json/Firestations.json";
import dat2 from "./json/Commissioner_Districts_Boundary.json";

const dummyGeoJson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Point",
        coordinates: [16.959285736083984, 52.40472293138462]
      }
    }
  ]
};

const customMarker = new L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40]
});

export default class SampleComponent extends React.Component {
  componentDidMount() {
    var layer1 = new L.LayerGroup();
    var layer2 = new L.LayerGroup();
    var layer3 = new L.LayerGroup();
    var layer4 = new L.LayerGroup();
    var layer5 = new L.LayerGroup();

    var x1 = L.geoJSON(dat1, {
      pointToLayer: (feature, latlng) => {
        return L.marker(latlng, { icon: customMarker });
      }
    });
    x1.addTo(layer1);

    var x2 = L.geoJSON(dat2, {
      pointToLayer: (feature, latlng) => {
        return L.marker(latlng, { icon: customMarker });
      }
    });
    x2.addTo(layer2);

    var x3 = L.geoJSON(dat3, {
      pointToLayer: (feature, latlng) => {
        return L.marker(latlng, { icon: customMarker });
      }
    });
    x3.addTo(layer3);

    var x4 = L.geoJSON(dat4, {
      pointToLayer: (feature, latlng) => {
        return L.marker(latlng, { icon: customMarker });
      }
    });
    x4.addTo(layer4);

    var x5 = L.geoJSON(dat5, {
      pointToLayer: (feature, latlng) => {
        return L.marker(latlng, { icon: customMarker });
      }
    });
    x5.addTo(layer5);

    var openmap = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 20
        }
      ),
      stmap = L.tileLayer(
        "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",
        {
          attribution: "",
          maxZoom: 20
        }
      );

    const map = L.map("map", {
      layers: [openmap]
    }).setView([51.9194, 19.1451], 6);

    var baseLayers = {
      "OSM Mapnik": openmap,
      Landscape: stmap
    };

    var overlays = {
      GeoData1: layer1,
      GeoData2: layer2,
      GeoData3: layer3,
      GeoData4: layer4,
      GeoData5: layer5
    };

    L.control.layers(baseLayers, overlays).addTo(map);
    // L.featureGroup([x1, x2, x3, x4, x5])
    //   .bindPopup("Hello world!")
    //   .on("click", function() {
    //     alert("Clicked on a member of the group!");
    //   })
    //   .addTo(map);
  }

  render() {
    return <div id="map" style={{ height: "100vh" }} />;
  }
}
