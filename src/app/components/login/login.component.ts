import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usuario: string;
  password: string;

  constructor(public loginService: LoginService, public router: Router) {
    this.usuario="";
    this.password="";
  }

  login(){
    const user = {email:this.usuario, password:this.password};
    this.loginService.signIn(user);
  }

  loginFake(){
    this.router.navigate(['home']);
  }

  ngOnInit(): void {
    console.log("Valor isLoggedIn: "+this.loginService.isLoggedIn);
  }

}
