import _ from 'lodash';

const MapConfig = {
    appId: 'eBWPXwy5NTgs66Q56LPO',
    appCode: 'sRJPc2zq91rLlD61rf2SkQ',
    libraries: 'mapevents,ui',
    useHTTPS: true
}

const MapBoxConfig = {
    mapboxAccessToken: 'pk.eyJ1IjoiaW1raXJhbjIyIiwiYSI6ImNqZzRxaDRseDdybHMycW1zZ3RpdDlxMjYifQ.C2PQ36BtOIv5xPoXJlneDg'
}

const AERIS = {
    appUrl: 'https://maps.aerisapi.com/',
    appId: 'TPRXjpHE3Chieeze5Sfg9_lETxT4qNjaH5iycUX9N5DZDKT3OvTQUcHFEIM3O8',
    type: '/radar/',
    imageName: '/current.png',
    weatherEnabledCompanies: ['gap-inc', 'meijer']
};


// export const mapBoxLayers = [
//     { scheme: 'mapbox.satellite' },
//     { scheme: 'mapbox.streets' },
//     { scheme: 'mapbox.light' }, 
//     { scheme: 'mapbox.dark' },
//     { scheme: 'mapbox.satellite' }, 
//     { scheme: 'mapbox.streets-satellite' },
//     { scheme: 'mapbox.wheatpaste' }, 
//     { scheme: 'mapbox.comic' },
//     { scheme: 'mapbox.outdoors' },
//     { scheme: 'mapbox.run-bike-hike' },
//     { scheme: 'mapbox.pencil' },
//     { scheme: 'mapbox.pirates' },
//     { scheme: 'mapbox.emerald' },
//     { scheme: 'mapbox.high-contrast' },
//     { scheme: 'mapbox.streets-basic' }
// ]

export const hereLayers = [/*{
        base: 'base',
        type: 'maptile',
        scheme: 'normal.day'
    },
    {
        base: 'base',
        type: 'maptile',
        scheme: 'normal.day.transit'
    },
    {
        base: 'base',
        type: 'maptile',
        scheme: 'pedestrian.day'
    },*/
    {
        base: 'aerial',
        type: 'maptile',
        scheme: 'terrain.day'
    }/*,
    {
        base: 'aerial',
        type: 'maptile',
        scheme: 'satellite.day'
    },
    {
        base: 'aerial',
        type: 'maptile',
        scheme: 'hybrid.day'
    }, {
        base: 'base',
        type: 'maptile',
        scheme: 'reduced.day'
    }*/
];


export const LeafIcon = L.Icon.extend({
    options: {
        shadowUrl: '',
        iconSize: [30, 45],
        shadowSize: [50, 64],
        iconAnchor: [10, 10],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -76]
    }
});

export function createPopUpOnMarker(MARKER, info) {
    MARKER.bindPopup(info);
}

export function getEquiDistanceWaypoints(waypoints) {
    let equiDistanceWaypoints = [];
    if (waypoints) {
        let length = waypoints.length;
        let distance = Math.ceil(length / 23);
        for (let i = 0; i < length; i += distance) {
            equiDistanceWaypoints.push(waypoints[i]);
        }
    }
    return equiDistanceWaypoints;
}

export function calculateRouteApiParams(options) {
    let vehicle, mode, language, params;
    vehicle = options.vehicle || 'truck';
    mode = options.mode || 'fastest';
    language = options.language || 'en-us';
    params = {
        mode: mode + ';' + vehicle,
        representation: 'display',
        language: language
    };
    if (!_.isEmpty(options.truckRoutingParams)) {
        options.truckRoutingParams.forEach(function(key, value) {
            if (!_.isEmpty(value)) {
                params[key] = value;
            }
        });
    }
    options.waypoints.forEach(function(waypoint, index) {
        params["waypoint" + index] = [waypoint.lat, waypoint.lng].join(',');
    });
    return params;
}

export function fetchWayPoints(result) {
    let route, latLng = [];
    if (result.response.route) {
        route = result.response.route[0];
        route = route && route.shape;
        route.forEach(function(point) {
            let parts = point.split(',');
            latLng.push([parseFloat(parts[0]), parseFloat(parts[1])]);
        });
    }
    return latLng;
}

