import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'keyobject' })

export class Keyobject implements PipeTransform {

    transform(value, args: string[]): any {
        const keys = [];
        for (let key in value) {
            keys.push({ key: key, value: value[ key ] });
        }
        return keys.filter(itm => itm.value).map((itm, i, arr) => { itm.total = arr.length; return itm });
    }
}
