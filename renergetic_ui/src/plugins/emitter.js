import mitt from "mitt";
import { setLocale } from "@/plugins/locales.js";
const emitter = mitt();
emitter.on("localeSwitch", (currentLocale) => {
  console.info(`Locale request: ${currentLocale}`);
  if (currentLocale) {
    setLocale(currentLocale);
    emitter.emit("refresh");
  }
});
export default emitter;
