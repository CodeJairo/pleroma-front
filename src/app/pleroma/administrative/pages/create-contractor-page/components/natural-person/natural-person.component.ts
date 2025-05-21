import { Component, HostListener, inject, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { allowOnlyNumbers, allowOnlyNumbersAndHyphens, smoothScrollTo } from '@shared/utils';
import { FormCacheService } from 'src/app/pleroma/services/form-cache.service';

@Component({
  selector: 'natural-person',
  imports: [ReactiveFormsModule],
  templateUrl: './natural-person.component.html',
})
export class NaturalPersonComponent {
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
  naturalPersonForm = this.fb.group({
    businessName: ['', [Validators.required, Validators.minLength(3)]],
    TOD: ['NIT'],
    document: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15), Validators.pattern(/^\d+-?\d*$/)]],
    rlNAME: ['', [Validators.required, Validators.minLength(3)]],
    rlTOD: ['', [Validators.required]],
    rlDocument: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15), Validators.pattern(/^\d+$/)]],
    rlExpeditionPlace: ['', [Validators.required, Validators.minLength(3)]],
    rlBirthdate: ['', [Validators.required]],
    rlGender: ['', [Validators.required]],
    rlAddress: ['', [Validators.required, Validators.minLength(3)]],
    rlPhone: ['', [Validators.required, Validators.minLength(10)]],
    rlPhone2: ['', [Validators.minLength(10)]],
    rlEmail: ['', [Validators.required, Validators.email]],
    rlBank: ['', [Validators.required]],
    rlAnotherBank: ['', [Validators.minLength(3)]],
    rlAccountType: ['', [Validators.required]],
    rlAccountNumber: ['', [Validators.required]],
  });

  constructor() {
    // Inicializar validadores personalizados
    this.allowOnlyNumbers = allowOnlyNumbers;
    this.allowOnlyNumbersAndHyphens = allowOnlyNumbersAndHyphens;

    // Cargar datos del caché si existen
    const cachedData = this.formCacheService.getCache('naturalPersonForm');
    if (cachedData) {
      this.naturalPersonForm.patchValue(cachedData);
    }

    // Escuchar cambios en el formulario y actualizar el caché
    this.naturalPersonForm.valueChanges.subscribe(value => {
      this.formCacheService.setCache('naturalPersonForm', value);
      this.isFormDirty.emit(this.naturalPersonForm.dirty);
    });
  }

  // Métodos relacionados con el formulario
  onSubmit() {
    this.naturalPersonForm.markAllAsTouched();

    if (this.naturalPersonForm.invalid) {
      // Buscar el primer control inválido
      const firstInvalid = document.querySelector('form .ng-invalid') as HTMLElement;

      if (firstInvalid) {
        const offset = firstInvalid.getBoundingClientRect().top + window.scrollY; // Obtener posición del elemento
        smoothScrollTo(offset - 100); // Desplazar con un margen de 100px
        firstInvalid.focus(); // Enfocar el campo inválido
      }

      return;
    }

    // Limpiar el caché y procesar el formulario
    this.formCacheService.clearCache('naturalPersonForm');
    console.log(this.naturalPersonForm.value);
  }

  onReset() {
    // Reiniciar el formulario y limpiar el caché
    this.naturalPersonForm.reset();
    this.formCacheService.clearCache('naturalPersonForm');
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
    const control: AbstractControl | null = this.naturalPersonForm.get(controlName);
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
    const control: AbstractControl | null = this.naturalPersonForm.get(controlName);
    return !!control?.invalid && control?.touched;
  }

  // Evento para prevenir recarga o cierre de la página
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: BeforeUnloadEvent): void {
    if (this.naturalPersonForm.dirty) {
      $event.preventDefault();
      $event.returnValue = '';
    }
  }
}
