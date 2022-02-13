var dummyList = [
  {
    id: "1",
    label: "Dashboard 1",
    name: "dashboard_1",
    url: "http://localhost:3000/d/cWp8595nk/embedded-dashboard?orgId=1&from=1640263130489&to=1640284730489&kiosk=tv",
  },
  {
    id: "2",
    label: "Dashboard 2",
    name: "dashboard_2",
    url: "http://localhost:3000/d/cWp8595nk/embedded-dashboard?orgId=1&from=1640263130489&to=1640284730489&kiosk=tv",
  },
];
//TODO: timestamp
//async () => {return
var informationPanels = [
  {
    id: "1",
    label: "testname",
    tiles: [
      {
        layout: { x: 0, y: 0, h: 3, w: 3 },
        state: "ok",
        id: "1",
        title: null,
        col: 2,
        props: {
          items: [
            {
              id: "id1",
              value: 0.05,
              key: "e1",
              unit: "kWh",
              description: "avg",
              icon: "electricity",
            },
            {
              id: "id2",
              value: 1.05,
              unit: "kWh",
              key: "e2",
              description: "total",
              icon: "electricity",
            },
          ],
        },
      },
      {
        id: "2",
        x: 4,
        y: 0,
        title: null,
        col: 2,
        props: {
          items: [
            {
              id: "id1",
              key: "e3",
              value: 20.05,
              unit: "kWh",
              description: "avg",
              icon: "electricity",
            },
            {
              id: "id2",
              value: 21.05,
              key: "e4",
              unit: "kWh",
              description: "total",
              icon: "electricity",
            },
          ],
        },
      },
      {
        id: "3",
        state: "warning",
        title: null,
        type: null,
        col: 2,
        x: 8,
        y: 0,
        props: {
          items: [
            {
              id: "id1",
              value: 30.05,
              key: "e5",
              unit: "kWh",
              description: "avg",
              icon: "electricity",
            },
            {
              id: "id2",
              key: "e6",
              value: 3.05,
              unit: "kWh",
              description: "total",
              icon: "electricity",
            },
          ],
        },
      },
      {
        id: "4",
        state: "warning",
        title: null,
        type: "knob",
        col: 4,
        x: 0,
        y: 4,
        props: {
          key: "e7",
          value: 0.6
        },
      },
    ],
  },
];

var heatmaps = [
  {
    areas: [
      {
        points: [
          [125.58000000000001, 227.01000000000002],
          [196.42000000000002, 75.67],
          [322, 180.32000000000002],
        ],
        id: "area_1",
        value: "area_1",
        label: "area_1",
        heatMapId: 80,
        dashboard: {
          id: "2",
          label: "Dashboard 2",
          name: "dashboard_2",
          url:
            "http://localhost:3000/d/cWp8595nk/embedded-dashboard" +
            "?orgId=1&from=1640263130489&to=1640284730489&kiosk=tv",
        },
      },
      {
        points: [
          [421.82000000000005, 191.59],
          [524.86, 133.63000000000002],
          [589.26, 222.18],
        ],
        id: "area_2",
        value: "area_2",
        label: "area_2",
        dashboardId: null,
        heatMapId: 80,
      },
      {
        points: [
          [718.0600000000001, 164.22],
          [759.9200000000001, 74.06],
          [827.5400000000001, 111.09],
        ],
        id: "area_3",
        value: "area_3",
        label: "area_3",
        dashboardId: null,
        heatMapId: 80,
      },
    ],
    id: 80,
    imgUrl: "http://localhost:8080/put.jpg",
    label: "heatmap_0",
  },
];
var measurementAttributes = [
  {
    key: "id4",
    label: "Predictors",
    name: "predictors",
    type: "group",
    children: [
      {
        key: "id5",
        name: "electrical",
        label: "Electrical",
        type: "measurement",
        children: [],
      },
      {
        key: "id6",
        name: "thermic",
        label: "Thermic",
        type: "measurement",
        children: [],
      },
    ],
  },
  {
    key: "id1",
    label: "Target",
    name: "target",
    type: "group",
    children: [
      {
        key: "id2",
        name: "electrical",
        label: "Electrical",
        type: "measurement",
        children: [],
      },
      {
        key: "id3",
        name: "thermic",
        label: "Thermic",
        type: "measurement",
        children: [],
      },
    ],
  },
  {
    key: "id7",
    label: "Prediction Interval",
    name: "prediction_interval",
    type: "group",
    children: [
      {
        key: "id8",
        name: "3h",
        label: "3 H",
        type: "measurement",
        children: [],
      },
      {
        key: "id9",
        name: "6h",
        label: "6 H",
        type: "measurement",
        children: [],
      },
    ],
  },
];
let measurementsGenerator = (i, n) => {
  let datasets = [];
  for (var d = 0; d < i; d++) {
    var data = [];
    let next = Math.floor(Math.random() * 150) - 50;
    for (var j = 0; j < n; j++) {
      data.push(next);
      next += Math.floor(Math.random() * 150) - 50;
    }
    datasets.push({
      data: data,
      label: `label_${j}`,
      // borderColor: ,
      fill: false,
    });
  }
};

let dataGenerator = (n) => {
  let data = {};
  for (var d = 0; d < n; d++) {
    var data = [];
    let next = Math.floor(Math.random() * 150) - 50;
    data[`id${n}`] = next
  }
  return data
};
let currentMeasurementsGenerator = (keys) => {
  let measurements = [];
  for (var i = 0; i < keys.length; i++) {
    let next = Math.floor(Math.random() * 150) - 50;
    measurements.push(next);
  }
  return measurements;
};
export {
  dummyList,
  informationPanels,
  heatmaps,
  measurementAttributes,
  measurementsGenerator,
  dataGenerator,
  currentMeasurementsGenerator,
};
