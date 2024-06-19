export default [
  {
    key: "icon",
  },
  {
    key: "icon_visibility",
    type: "boolean",
  },
  {
    key: "legend",
    type: "boolean",
  },
  {
    key: "legend_label_color",
    hidden: true,
    //TODO: set translations
  },
  {
    key: "chart_type", //chartjs type
    hidden: true,
    //TODO: set translations
  },
  {
    key: "measurement_list", //chartjs type
    type: "boolean",
    //TODO: set translations
  },
  {
    key: "background_mask",
    type: "hex",
  },
  {
    key: "measurement_background",
    type: "boolean",
  },
  {
    key: "template",
    type: "boolean",
  },
  {
    key: "knob_color",
    type: "hex",
  },
  {
    key: "background",
    type: "hex",
  },
];
// TODO:
// title_color: tile.props.title_color != null ? tile.props.title_color : null,
// fontSize: panelSettings.fontSize,
// background_mask: tile.props.mask,
// background: tile.props.background,
// template: tile.props.template,
// legend: tile.props.legend != null ? tile.props.legend : panelSettings.legend,
// legend_label_color: tile.props.legend_label_color != null ? tile.props.legend_label_color : "#495057",
