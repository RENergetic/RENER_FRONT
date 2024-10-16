export default [
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
