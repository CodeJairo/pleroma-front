import { Component, OnInit, signal } from '@angular/core';
import { NaturalPersonComponent } from './components/natural-person/natural-person.component';
import { JuridicalPersonComponent } from './components/juridical-person/juridical-person.component';

@Component({
  selector: 'app-create-contractor-page',
  imports: [NaturalPersonComponent, JuridicalPersonComponent],
  schemas: [],
  templateUrl: './create-contractor-page.component.html',
})
export class CreateContractorPageComponent implements OnInit {
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
