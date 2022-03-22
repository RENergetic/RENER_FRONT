export default [
  {
    id: 1,
    type: "heat",
    msg: "Increase power usage",
    tile: {
      id: "3",
      panelId: "607",
      layout: { x: 4, y: 0, h: 5, w: 4 },
      state: "warning",
      label: null,
      featured: true,
      type: "doughnut",
      measurements: [
        {
          id: "2",
          name: "e5",
          label: "e5",
          unit: "kWh",
          description: "avg",
          icon: "electricity",
          measurement_details: { color: "#5C6BC0" },
        },
        {
          id: "3",
          name: "e6",
          label: "e6",
          unit: "kWh",
          description: "total",
          icon: "electricity",
          measurement_details: { color: "#FF7043" },
        },
        {
          id: "4",
          name: "e6",
          label: "e6",
          unit: "kWh",
          description: "total",
          icon: "electricity",
          measurement_details: { color: "#1976D2" },
        },
      ],
      props: {},
    },
    asset: { id: 1 },
    measurement_type: null,
    measurement: { id: 1 },
    up: true,
    description: "Increase power usage by flah ulah because of clah klah",

    demand_request_start: 1646082303,
    demand_request_stop: 1646182303,
  },
  {
    id: 2,
    type: "heat",
    msg: "Decrease power usage",
    icon: "battery",
    asset: { id: 2 },
    measurement_type: null,
    measurement: { id: 2 },
    up: true,
    description: "Decrease power usage ",

    demand_request_start: 1646082303,
    demand_request_stop: 1646182303,
  },
  {
    id: 3,
    type: "heat",
    msg: "Increase power usage",
    icon: "electricity",
    asset: { id: 3 },
    measurement_type: { id: 1 },
    measurement: null,
    up: true,
    description: "Increase power usage by flah ulah because of clah klah",
    demand_request_start: 1646082303,
    demand_request_stop: 1646182303,
  },
  {
    id: 4,
    type: "heat",
    msg: "Decrease power usage",
    icon: "heat",
    asset: { id: 4 },
    measurement_type: { id: 2 },
    measurement: null,
    up: true,
    description: "Decrease power usage ",
    demand_request_start: 1646082303,
    demand_request_stop: 1646182303,
  },
  {
    id: 5,
    type: "heat",
    msg: "Decrease power usage",
    icon: "heat",
    asset: { id: 4 },
    measurement_type: { id: 2 },
    measurement: null,
    up: true,
    description: "Decrease power usage ",
    demand_request_start: 1646082303,
    demand_request_stop: 1646182303,
  },
  {
    id: 6,
    type: "heat",
    msg: "Decrease power usage",
    icon: "heat",
    asset: { id: 4 },
    measurement_type: { id: 2 },
    measurement: null,
    up: true,
    description: "Decrease power usage ",
    demand_request_start: 1646082303,
    demand_request_stop: 1646182303,
  },
  {
    id: 7,
    type: "heat",
    msg: "Decrease power usage",
    icon: "heat",
    asset: { id: 4 },
    measurement_type: { id: 2 },
    measurement: null,
    up: true,
    description: "Decrease power usage ",
    demand_request_start: 1646082303,
    demand_request_stop: 1646182303,
  },
];
