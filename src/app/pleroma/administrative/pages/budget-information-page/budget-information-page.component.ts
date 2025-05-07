import { Component, HostListener, inject, output, signal } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  allowOnlyNumbers,
  allowOnlyNumbersAndHyphens,
} from '@shared/utils/key-filter';
import smoothScrollTo from '@shared/utils/smooth-scroll-to';
import { FormCacheService } from 'src/app/pleroma/services/form-cache.service';

@Component({
  selector: 'app-budget-information-page',
  imports: [ReactiveFormsModule],
  templateUrl: './budget-information-page.component.html',
})
export class BudgetInformationPageComponent {
  // Inyección de dependencias
  fb = inject(FormBuilder);
  formCacheService = inject(FormCacheService);

  // Propiedades
  isFormDirty = output<boolean>();
  otherBank = signal(false);

  // Validadores personalizados
  allowOnlyNumbers: (event: KeyboardEvent) => void;
  allowOnlyNumbersAndHyphens: (event: KeyboardEvent) => void;

  // Formulario reactivo
  budgetInformationForm = this.fb.group({
    certificatedNumber: ['', [Validators.required, Validators.minLength(3)]],
    expeditionDate: ['', [Validators.required]],
    rubros: this.fb.array([this.createRubro()]),
  });

  get rubrosArray(): FormArray {
    return this.budgetInformationForm.get('rubros') as FormArray;
  }

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

  // removeRubro(index: number) {
  //   this.rubros.removeAt(index);
  // }

  constructor() {
    // Inicializar validadores personalizados
    this.allowOnlyNumbers = allowOnlyNumbers;
    this.allowOnlyNumbersAndHyphens = allowOnlyNumbersAndHyphens;

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

  // Métodos relacionados con el formulario
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

  onBankChange(event: any) {
    const target = event.target as HTMLSelectElement;
    const value = target?.value || '';
    if (value === 'Otra entidad financiera') {
      this.otherBank.set(true);
    } else {
      this.otherBank.set(false);
    }
  }

  toggleOtherBank() {
    this.otherBank.set(!this.otherBank());
  }

  // Validación y mensajes de error
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

  // Evento para prevenir recarga o cierre de la página
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: BeforeUnloadEvent): void {
    if (this.budgetInformationForm.dirty) {
      $event.preventDefault();
      $event.returnValue = '';
    }
  }
}
