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
        x: 0,
        y: 0,
        id: "1",
        title: null,
        col: 2,
        items: [
          {
            id: "id1",
            value: 0.05,
            unit: "kWh",
            description: "avg",
            icon: "electricity",
          },
          {
            id: "id2",
            value: 1.05,
            unit: "kWh",
            description: "total",
            icon: "electricity",
          },
        ],
      },
      {
        id: "2",
        x: 4,
        y: 0,
        title: null,
        col: 2,
        items: [
          {
            id: "id1",
            value: 20.05,
            unit: "kWh",
            description: "avg",
            icon: "electricity",
          },
          {
            id: "id2",
            value: 21.05,
            unit: "kWh",
            description: "total",
            icon: "electricity",
          },
        ],
      },
      {
        id: "3",
        title: null,
        col: 2,
        x: 8,
        y: 0,
        items: [
          {
            id: "id1",
            value: 30.05,
            unit: "kWh",
            description: "avg",
            icon: "electricity",
          },
          {
            id: "id2",
            value: 3.05,
            unit: "kWh",
            description: "total",
            icon: "electricity",
          },
        ],
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
        dashboardId: null,
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
      },
    ],
    id: 80,
    imgUrl: "http://localhost:8080/put.jpg",
    label: "heatmap_0",
  },
];
export { dummyList, informationPanels, heatmaps };
