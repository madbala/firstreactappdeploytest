import React from "react";
import "./style.less";
import "antd/dist/antd.css";
import { Row, Col } from "antd";
import { Tabs } from "antd";
import { Menu, Switch } from "antd";
import { Table, Descriptions } from "antd";
import dat1 from "./json/gdata.json";
import dat2 from "./json/Commissioner_Districts_Boundary.json";
import dat3 from "./json/Country_Boundary.json";
import dat4 from "./json/Firestations.json";
import dat5 from "./json/Pts_of_Interest.json";
// import dat5 from "./json/Schools.geojson";

import {
  MailOutlined,
  CalendarOutlined,
  AppstoreOutlined,
  SettingOutlined
} from "@ant-design/icons";

import { iconPerson, iconPerson1 } from "./icon";
import L, { latLng } from "leaflet";
import cm_studentss from "./student.json";
import cm_teacherss from "./teacher.json";
import heatmap_pointss from "./heatmap_points.json";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2
} from "react-html-parser";
import ReactMarkDown from "react-markdown";
import JsxParser from "react-jsx-parser";
import {
  Map,
  TileLayer,
  GeoJSON,
  CircleMarker,
  Popup,
  withLeaflet,
  ZoomControl,
  LayerGroup,
  LayersControl,
  Marker
} from "react-leaflet";

// import MarkerClusterGroup from "react-leaflet-markercluster";
import MarkerClusterGroup from "./markerCluster";
import HeatmapLayer from "react-leaflet-heatmap-layer";
import "leaflet/dist/leaflet.css";
import VectorGridDefault from "react-leaflet-vectorgrid";
//import "./styles.scss";
import "./markercluster.css";
// let dat5 = require("./json/Pts_of_Interest.json");
const vectorOptions = {
  type: "protobuf",
  url:
    "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/tile/{z}/{y}/{x}.pbf",
  vectorTileLayerStyles:
    "https://www.arcgis.com/sharing/rest/content/items/5e9b3685f4c24d8781073dd928ebda50/resources/styles/root.json?f=pjson",
  subdomains: "abc"
};
const { SubMenu } = Menu;
const { TabPane } = Tabs;
const columns = [
  {
    title: "Name",
    dataIndex: "student_first_name",
    key: "student_first_name",
    render: text => <a>{text}</a>
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age"
  },
  {
    title: "Address",
    dataIndex: "student_address",
    key: "student_address"
  }
];

const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"]
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"]
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
    tags: ["cool", "teacher"]
  },
  {
    key: "4",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"]
  },
  {
    key: "5",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"]
  },
  {
    key: "6",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
    tags: ["cool", "teacher"]
  }
];
const VectorGrid = withLeaflet(VectorGridDefault);
const { BaseLayer, Overlay } = LayersControl;
const createClusterCustomIcon = cluster => {
  var tempDeviceCount = "";
  const count = cluster.getChildCount();
  let size = "LargeXL";

  if (count < 10) {
    size = "Small";
  } else if (count >= 10 && count < 100) {
    size = "Medium";
  } else if (count >= 100 && count < 500) {
    size = "Large";
  }
  const options = {
    cluster: `markerCluster${size}`
  };

  let values = [];
  cluster.getAllChildMarkers().forEach((n, indx) => {
    if (n.options.devices) {
      let isExist = false;

      values.forEach(val => {
        if (val.label === n.options.devices) {
          isExist = true;
          val.count = val.count++;
        }
      });

      if (!isExist) {
        values.push({ devices_Count: n.options.devices, count: 1 });
        tempDeviceCount = values[indx].devices_Count;
      }
    }
  });

  values.forEach(n => {
    if (n.count) {
      n.perc = (n.count / cluster.getAllChildMarkers().length) * 100;
    }
  });

  return L.divIcon({
    html: `
    <svg height="30" width="30" viewBox="0 0 20 20">
      <circle r="10" cx="10" cy="10" fill="#193a5c" />
      <circle r="5" cx="10" cy="10" fill="transparent"
              stroke="#f68a39"
              stroke-width="10"
              stroke-dasharray="calc(${tempDeviceCount} * 31.4 / 100) 31.4"
              transform="rotate(-90) translate(-20)" />
    </svg>
  `,
    className: `${options.cluster}`
  });
};
function callback(key) {
  console.log(key);
}

