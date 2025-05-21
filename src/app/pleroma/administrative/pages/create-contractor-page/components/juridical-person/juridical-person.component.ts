import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, inject, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IJuridicalPersonEntity } from '@pleroma/administrative/interfaces/juridical-person.interface';
import { JuridicalPersonService } from '@pleroma/administrative/services/juridical-person.service';
import { FormCacheService } from '@pleroma/services/form-cache.service';
import { allowOnlyNumbers, allowOnlyNumbersAndHyphens, smoothScrollTo } from '@shared/utils';
import { catchError, EMPTY, tap } from 'rxjs';

@Component({
  selector: 'juridical-person',
  imports: [ReactiveFormsModule],
  templateUrl: './juridical-person.component.html',
})
export class JuridicalPersonComponent {
  // Inyección de dependencias
  fb = inject(FormBuilder);
  formCacheService = inject(FormCacheService);
  #juridicalPersonService = inject(JuridicalPersonService);

  // Propiedades
  isFormDirty = output<boolean>();
  otherBank = signal(false);

  hasFormError = signal(false);
  hasFetchError = signal(false);
  isPosting = signal(false);
  errorMessage = signal<string | null>(null);
  isFormPosted = signal(false);

  // Validadores personalizados
  allowOnlyNumbers: (event: KeyboardEvent) => void;
  allowOnlyNumbersAndHyphens: (event: KeyboardEvent) => void;

  // Formulario reactivo
  juridicalPersonForm = this.fb.group({
    businessName: ['', [Validators.required, Validators.minLength(3)]],
    businessDocumentNumber: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(15), Validators.pattern(/^\d+-?\d*$/)],
    ],
    name: ['', [Validators.required, Validators.minLength(3)]],
    documentType: ['', [Validators.required]],
    documentNumber: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15), Validators.pattern(/^\d+$/)]],
    expeditionAddress: ['', [Validators.required, Validators.minLength(3)]],
    birthDate: ['', [Validators.required]],
    genre: ['', [Validators.required]],
    address: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', [Validators.required, Validators.minLength(10)]],
    phone2: ['', [Validators.minLength(10)]],
    email: ['', [Validators.required, Validators.email]],
    bank: ['', [Validators.required]],
    // rlAnotherBank: ['', [Validators.minLength(3)]],
    accountType: ['', [Validators.required]],
    bankAccountNumber: ['', [Validators.required]],
  });

  constructor() {
    // Inicializar validadores personalizados
    this.allowOnlyNumbers = allowOnlyNumbers;
    this.allowOnlyNumbersAndHyphens = allowOnlyNumbersAndHyphens;

    // Cargar datos del caché si existen
    const cachedData = this.formCacheService.getCache('juridicalPersonForm');
    if (cachedData) {
      this.juridicalPersonForm.patchValue(cachedData);
    }

    // Escuchar cambios en el formulario y actualizar el caché
    this.juridicalPersonForm.valueChanges.subscribe(value => {
      this.formCacheService.setCache('juridicalPersonForm', value);
      this.isFormDirty.emit(this.juridicalPersonForm.dirty);
    });
  }

  // Métodos relacionados con el formulario
  onSubmit() {
    console.log(this.juridicalPersonForm.value);
    this.juridicalPersonForm.markAllAsTouched();

    if (this.juridicalPersonForm.invalid) {
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
    this.formCacheService.clearCache('juridicalPersonForm');
    this.#juridicalPersonService
      .createJuridicalPerson(this.juridicalPersonForm.getRawValue() as IJuridicalPersonEntity)
      .pipe(
        tap(() => {
          this.onReset();
          this.isFormPosted.set(true);
          setTimeout(() => {
            this.isFormPosted.set(false);
          }, 3500);
          return;
        }),
        catchError(error => this.#handleError(error))
      )
      .subscribe();
  }

  onReset() {
    // Reiniciar el formulario y limpiar el caché
    this.isPosting.set(false);
    this.juridicalPersonForm.reset();
    this.formCacheService.clearCache('juridicalPersonForm');
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
    const control: AbstractControl | null = this.juridicalPersonForm.get(controlName);
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
    const control: AbstractControl | null = this.juridicalPersonForm.get(controlName);
    return !!control?.invalid && control?.touched;
  }



  closeSuccessModal() {
    this.isFormPosted.set(false);
  }

  // Evento para prevenir recarga o cierre de la página
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: BeforeUnloadEvent): void {
    if (this.juridicalPersonForm.dirty) {
      $event.preventDefault();
      $event.returnValue = '';
    }
  }

  #handleError(error: HttpErrorResponse) {
    console.error(error);
    this.errorMessage.set(error.error.message);
    this.hasFetchError.set(true);
    setTimeout(() => {
      this.hasFetchError.set(false);
    }, 3500);
    return EMPTY;
  }
}
