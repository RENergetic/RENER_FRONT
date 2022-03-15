export default [
  {
    id: "1",
    label: "testname",
    name: "some name",
    tiles: [
      {
        layout: { x: 0, y: 0, h: 3, w: 2 },
        state: "ok",
        id: "1",
        label: "Label ",
        measurements: [
          {
            id: "1",
            name: "e1",
            label: "e1",
            unit: "kWh",
            description: "avg",
            icon: "electricity",
            measurement_details: {},
          },
          {
            id: "2",
            unit: "kWh",
            label: "e2",
            name: "e2",
            description: "total",
            icon: "electricity",
            measurement_details: {},
          },
        ],
        props: {},
      },
      {
        id: "2",
        layout: { x: 2, y: 0, h: 3, w: 2 },
        label: "label 2",
        measurements: [
          {
            id: "1",
            name: "e3",
            label: "e3",
            unit: "kWh",
            description: "avg",
            icon: "electricity",
            measurement_details: {},
          },
          {
            id: "2",
            name: "e4",
            label: "e4",
            unit: "kWh",
            description: "total",
            icon: "electricity",
            measurement_details: {},
          },
        ],
        props: {},
      },
      {
        id: "3",
        layout: { x: 4, y: 0, h: 6, w: 4 },
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
      {
        id: "4",
        layout: { x: 8, y: 0, h: 6, w: 4 },
        state: "warning",
        label: "label 4",
        type: "doughnut",
        measurements: [
          {
            id: "5",
            name: "e5",
            label: "e5",
            unit: "kWh",
            description: "avg",
            icon: "electricity",
            measurement_details: { color: "#5C6BC0" },
          },
          {
            id: "6",
            name: "e6",
            label: "e6",
            unit: "kWh",
            description: "total",
            icon: "electricity",
            measurement_details: { color: "#FF7043" },
          },
          {
            id: "7",
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
      {
        id: "5",
        state: "warning",
        label: null,
        type: "knob",
        layout: { x: 0, y: 3, h: 3, w: 2 },
        measurements: [
          {
            id: "7",
            name: "e7",
            label: "e7",
            unit: "kWh",
            description: "total",
            icon: "electricity",
            measurement_details: {},
          },
        ],
        props: {},
      },
      {
        id: "6",
        state: "warning",
        label: "label 6",
        type: "knob",
        layout: { x: 2, y: 3, h: 3, w: 2 },
        measurements: [
          {
            id: "9",
            name: "e9",
            label: "e9",
            unit: "kWh",
            description: "total",
            icon: "electricity",
            measurement_details: {},
          },
        ],
        props: {},
      },
    ],
  },
  {
    tiles: [
      {
        id: "abd4491c-34ac-4a10-a3ec-0e003670636b",
        title: null,
        type: "knob",
        measurements: [
          {
            id: "2",
            type: { name: "electricity", unit: "kWh" },
            name: "m_2",
            label: "M 2",
            direction: 1,
            measurement_details: { color: "#FF7043" },
          },
        ],
        props: { items: [] },
        layout: { x: 0, y: 0, w: 3, h: 2 },
      },
    ],
    id: 790,
  },
];
