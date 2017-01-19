import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import {Validators, FormBuilder } from '@angular/forms';

import { Page1 } from '../page1/page1';

/*
  Generated class for the MyPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-my-page',
  templateUrl: 'my-page.html'
})
export class MyPagePage {
  private todo:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,private formBuilder: FormBuilder) {
    this.todo = this.formBuilder.group({
      title: ['', Validators.compose([Validators.maxLength(10), Validators.pattern('[a-zA-Z]*'), Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyPagePage');
  }
  logForm(){
    this.navCtrl.setRoot(Page1,{name:this.todo.value.title});
   // console.log(this.todo.value)
  }
  

}
