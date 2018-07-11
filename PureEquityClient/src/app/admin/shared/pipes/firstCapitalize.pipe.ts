import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstcapitalize'
})
export class FirstcapitalizePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === null) return 'Not assigned';
    if (typeof value === "boolean"){
      var x=value;
      return x.toString().charAt(0).toUpperCase() + x.toString().slice(1);
    }
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

}
