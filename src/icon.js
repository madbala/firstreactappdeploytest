import L from "leaflet";

const iconPerson = new L.Icon({
  iconUrl: require("./maplogo.svg"),
  iconRetinaUrl: require("./maplogo.svg"),
  iconAnchor: null,
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: new L.Point(20, 30),
  className: "leaflet-div-icon"
});
const iconPerson1 = new L.Icon({
  iconUrl: require("./maplogo1.svg"),
  iconRetinaUrl: require("./maplogo1.svg"),
  iconAnchor: null,
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: new L.Point(20, 30),
  className: "leaflet-div-icon"
});

export { iconPerson, iconPerson1 };
