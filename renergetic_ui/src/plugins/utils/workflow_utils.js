// import { TileTypes } from "@/plugins/model/Enums.js";
export default {
  isTaskRunning(workflowRun) {
    return workflowRun && workflowRun.start_time && (workflowRun.end_time == null || workflowRun.end_time < 0);
  },
};
