import {CreateUserComponent} from "../create-user/create-user";
import {LoginComponent} from "../login/login";
import {Component} from "@angular/core/src/metadata/directives";
import {Nav} from "ionic-angular";
import {ViewChild} from "@angular/core";

@Component({
  templateUrl: 'authentication.html'
})
export class AuthenticationComponent {
  private signup = CreateUserComponent;
  private login = LoginComponent;

  constructor() {}

}
