import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'experienceYears',
})
export class ExperienceYearsPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}
