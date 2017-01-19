import { Component , ViewChild} from '@angular/core';

import { Platform, NavController, NavParams ,Content} from 'ionic-angular';

import { FormBuilder, FormGroup,Validators } from '@angular/forms';


 
import { Page2 } from '../page2/page2';

import {PubNubService, PubNubEvent, PubNubEventType} from '../../services/pubnub';

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {
@ViewChild(Content) content: Content;
   private  messageForm: any;
   private message:string;
    channel:string = 'group1-ch';
    
    messages:Array<any> = ['1', '2'];
    uuid:string;
  constructor(public navCtrl: NavController,private pubNubService:PubNubService,private platform: Platform,private builder: FormBuilder,private param:NavParams) {
    // Generating a random uuid between 1 and 100 using utility function from lodash library.
        console.log(this.param.get('name'));
        this.uuid = this.param.get('name');
        console.log(this.uuid);
        // Create reference to message field
        this.messageForm = this.builder.group({
      'message': ['', Validators.required]
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
                let dataReverse=event.value[0].reverse();
                for (let i = 0; i < dataReverse.length; i++) {
                    messages.push(this.createMessage(dataReverse[i].message));
                }
                this.messages = messages.reverse();
                this.scrollToTop();
            }, (error) => {
                console.log(JSON.stringify(error));
            });
            // Subscribe to messages channel
            this.pubNubService.subscribe(this.channel).subscribe((event: PubNubEvent) => {
                if (event.type === PubNubEventType.MESSAGE) {
                    this.messages.push(this.createMessage(event.value));
                    this.scrollToTop();
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
            user:message.sender_uuid,
            sender: message.sender_uuid==this.uuid ? 'sender' : 'reciever'
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
                   this.scrollToTop();
                   this.message='';
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
    scrollToTop() {
        var THIS=this.content;
        setTimeout(function(){
      THIS.scrollToBottom();
    }, 100);
  }
  doInfinte (){
    
  }

  loadingMore = false;
  previousScrollPosition = 0;
  onScroll = (e) => {
    let page = e.target.clientHeight;
    let scrolled = e.target.scrollTop;
    let direction = this.previousScrollPosition > scrolled ? 'top' : 'bottom';
    this.previousScrollPosition = scrolled;
    if(scrolled < page * 0.10) { //trigger infinite when we are at 10% from top
      if(!this.loadingMore && direction == 'top') {
        this.loadingMore = true;
          setTimeout( _=> {
            this.loadingMore = false;
          }, 100);
      }
    }
  }

  

}
