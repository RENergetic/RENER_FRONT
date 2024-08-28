import i18n from "@/plugins/locales";
//TILE PROPERTIES:
const $t = i18n.global.t.bind(i18n);
const tileProperties = [
  {
    label: $t(`model.information_panel.tile.properties.icon`),
    description: $t(`model.information_panel.tile.properties.icon_description`),
    type: "icon",
    key: "icon",
  },
  {
    label: $t(`model.information_panel.tile.properties.title_visibility`),
    description: $t(`model.information_panel.tile.properties.title_visibility_description`),
    type: "Boolean",
    ext: {
      true: $t("settings.yes"),
      false: $t("settings.no"),
    },
    key: "title_visibility",
  },
  {
    label: $t(`model.information_panel.tile.properties.icon_visibility`),
    description: $t(`model.information_panel.tile.properties.icon_visibility_description`),
    type: "Boolean",
    ext: {
      true: $t("settings.yes"),
      false: $t("settings.no"),
    },
    key: "icon_visibility",
  },
  {
    label: $t(`model.information_panel.tile.properties.item_icon_visibility`),
    description: $t(`model.information_panel.tile.properties.item_icon_visibility_description`),
    type: "Boolean",
    ext: {
      true: $t("settings.yes"),
      false: $t("settings.no"),
    },
    key: "item_icon_visibility",
  },
  {
    label: $t(`model.information_panel.tile.properties.legend`),
    description: $t(`model.information_panel.tile.properties.legend_description`),
    type: "Boolean",
    ext: {
      true: $t("settings.yes"),
      false: $t("settings.no"),
    },
    key: "legend",
  },

  {
    label: $t(`model.information_panel.tile.properties.title_color`),
    description: $t(`model.information_panel.tile.properties.title_color_description`),
    type: "Color",
    key: "title_color",
  },
  {
    label: $t(`model.information_panel.tile.properties.legend_label_color`),
    description: $t(`model.information_panel.tile.properties.legend_label_color_description`),
    type: "Color",
    key: "legend_label_color",
    disabled: true,
  },

  {
    label: $t(`model.information_panel.tile.properties.chart_type`),
    description: $t(`model.information_panel.tile.properties.chart_type_description`),
    type: "String",
    key: "chart_type",
    disabled: true,
  },
  {
    label: $t(`model.information_panel.tile.properties.measurement_list`),
    description: $t(`model.information_panel.tile.properties.measurement_list_description`),
    type: "Boolean",
    ext: {
      true: $t("settings.yes"),
      false: $t("settings.no"),
    },
    key: "measurement_list",
  },
  {
    label: $t(`model.information_panel.tile.properties.background_mask`),
    description: $t(`model.information_panel.tile.properties.background_mask_description`),
    type: "Color",
    key: "background_mask",
    disabled: true,
  },
  {
    label: $t(`model.information_panel.tile.properties.measurement_background`),
    description: $t(`model.information_panel.tile.properties.measurement_background_description`),
    type: "Boolean",
    ext: {
      true: $t("settings.yes"),
      false: $t("settings.no"),
    },
    key: "measurement_background",
  },
  {
    label: $t(`model.information_panel.tile.properties.template`),
    description: $t(`model.information_panel.tile.properties.template_description`),
    type: "Boolean",
    ext: {
      true: $t("settings.yes"),
      false: $t("settings.no"),
    },
    key: "template",
  },
  {
    label: $t(`model.information_panel.tile.properties.measurement_color`),
    description: $t(`model.information_panel.tile.properties.measurement_color_description`),
    type: "Color",
    key: "measurement_color",
  },
  {
    label: $t(`model.information_panel.tile.properties.knob_color`),
    description: $t(`model.information_panel.tile.properties.knob_color_description`),
    type: "Color",
    key: "knob_color",
  },
  {
    label: $t(`model.information_panel.tile.properties.background`),
    description: $t(`model.information_panel.tile.properties.background_description`),
    type: "Color",
    key: "background",
    ext: {
      use_alpha: true,
    },
  },
  {
    label: $t(`model.information_panel.tile.properties.img_url`),
    description: $t(`model.information_panel.tile.properties.img_url_description`),
    type: "String",
    key: "img_url",
  },
  {
    label: $t(`model.information_panel.tile.properties.qrcode_content`),
    description: $t(`model.information_panel.tile.properties.qrcode_content_description`),
    type: "String",
    key: "qrcode_content",
  },
];
console.debug(tileProperties.map((it) => it.key).join(","));
export default tileProperties;
const chartProperties = new Set([
  "title_visibility",
  "title_color",
  "background",
  "background_mask",
  "measurement_background",
  "measurement_color",
  "legend",
  // "legend_label_color",
  // "chart_type",
]);
const knobProperties = new Set([
  "title_visibility",
  "title_color",
  "background",
  "background_mask",
  "measurement_background",
  "measurement_color",
  "knob_color",
  "icon_visibility",
  "icon",
]);
const multiKnobProperties = new Set([
  "title_visibility",
  "title_color",
  "background",
  "background_mask",
  "measurement_background",
  "measurement_color",
  "measurement_list",
  "legend",
  "icon_visibility",
  "item_icon_visibility",
  "icon",
]);
const doughnutProperties = new Set([
  "title_visibility",
  "title_color",
  "background",
  "background_mask",
  "measurement_background",
  "measurement_color",
  "legend",
  "icon_visibility",
  "icon",
]);
const listProperties = new Set([
  "title_visibility",
  "title_color",
  "background",
  "background_mask",
  "icon_visibility",
  "item_icon_visibility",
  "icon",
]);
const singleProperties = new Set([
  "title_visibility",
  "title_color",
  "background",
  "background_mask",
  "icon_visibility",
  "measurement_background",
  "measurement_color",
  "icon",
  "template",
]);
const emptyProperties = new Set(["title_visibility", "title_color", "background", "background_mask", "icon_visibility", "icon", "template"]);
const qrCodeProperties = new Set(["background", "qrcode_content"]);
//"title_visibility", "title_color",
const imageProperties = new Set(["title_visibility", "title_color", "background", "img_url"]);

export function getTileProperties(tileType) {
  let propertiesWhiteFilter = null;
  switch (tileType) {
    case "chart":
      propertiesWhiteFilter = chartProperties;
      break;
    case "knob":
      propertiesWhiteFilter = knobProperties;
      break;
    case "multi_knob":
      propertiesWhiteFilter = multiKnobProperties;
      break;
    case "doughnut":
      propertiesWhiteFilter = doughnutProperties;
      break;
    case "list":
      propertiesWhiteFilter = listProperties;
      break;
    case "single":
      propertiesWhiteFilter = singleProperties;
      break;
    case "image":
      propertiesWhiteFilter = imageProperties;
      break;
    case "qrcode":
      propertiesWhiteFilter = qrCodeProperties;
      break;
    case "empty":
      propertiesWhiteFilter = emptyProperties;
      break;
    default:
      return tileProperties;
    // "panel": "Panel", -> TODO:
    // "multi_doughnut": "Multi doughnut chart",  -> TODO:
  }
  return tileProperties.filter((it) => propertiesWhiteFilter.has(it.key));
  // TODO:
  // title_color: tile.props.title_color != null ? tile.props.title_color : null,
  // fontSize: panelSettings.fontSize,
  // background_mask: tile.props.mask,
  // background: tile.props.background,
  // template: tile.props.template,
  // legend: tile.props.legend != null ? tile.props.legend : panelSettings.legend,
}
