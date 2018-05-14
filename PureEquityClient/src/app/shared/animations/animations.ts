import { trigger, state, style, transition, animate } from '@angular/core';

export const slideIn = trigger('slideIn', [
  state('*', style({
    transform: 'translateX(100%)',
  })),
  state('in', style({
    transform: 'translateX(0)',
  })),
  state('out',   style({
    transform: 'translateX(-100%)',
  })),
  transition('* => in', animate('600ms ease-in')),
  transition('in => out', animate('600ms ease-in'))
]);
export const card =  trigger('card', [
    transition(':enter', [
      style({ transform: 'scale(0.5)', opacity: 0 }),  // initial
      animate('0.7s cubic-bezier(.8, -0.6, 0.26, 1.6)',
        style({ transform: 'scale(1)', opacity: 1 }))  // final
    ])
  ])

export const flip =  trigger('flip', [
  state('active', style({
    transform: 'rotateY(179.9deg)'
  })),
  state('inactive', style({
    transform: 'rotateY(0)'
  })),
  transition('active => inactive', animate('500ms ease-out')),
  transition('inactive => active', animate('500ms ease-in'))
])  