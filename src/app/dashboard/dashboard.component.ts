import { Component, OnInit, OnDestroy } from '@angular/core';
import { ZegoExpressEngine } from 'zego-express-engine-webrtc';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private zegoEngine: ZegoExpressEngine | null = null;
  private appID = --;
  private server = '--'; 
  private token = '--'; 

  constructor(private auth: Auth, private router: Router) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.initializeZego(user.uid, user.displayName || 'Anonymous');
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy() {
    if (this.zegoEngine) {
      this.zegoEngine.destroyEngine();
    }
  }

  async initializeZego(userID: string, userName: string) {
    this.zegoEngine = new ZegoExpressEngine(this.appID, this.server);

    // Initialize the ZEGOCLOUD SDK
    await this.zegoEngine.loginRoom('roomID', this.token, { userID, userName });

    const localStream = await this.zegoEngine.createStream();
    const localVideo = document.getElementById('localVideo') as HTMLVideoElement;
    if (localVideo) {
      localVideo.srcObject = localStream;
    }

    this.zegoEngine.startPublishingStream('streamID', localStream);

    // To play the remote stream, you need to listen for the remote stream added event
    this.zegoEngine.on('roomStreamUpdate', (roomID, updateType, streamList) => {
      if (updateType === 'ADD' && streamList.length > 0) {
        const remoteVideo = document.getElementById('remoteVideo') as HTMLVideoElement;
        if (remoteVideo) {
          this.zegoEngine?.startPlayingStream(streamList[0].streamID);
        }
      }
    });
  }
}