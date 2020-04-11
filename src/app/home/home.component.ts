import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as _ from "lodash";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { v4 as uuid } from "uuid";
import { AlertifyService } from "../services/alertify.service";
import { EosService } from "../services/eos.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
declare const Buffer;

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
/****************************************************************************************************
 ****************************************************************************************************
 ****************************************************************************************************
 * @ngdoc class                                                                                   ***
 * @name HomeComponent                                                                            ***
 * @module components.home.module                                                                 ***
 * @requires EosService                                                                           ***
 * @description Home page. Displays all personal data related to user                             ***
 ****************************************************************************************************
 **********************************************************ª*****************************************/
export class HomeComponent implements OnInit {
  // Decorator wires up blockUI instance
  @BlockUI() blockUI: NgBlockUI;
  data: any;

  isDraft: boolean = false;

  records: any = [
    {
      time: "18:30:05 - 18:30:45",
      date: "10/09/20",
      description: "40 seconds of contact",
      minTime: "1",
      maxTime: "1",
    },
    {
      time: "18:30:05 - 18:30:45",
      date: "10/09/20",
      description: "40 seconds of contact",
      minTime: "1",
      maxTime: "1",
    },
    {
      time: "18:30:05 - 18:30:45",
      date: "10/09/20",
      description: "40 seconds of contact",
      minTime: "1",
      maxTime: "1",
    },
    {
      time: "18:30:05 - 18:30:45",
      date: "10/09/20",
      description: "40 seconds of contact",
      minTime: "1",
      maxTime: "1",
    },
    {
      time: "18:30:05 - 18:30:45",
      date: "10/09/20",
      description: "40 seconds of contact",
      minTime: "1",
      maxTime: "1",
    },
    {
      time: "18:30:05 - 18:30:45",
      date: "10/09/20",
      description: "40 seconds of contact",
      minTime: "1",
      maxTime: "1",
    },
    {
      time: "18:30:05 - 18:30:45",
      date: "10/09/20",
      description: "40 seconds of contact",
      minTime: "1",
      maxTime: "1",
    },
    {
      time: "18:30:05 - 18:30:45",
      date: "10/09/20",
      description: "40 seconds of contact",
      minTime: "1",
      maxTime: "1",
    },
    {
      time: "18:30:05 - 18:30:45",
      date: "10/09/20",
      description: "40 seconds of contact",
      minTime: "1",
      maxTime: "1",
    },
    {
      time: "18:30:05 - 18:30:45",
      date: "10/09/20",
      description: "40 seconds of contact",
      minTime: "1",
      maxTime: "1",
    },
    {
      time: "18:30:05 - 18:30:45",
      date: "10/09/20",
      description: "40 seconds of contact",
      minTime: "1",
      maxTime: "1",
    },
    {
      time: "18:30:05 - 18:30:45",
      date: "10/09/20",
      description: "40 seconds of contact",
      minTime: "1",
      maxTime: "1",
    },
    {
      time: "18:30:05 - 18:30:45",
      date: "10/09/20",
      description: "40 seconds of contact",
      minTime: "1",
      maxTime: "1",
    },
  ];
  alertId: string = uuid();
  constructor(
    private activatedRoute: ActivatedRoute,
    private alertify: AlertifyService,
    private eosService: EosService,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.alertify.alertId = this.alertId;
  }

  /**
   *
   * @param frames
   * Returns sorted list of frames
   */
  sortFrames(frames: any) {
    if (frames) {
      frames.sort(function (a: any, b: any) {
        if (a.stamp_secs < b.stamp_secs) {
          return -1;
        }
        if (a.stamp_secs > b.stamp_secs) {
          return 1;
        }
        return 0;
      });
    }
    return frames;
  }

  ngOnInit() {
    this.blockUI.stop();
    this.alertify.clear();
    this.activatedRoute.data.subscribe((data) => {
      if (data["recordsList"] && data["recordsList"].rows) {
        let hash_uid = localStorage.getItem("uid");
        let storageRows = data["recordsList"].rows;
        let userRows: any = [];
        if (!_.isEmpty(storageRows)) {
          for (let i = 0; i < storageRows.length; i++) {
            if (storageRows[i].hash_uid === hash_uid) {
              userRows.push(storageRows[i]);
            }
          }
          this.records = this.createVideosFromFrames(userRows);
        }
      } else {
        if (data["recordsList"] && data["recordsList"].message) {
          this.alertify.error(data["recordsList"].message);
        }
      }
    });
  }

  search(event) {}

  eraseAllDataFromStorage() {
    this.eosService.eraseAllDataFromStorage();
  }

  deleteCards(content: any) {
    this.isDraft = true;
  }

  declineDeletion() {
    this.isDraft = false;
    if (this.records && this.records.length > 0) {
      for (let i = 0; i < this.records.length; i++) {
        this.records[i].checked = false;
      }
    }
  }

  /**
   *
   * @param record
   * Load record from database
   */
  loadRecord(record: any) {
    this.blockUI.start();
    // this.eosService.update(record.images);
    this.router.navigate(["main", "record", record.minTime, record.maxTime]);
  }

  get tableIsEmpty() {
    return _.isEmpty(this.records);
  }

  /**
   * @param given_seconds
   * Returns time string in human readable format
   */
  convertSecondsToTime(given_seconds: any) {
    const dateObj = new Date(given_seconds * 1000);
    const hours = dateObj.getUTCHours();
    const minutes = dateObj.getUTCMinutes();
    const seconds = dateObj.getSeconds();

    const timeString =
      hours.toString().padStart(2, "0") +
      ":" +
      minutes.toString().padStart(2, "0") +
      ":" +
      seconds.toString().padStart(2, "0");
    return timeString;
  }
  /**
   *
   * @param frames
   * Returns List of videos that are deducible from a given list of frames
   * 1. Sort frames by time
   * 2. If one frame is 10 seconds older than the subsequent one,
   * than first frame is the end of the 1 video and last frame is the beggining of the second video
   */
  createVideosFromFrames(frames: any) {
    let videos: any = [];
    if (frames) {
      const sortedFrames = this.sortFrames(frames);
      let startTime: any;
      let videoFrames: any = [];
      for (let i = 0; i < sortedFrames.length; i++) {
        videoFrames.push(sortedFrames[i]);
        if (i == 0) {
          startTime = sortedFrames[i].stamp_secs;
        } else if (
          sortedFrames[i].stamp_secs - sortedFrames[i - 1].stamp_secs >=
          10
        ) {
          videos.push({
            hash_uid: sortedFrames[i].hash_uid,
            minTime: startTime,
            maxTime: sortedFrames[i].stamp_secs,
            time:
              this.convertSecondsToTime(startTime) +
              " - " +
              this.convertSecondsToTime(sortedFrames[i].stamp_secs),
            images: videoFrames,
          });
          startTime = sortedFrames[i].stamp_secs;
          videoFrames = [];
        } else if (i == sortedFrames.length - 1) {
          videos.push({
            hash_uid: sortedFrames[i].hash_uid,
            minTime: startTime,
            maxTime: sortedFrames[i].stamp_secs,
            time:
              this.convertSecondsToTime(startTime) +
              " - " +
              this.convertSecondsToTime(sortedFrames[i].stamp_secs),
            images: videoFrames,
          });
          videoFrames = [];
        }
      }
    }
    return videos;
  }
}
