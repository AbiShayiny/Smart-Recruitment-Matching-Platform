import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'matchBand',
})
export class MatchBandPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}