export default class SampleComponent extends React.Component {
  constructor(props) {
    super(props);
    // 51.505,-0.09
    this.state = {
      clp: true,
      dataSam: null,
      mode: "inline",
      theme: "dark",
      fulKey: "hi",
      lat: 51.505,
      lng: -0.09,
      zoom: 18,
      config: {
        studentFirstName: "student_first_name",
        studentMiddleName: "student_middle_name",
        studentLastName: "student_last_name",
        VIPVAL: 100,
        center: [34.02409, -118.36744],

        layers: [
          {
            type: "heatmap",
            id: "heatmap_points",
            name: "Covid 19 Affected Areas"
          },
          {
            type: "marker",
            id: "cm_students",
            name: "Students",
            img: window.location.origin + "/images/community_view/student.png",
            VIPVAL: 100,
            VIPCOLOR: { color: "purple" },
            rang: [
              {
                min: 51,
                max: 100
              },
              {
                min: 11,
                max: 50
              },
              {
                min: 0,
                max: 10
              }
            ],
            rangeColor: [
              { color: "red" },
              { color: "blue" },
              { color: "green" }
            ],
            popupStructure: `<div style={{ margin: "10px", width: "250px" }}><img src={layer.img} alt="Profile Photo" style={{height: "55px",width: "55px",position: "absolute",transform: "translate(-39px, -5px)"}}/><div style={{ marginLeft: "20px", height: "40px" }}>{student_first_name} {" -- "}{student_middle_name}{" -- "}{student_last_name} {" -- "}{layer.name}{"Lat-"}{latitude}{"lon -"}{longitude}</div></div><div style={{ height: "40px", backgroundColor: "#0e253d" }}></div>`
          },
          {
            type: "markerTeacher",
            id: "cm_teachers",
            name: "Teachers",
            img: window.location.origin + "/images/community_view/student.png",
            VIPVAL: 100,
            VIPCOLOR: { color: "purple" },
            rang: [
              {
                min: 51,
                max: 100
              },
              {
                min: 11,
                max: 50
              },
              {
                min: 0,
                max: 10
              }
            ],
            rangeColor: [
              { color: "red" },
              { color: "blue" },
              { color: "green" }
            ],
            popupStructure: `<div style={{ margin: "10px", width: "250px" }}><img src={layer.img} alt="Profile Photo" style={{height: "55px",width: "55px",position: "absolute",transform: "translate(-39px, -5px)"}}/><div style={{ marginLeft: "20px", height: "40px" }}>{student_first_name} {" -- "}{student_middle_name}{" -- "}{student_last_name} {" -- "}{layer.name}</div></div><div style={{ height: "40px", backgroundColor: "#0e253d" }}></div>`
          },
          {
            type: "geoData1",
            id: "heatmap_points",
            name: "GeoData1"
          },
          {
            type: "geoData2",
            id: "heatmap_points",
            name: "GeoData2"
          },
          {
            type: "geoData3",
            id: "heatmap_points",
            name: "GeoData3"
          },
          {
            type: "geoData4",
            id: "heatmap_points",
            name: "GeoData4"
          },
          {
            type: "geoData5",
            id: "heatmap_points",
            name: "GeoData5"
          }
        ],
        enrichedSources: ["cm_teachers", "cm_students", "heatmap_points"]
      },
      cm_teachers: cm_teacherss,
      cm_students: cm_studentss,
      heatmap_points: heatmap_pointss
    };

    if (this.state.cm_students) {
      this.state.cm_students.map(obj => {
        if (obj.poverty === "YES") {
          return (
            (obj["studentRange"] = this.state.config.VIPVAL),
            (obj["devices"] = (Math.random() * 100).toFixed())
          );
        } else {
          return (
            (obj["studentRange"] = (Math.random() * 100).toFixed()),
            (obj["devices"] = (Math.random() * 100).toFixed())
          );
        }
      });
    }
    if (this.state.cm_teachers) {
      this.state.cm_teachers.map(obj => {
        return (obj["studentRange"] = (Math.random() * 100).toFixed());
      });
    }

    this.setState(state => {
      return {
        cm_students: state.cm_students,
        cm_teachers: state.cm_teachers,
        fulKey: Object.keys(state.cm_students)
      };
    });
  }

