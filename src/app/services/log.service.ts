import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class LogService {
  log(...msg: string[]) {
    console.log(new Date() + ": " + JSON.stringify(msg.join(' , ')));
  }
}
