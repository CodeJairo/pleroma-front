import { Component, OnInit, signal, computed } from '@angular/core';
import { NaturalPersonComponent } from './components/natural-person/natural-person.component';
import { JuridicalPersonComponent } from './components/juridical-person/juridical-person.component';
import { CanComponentDeactivate } from '@auth/guards/unsaved-changes.guard';

@Component({
  selector: 'app-create-contractor-page',
  imports: [NaturalPersonComponent, JuridicalPersonComponent],
  schemas: [],
  templateUrl: './create-contractor-page.component.html',
})
export class CreateContractorPageComponent
  implements OnInit, CanComponentDeactivate
{
  #isFormDirty = signal<any>(false);

  getIsFormDirty(event: boolean) {
    return this.#isFormDirty.set(event);
  }

  canDeactivate(): boolean {
    if (this.#isFormDirty() === true) {
      return confirm(
        'Tiene cambios sin guardar. ¿Está seguro de que desea salir?'
      );
    }
    return true;
  }

  section = signal(0);

  ngOnInit(): void {
    const storedSection = localStorage.getItem('section');
    if (storedSection !== null) {
      this.section.set(Number(storedSection));
    }
  }

  changeSection(section: number) {
    this.section.set(section);
    localStorage.setItem('section', section.toString());
  }
}
