import { AngularFirestore } from 'angularfire2/firestore';
import { AppSettingsService } from './../../../app/service/AppSettingsService';
import { LocalAppSettings } from './../../../app/model/settings';
import { map, flatMap } from 'rxjs/operators';
import { ConnectedUserService } from './../../../app/service/ConnectedUserService';
import { ResponseWithData } from './../../../app/service/response';
import { User } from './../../../app/model/user';
import { Subject, from } from 'rxjs';
import { NavController, LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/UserService';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
})
export class UserLoginComponent implements OnInit {

  email: string;
  password: string;
  savePassword = true;
  errors: any[] = [];

  constructor(
    private appSettingsService: AppSettingsService,
    private connectedUserService: ConnectedUserService,
    private firestore: AngularFirestore,
    private loadingController: LoadingController,
    private navController: NavController,
    private userService: UserService,
  ) { }

  ngOnInit() {
    if (this.connectedUserService.isConnected()) {
      this.navController.navigateRoot(['/home']);
    }
    this.appSettingsService.get().pipe(
      map((settings: LocalAppSettings) => {
        this.email = settings.lastUserEmail;
        this.password = settings.lastUserPassword;
        console.log('Set email and password from local settings: ', this.email, this.password);
      })).subscribe();
  }

  isValid(): boolean {
    this.errors = [];
    if (!this.password || this.password.trim().length === 0) {
      this.errors.push('The password is required.');
    }
    if (!this.email || this.email.trim().length === 0) {
      this.errors.push('The email is required.');
    }
    return this.errors.length === 0;
  }

  login() {
    if (this.isValid()) {
      this.loadingController.create({ message: 'Login...', translucent: true}).then((l) => l.present());
      this.userService.loginWithEmailNPassword(this.email, this.password, this.savePassword).pipe(
        map((ruser) => {
          this.loadingController.dismiss();
          if (this.connectedUserService.isConnected()) {
            this.navController.navigateRoot(['/home']);
          } else {
            this.errors = [ruser.error];
          }
        })
      ).subscribe();
    }
  }

  createAccount() {
    this.navController.navigateRoot(['/user/create']);
  }

  resetPassword() {
    this.userService.resetPassword(this.email);
  }
}