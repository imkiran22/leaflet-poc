import React from 'react';
import ReactDOM from 'react-dom';
require('../../lib/leaflet/smoothMarkerBouncing');
require('../../lib/leaflet/slideMarker');
require('../../../node_modules/leaflet-routing-machine/dist/leaflet-routing-machine');
require('../../../node_modules/leaflet.polyline.snakeanim/L.Polyline.SnakeAnim');

import icon1 from '../../asset/drop.svg';
import marker from '../../asset/marker1.png';
import icon2 from '../../asset/pickup.svg';
import truckSvg from '../../asset/truck.svg';
import blue_marker from '../../asset/blue_marker.png';
import { MOCK_STOPS_DATA, UP_DOWN_STREAM_DATA } from '../MOCK_STOPS_DATA';
import _ from 'lodash';
import {HERE, DOPPLERRADAR, createToolbox, mapBoxLayers, MAPBOX, LeafIcon, herePlatformService, calculateRouteApiParams, getEquiDistanceWaypoints, fetchWayPoints, createPopUpOnMarker, hereLayers} from '../utils/LeafletUtil';

const params = {
  "mode":"fastest;truck",
  "representation":"display",
  "language":"en-us",
  "waypoint0":"37.77713,-122.41964",
  "waypoint1":"42.65156,-73.75521"
};

const DURATIONS = [20000];

const SLIDING_MARKER_INTERVAL = [100000];

const CENTER = [42.65156, -73.75521];
const CENTER2 = [37.77713, -122.41964];

const nashville = [36.16764, -86.77831];
const texas = [30.265941, -97.739496];
class Leaflet extends React.Component {
    fitBoundsArr = [];
  	leafletMap = null;
    platform = null;
    routingService = null;
    slidingMarker;
    mapData = null;
    markers = [];
    polyline = [];
    polylineOverlay = [];
    constructor(props) {
       super(props);
    } 

    createPlatformService() {
       this.platform = herePlatformService();
       this.routingService = this.platform.getRoutingService();
    }
    
    createLeafletMap = () => {
      var bounds = L.latLngBounds(CENTER, CENTER2);
      //CREATE LAYERS
      //var normalDefaultLayer = HERE({scheme: 'normal.day'});
      //var grayScaleLayer = HERE({scheme: 'reduced.day'});
      var layers = [];
      var baseMaps = {};

      //CREATE MULTIPLE LAYERS - HERE
      hereLayers.forEach((option, index) => {
         layers.push(HERE(option));//?
         baseMaps[option.scheme] = layers[index];
      });

      //CREATING BASIC LEAFLET MAP
      this.leafletMap = new L.Map(document.querySelector('div#leaflet-map'), { 
        zoom: 5, 
        scrollWheelZoom: false, 
        maxZoom: 18,
        minZoom: 2,
        layers
      });
      layers[layers.length - 1].addTo(this.leafletMap);
      //ICON
      
      // var iconOne = new LeafIcon({iconUrl: marker, iconAnchor: [0, 20], iconSize: [30, 30]});
      // var iconTwo = new LeafIcon({iconUrl: marker, iconAnchor: [0, 20], iconSize: [30, 30]});
   
      //ADDING MARKER WITH SMOOTH ANIMATIONS
      // var SMOOTHMARKER = L.marker(CENTER2, {icon: iconTwo})
      // .setBouncingOptions({
      // 	bounceHeight : 60,
      // 	bounceSpeed  : 30,
      //   exclusive    : true
      // }).on('click', function() {
      //   this.bounce(1);
      // })
      // L.marker(CENTER2, {icon: iconTwo}).addTo(this.leafletMap);

      // var MARKER = L.marker(CENTER, {icon: iconOne})
      // .setBouncingOptions({
      //   bounceHeight : 60,
      //   bounceSpeed  : 30,
      //   exclusive    : true
      // }).on('click', function () {
      //    this.bounce(1);
      // })

      // L.marker(CENTER, {icon: iconOne}).addTo(this.leafletMap);

      // setTimeout(() => {
      //   SMOOTHMARKER.bounce(2);
      //   MARKER.bounce(2);
      // });

      // MARKER.bindTooltip("my tooltip text").openTooltip();


      //OVERLAY & GROUPING

      // var groupOverlay = L.layerGroup([MARKER, SMOOTHMARKER]);

      // var baseMaps = {
      //   '<span style="color: gray">Grayscale</span>': grayScaleLayer,
      //   '<span style="color: #363636">Normal</span>': normalDefaultLayer
      // };

      // var overlayMaps = {
      //   "Group": groupOverlay
      // };

      //HERE({scheme: 'normal.day'}).addTo(this.leafletMap);
      setTimeout(() => {
        this.leafletMap.fitBounds(bounds);
      });
      


      //CREATE POPUP ON MARKER
      ///createPopUpOnMarker(MARKER, 'One good message');
      //createPopUpOnMarker(SMOOTHMARKER, 'Another good message');


      //RESIZING LEAFLET MAP
      setTimeout(() => { 
        this.leafletMap.invalidateSize();
      });
    }

