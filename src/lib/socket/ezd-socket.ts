
/*
module for managing websockets
_*/

import { sleep } from '../util/sleep';

const reconn_sleep_base_ms = 100;

export class EzdSocket {
  ws: WebSocket;
  private constructor() {
    this.ws = new WebSocket('ws://localhost:4446');
    this.ws.addEventListener('open', (evt) => {
      this.handleOpen(evt);
    });
  }
  handleOpen(evt: Event) {
    console.log('connected to server');
    this.ws.addEventListener('close', (evt) => {
      this.handleClose(evt);
    });
  }
  handleClose(evt: Event) {
    this.reconnect();
  }
  async reconnect(reconnCount = 0) {
    let sleepMs = reconn_sleep_base_ms * Math.min((reconnCount + 1), 10);
    console.log(`reconnecting attempt ${reconnCount}, sleeping ${sleepMs}`);
    await sleep(sleepMs);
    this.ws = new WebSocket('ws://localhost:4446');
    this.ws.addEventListener('open', (evt) => {
      this.handleOpen(evt);
    });
    this.ws.addEventListener('error', () => {
      this.ws.close();
      this.reconnect(reconnCount + 1);
    });
  }
  static init(): EzdSocket {
    return new EzdSocket();
  }
}

// export const ezdSocket = new class EzdSocket {

// };
