import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { FormHelper } from 'src/app/shared/helpers/form-helper';
import { FieldRegExConst } from 'src/app/shared/constants';
import { UserReferences } from 'src/app/shared/models/reference';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-add-reference',
    templateUrl: './add-reference.component.html'
})
export class AddReferenceComponent implements OnInit {

    referenceForm: FormGroup;
    submitBtn = false;
    isEdit: boolean;
    references: UserReferences;
    subscriptions: Subscription[] = [];
    isAdd: boolean;

    constructor(private _formBuilder: FormBuilder,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _userService: UserService) { }

    ngOnInit(): void {
        this.startSubscriptions();
        this.formInit();        
    }

    startSubscriptions() {
        this.subscriptions.push(
            this._activatedRoute.url.subscribe(url => {
                this.isEdit = url[1].path == 'edit';
                this.isAdd = url[1].path == 'add';
                if (this.isEdit){
                    if(this._userService.referencesToEdit) {
                        this.references = this._userService.referencesToEdit;
                    }else{
                        this._router.navigate(['/user/profile/reference']);
                    }
                }
            })
        );
    }

    formInit(){
        const {companyName, name, phone} = this.references || {} as UserReferences;
        this.referenceForm = this._formBuilder.group({
            companyName: [companyName || '', {
                validators: [
                    Validators.required
                ]
            }],
            name: [ name || '', {
                validators: [
                    Validators.required
                ]
            }],
            phone: [phone || '', {
                validators: [
                    Validators.pattern(FieldRegExConst.PHONE),
                    Validators.maxLength(10),
                    Validators.minLength(10),
                    Validators.required
                ]
            }],
        });
    }

    submit() {
        if (this.referenceForm.valid) {

            const data = [];
            data.push(this.referenceForm.value);

            if (this.isEdit) {
                this.editUserReference(this.references.id, this.referenceForm.value);

            } else {
                this.addUserReference(data);
            }
        }
        else {
            FormHelper.validateAllFormFields(this.referenceForm);
        }
    }

    /**
    *  @description: this function is used to cancel the billing/deliveryRange address after editing
    */
    goToReferencePage() {
        this._router.navigate([`/user/profile/reference`]);
    }

    /**
     * 
     * @param value data need to edit
     * @description Function will execute to Edit Reference
     */
    editUserReference(refId, value){
        this._userService.editReferences(refId, value).then(res => {
            if (res.success) {
                this.goToReferencePage();
            }
        });
    }

    /**
     * 
     * @param value data need to add
     * @description Function will execute to add Reference
     */
    addUserReference(value){
        this._userService.addReferences(value).then(res => {
            if (res.success) {
                this.goToReferencePage();
            }
        });
    }
}