    addPolyLines(waypoints, classNames) {
      const polyline = L.polyline(waypoints, {
        className: classNames[0],
        snakingSpeed: 500
      }).addTo(this.leafletMap);
      //HACK TO ACHEIVE BORDERING IN POLYLINE AS THEY ARE SVG ELEMENTS
      const polylineOverlay = L.polyline(waypoints, {
        className: classNames[1]
      }).addTo(this.leafletMap);

      this.polyline.push(polyline);
      this.polylineOverlay.push(polylineOverlay);
      //zoom the map to the polyline
      //this.leafletMap.fitBounds(polyline.getBounds());
      polyline.snakeIn();
      // polyline.on('snakeend', (e) => {
      //    console.log(waypoints);
      //    this.createSlidingMarker(waypoints);
      // })
    }

    createRouting(first, second) {
      L.Routing.control({
        waypoints: [first, second],
        routeWhileDragging: true
      }).addTo(this.leafletMap);
    }

    createRouteAndUpdateMap(start, end, classNames) {
      let waypoints = [{lat: start[0], lng: start[1]}, {lat: end[0], lng: end[1]}];
      this.routingService.calculateRoute(calculateRouteApiParams({
        vehicle: null,
        mode: null,
        waypoints: getEquiDistanceWaypoints(waypoints),
        truckRoutingParams: {}
      }), (response) => {
         //ADDING POLYLINES
         let points = fetchWayPoints(response);
         this.addPolyLines(points, classNames);
      }, (error) => {
         console.error('SOME ERROR IN HERE', error);
      });
    }


    componentDidMount() {
    	this.createLeafletMap();
      this.createPlatformService();
    	document.querySelector('div#leaflet-map').style.height = '520px';
      this.getData().then((res) => {
        this.mapData = res;
        this.renderData(res);
      });
    }

    createMarkers(stops, currentStop = false, id = null) {
      if (_.isEmpty(stops)) {
        return;
      }
      //var iconUrl = null;
      var icon = null;
      //var icon = new LeafIcon({iconUrl: marker, iconAnchor: [15, 15], iconSize: [30, 30]});
      var markerIcon = marker;
      stops.forEach((stop) => {
        const coords = [stop.lat, stop.long];
        if (currentStop && id === stop.id) {
          icon = new LeafIcon({iconUrl: blue_marker, iconAnchor: [15, 15], iconSize: [30, 30], popupAnchor: [0, 7]});
        } else {
          icon = new LeafIcon({iconUrl: markerIcon, iconAnchor: [15, 15], iconSize: [30, 30], popupAnchor: [0, 7]});
        }
        const marker = L.marker(coords, {icon}).addTo(this.leafletMap);
        this.markers.push(marker);
        marker.on('click', (ev) => {
          this.reRenderRoute(stop);
        });
        const relations = this.mapData.relations;
        let index = _.findIndex(relations, {from: stop.id});
        if (index === -1) {
          index = _.findIndex(relations, {to: stop.id});
        }
        marker.bindPopup(`
          <div>
             <span class="stats">STATS: </span>
             <span class="value">${relations[index].stats.count}</span>
          </div>
        `);
        marker.on('mouseover', (ev) => {
          marker.openPopup();
        });
        marker.on('mouseout', (ev) => {
          marker.closePopup();
        });
        this.fitBoundsArr.push(coords);
      });
    }

