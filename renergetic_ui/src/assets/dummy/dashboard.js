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
var informationTiles = [
  {
    id: "1",
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
];

export { dummyList, informationTiles };
