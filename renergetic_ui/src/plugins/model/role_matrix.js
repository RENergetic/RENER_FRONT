import { RenRolesStr, RenFeatures } from "./Enums";

const matrix = new Map([
  [
    RenRolesStr.REN_STAFF,
    new Map([
      [RenFeatures.PUBLIC_REPORTS, 1],
      [RenFeatures.GRAFANA_ACCESS, 0],
      [RenFeatures.GRAFANA_MANAGEMENT, 0],
      [RenFeatures.USER_MANAGEMENT, 0],
      [RenFeatures.ROLE_MANAGEMENT, 0],
      [RenFeatures.REPORT, 0],
      [RenFeatures.MANAGE_ASSET, 0],
      [RenFeatures.OWNER, 0],
      [RenFeatures.NOTIFICATION, 1],
      [RenFeatures.READ, 0],
    ]),
  ],

  [
    RenRolesStr.REN_GUEST,
    new Map([
      [RenFeatures.PUBLIC_REPORTS, 1],
      [RenFeatures.GRAFANA_ACCESS, 0],
      [RenFeatures.GRAFANA_MANAGEMENT, 0],
      [RenFeatures.USER_MANAGEMENT, 0],
      [RenFeatures.ROLE_MANAGEMENT, 0],
      [RenFeatures.REPORT, 0],
      [RenFeatures.MANAGE_ASSET, 0],
      [RenFeatures.OWNER, 0],
      [RenFeatures.NOTIFICATION, 0],
      [RenFeatures.READ, 0],
    ]),
  ],
  [
    RenRolesStr.REN_VISITOR,
    new Map([
      [RenFeatures.PUBLIC_REPORTS, 1],
      [RenFeatures.GRAFANA_ACCESS, 0],
      [RenFeatures.GRAFANA_MANAGEMENT, 0],
      [RenFeatures.USER_MANAGEMENT, 0],
      [RenFeatures.ROLE_MANAGEMENT, 0],
      [RenFeatures.REPORT, 0],
      [RenFeatures.MANAGE_ASSET, 0],
      [RenFeatures.OWNER, 0],
      [RenFeatures.NOTIFICATION, 0],
      [RenFeatures.READ, 1],
    ]),
  ],
  [
    RenRolesStr.REN_USER,
    new Map([
      [RenFeatures.PUBLIC_REPORTS, 1],
      [RenFeatures.GRAFANA_ACCESS, 0],
      [RenFeatures.GRAFANA_MANAGEMENT, 0],
      [RenFeatures.USER_MANAGEMENT, 0],
      [RenFeatures.ROLE_MANAGEMENT, 0],
      [RenFeatures.REPORT, 0],
      [RenFeatures.MANAGE_ASSET, 0],
      [RenFeatures.OWNER, 1],
      [RenFeatures.NOTIFICATION, 1],
      [RenFeatures.READ, 1],
    ]),
  ],
  [
    RenRolesStr.REN_MANAGER,
    new Map([
      [RenFeatures.PUBLIC_REPORTS, 1],
      [RenFeatures.GRAFANA_ACCESS, 1],
      [RenFeatures.GRAFANA_MANAGEMENT, 0],
      [RenFeatures.USER_MANAGEMENT, 0],
      [RenFeatures.ROLE_MANAGEMENT, 0],
      [RenFeatures.REPORT, 1],
      [RenFeatures.MANAGE_ASSET, 0],
      [RenFeatures.OWNER, 0],
      [RenFeatures.NOTIFICATION, 1],
      [RenFeatures.READ, null],
    ]),
  ],
  [
    RenRolesStr.REN_TECHNICAL_MANAGER,
    new Map([
      [RenFeatures.PUBLIC_REPORTS, 1],
      [RenFeatures.GRAFANA_ACCESS, 1],
      [RenFeatures.GRAFANA_MANAGEMENT, 1],
      [RenFeatures.USER_MANAGEMENT, 1],
      [RenFeatures.ROLE_MANAGEMENT, 0],
      [RenFeatures.REPORT, 1],
      [RenFeatures.MANAGE_ASSET, 1],
      [RenFeatures.OWNER, 0],
      [RenFeatures.NOTIFICATION, 1],
      [RenFeatures.READ, null],
    ]),
  ],
  [
    RenRolesStr.REN_ADMIN,
    new Map([
      [RenFeatures.PUBLIC_REPORTS, 1],
      [RenFeatures.GRAFANA_ACCESS, 1],
      [RenFeatures.GRAFANA_MANAGEMENT, 1],
      [RenFeatures.USER_MANAGEMENT, 1],
      [RenFeatures.ROLE_MANAGEMENT, 1],
      [RenFeatures.REPORT, 1],
      [RenFeatures.MANAGE_ASSET, 1],
      [RenFeatures.OWNER, 0],
      [RenFeatures.NOTIFICATION, 1],
      [RenFeatures.READ, null],
    ]),
  ],

  //   [
  //     RenRolesStr.REN_DEV,
  //     new Map([
  //       [RenFeatures.PUBLIC_REPORTS, 1],
  //       [RenFeatures.GRAFANA_ACCESS, 1],
  //       [RenFeatures.GRAFANA_MANAGEMENT, 1],
  //       [RenFeatures.USER_MANAGEMENT, 1],
  //       [RenFeatures.ROLE_MANAGEMENT, 1],
  //       [RenFeatures.REPORT, 1],
  //       [RenFeatures.MANAGE_ASSET, 1],
  //       [RenFeatures.OWNER, 1],
  //       [RenFeatures.NOTIFICATION, 1],
  //       [RenFeatures.READ,      0]
  //     ]),
  //   ],
]);

export default matrix;
export { matrix };