    flushMapLayersAndRoutes() {
      this.markers.forEach((marker) => {
        this.leafletMap.removeLayer(marker);
      });
      this.polylineOverlay.forEach((overlay) => {
        this.leafletMap.removeLayer(overlay);
      });
      this.polyline.forEach((polyline) => {
        this.leafletMap.removeLayer(polyline);
      });
      this.markers = [];
      this.polyline = [];
      this.polylineOverlay = [];
    }

    reRenderRoute(stop) {
      this.getData(true).then((res) => {
        this.flushMapLayersAndRoutes();
        this.mapData = res;
        this.createMarkers(res.stops, true, stop.id);
        this.constructUpDownStreamMap(res);
      });
    }

    constructUpDownStreamMap(data) {
      const upStream = data.upStream || [];
      const downStream = data.downStream || [];
      const stops = data.stops || [];
      upStream.forEach((upval, index) => {
        const fromIndex = _.findIndex(stops, {id: upval.from});
        const toIndex = _.findIndex(stops, {id: upval.to});
        const startCoord = [stops[fromIndex].lat, stops[fromIndex].long];
        const endCoord = [stops[toIndex].lat, stops[toIndex].long];
        this.createRouteAndUpdateMap(startCoord, endCoord, ['my_polyline_upsteam_base', 'my_polyline_upsteam_overlay']);
      });
      downStream.forEach((downval, index) => {
        const fromIndex = _.findIndex(stops, {id: downval.from});
        const toIndex = _.findIndex(stops, {id: downval.to});
        const startCoord = [stops[fromIndex].lat, stops[fromIndex].long];
        const endCoord = [stops[toIndex].lat, stops[toIndex].long];
        this.createRouteAndUpdateMap(startCoord, endCoord, ['my_polyline_downsteam_base', 'my_polyline_downsteam_overlay']);
      });
    }


    createLineRoutes(data) {
      const {stops, relations} = data;
      if (_.isEmpty(stops)) {
        return;
      }
      relations.forEach((relation) => {
        const startIndex = _.findIndex(stops, {id: relation.from});
        const endIndex = _.findIndex(stops, {id: relation.to});
        const startCoord = [stops[startIndex].lat, stops[startIndex].long];
        const endCoord = [stops[endIndex].lat, stops[endIndex].long];
        this.createRouteAndUpdateMap(startCoord, endCoord, ['my_polyline_base', 'my_polyline_overlay']);
      });
    }

    renderData(data) {
      this.createMarkers(data.stops);
      this.createLineRoutes(data);
      setTimeout(() => {
        this.leafletMap.fitBounds(new L.latLngBounds(this.fitBoundsArr).pad(0.25));
      });
    }

    getData(bool = false) {
      return Promise.resolve(bool ?  UP_DOWN_STREAM_DATA : MOCK_STOPS_DATA);
    }

	render() {
		return (
         <section>
           <div id="leaflet-map" class="leaflet-map">
             
           </div>
           <div id="stats-area">

           </div>
           <div id="details-section">
              <div class="child pull-left risk">
                 <h3>At Risk</h3>
                 <span>4</span>
              </div>
              <div class="child pull-left risk">
                 <h3>Hierarchy level</h3>
                 <span>4/6</span>
              </div>
              <div class="child pull-left">
                 <h3>Impact factor</h3>
                 <span class="box">
                   <b>Avg input loads</b>
                   <span>150</span>
                 </span>
                 <span class="box">
                   <b>Avg output loads</b>
                   <span>150</span>
                 </span>
              </div>
              <div class="child pull-left">
                 <h3>Exchange ratio</h3>
                 <span class="box">
                   <b>Predecessor stops</b>
                   <span>4</span>
                 </span>
                 <span class="box">
                   <b>Successor stops</b>
                   <span>6</span>
                 </span>
              </div>
           </div>
          </section>
		)
	}
}

export default Leaflet