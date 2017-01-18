import { Component } from '@angular/core';

import { Platform,NavController, NavParams } from 'ionic-angular';

import {PubNubService, PubNubEvent, PubNubEventType} from '../../services/pubnub';

import { PrivatePagePage } from '../private-page/private-page';

@Component({
  selector: 'page-page2',
  templateUrl: 'page2.html'
})
export class Page2 {
  selectedItem: any;
  icons: string[];
  items: Array<any>;

  channel:string = 'group1-ch';

  constructor(public navCtrl: NavController, public navParams: NavParams,private platform: Platform,private pubNubService:PubNubService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    // Let's populate this page with some filler content for funzies
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    'american-football', 'boat', 'bluetooth', 'build'];
    this.pubNubService.connectionuuid(navParams.get('uuid'));
    this.items = [];
    this.onLine();
    
  }

   onLine() {
        this.platform.ready().then(() => {

          this.pubNubService.here_now(this.channel).subscribe((event: PubNubEvent) => {
                 let user:Array<any> = [];
               // console.log(event);
                for (let i = 0; i < event.value.uuids.length; i++) {
                    user.push(this.createUser(event.value.uuids[i]));
                }
                this.items = user;

            }, (error) => {
                console.log(JSON.stringify(error));
            });
            // Get history for channel
            this.pubNubService.subscribe(this.channel).subscribe((event: PubNubEvent) => {
                console.log(event);

                if (event.type === PubNubEventType.PRESENCE) {
                  
                   // this.messages.push(this.createMessage(event.value));
                }
            }, (error) => {
                console.log(JSON.stringify(error));
            });
            
        });
    }
  avatarUrl(uuid) {
        return '//robohash.org/' + uuid + '?set=set2&bgset=bg2&size=70x70';
    };
    createUser(user:any):any {
        return {
            user:user
        };
    }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(PrivatePagePage,{ payload: {
      action: 'request',
      uuid: this.navParams.get('uuid'),
      target: item.user
    } });
  }
}
