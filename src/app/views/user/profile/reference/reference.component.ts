import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UserReferences } from 'src/app/shared/models/reference';
import { UserService } from 'src/app/shared/services/user.service';
import { DeleteReferenceComponent } from 'src/app/shared/dialogs/delete-reference/delete-reference.component';
import { MatDialog } from '@angular/material';

@Component({
    selector: 'app-reference',
    templateUrl: './reference.component.html'
})
export class ReferenceComponent implements OnInit {

    userReferences: UserReferences[];
    subscriptions: Subscription[] = [];
    
    constructor(private _activatedRoute: ActivatedRoute,
        private _userService: UserService,
        private _dialog: MatDialog){ }

    ngOnInit(){
        this.startSubscriptions();
    }

    startSubscriptions() {
        this.subscriptions.push(
            this._activatedRoute.params.subscribe(_ => {
                this.userReferences = this._activatedRoute.snapshot.data.reference;
            }),

            this._userService.editReference$.subscribe((references: UserReferences) => {
                this._userService.referencesToEdit = references;
            })
        );
    }

    deleteReferences(id: number): void {
        const d = this._dialog.open(DeleteReferenceComponent, {
            data: { deleteId: id, userReference: this.userReferences },
            disableClose: true,
            panelClass: 'profile-verification-popup',
            width: '25%'
        });
        d.afterClosed().toPromise().then((data: any) => {
            if (data) {
                this.userReferences = data;
            }
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subs => subs.unsubscribe())
    }
}