import { Component, HostListener, inject, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { INaturalPersonEntity } from '@pleroma/administrative/interfaces/natural-person.interface';
import { NaturalPersonService } from '@pleroma/administrative/services/natural-person.service';
import { FormCacheService } from '@pleroma/services/form-cache.service';
import { allowOnlyNumbers, allowOnlyNumbersAndHyphens, smoothScrollTo } from '@shared/utils';
import { catchError, EMPTY, tap } from 'rxjs';

@Component({
  selector: 'natural-person',
  imports: [ReactiveFormsModule],
  templateUrl: './natural-person.component.html',
})
export class NaturalPersonComponent {
  // Inyección de dependencias
  fb = inject(FormBuilder);
  formCacheService = inject(FormCacheService);
  #naturalPersonService = inject(NaturalPersonService);
  banks = [];
  // Propiedades
  isFormDirty = output<boolean>();

  hasFormError = signal(false);
  hasFetchError = signal(false);
  isPosting = signal(false);
  errorMessage = signal<string | null>(null);
  isFormPosted = signal(false);

  // Validadores personalizados
  allowOnlyNumbers: (event: KeyboardEvent) => void;
  allowOnlyNumbersAndHyphens: (event: KeyboardEvent) => void;

  // Formulario reactivo
  naturalPersonForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    documentType: ['', [Validators.required]],
    documentNumber: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15), Validators.pattern(/^[0-9]+$/)]],
    expeditionAddress: ['', [Validators.required, Validators.minLength(3)]],
    birthDate: ['', [Validators.required]],
    genre: ['', [Validators.required]],
    address: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', [Validators.required, Validators.minLength(10)]],
    phone2: ['', [Validators.minLength(10)]],
    email: ['', [Validators.required, Validators.email]],
    bank: ['', [Validators.required]],
    accountType: ['', [Validators.required]],
    bankAccountNumber: ['', [Validators.required]],
  });

  constructor() {
    // Inicializar validadores personalizados
    this.allowOnlyNumbers = allowOnlyNumbers;
    this.allowOnlyNumbersAndHyphens = allowOnlyNumbersAndHyphens;

    // Cargar datos del caché si existen
    const cachedData = this.formCacheService.getCache('naturalPersonForm');
    if (cachedData) this.naturalPersonForm.patchValue(cachedData);

    // Escuchar cambios en el formulario y actualizar el caché
    this.naturalPersonForm.valueChanges.subscribe(value => {
      this.formCacheService.setCache('naturalPersonForm', value);
      this.isFormDirty.emit(this.naturalPersonForm.dirty);
    });
  }

  onBankChange(e: Event) {
    const value = (e.target as HTMLSelectElement).value;
    if (value === 'null' || value === '' || value === null)
      (this.naturalPersonForm as any).addControl('anotherBank', this.fb.control('', [Validators.required, Validators.minLength(3)]));
    else {
      if ((this.naturalPersonForm as any).contains('anotherBank')) {
        (this.naturalPersonForm as any).removeControl('anotherBank');
      }
    }
  }

  // Métodos relacionados con el formulario
  onSubmit() {
    console.log(this.naturalPersonForm.value);
    this.naturalPersonForm.markAllAsTouched();
    if (this.naturalPersonForm.invalid) {
      // Buscar el primer control inválido
      const firstInvalid = document.querySelector('form .ng-invalid') as HTMLElement;
      if (firstInvalid) {
        const offset = firstInvalid.getBoundingClientRect().top + window.scrollY;
        smoothScrollTo(offset - 100);
        firstInvalid.focus();
      }
      return;
    }
    // Limpiar el caché y procesar el formulario
    this.formCacheService.clearCache('naturalPersonForm');

    this.#naturalPersonService
      .createNaturalPerson(this.naturalPersonForm.getRawValue() as INaturalPersonEntity)
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
    this.isPosting.set(false);
    this.naturalPersonForm.reset();
    this.formCacheService.clearCache('naturalPersonForm');
    smoothScrollTo(0);
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

  closeSuccessModal() {
    this.isFormPosted.set(false);
  }

  // Evento para prevenir recarga o cierre de la página
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: BeforeUnloadEvent): void {
    if (this.naturalPersonForm.dirty) {
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
