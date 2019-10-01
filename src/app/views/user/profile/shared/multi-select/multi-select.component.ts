import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface item {
    name: string;
    id: number;
    isSelected?: boolean;
    locationCd?: string;
}

@Component({
    selector: 'app-multi-select',
    templateUrl: './multi-select.component.html'
})
export class MultiSelectChipComponent implements OnInit {

    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    separatorKeysCodes: number[] = [ ENTER, COMMA ];
    itemCtrl = new FormControl();
    filteredItems: Observable<item[]>;
    items: item[];
    allItems: item[]; // = [ { name: 'Apple', id: 9 }, { name: 'Lime', id: 1 }, { name: 'Oenger', id: 3 }, { name: 'Orange2', id: 5 } ];

    @ViewChild('itemInput', { static: false }) itemInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
    @Input('listData') list: any[];
    @Input('placeholder') placeholder: string;
    @Input('isErr') isErr: boolean;
    @Output('onDataChange') onDataChange = new EventEmitter<item[]>();
    @Input('checkDisabled') isDisable: boolean;

    constructor() {}

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.allItems = this.list.map(item => {
            return { id: item.id, name: item.name, isSelected: item.isSelected ? true : false }
        });

        this.items = this.allItems.filter(itm => itm.isSelected);

        this.filteredItems = this.itemCtrl.valueChanges.pipe(
            startWith(null),
            map((input: string | number | null) => input ? this._filter(input) : this.allItems.slice()));
    }

    addToSelectedItems(item: item) {
        const isExist = this.items.some(itm => itm.id == item.id);
        if (!isExist) {
            item.isSelected = true;
            this.items.push(item);
            this.onDataChange.emit(this.items);
        }
    }

    add(event: MatChipInputEvent): void {
        // Add fruit only when MatAutocomplete is not open
        // To make sure this does not conflict with OptionSelected Event
        if (!this.matAutocomplete.isOpen) {
            const input = event.input;
            const value = event.value;

            // Add our fruit
            if ((value || '').trim()) {
                const item = this.allItems.find(item => item.name.toLowerCase() == value.toLowerCase())
                if (item) {
                    this.addToSelectedItems(item);
                }
            }

            // Reset the input value
            if (input) {
                input.value = '';
            }
            this.itemCtrl.setValue(null);
        }
    }

    remove(selectedItemId: number): void {
        const index = this.items.findIndex(item => item.id == selectedItemId);

        if (index >= 0) {
            this.items[ index ].isSelected = false;
            this.items.splice(index, 1);
            this.onDataChange.emit(this.items);
        }
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        const selectedItm = this.allItems.find((itm: item) => itm.id == parseInt(event.option.value))
        this.addToSelectedItems(selectedItm);
        this.itemInput.nativeElement.value = '';
        this.itemCtrl.setValue(null);
    }

    open(trigger: MatAutocompleteTrigger) {
        trigger.openPanel();
    }

    private _filter(value: any): item[] {

        const isString = typeof value == 'string';
        const filterValue = isString ? value.toLowerCase() : value;

        return this.allItems.filter((item: item) => {
            if (isString) {
                return item.name.toLowerCase().indexOf(filterValue) !== -1;
            } else {
                return item.id == value
            }
        });
    }
}