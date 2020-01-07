export const MOCK_STOPS_DATA = {
    stops: [{
           id: 1,
           name: "Houston",
           lat: 29.7604,
           long: -95.3698,
       },
       {
           id: 2,
           name: "San Francisco",
           lat: 37.7749, 
           long: -122.4194
       },
       {
           id: 3,
           name: "New york",
           lat: 40.7128, 
           long: -74.0060
       },
       {
           id: 4,
           name: "Chicago",
           lat: 41.8781,
           long: -87.6298
       }
    ],
    relations: [{
            from: 1,
            to: 2,
            stats: {
                count: 12
            }
        },
        {
            from: 1,
            to: 3,
            stats: {
                count: 34
            }
        },
        {
            from: 4,
            to: 1,
            stats: {
                count: 10
            }
        }
    ],
    upStream: [{
        from: 4,
        to: 1,
        stats: {
            count: 10
        }
    }],
    downStream: [{
            from: 1,
            to: 2,
            stats: {
                count: 12
            }
        },
        {
            from: 1,
            to: 3,
            stats: {
                count: 34
            }
        }
    ],
    params: {
        shipper: []
    }
};

export const UP_DOWN_STREAM_DATA =  {
    stops: [{
           id: 1,
           name: "Houston",
           lat: 29.7604,
           long: -95.3698,
       },
       {
           id: 2,
           name: "San Francisco",
           lat: 37.7749, 
           long: -122.4194
       },
       {
           id: 3,
           name: "New york",
           lat: 40.7128, 
           long: -74.0060
       },
       {
           id: 4,
           name: "Chicago",
           lat: 41.8781,
           long: -87.6298
       }],
    relations: [{
            from: 1,
            to: 2,
            stats: {
                count: 12
            }
        },
        {
            from: 1,
            to: 3,
            stats: {
                count: 34
            }
        },
        {
            from: 4,
            to: 1,
            stats: {
                count: 10
            }
        }
    ],
    upStream: [{
        from: 4,
        to: 1,
        stats: {
            count: 10
        }
    }],
    downStream: [{
            from: 1,
            to: 2,
            stats: {
                count: 12
            }
        },
        {
            from: 1,
            to: 3,
            stats: {
                count: 34
            }
        }
    ],
    params: {
        shipper: []
    }
};