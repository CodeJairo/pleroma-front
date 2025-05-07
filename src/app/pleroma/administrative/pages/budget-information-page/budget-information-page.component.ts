import {
  Component,
  HostListener,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import smoothScrollTo from '@shared/utils/smooth-scroll-to';
import { FormCacheService } from 'src/app/pleroma/services/form-cache.service';

@Component({
  selector: 'app-budget-information-page',
  imports: [ReactiveFormsModule],
  templateUrl: './budget-information-page.component.html',
})
export class BudgetInformationPageComponent implements OnInit {
  // ================================
  // Inyección de dependencias
  // ================================
  fb = inject(FormBuilder);
  formCacheService = inject(FormCacheService);

  // ================================
  // Propiedades
  // ================================
  isFormDirty = output<boolean>();
  otherBank = signal(false);
  rubrosTotal = signal<number>(0);

  // ================================
  // Formulario reactivo
  // ================================
  budgetInformationForm = this.fb.group({
    certificatedNumber: ['', [Validators.required, Validators.minLength(3)]],
    expeditionDate: ['', [Validators.required]],
    rubros: this.fb.array([this.createRubro()]),
  });

  get rubrosArray(): FormArray {
    return this.budgetInformationForm.get('rubros') as FormArray;
  }

  // ================================
  // Métodos del formulario
  // ================================
  createRubro() {
    return this.fb.group({
      rubroName: ['', [Validators.required, Validators.minLength(3)]],
      rubroCode: ['', [Validators.required, Validators.minLength(3)]],
      allocatedAmount: ['', [Validators.required]],
    });
  }

  addRubro() {
    this.rubrosArray.push(this.createRubro());
  }

  removeRubro(index: number) {
    this.rubrosArray.removeAt(index);
  }

  onSubmit() {
    this.budgetInformationForm.markAllAsTouched();
    console.log(this.budgetInformationForm.value);
    if (this.budgetInformationForm.invalid) {
      // Buscar el primer control inválido
      const firstInvalid = document.querySelector(
        'form .ng-invalid'
      ) as HTMLElement;

      if (firstInvalid) {
        const offset =
          firstInvalid.getBoundingClientRect().top + window.scrollY; // Obtener posición del elemento
        smoothScrollTo(offset - 100); // Desplazar con un margen de 100px
        firstInvalid.focus(); // Enfocar el campo inválido
      }

      return;
    }

    // Limpiar el caché y procesar el formulario
    this.formCacheService.clearCache('budgetInformationForm');
    console.log(this.budgetInformationForm.value);
  }

  onReset() {
    // Reiniciar el formulario y limpiar el caché
    this.budgetInformationForm.reset();
    this.rubrosArray.controls.splice(1, this.rubrosArray.length);
    this.formCacheService.clearCache('budgetInformationForm');
    smoothScrollTo(0);
  }

  // ================================
  // Métodos relacionados con los rubros
  // ================================
  onRubroChange(): void {
    let rubrosTotal = 0;
    this.rubrosArray.controls.forEach((control) => {
      rubrosTotal += control.value['allocatedAmount'];
    });
    this.rubrosTotal.set(rubrosTotal);
  }

  // ================================
  // Validación y mensajes de error
  // ================================
  getErrorMessage(controlName: string, minLength?: number): string | null {
    const control: AbstractControl | null =
      this.budgetInformationForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Este campo es requerido.';
    }
    if (control?.hasError('minlength') || control?.hasError('min')) {
      return `El campo debe tener al menos ${minLength ?? 3} caracteres.`;
    }
    if (control?.hasError('email')) {
      return 'El formato del correo electrónico es inválido.';
    }
    return null;
  }

  controlHasError(controlName: string): boolean {
    const control: AbstractControl | null =
      this.budgetInformationForm.get(controlName);
    return !!control?.invalid && control?.touched;
  }

  // ================================
  // Eventos del navegador
  // ================================
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: BeforeUnloadEvent): void {
    if (this.budgetInformationForm.dirty) {
      $event.preventDefault();
      $event.returnValue = '';
    }
  }

  ngOnInit(): void {
    // Cargar datos del caché si existen
    const cachedData = this.formCacheService.getCache('budgetInformationForm');
    if (cachedData) {
      this.budgetInformationForm.patchValue(cachedData);
    }

    // Escuchar cambios en el formulario y actualizar el caché
    this.budgetInformationForm.valueChanges.subscribe((value) => {
      this.formCacheService.setCache('budgetInformationForm', value);
      this.isFormDirty.emit(this.budgetInformationForm.dirty);
    });
  }
}