  changeMode = value => {
    this.setState({
      clp: !value
    });
  };

  changeTheme = value => {
    this.setState({
      theme: ""
    });
  };
  componentWillMount = () => {
    //     this.props.config.enrichedSources.forEach(n => {
    //       AppDataLoader.watch(n, data => {
    //         this.setState({
    //           n: data
    //         })
    //       })
    //     })
  };

  renderHeatMap = layer => {
    let data = this.state.cm_students;

    if (data) {
      return (
        <HeatmapLayer
          points={data}
          longitudeExtractor={m => m.longitude}
          latitudeExtractor={m => m.latitude}
          intensityExtractor={m => parseFloat(m.intensity)}
          minOpacity={0.1}
          gradient={{ 0.7: "#9dd7bd", 0.9: "#edeba3", 1.0: "#f8ba9c" }}
        />
      );
    }
  };

  renderCircleMarkers = (layer, ck) => {
    let data = this.state[layer.id];

    if (data) {
      return data.map(n => {
        var popupContent = this.state.config.layers[ck].popupStructure;
        var objKey = Object.keys(n);
        objKey.map(dynObj => {
          if (popupContent.includes(dynObj)) {
            popupContent = popupContent.replace(dynObj, `"${n[dynObj]}"`);
          }
        });

        return this.state.config.layers[ck].rang.map((r, i) => {
          if (n.studentRange >= r.min && n.studentRange <= r.max) {
            if (n.studentRange === this.state.config.layers[ck].VIPVAL) {
              return (
                <CircleMarker
                  onClick={() => {
                    this.setState(state => {
                      return {
                        dataSam: [{ ...n }]
                      };
                    });
                    console.log({ ...n });
                    console.log(this.state.dataSam);
                    console.log(this.state.dataSam[0].student_first_name);
                  }}
                  center={[n.latitude, n.longitude]}
                  radius={8}
                  fillOpacity={0.7}
                  color={this.state.config.layers[ck].VIPCOLOR.color}
                  {...n}
                >
                  <Popup
                    position="top"
                    offset={[-8, -2]}
                    opacity={1}
                    className={"react-leaflet-popup"}
                    {...n}
                  >
                    <JsxParser jsx={popupContent} />
                    {/* <ReactMarkDown source={popupContent} escapeHtml={false} /> */}
                    {/* ReactHtmlParser(popupContent) */}
                  </Popup>
                </CircleMarker>
              );
            } else {
              return (
                <CircleMarker
                  center={[n.latitude, n.longitude]}
                  radius={8}
                  fillOpacity={0.7}
                  color={this.state.config.layers[ck].rangeColor[i].color}
                  {...n}
                  onClick={() => {
                    this.setState(state => {
                      return {
                        dataSam: [{ ...n }]
                      };
                    });
                    console.log({ ...n });
                    console.log(this.state.dataSam);
                    console.log(this.state.dataSam[0].student_first_name);
                  }}
                >
                  <Popup
                    position="top"
                    offset={[-8, -2]}
                    opacity={1}
                    className={"react-leaflet-popup"}
                  >
                    <div style={{ margin: "10px", width: "250px" }}>
                      <img
                        src={layer.img}
                        alt="Profile Photo"
                        style={{
                          height: "55px",
                          width: "55px",
                          position: "absolute",
                          transform: "translate(-39px, -5px)"
                        }}
                      />
                      <div style={{ marginLeft: "20px", height: "40px" }}>
                        {n[this.state.config.studentFirstName]} {" -- "}
                        {n[this.state.config.studentMiddleName]}
                        {" -- "}
                        {n[this.state.config.studentLastName]} {" -- "}
                        {layer.name}
                      </div>
                    </div>
                    <div
                      style={{ height: "40px", backgroundColor: "#0e253d" }}
                    ></div>
                  </Popup>
                </CircleMarker>
              );
            }
          }
        });
      });
      //   <Marker
      //   key={n.ssid}
      //   position={[n.latitude, n.longitude]}
      //   className={"react-leaflet-popup"}
      //   icon={layer.name === "Students" ? iconPerson : iconPerson1}
      //   {...n}
      // >
      //   {/* <Popup>
      //     <span>hi i am</span>
      //   </Popup> */}
      // </Marker>
    }
  };

