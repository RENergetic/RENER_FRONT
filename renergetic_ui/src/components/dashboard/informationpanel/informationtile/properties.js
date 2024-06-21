import i18n from "@/plugins/locales";

const $t = i18n.global.t.bind(i18n);
export default [
  {
    label: $t(`model.information_panel.tile.properties.icon`),
    description: $t(`model.information_panel.tile.properties.icon_description`),
    type: "icon",
    key: "icon",
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
    description: $t(`model.information_panel.tile.properties.background_mask_list_description`),
    type: "Color",
    key: "background_mask",
  },
  {
    label: $t(`model.information_panel.tile.properties.measurement_background`),
    description: $t(`model.information_panel.tile.properties.measurement_background_list_description`),
    type: "Boolean",
    ext: {
      true: $t("settings.yes"),
      false: $t("settings.no"),
    },
    key: "measurement_background",
  },
  {
    label: $t(`model.information_panel.tile.properties.template`),
    description: $t(`model.information_panel.tile.properties.template_list_description`),
    type: "Boolean",
    ext: {
      true: $t("settings.yes"),
      false: $t("settings.no"),
    },
    key: "template",
  },
  {
    label: $t(`model.information_panel.tile.properties.knob_color`),
    description: $t(`model.information_panel.tile.properties.knob_color_list_description`),
    type: "Color",
    key: "knob_color",
  },
  {
    label: $t(`model.information_panel.tile.properties.background`),
    description: $t(`model.information_panel.tile.properties.background_list_description`),
    type: "Color",
    key: "background",
    ext: {
      use_alpha: true,
    },
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
