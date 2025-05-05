import { Component, signal } from '@angular/core';
import { CanComponentDeactivate } from '@auth/guards/unsaved-changes.guard';

@Component({
  selector: 'natural-person',
  imports: [],
  templateUrl: './natural-person.component.html',
})
export class NaturalPersonComponent implements CanComponentDeactivate {
  otherBank = signal(false);

  toggleOtherBank() {
    this.otherBank.set(!this.otherBank());
  }

  onEntityChange(event: any) {
    const target = event.target as HTMLSelectElement;
    const value = target?.value || '';
    if (value === 'Otra entidad financiera') return this.otherBank.set(true);
    this.otherBank.set(false);
  }

  canDeactivate(): boolean {
    return true;
  }
}
