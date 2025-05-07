import { Component, HostListener, inject, output, signal } from '@angular/core';
import {
  FormBuilder,
  Validators,
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  allowOnlyNumbers,
  allowOnlyNumbersAndHyphens,
} from '@shared/utils/key-filter';
import smoothScrollTo from '@shared/utils/smooth-scroll-to';
import { FormCacheService } from 'src/app/pleroma/services/form-cache.service';

@Component({
  selector: 'app-master-info-page',
  imports: [ReactiveFormsModule],
  templateUrl: './master-info-page.component.html',
})
export class MasterInfoPageComponent {
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
  masterInfoForm = this.fb.group({
    businessName: ['', [Validators.required, Validators.minLength(3)]],
    TOD: ['NIT'],
    document: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(15),
        Validators.pattern(/^\d+-?\d*$/),
      ],
    ],
    rlNAME: ['', [Validators.required, Validators.minLength(3)]],
    rlTOD: ['', [Validators.required]],
    rlDocument: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(15),
        Validators.pattern(/^\d+$/),
      ],
    ],
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
    const cachedData = this.formCacheService.getCache('juridicalPersonForm');
    if (cachedData) {
      this.masterInfoForm.patchValue(cachedData);
    }

    // Escuchar cambios en el formulario y actualizar el caché
    this.masterInfoForm.valueChanges.subscribe((value) => {
      this.formCacheService.setCache('juridicalPersonForm', value);
      this.isFormDirty.emit(this.masterInfoForm.dirty);
    });
  }

  // Métodos relacionados con el formulario
  onSubmit() {
    this.masterInfoForm.markAllAsTouched();

    if (this.masterInfoForm.invalid) {
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
    this.formCacheService.clearCache('juridicalPersonForm');
    console.log(this.masterInfoForm.value);
  }

  onReset() {
    // Reiniciar el formulario y limpiar el caché
    this.masterInfoForm.reset();
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
    const control: AbstractControl | null =
      this.masterInfoForm.get(controlName);
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
      this.masterInfoForm.get(controlName);
    return !!control?.invalid && control?.touched;
  }

  // Evento para prevenir recarga o cierre de la página
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: BeforeUnloadEvent): void {
    if (this.masterInfoForm.dirty) {
      $event.preventDefault();
      $event.returnValue = '';
    }
  }
}
