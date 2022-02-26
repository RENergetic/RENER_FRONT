export default [
  {
    id: 1,
    type: "heat",
    msg: "Increase Something",
    icon: "battery",

    asset: { id: 1 },
    measurement_type: null,
    measurement: { id: 1 },
    up: true,
    description: "Increase something by flah ulah because of clah klah",
  },
  {
    id: 2,
    type: "heat",
    msg: "Decrease Something",
    icon: "battery",
    asset: { id: 2 },
    measurement_type: null,
    measurement: { id: 2 },
    up: true,
    description: "Decrease something by plah ulah because of tlah ilah nlah",
  },
  {
    id: 3,
    type: "heat",
    msg: "Increase Something",
    icon: "electricity",
    asset: { id: 3 },
    measurement_type: { id: 1 },
    measurement: null,
    up: true,
    description: "Increase something by flah ulah because of clah klah",
  },
  {
    id: 4,
    type: "heat",
    msg: "Decrease Something",
    icon: "heat",
    asset: { id: 4 },
    measurement_type: { id: 2 },
    measurement: null,
    up: true,
    description: "Decrease something by plah ulah because of tlah ilah nlah",
  },
];