export function herePlatformService() {
    return new H.service.Platform({
        'app_id': MapConfig.appId,
        'app_code': MapConfig.appCode,
        useHTTPS: MapConfig.useHTTPS
    });
}

export function DOPPLERRADAR() {
    var URL = AERIS.appUrl + AERIS.appId + AERIS.type;
    return L.tileLayer(URL + '{z}/{x}/{y}/current.png', {
       subdomains: '1234',
       attribution: '&copy;AerisWeather',
       client_id: AERIS.appId
    });
}


export function MAPBOX(options) {
    return L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + MapBoxConfig.mapboxAccessToken, {
        id: options.scheme,
        attribution: '',
        maxZoom: 20,
        minZoom: 2
    });
}


export function HERE(options) {
    var HERE_INSTANCE = L.TileLayer.extend({
        options: {
            subdomains: '1234',
            minZoom: 2,
            maxZoom: 20,

            // 🍂option scheme: String = 'normal.day'
            // The "map scheme", as documented in the HERE API.
            scheme: options.scheme,

            // 🍂option resource: String = 'maptile'
            // The "map resource", as documented in the HERE API.
            resource: 'maptile',

            // 🍂option mapId: String = 'newest'
            // Version of the map tiles to be used, or a hash of an unique map
            mapId: 'newest',

            // 🍂option format: String = 'png8'
            // Image format to be used (`png8`, `png`, or `jpg`)
            format: 'png8',

            // 🍂option appId: String = ''
            // Required option. The `app_id` provided as part of the HERE credentials
            appId: MapConfig.appId,

            // 🍂option appCode: String = ''
            // Required option. The `app_code` provided as part of the HERE credentials
            appCode: MapConfig.appCode
        },


        initialize: function initialize(options) {
            options = L.setOptions(this, options);

            // Decide if this scheme uses the aerial servers or the basemap servers
            var schemeStart = options.scheme.split('.')[0];
            options.tileResolution = 256;

            if (L.Browser.retina) {
                options.tileResolution = 256;
            }

            //      {Base URL}{Path}/{resource (tile type)}/{map id}/{scheme}/{zoom}/{column}/{row}/{size}/{format}
            //      ?app_id={YOUR_APP_ID}
            //      &app_code={YOUR_APP_CODE}
            //      &{param}={value}

            var path = '/{resource}/2.1/{resource}/{mapId}/{scheme}/{z}/{x}/{y}/{tileResolution}/{format}?app_id={appId}&app_code={appCode}';
            var attributionPath = '/maptile/2.1/copyright/{mapId}?app_id={appId}&app_code={appCode}';

            var tileServer = 'base.maps.api.here.com';
            if (schemeStart == 'satellite' ||
                schemeStart == 'terrain' ||
                schemeStart == 'hybrid') {
                tileServer = 'aerial.maps.api.here.com';
            }
            if (options.scheme.indexOf('.traffic.') !== -1) {
                tileServer = 'traffic.maps.api.here.com';
            }

            var tileUrl = 'https://{s}.' + tileServer + path;

            this._attributionUrl = L.Util.template('https://1.' + tileServer + attributionPath, this.options);

            L.TileLayer.prototype.initialize.call(this, tileUrl, options);

            this._attributionText = '';

        },

        onAdd: function onAdd(map) {
            L.TileLayer.prototype.onAdd.call(this, map);

            if (!this._attributionBBoxes) {
                this._fetchAttributionBBoxes();
            }
        },

        onRemove: function onRemove(map) {
            L.TileLayer.prototype.onRemove.call(this, map);

            this._map.attributionControl.removeAttribution(this._attributionText);

            this._map.off('moveend zoomend resetview', this._findCopyrightBBox, this);
        },

        _fetchAttributionBBoxes: function _onMapMove() {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = L.bind(function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    this._parseAttributionBBoxes(JSON.parse(xmlhttp.responseText));
                }
            }, this);
            xmlhttp.open("GET", this._attributionUrl, true);
            xmlhttp.send();
        },

        _parseAttributionBBoxes: function _parseAttributionBBoxes(json) {
            if (!this._map) { return; }
            var providers = json[this.options.scheme.split('.')[0]] || json.normal;
            for (var i = 0; i < providers.length; i++) {
                if (providers[i].boxes) {
                    for (var j = 0; j < providers[i].boxes.length; j++) {
                        var box = providers[i].boxes[j];
                        providers[i].boxes[j] = L.latLngBounds([
                            [box[0], box[1]],
                            [box[2], box[3]]
                        ]);
                    }
                }
            }

            this._map.on('moveend zoomend resetview', this._findCopyrightBBox, this);

            this._attributionProviders = providers;

            this._findCopyrightBBox();
        },

        _findCopyrightBBox: function _findCopyrightBBox() {
            try {
                if (!this._map) { return; }
                var providers = this._attributionProviders;
                var visibleProviders = [];
                var zoom = this._map.getZoom();
                var visibleBounds = this._map.getBounds();

                for (var i = 0; i < providers.length; i++) {
                    if (providers[i].minLevel < zoom && providers[i].maxLevel > zoom) {

                        if (!providers[i].boxes) {
                            // No boxes = attribution always visible
                            visibleProviders.push(providers[i]);
                            break;
                        }

                        for (var j = 0; j < providers[i].boxes.length; j++) {
                            var box = providers[i].boxes[j];
                            if (visibleBounds.overlaps(box)) {
                                visibleProviders.push(providers[i]);
                                break;
                            }
                        }
                    }
                }

                var attributions = ['<a href="https://legal.here.com/terms/serviceterms/gb/">HERE maps</a>'];
                for (var k = 0; i < visibleProviders.length; k++) {
                    var provider = visibleProviders[k];
                    attributions.push('<abbr title="' + provider.alt + '">' + provider.label + '</abbr>');
                }

                var attributionText = '© ' + attributions.join(', ') + '. ';

                if (attributionText !== this._attributionText) {
                    this._map.attributionControl.removeAttribution(this._attributionText);
                    this._map.attributionControl.addAttribution(this._attributionText = attributionText);
                }
            } catch (e) {
                console.log('ERROR', e);
            }
        },

    }, null, null, { ppi: 500 });

    return new HERE_INSTANCE(options);
}

