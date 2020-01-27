import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'IsoDatePipe' })

export class NewDatePipe implements PipeTransform {
    transform(str: any): string {
        let date = str.slice(0, 10);
        date = date.split("-");
        const newdate = `${date[2] + '-' + date[1] + '-' + date[0]}` + ' ' + str.slice(11, 19);
        return newdate;
    }
}