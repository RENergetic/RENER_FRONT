const MIN_INTERVAL_MS = 15000;
const DEFAULT_REFRESH_INTERVAL_MS = 15 * 60 * 1000;
export default class LoopRunner {
  minInterval = MIN_INTERVAL_MS;
  interval = DEFAULT_REFRESH_INTERVAL_MS;
  running = false;
  _promise = null;
  _handlerPromise = null;
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
    this.running = true;
    this.id = this.id++;
    console.debug(`start loop(${this.id}) : ${this.interval} `);
    this.loop();
  }
  async stop() {
    if (!this.running) return;
    console.debug(`stop loop(${this.id}) : ${this.interval} `);
    this.running = false;
    try {
      if (this._promise != null) {
        await this._promise;
      }
      if (this._handlerPromise != null) {
        await this._handlerPromise;
      }
    } catch (ex) {
      console.debug(ex);
    }
  }
  async reset() {
    console.debug(`reset loop(${this.id}) : ${this.interval} `);
    await this.stop();
    let dt = Math.max(this.interval, this.minInterval);
    // console.info(dt);
    this._promise = new Promise((r) => setTimeout(r, dt));
    await this._promise;
    this._promise = null;
    this.start();
  }
  async loop() {
    var id = this.id; // in case we toggle running state it prevents from running many instances forever
    while (this.running && id == this.id) {
      console.debug(`loop(${id}) : ${this.interval} `);
      let t = Date.now();
      try {
        this._handlerPromise = this.handler();
        await this._handlerPromise;
        this._handlerPromise = null;
      } catch (ex) {
        console.error(ex);
      }

      let dt = Date.now() - t;
      // console.info(dt);
      dt = Math.max(this.interval - dt, this.minInterval);
      // console.info(dt);
      this._promise = new Promise((r) => setTimeout(r, dt));
      await this._promise;
      this._promise = null;
    }
  }
}
