import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'animal-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit {
  //数据
  @Input()
  set data(data: TimelineData) {
    if (data != null) {

    }
  };
  constructor() { }

  ngOnInit() { }

}

class TimelineData {
  album: Array<Media> = [];
  timeline: Array<TimelineNode> = [];
}
class Media {
  type: MediaType = MediaType.PHOTO;
  url: string;
}
enum MediaType {
  PHOTO
}
class TimelineNode {
  time: Date;
  text: string;
}
