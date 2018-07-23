import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'creditCardMask'
})
export class CreditCardMaskPipe implements PipeTransform {
  transform(plainCreditCard: string, visibleDigits: number = 4): string {
    //const visibleDigits = 4;
    let maskedSection = plainCreditCard.slice(0, -visibleDigits);
    let visibleSection = plainCreditCard.slice(-visibleDigits);
    console.log(maskedSection.replace(/./g, '*') + visibleSection);
    return maskedSection.replace(/./g, '*') + visibleSection;
  }
}
