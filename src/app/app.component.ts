import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
  AfterViewInit
} from "@angular/core";
import {fromEvent, combineLatest} from "rxjs";
import {filter, tap, concatMap, mergeMap, takeUntil} from "rxjs/operators";
import {CommunityMashupService} from "./communitymashup/communitymashup.service";
import {Person} from "./communitymashup/model/person.model";

export enum Direction {
  up,
  left,
  down,
  right
}

export const DistanceConfig = {
  up: {
    x: 0,
    y: 10
  },
  left: {
    x: -10,
    y: 0
  },
  down: {
    x: 0,
    y: -10
  },
  right: {
    x: 10,
    y: 0
  }
};

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, AfterViewInit {
  name = "Angular";
  cx;
  canvas = {width: 530, height: 350};
  currentLocation = {x: 200, y: 200};
  preDirection: string;

  penColor = 'black';
  penSize = 1;

  locationList = [];

  randProf: Person;

  @ViewChild("myCanvas", {static: false}) myCanvas: ElementRef;

  constructor(public communitymashup: CommunityMashupService) {
  }

  ngOnInit() {
    this.communitymashup.loadFromUrl();
  }

  ngAfterViewInit(): void {
    const canvasEl: HTMLCanvasElement = this.myCanvas.nativeElement;
    this.cx = canvasEl.getContext("2d");

    const mouseDown$ = fromEvent(this.myCanvas.nativeElement, "mousedown");
    const mouseMove$ = fromEvent(this.myCanvas.nativeElement, "mousemove");
    const mouseUp$ = fromEvent(this.myCanvas.nativeElement, "mouseup");

    mouseDown$.pipe(concatMap(down => mouseMove$.pipe(takeUntil(mouseUp$))));

    const mouseDraw$ = mouseDown$.pipe(
      tap((e: MouseEvent) => {
        this.cx.beginPath();
        this.cx.moveTo(e.offsetX, e.offsetY);
        this.cx.closePath();
      }),
      concatMap(() => mouseMove$.pipe(takeUntil(mouseUp$)))
    );

    mouseDraw$.subscribe((e: MouseEvent) => this.draw(e.offsetX, e.offsetY));
  }

  draw(offsetX, offsetY) {
    //this.cx.beginPath();
    this.cx.lineTo(offsetX, offsetY);
    this.cx.strokeStyle = this.penColor;
    this.cx.lineWidth = this.penSize;
    this.cx.stroke();
    //this.cx.closePath();
  }

//TODO Does not work yet
//Größenänderung des Pinsels (y)
  size(obj) {
    this.penSize = obj;
    //switch (obj.id) {
    //case "s1":
    //this.penSize = 1;
    //break;
    //case "s2":
    //this.penSize = 2;
    //break;
    //case "s5":
    //this.penSize = 5;
    //break;
    //case "s8":
    //this.penSize = 8;
    //break;
    //}
  }

//Farbänderung des Pinsels (x)
  color(obj) {
    if (obj == 1) {
      this.penColor = "#9C27B0";
    }
    if (obj == 2) {
      this.penColor = "#0D47A1";
    }
    if (obj == 3) {
      this.penColor = "#03A9F4";
    }
    if (obj == 4) {
      this.penColor = "#4CAF50";
    }
    if (obj == 5) {
      this.penColor = "#CDDC39";
    }
    if (obj == 6) {
      this.penColor = "#FFEB3B";
    }
    if (obj == 7) {
      this.penColor = "#FF9800";
    }
    if (obj == 8) {
      this.penColor = "#B71C1C";
    }
    if (obj == 9) {
      this.penColor = "#795548";
    }
    if (obj == 10) {
      this.penColor = "#D3D3D3";
    }
    if (obj == 11) {
      this.penColor = "#808080";
    }
    if (obj == 12) {
      this.penColor = "#000";
    }
    if (obj == 13) {
      this.penColor = "#D2B48C";
    }
    if (obj == 14) {
      this.penColor = "#DAA520";
    }
    if (obj == 15) {
      this.penColor = "#4B0082";
    }
    if (obj == 16) {
      this.penColor = "#FFC0CB";
    }
    if (obj == 17) {
      this.penColor = "#EE82EE";
    }


    if (obj == 0) {
      this.penColor = "white";
    }
    if (this.penColor == "white") this.penSize = 14;
    //else this.penSize = 2;
  }

  delete() {
    var m = confirm("Willst du dein Bild wirklich löschen?");
    if (m) {
      this.cx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.cx.beginPath();
    }
  }

  //Bereitstellung des Canvas als Image-Datei
  save() {
    var canvasImg: HTMLCanvasElement = this.myCanvas.nativeElement;
    var dataURL = canvasImg.toDataURL('image/jpeg');
    console.log(dataURL);
  }


  showColors() {
    let col = document.getElementById('colours');

    if (col.classList.contains('hidden')) {
      col.classList.remove('hidden');
      setTimeout(function () {
        col.classList.remove('visuallyhidden');
      }, 20);
    } else {
      col.classList.add('visuallyhidden');
      col.addEventListener('transitionend', function (e) {
        col.classList.add('hidden');
      }, {
        capture: false,
        once: true,
        passive: false
      });
    }
  }

  setRandProf(): void {
    const persons = this.communitymashup.getPersons('Prof');
    do {
      this.randProf = persons[Math.floor(Math.random() * (persons.length - 1))];
    } while (this.randProf.getImages().length === 0);
    console.log("rando is now " + this.randProf.name);
  }

}

