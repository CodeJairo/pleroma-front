import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-no-access-subscription',
  imports: [ReactiveFormsModule],
  templateUrl: './no-access-subscription-page.component.html',
})
export class NoAccessSubscriptionComponent {
  fb = inject(FormBuilder);

  hasFormError = signal(false);
  errorMessage = signal<string | null>(null);

  requestUpgradeForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  // Validación y mensajes de error
  getErrorMessage(controlName: string, minLength?: number): string | null {
    const control: AbstractControl | null = this.requestUpgradeForm.get(controlName);
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
    const control: AbstractControl | null = this.requestUpgradeForm.get(controlName);
    return !!control?.invalid && control?.touched;
  }

  onSubmit() {
    this.requestUpgradeForm.markAllAsTouched();

    if (this.requestUpgradeForm.invalid) {
      this.errorMessage.set('Verifique todos los campos');
      this.hasFormError.set(true);
      setTimeout(() => {
        this.hasFormError.set(false);
      }, 3500);
      return;
    }
  }
}
