import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserRoutes } from './user.routing';
import { ProfileModule} from './profile/profile.module';
import { AppSharedModule } from 'src/app/shared/app-shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ProfileModule,
    FormsModule,
    ReactiveFormsModule,
    AppSharedModule,
    SharedComponentsModule,
    RouterModule.forChild(UserRoutes)
  ],
  entryComponents : []
})
export class UserModule { }
