import {CreateUserComponent} from "../create-user/create-user";
import {LoginComponent} from "../login/login";
import {Component} from "@angular/core/src/metadata/directives";
import {Nav} from "ionic-angular";
import {ViewChild} from "@angular/core";
import {TOKEN, USER} from "../../../shared/storage";
import {NativeStorage} from "@ionic-native/native-storage";

@Component({
  templateUrl: 'authentication.html'
})
export class AuthenticationComponent {
  private signup = CreateUserComponent;
  private login = LoginComponent;

  constructor(private storage: NativeStorage) {
  }

  ionViewDidLoad() {
    this.storage.clear().then(()=>{}).catch((err)=>{})
  };

}
