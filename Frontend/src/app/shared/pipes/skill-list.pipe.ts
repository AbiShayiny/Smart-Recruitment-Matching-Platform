import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'skillList',
})
export class SkillListPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}
