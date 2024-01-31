import i18n from "@/plugins/locales";

const $t = i18n.global.t.bind(i18n);
var panelSchema = [
  {
    label: $t("settings.panel_reload_time_ms"),
    description: $t("settings.panel_reload_time_ms_description"),
    type: "Number",
    placeholder: 60000,
    key: "refreshTime",
  },
  {
    label: $t("settings.relative_values"),
    description: $t("settings.relative_values_description"),
    ext: {
      true: $t("settings.enabled"),
      false: $t("settings.disabled"),
    },
    type: "Boolean",
    key: "relativeValues",
  },
  {
    label: $t("settings.agg_by_domain"),
    description: $t("settings.agg_by_domain_description"),
    ext: {
      true: $t("settings.enabled"),
      false: $t("settings.disabled"),
    },
    type: "Boolean",
    key: "groupByDomain",
  },
  {
    label: $t("settings.agg_by_measurement"),
    description: $t("settings.agg_by_measurement_description"),
    ext: {
      true: $t("settings.enabled"),
      false: $t("settings.disabled"),
    },
    type: "Boolean",
    key: "groupByMeasurement",
  },
  {
    label: $t("settings.agg_by_direction"),
    description: $t("settings.agg_by_direction_description"),
    ext: {
      true: $t("settings.enabled"),
      false: $t("settings.disabled"),
    },
    type: "Boolean",
    key: "groupByDirection",
  },
  {
    label: $t("settings.tile_legend_visibility"),
    description: $t("settings.tile_legend_visibility_description"),
    ext: {
      true: $t("settings.enabled"),
      false: $t("settings.disabled"),
    },
    type: "Boolean",
    key: "legend",
  },
  {
    label: $t("settings.request_demand"),
    description: $t("settings.request_demand_description"),
    ext: {
      true: $t("settings.visible"),
      false: $t("settings.hidden"),
    },
    type: "Boolean",
    key: "demandVisibility",
  },
  {
    label: $t("settings.notification"),
    ext: {
      true: $t("settings.visible"),
      false: $t("settings.hidden"),
    },
    type: "Boolean",
    key: "notificationVisibility",
  },
  // {
  //   label: $t("settings.time_filter"),
  //   ext: {
  //     options: [
  //       { id: "current_day", label: $t("settings.time_filters.current_day") },
  //       { id: "current_month", label: $t("settings.time_filters.current_month") },
  //       { id: "current_year", label: $t("settings.time_filters.current_year") },
  //       { id: "previous_year", label: $t("settings.time_filters.previous_year") },
  //     ],
  //     optionLabel: "label",
  //     optionValue: "id",
  //   },
  //   type: Array,
  //   key: "selectedPanel",
  // },
  //TODO: font size?
  // {
  //   label: $t("settings.panel_font_size"),
  //   type: Number,
  //   key: "fontSize",
  //   ext: { mode: "decimal" },
  // },
];

export { panelSchema };