  geoJSONStyle() {
    return {
      color: "#1f2021",
      weight: 1,
      fillOpacity: 0.5,
      fillColor: "#fff2af"
    };
  }

  onEachFeature(feature, layer) {
    console.log("feat", feature);

    const popupContent = `<Popup><p>Customizable Popups <br />with feature information.</p><pre>Borough: <br />${feature.properties.Name}</pre></Popup>`;
    console.log(popupContent);
    layer.bindPopup(popupContent);
  }

  pointToLayer = (feature, layer) => {
    console.log("feat", feature);
    return L.circleMarker(feature.geometry.coordinates, {
      color: "#228B22",
      fillColor: "black",
      fillOpacity: 0.6,
      radius: 3
    }).bindPopup("im working smile please");
  };
  ccc = () => {
    alert("hi");
    return L.geoJSON(dat5, {
      style: function(feature) {
        return { color: "red" };
      }
    }).bindPopup(function(layer) {
      return "layer.feature.properties.description";
    });
  };
  render() {
    return (
      <div>
        <Row
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          style={{ paddingTop: 30 }}
        >
          <Col span={12} style={{ padding: 0 }} offset={1}>
            <Map
              // setZoom={1}
              // setView={([0, 0], 0)}
              minZoom={1.5}
              center={[50, 10]}
              zoom={10}
              maxZoom={18}
              // bounds={[
              //   [34.05878, -118.23676],
              //   [33.93415, -118.29674]
              // ]}
              // padding={[0, 0]}
              fitWorld={[0, 0]}
              attributionControl={true}
              zoomControl={false}
              // zoomSnap={1}
              // zoomDelta={0.5}
              doubleClickZoom={true}
              scrollWheelZoom={true}
              dragging={true}
              animate={true}
              easeLinearity={0.35}
              style={{ height: "500px", width: "100%" }}
              onClick={() => {
                // alert("hi");
              }}
            >
              <TileLayer
                attribution=""
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
              />
              <LayersControl
                position="topright"
                collapsed={this.state.clp}
                onClick={this.changeMode}
              >
                <BaseLayer checked name="stadiamaps">
                  <TileLayer
                    attribution=""
                    url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                  />
                </BaseLayer>
                <BaseLayer name="OpenStreetMap.Mapnik">
                  <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                </BaseLayer>
              </LayersControl>
              <LayersControl position="topright" onClick={this.changeMode}>
                {this.state.config.layers.map((layer, ck) => {
                  //console.log(layer);
                  if (layer.type === "heatmap") {
                    return (
                      <Overlay checked name={layer.name || "Heatmap"}>
                        {" "}
                        <LayerGroup>{this.renderHeatMap(layer)} </LayerGroup>
                      </Overlay>
                    );
                  } else if (layer.type === "marker") {
                    return (
                      <Overlay checked name={layer.name || "Feature Layer"}>
                        {" "}
                        <LayerGroup>
                          <MarkerClusterGroup
                            iconCreateFunction={createClusterCustomIcon}
                          >
                            {" "}
                            {this.renderCircleMarkers(layer, ck)}{" "}
                          </MarkerClusterGroup>
                        </LayerGroup>{" "}
                      </Overlay>
                    );
                  } else if (layer.type === "markerTeacher") {
                    return (
                      <Overlay checked name={layer.name || "Feature Layer"}>
                        {" "}
                        <MarkerClusterGroup>
                          {" "}
                          {this.renderCircleMarkers(layer, ck)}{" "}
                        </MarkerClusterGroup>{" "}
                      </Overlay>
                    );
                  } else if (layer.type === "geoData1") {
                    return (
                      <Overlay checked name={layer.name || "Feature Layer"}>
                        <MarkerClusterGroup>
                          <GeoJSON
                            data={dat1}
                            // style={() => {
                            //   return {
                            //     color: "#fc2b23",
                            //     weight: 1,
                            //     fillOpacity: 0.5,
                            //     fillColor: "#fc2b23"
                            //   };
                            // }}
                            // pointToLayer={() => {
                            //   return <CircleMarker></CircleMarker>;
                            // }}
                            // onEachFeature={this.onEachFeature}
                            key={Math.random()}
                            // pointToLayer={this.pointToLayer}
                            // markersInheritOptions={true}
                          />
                        </MarkerClusterGroup>
                      </Overlay>
                    );
                  } else if (layer.type === "geoData2") {
                    return (
                      <Overlay checked name={layer.name || "Feature Layer"}>
                        <MarkerClusterGroup>
                          <GeoJSON
                            data={dat2}
                            // key={Math.random()}
                            // pointToLayer={this.pointToLayer}
                            // markersInheritOptions={true}
                          />
                        </MarkerClusterGroup>
                      </Overlay>
                    );
                  } else if (layer.type === "geoData3") {
                    return (
                      <Overlay checked name={layer.name || "Feature Layer"}>
                        <MarkerClusterGroup>
                          <GeoJSON
                            data={dat3}
                            // key={Math.random()}
                            // pointToLayer={this.pointToLayer}
                            markersInheritOptions={true}
                          />
                        </MarkerClusterGroup>
                      </Overlay>
                    );
                  } else if (layer.type === "geoData4") {
                    return (
                      <Overlay checked name={layer.name || "Feature Layer"}>
                        <MarkerClusterGroup>
                          <GeoJSON
                            data={dat4}
                            key={Math.random()}
                            // pointToLayer={this.pointToLayer}
                            markersInheritOptions={true}
                          />
                        </MarkerClusterGroup>
                      </Overlay>
                    );
                  } else if (layer.type === "geoData5") {
                    return (
                      <Overlay checked name={layer.name || "Feature Layer"}>
                        <LayerGroup>
                          <MarkerClusterGroup>
                            <GeoJSON
                              data={dat5}
                              key={Math.random()}
                              // pointToLayer={this.pointToLayer.bind(this)}
                              markersInheritOptions={true}
                            />
                            {/* {this.ccc()} */}
                          </MarkerClusterGroup>
                        </LayerGroup>
                      </Overlay>
                    );
                  }
                })}
              </LayersControl>
              {/* <GeoJSON
                data={getGeoJson()}
                style={this.geoJSONStyle}
                // onEachFeature={this.onEachFeature}
                // pointToLayer={this.pointLayer}
                markersInheritOptions={true}
              /> */}
              {/* <ZoomControl position="bottomright"></ZoomControl> */}
            </Map>
          </Col>
          <Col span={5} style={{ padding: 0 }}>
            <div>
              {" "}
              <Menu
                style={{ width: "100%", height: 500 }}
                defaultSelectedKeys={["1"]}
                defaultOpenKeys={["sub1"]}
                mode={this.state.mode}
                theme={this.state.theme}
              >
                {/* <Menu.Item key="1">
                  <MailOutlined />
                  Navigation One
                </Menu.Item>
                <Menu.Item key="2">
                  <CalendarOutlined />
                  Navigation Two
                </Menu.Item> */}
                <SubMenu
                  key="sub1"
                  title={
                    <span>
                      <AppstoreOutlined />
                      <span style={{ margin: "0 1em" }}>My Schools</span>
                      <Switch onChange={this.changeTheme} />
                    </span>
                  }
                >
                  <Menu.Item key="3">Option 3</Menu.Item>
                  <Menu.Item key="4">Option 4</Menu.Item>
                  <SubMenu key="sub1-2" title="Submenu">
                    <Menu.Item key="5">Option 5</Menu.Item>
                    <Menu.Item key="6">Option 6</Menu.Item>
                  </SubMenu>
                </SubMenu>
                <SubMenu
                  key="sub2"
                  title={
                    <span>
                      <SettingOutlined />
                      <span style={{ margin: "0 1em" }}>Other Schools</span>
                      <Switch onChange={this.changeTheme} />
                    </span>
                  }
                >
                  <Menu.Item key="7">Option 7</Menu.Item>
                  <Menu.Item key="8">Option 8</Menu.Item>
                  <Menu.Item key="9">Option 9</Menu.Item>
                  <Menu.Item key="10">Option 10</Menu.Item>
                </SubMenu>
              </Menu>
            </div>
          </Col>
          <Col span={5} style={{ padding: 0 }}>
            <div style={{ width: "100%", height: "100%" }}>
              {" "}
              <Tabs onChange={callback} type="card">
                <TabPane tab="General Info" key="1">
                  <Table columns={columns} dataSource={this.state.dataSam} />
                </TabPane>
                <TabPane tab="Enrollment" key="2">
                  <Table columns={columns} dataSource={data} />
                </TabPane>
                <TabPane tab="Staffing" key="3">
                  <Descriptions
                    title="Basic Info"
                    bordered
                    column={{ xxl: 1, xl: 1, lg: 1, md: 3, sm: 1, xs: 1 }}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <Descriptions.Item label="First Name">
                      {this.state.dataSam === null
                        ? "No Records"
                        : this.state.dataSam[0].student_first_name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Age">
                      {this.state.dataSam === null
                        ? "No Records"
                        : this.state.dataSam[0].age}
                    </Descriptions.Item>
                    <Descriptions.Item label="School">
                      {this.state.dataSam === null
                        ? "No Records"
                        : this.state.dataSam[0].home_school_name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                      {this.state.dataSam === null
                        ? "No Records"
                        : this.state.dataSam[0].student_email}
                    </Descriptions.Item>
                    <Descriptions.Item label="Grade">
                      {this.state.dataSam === null
                        ? "No Records"
                        : this.state.dataSam[0].grade_enrolled}
                    </Descriptions.Item>
                    <Descriptions.Item label="Country">
                      {this.state.dataSam === null
                        ? "No Records"
                        : this.state.dataSam[0].birth_country}
                    </Descriptions.Item>
                  </Descriptions>
                </TabPane>
                <TabPane tab="Student Perf" key="4">
                  Content of Tab Pane 4
                </TabPane>
              </Tabs>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

// import React, { Component } from "react";

// import { Map, CircleMarker, TileLayer, GeoJSON, Popup } from "react-leaflet";
// import dat from "./Schools.geojson";
// import "leaflet/dist/leaflet.css";
// export default class SampleComponent extends Component {
//   constructor() {
//     super();
//     this.state = {
//       lat: 37.81893781173967,
//       lng: -122.47867584228514,
//       zoom: 13,
//       open: false
//     };
//   }
//   getStyle(feature, layer) {
//     return {
//       color: "#006400",
//       weight: 5,
//       opacity: 0.65
//     };
//   }
//   render() {
//     const position = [this.state.lat, this.state.lng];
//     console.log(position);
//     return (
//       <Map
//         center={position}
//         zoom={this.state.zoom}
//         style={{ width: "600px", height: "500px" }}
//       >
//         <TileLayer
//           attribution=""
//           url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
//         />
//         <CircleMarker
//           position={position}
//           radius={8}
//           fillOpacity={0.7}
//           color={"green"}
//         >
//           <Popup>{"JUst Checking"}</Popup>
//         </CircleMarker>
//         {/* <GeoJSON
//           data={dat}
//           key={(Math.random() * 100).toFixed()}
//           style={this.getStyle}
//         /> */}
//       </Map>
//     );
//   }
// }
