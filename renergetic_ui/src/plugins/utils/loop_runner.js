const MIN_INTERVAL_MS = 15000;
const DEFAULT_REFRESH_INTERVAL_MS = 15 * 60 * 1000;
export default class LoopRunner {
  minInterval = MIN_INTERVAL_MS;
  interval = DEFAULT_REFRESH_INTERVAL_MS;
  running = false;
  id = 0;
  handler;

  constructor(handler, interval = null, minInterval = null) {
    this.minInterval = minInterval;
    this.interval = interval;
    this.handler = handler;
  }
  static init(handler, interval = null, minInterval = null) {
    minInterval = Math.max(MIN_INTERVAL_MS, minInterval ? minInterval : MIN_INTERVAL_MS);
    this.handler = handler;
    interval = interval ? interval : DEFAULT_REFRESH_INTERVAL_MS;
    return new LoopRunner(async () => handler(), interval, minInterval);
  }
  start() {
    if (this.running) return;
    console.info(`start loop(${this.id}) : ${this.interval} `);
    this.running = true;
    this.id = this.id++;
    this.loop();
  }
  stop() {
    if (!this.running) return;
    this.running = false;
  }
  async loop() {
    var id = this.id; // in case we toggle rinning state it prevents from running many instances forever
    while (this.running && id == this.id) {
      console.debug(`loop(${id}) : ${this.interval} `);
      let t = Date.now();
      try {
        await this.handler();
      } catch (ex) {
        console.error(ex);
      }

      let dt = Date.now() - t;
      // console.info(dt);
      dt = Math.max(this.interval - dt, this.minInterval);
      // console.info(dt);
      await new Promise((r) => setTimeout(r, dt));
    }
  }
}
