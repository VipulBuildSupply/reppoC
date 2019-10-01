import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { UserModel } from 'src/app/shared/models/user.model';
import { FieldRegExConst } from 'src/app/shared/constants';

@Component({
    selector: 'app-personal-profile',
    templateUrl: './personal-profile.component.html'
})
export class PersonalProfileComponent implements OnInit {

    user: UserModel;
    userForm: FormGroup;
    subscriptions: Subscription[] = [];
    photoForm: FormGroup;
    _isEdit: boolean = false;
    msg: string;
    localImg;
    firstName: string;

    constructor(private userService: UserService,
        private _formBuilder: FormBuilder,
        private activatedRout: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {

        if (this.router.url != '/user/profile/personal/edit') {
            this.userService.isEdit = false;
            this.user = new UserModel(this.activatedRout.snapshot.data.user);
            this.formInit();
        } else {
            this.user = this.userService.user;
        }
        this._isEdit = this.userService.isEdit;

        if (this.router.url === '/user/profile/personal/edit' && !this._isEdit) {
            this.router.navigate(['/user/profile/personal']);
        }

        if (this.router.url === '/user/profile') {
            this.router.navigate([`/user/profile/personal`]);
        }

        this.startSubscriptions();
        this.formInit();
    }

    edit() {
        this.userService.isEdit = true;
        this.router.navigate(['/user/profile/personal/edit']);
    }

    startSubscriptions() {
        this.subscriptions.push(

            this.activatedRout.url.subscribe(url => {

            }),

            this.activatedRout.params.subscribe(prm => {
                if (prm.edit) {
                    this._isEdit = prm.edit;
                }
            }),

            this.userService.userUpdated$.subscribe((user: UserModel) => {
                this.updateUser(this.userService.user)
            }),

            this.userService.onProfileSwitch$.subscribe(_ => {
                this.router.navigate([`/user/profile/personal`]);
            })
        );

    }

    formInit() {

        this.userForm = this._formBuilder.group({

            firstName: [{
                value: this.user.sellerPersonalProfile.firstName,
                disabled: (!this._isEdit)
            }],
            phone: [{
                value: this.user.phone,
                disabled: true
            }, {
                validators: [
                    Validators.required
                ]
            }],
            email: [{
                value: this.user.sellerPersonalProfile.email,
                disabled: (!this._isEdit)
            }, {
                validators: [
                    Validators.required,
                    Validators.pattern(FieldRegExConst.EMAIL),
                ]
            }],
        });

        this.photoForm = this._formBuilder.group({
            file: ['']
        });
    }

    updateUser(user: UserModel) {
        this.user = user;
        this.formInit();
    }

    onFileSelect(event) {
        if (event.target.files.length > 0) {

            var reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (event) => {
                this.localImg = (<FileReader>event.target).result;
            }

            const file = event.target.files[0];
            this.photoForm.get('file').setValue(file);
            this.uploadImage();
        }
    }

    uploadImage() {
        if (this.photoForm.valid && this.photoForm.get('file').value) {

            const formData = new FormData();
            formData.append('file', this.photoForm.get('file').value);

            this.userService.updatePhoto(formData).then(res => {
                this.router.navigate(['/user/profile/personal']);
                this.userService.getUserData();
            })
        }
    }

    submit() {
        if (this.userForm.valid) {
            this.userService.updateProfile(this.userForm.value).then(res => {
                this.router.navigate(['/user/profile/personal']);
            });
        }
        this.uploadImage();
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
    }

    verifyEmail() {
        this.userService.emailVerify(this.user).then(res => {
            console.log(res);
        });
    }

}
