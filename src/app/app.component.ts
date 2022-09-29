import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit
} from "@angular/core";
import {fromEvent} from "rxjs";
import {tap, concatMap, takeUntil} from "rxjs/operators";
import {CommunityMashupService} from "./communitymashup/communitymashup.service";
import {Person} from "./communitymashup/model/person.model";

//Enum-Type für die Bewegungsrichtung
export enum Direction {
  up,
  left,
  down,
  right
}

//Festlegung der Distanz in eine Bewegungsrichtung
export const DistanceConfig = {
  up: {
    x: 0,
    y: 5
  },
  left: {
    x: -5,
    y: 0
  },
  down: {
    x: 0,
    y: -5
  },
  right: {
    x: 5,
    y: 0
  }
};

@Component({
  selector: "drawing",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, AfterViewInit {
  name = "Angular";
  cx;
  canvas = {width: 530, height: 350};
  currentLocation = {x: 200, y: 200};
  locationList = [];

  penColor = 'black';
  penSize = 1;

  //Variable für einen zufällig generierten Professor
  randomProf: Person;
  showPic : boolean = false;

  @ViewChild("myCanvas", {static: false}) myCanvas: ElementRef;

  constructor(public communitymashup: CommunityMashupService) {  }

  ngOnInit() {
    this.communitymashup.loadFromUrl();
  }

  ngAfterViewInit(): void {
    //Wichtigste Variablen für das Malen auf dem Canvas:
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

  //Funktion für das Zeichnen mit der Maus
  draw(offsetX, offsetY) {
    this.cx.lineTo(offsetX, offsetY);
    this.cx.strokeStyle = this.penColor;
    this.cx.lineWidth = this.penSize;
    this.cx.stroke();
  }

  //Anpassung der Pinselgröße als Size
  size(obj) {
    this.penSize = obj;
  }

  //Anpassung der Zeichenfarbe als Color
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
    //Falls "weiß" ausgewählt wird, muss zusätzlich die Pinselgröße angepasst werden
    if (obj == 0) {
      this.penColor = "white";
    }
    if (this.penColor == "white") this.penSize = 14;
    //else this.penSize = 2;
  }

  //Funktion zum Löschen des Canvas
  delete() {
    let m = confirm("Möchtest du dein bisher Gemaltes wirklich löschen?");
    if (m) {
      this.cx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      //An dieser Stelle muss ein neuer Path begonnen werden!
      this.cx.beginPath();
    }
  }

  //Bereitstellung des Canvas als Image-URL
  save() {
    let canvasImg: HTMLCanvasElement = this.myCanvas.nativeElement;
    let dataURL = canvasImg.toDataURL('image/jpeg');
    //Kontrolle der Korrektheit der Funktion
    console.log(dataURL);
  }

  //Ausblenden der Color-Bar mit Transition-Effekt
  toggleColors() {
    let col = document.getElementById('colours');
    //Unterscheidung nach aktuellem Stand der Color-Bar
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

  //Zufallsgenerator für einen beliebigen Professor der Datenbank
  setRandProf(): void {
    const persons = this.communitymashup.getPersons('Prof');
    do {
      this.randomProf = persons[Math.floor(Math.random() * (persons.length - 1))];
    } while (this.randomProf.getImages().length === 0);
    //Zurücksetzen der Bildanzeige
    this.showPic = false;
    //Kontrolle der Korrektheit der Funktion
    console.log("Der zufällige Professor ist momentan " + this.randomProf.name);
  }

  //Toggelt die Anzeige des Bildes auf "true" und damit sichtbar
  togglePic() {
    this.showPic = true;
  }
}