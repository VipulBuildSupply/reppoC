import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'gmtToLocal' })
export class CustomDatePipe implements PipeTransform {
  transform(str: any): string {

    const isTime = str.indexOf(":") != -1;

    const d = new Date(str.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3") + " GMT");

    const locaDate = `${("0" + d.getDate()).slice(-2)}-${("0" + (d.getMonth() + 1)).slice(-2)}-${d.getFullYear()}`

    const localTime = ` ${("0" + d.getHours()).slice(-2)}:${("0" + d.getMinutes()).slice(-2)}:${("0" + d.getSeconds()).slice(-2)}`

    return locaDate + (isTime ? localTime : '')
  }
}