export function createToolbox(map) {
    const editableLayers = new L.FeatureGroup();
    map.addLayer(editableLayers);
    // define custom marker
    const MyCustomMarker = L.Icon.extend({
        options: {
            shadowUrl: null,
            iconAnchor: new L.Point(12, 12),
            iconSize: new L.Point(24, 24),
            iconUrl: 'http://www.pdclipart.org/albums/Buildings/igloo.png'
        }
    });

    const drawPluginOptions = {
        position: 'topleft',
        draw: {
          polyline: {
            shapeOptions: {
              color: '#f357a1',
              weight: 10
            }
          },
          polygon: {
            allowIntersection: false, // Restricts shapes to simple polygons
            drawError: {
              color: '#e1e100', // Color the shape will turn when intersects
              message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
            },
            shapeOptions: {
              color: '#bada55'
            }
          },
           circle: {
            shapeOptions: {
              color: 'red',
              clickable: true,
              weight: 10,
              showArea: true,
              allowIntersection: true,
              radius: 200
            },
            _onMapMove: function(e) {
              alert(1); 
            },
            edit: true
          },  // Turns off this drawing tool
          rectangle: {
            shapeOptions: {
              clickable: false
            }
          },
          marker: {
            icon: new MyCustomMarker(),
            edit: false
          }
        },
        edit: {
          featureGroup: editableLayers, //REQUIRED!!
          remove: false
        }
    };

    // Initialise the draw control and pass it the FeatureGroup of editable layers
    const drawControl = new L.Control.Draw(drawPluginOptions);
    map.addControl(drawControl);

    //Initialise layers
    // const editableLayers = new L.FeatureGroup();
    // map.addLayer(editableLayers);

    //INITIALISE EVENTS
    map.on('draw:created', (e) => {
        var type = e.layerType,
          layer = e.layer;
      
        if (type === 'marker') {
          layer.bindPopup('A popup!');
        }
        map.addLayer(layer);
    });
}