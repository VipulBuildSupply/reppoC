import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { Router } from '@angular/router';
import { UserReferences } from 'src/app/shared/models/reference';
import { LoggerService } from 'src/app/shared/services/logger.service';

@Component({
    selector: 'app-reference-show',
    templateUrl: './reference-show.component.html'
})
export class ReferenceShowComponent implements OnInit {

    @Input('refer') refer: UserReferences;
    @Output('onDelete') deleteReferences = new EventEmitter<number>();
    @Input('isOptions') isOptions: boolean;

    constructor(private _userService: UserService,
        private _router: Router) { }

    ngOnInit(): void {
        this.isOptions = this.isOptions == false ? false : true;
    }

    edit() {
        this._userService.editReference$.next(this.refer);
        this._router.navigate(['user/profile/reference/edit']);
    }

    delete(id: number): void {
        this.deleteReferences.emit(id);
    }
}