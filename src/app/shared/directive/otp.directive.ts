import {Directive, HostListener, Output} from '@angular/core';
import {Subject} from 'rxjs';
declare const $: any;

@Directive({
    selector: '[otp]'
})
export class OtpDirective {

    @Output() numberValue: Subject<any> = new Subject<any>();

    @HostListener('keyup', ['$event']) keyEvent(event) {
        if(event.code == "Backspace"){
            $(event.target).parent().prev().children('input').focus();
        }else{

            if(event.target.value.length > 1){
                const val2 = event.target.value.split('')[1];
                $(event.target).parent().next().children('input').val(val2);
            }

            event.target.value = event.target.value.substr(0,1);
            $(event.target).parent().next().children('input').focus();
            this.numberValue.next(event.target.value);
        }
    }    
}
