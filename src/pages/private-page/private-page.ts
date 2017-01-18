import { Component } from '@angular/core';

import { Platform, NavController, NavParams } from 'ionic-angular';

import { FormBuilder, FormGroup } from '@angular/forms';

import { Page2 } from '../page2/page2';

import {PubNubService, PubNubEvent, PubNubEventType} from '../../services/pubnub';

/*
  Generated class for the PrivatePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-private-page',
  templateUrl: 'private-page.html'
})
export class PrivatePagePage {

   messageForm: FormGroup;
    messageControl;
    
    channel:string = 'group1-ch';
    
    messages:Array<any> = ['1', '2'];
    uuid:string;
  constructor(public navCtrl: NavController,private pubNubService:PubNubService,private platform: Platform,private builder: FormBuilder,private param:NavParams) {
    // Generating a random uuid between 1 and 100 using utility function from lodash library.
        console.log(this.param.get('name'));
        this.uuid = this.param.get('name');
        console.log(this.uuid);
        // Create reference to message field
        this.messageForm = builder.group({
      'message': ''
       });
       this.pubNubService.connectionuuid(this.uuid);
       this.onPageWillEnter();
       
      // this.messageControl = this.messageForm.controls['message'];
  }
  
  onPageWillEnter() {
        this.platform.ready().then(() => {
            // Get history for channel
            this.pubNubService.history(this.channel).subscribe((event: PubNubEvent) => {
                let messages:Array<any> = [];
               // console.log(event);
                for (let i = 0; i < event.value[0].length; i++) {
                    messages.push(this.createMessage(event.value[0][i].message));
                }
                this.messages = messages;
            }, (error) => {
                console.log(JSON.stringify(error));
            });
            // Subscribe to messages channel
            this.pubNubService.subscribe(this.channel).subscribe((event: PubNubEvent) => {
                if (event.type === PubNubEventType.MESSAGE) {
                    this.messages.push(this.createMessage(event.value));
                }
            }, (error) => {
                console.log(JSON.stringify(error));
            });
        });
    }
    createMessage(message:any):any {
        return {
            content: message && message.content ? message.content.message : message,
            date: message.date,
            user:message.sender_uuid
        };
    }
    // Fetching a uniq random avatar from the robohash.org service.
    avatarUrl(uuid) {
        return '//robohash.org/' + uuid + '?set=set2&bgset=bg2&size=70x70';
    };
    
    sendMessage(messageContent:string) {
       // Don't send an empty message 
       if (messageContent && messageContent !== '') {
           this.pubNubService.publish(this.channel, {
                    content: messageContent,
                    sender_uuid: this.uuid,
                    date: new Date()
                }).subscribe((event: PubNubEvent) => {
                    console.log('Published', event.value);
                    // Reset the messageContent input
                    (this.messageForm.controls['message']).updateValueAndValidity();
                   // console.log(this.messages);
                }, (error) => {
                    // Handle error here
                    console.log('Publish error', JSON.stringify(error));
                }
            );
       }
    }
    userlist(){
      this.navCtrl.setRoot(Page2,{"uuid":this.uuid});
    }

}
