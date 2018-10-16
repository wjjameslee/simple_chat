import { Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, Content} from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';


@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  @ViewChild(Content) content: Content;


  username: string = '';
  message: string = '';
  subscription;
  datas: object[] = [];

  constructor(public db: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {
    this.username = this.navParams.get('username');
    this.subscription = this.db.list('/chat').subscribe( data => {
          this.datas = data;
      });

  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 50);
  }


  sendMessage() {
    this.db.list('/chat').push({
      username: this.username,
      message: this.message
    }).then( () => {
      // message is sent
    }).catch( () => {
      // some error
    });
    this.message = '';
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 50);

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
    this.db.list('/chat').push({
      specialMessage: true,
      message: `${this.username} has joined the room`
    });

  }

  ionViewWillLeave() {
    console.log('User is about to go');
    this.subscription.unsubscribe();
    this.db.list('/chat').push({
      specialMessage: true,
      message: `${this.username} has left the room`
    });

  }

}
