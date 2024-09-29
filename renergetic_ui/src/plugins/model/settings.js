import i18n from "@/plugins/locales";

const $t = i18n.global.t.bind(i18n);

var panelSchema = function () {
  return [
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
      label: $t("settings.request_demand_visibility"),
      description: $t("settings.request_demand_visibility_description"),
      ext: {
        true: $t("settings.visible"),
        false: $t("settings.hidden"),
      },
      type: "Boolean",
      key: "demandVisibility",
    },
    {
      label: $t("settings.notification_visibility"),
      description: $t("settings.notification_visibility_description"),
      ext: {
        true: $t("settings.visible"),
        false: $t("settings.hidden"),
      },
      type: "Boolean",
      key: "notificationVisibility",
    },
    {
      label: $t("settings.panel_override_mode"),
      description: $t("settings.panel_override_mode_description"),
      ext: {
        true: $t("settings.enabled"),
        false: $t("settings.disabled"),
      },
      type: Boolean,
      key: "overrideMode",
    },
    {
      label: $t("settings.panel_qr_code"),
      description: $t("settings.panel_qr_code_description"),
      type: String,
      key: "qrcode",
    },
    {
      label: $t("settings.panel_qr_code_position"),
      description: $t("settings.panel_qr_code_position_description"),
      type: Array,
      key: "qrcodePosition",
      ext: {
        options: [
          { id: "top_right", label: $t("settings.panel_qr_code_positions.top_right") },
          { id: "top_left", label: $t("settings.panel_qr_code_positions.top_left") },
          { id: "bottom_right", label: $t("settings.panel_qr_code_positions.bottom_right") },
          { id: "bottom_left", label: $t("settings.panel_qr_code_positions.bottom_left") },
        ],
        optionLabel: "label",
        optionValue: "id",
      },
      defaultValue: "top_right",
    },
    {
      label: $t("settings.panel_qr_code_size"),
      description: $t("settings.panel_qr_code_size_description"),
      type: Number,
      key: "qrcodeSize",
      defaultValue: 200,
    },
    {
      label: $t("settings.panel_tag_key"),
      description: $t("settings.panel_tag_key_description"),
      type: String,
      key: "tag_key",
      defaultValue: null,
    },
    {
      label: $t("settings.panel_tag_value"),
      description: $t("settings.panel_tag_value_description"),
      type: String,
      key: "tag_value",
      defaultValue: null,
    },
    {
      label: $t(`settings.compare_interval_type`),
      description: $t(`settings.compare_interval_type_description`),
      type: Array,
      ext: {
        options: [
          { id: "none", label: $t("enums.interval_type.none") },
          { id: "previous", label: $t("enums.interval_type.previous") },
          { id: "year", label: $t("enums.interval_type.year") },
          { id: "month", label: $t("enums.interval_type.month") },
          { id: "day", label: $t("enums.interval_type.day") },
          { id: "week", label: $t("enums.interval_type.week") },
        ],
        optionLabel: "label",
        optionValue: "id",
      },
      key: "compare_interval_type",
      default: "none",
    },
  ];
};
var userPanelSchema = function () {
  return [
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
      label: $t("settings.request_demand_visibility"),
      description: $t("settings.request_demand_visibility_description"),
      ext: {
        true: $t("settings.visible"),
        false: $t("settings.hidden"),
      },
      type: "Boolean",
      key: "demandVisibility",
    },
    {
      label: $t("settings.notification_visibility"),
      description: $t("settings.notification_visibility_description"),
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
};
export { panelSchema, userPanelSchema };
