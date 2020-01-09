import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[game-host]',
})
export class GameDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}