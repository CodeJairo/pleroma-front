import { Component, HostListener, inject, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormCacheService } from '@pleroma/services/form-cache.service';
import { allowOnlyNumbers, allowOnlyNumbersAndHyphens, smoothScrollTo } from '@shared/utils';
import { MasterInfoService } from '../../services/master-info.service';
import { IContractors } from '@pleroma/administrative/interfaces/contractors.interface';
import { tap } from 'rxjs';

@Component({
  selector: 'app-master-info-page',
  imports: [ReactiveFormsModule, NgSelectModule],
  templateUrl: './master-info-page.component.html',
})
export class MasterInfoPageComponent {
  // Inyección de dependencias
  fb = inject(FormBuilder);
  formCacheService = inject(FormCacheService);
  masterInfoService = inject(MasterInfoService);

  // Propiedades
  isFormDirty = output<boolean>();
  otherBank = signal(false);
  contractors: IContractors[] = [];

  // Validadores personalizados
  allowOnlyNumbers: (event: KeyboardEvent) => void;
  allowOnlyNumbersAndHyphens: (event: KeyboardEvent) => void;

  // Formulario reactivo
  masterInfoForm = this.fb.group({
    costCenters: this.fb.group(
      {
        aqueduct: [false],
        sewer: [false],
        cleaning: [false],
        energy: [false],
        gas: [false],
      },
      { validators: this.#atLeastOneCostCenterValidator }
    ),
    modality: ['', Validators.required],
    denomination: ['', Validators.required],
    typology: ['', Validators.required],
    class: ['', Validators.required],
    orderNumber: [null, Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    contractor: ['', Validators.required],
    contractorDocument: ['', Validators.required],
    expeditionAddress: ['', Validators.required],
    birthDate: ['', Validators.required],
    genre: ['', Validators.required],
    contractObject: ['', Validators.required],
    scope: ['', Validators.required],
    executionPlace: ['', Validators.required],
    durationUntil: ['', Validators.required],
    contractValue: [null, Validators.required],
    contractValueInWords: [{ value: '', disabled: true }],
    partialActsValue: [null, Validators.required],
    partialActsValueInWords: [{ value: '', disabled: true }],
    paymentMethod: ['', Validators.required],
    supervisorName: ['', Validators.required],
    supervisorDocument: ['', Validators.required],
    acquisitionPlan: ['', Validators.required],
    developmentPlan: ['', Validators.required],
    strategicLine: ['', Validators.required],
    sectorName: ['', Validators.required],
    classifier: ['', Validators.required],
    ciiu: [null, Validators.required],
  });

  constructor() {
    // Inicializar validadores personalizados
    this.allowOnlyNumbers = allowOnlyNumbers;
    this.allowOnlyNumbersAndHyphens = allowOnlyNumbersAndHyphens;

    // Cargar datos del caché si existen
    const cachedData = this.formCacheService.getCache('masterInfoForm');
    if (cachedData) this.masterInfoForm.patchValue(cachedData);

    // Escuchar cambios en el formulario y actualizar el caché
    this.masterInfoForm.valueChanges.subscribe(value => {
      this.formCacheService.setCache('masterInfoForm', value);
      this.isFormDirty.emit(this.masterInfoForm.dirty);
    });

    this.masterInfoService
      .getAllContractors()
      .pipe(
        tap(contractors => {
          this.contractors = contractors;
        })
      )
      .subscribe();
  }

  // Métodos relacionados con el formulario
  onSubmit() {
    console.log(this.masterInfoForm.getRawValue());
    this.masterInfoForm.markAllAsTouched();

    if (this.masterInfoForm.invalid) {
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
    this.formCacheService.clearCache('masterInfoForm');
  }

  onReset() {
    // Reiniciar el formulario y limpiar el caché
    this.masterInfoForm.reset();
    this.formCacheService.clearCache('masterInfoForm');
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
    const control: AbstractControl | null = this.masterInfoForm.get(controlName);
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
    const control: AbstractControl | null = this.masterInfoForm.get(controlName);
    return !!control?.invalid && control?.touched;
  }

  groupHasError(groupName: string): boolean {
    const group: AbstractControl | null = this.masterInfoForm.get(groupName);
    return !!group?.invalid && group?.touched;
  }

  getGroupErrorMessage(groupName: string): string | null {
    const group: AbstractControl | null = this.masterInfoForm.get(groupName);
    if (group?.errors?.['atLeastOne']) {
      return 'Al menos un centro de costo debe estar seleccionado.';
    }
    return null;
  }

  // Opciones para cada denominación
  orderTypeOptions = [
    'Contrato de construcción civil',
    'Contrato de prestación de servicios de apoyo',
    'Contrato de suministro',
    'Contrato de compra/venta',
    'Contrato de estudios y apoyo técnicos',
    'Contrato de seguimiento técnico',
    'Contrato de procesos contractuales de empréstito',
    'Contrato de pruebas o ensayos',
    'Convenios o procesos contractuales interinstitucionales y de cooperación interinstitucional y nacional',
    'Procesos contractuales adicionales',
  ];

  contractTypeOptions = [
    'Contrato de bien inmueble',
    'Contrato de mercadeo',
    'Contrato de consultoría',
    'Pilotage',
    'Procesos contractuales con clausula de reserva',
    'contrato de recaudo',
    'contrato de venta de agua en bloque',
    'contrato de arrendamiento de tecnologías y soportes lógicos',
    'contrato de concesión',
    'Contrato de interventoría',
    'Alianza publico/privada',
    'contrato de encargo fiduciario',
  ];

  get typologyOptions() {
    const denomination = this.masterInfoForm.get('denomination')?.value;
    if (denomination === 'Orden Contractual') return this.orderTypeOptions;
    if (denomination === 'Contrato') return this.contractTypeOptions;
    return [];
  }

  onContractorSelected(contractorId: string) {
    const contractor = this.contractors.find(c => c.id === contractorId);
    if (contractor) {
      this.masterInfoForm.patchValue({
        contractorDocument: contractor.documentNumber,
        expeditionAddress: contractor.expeditionAddress,
        birthDate: contractor.birthDate,
        genre: contractor.genre,
      });
    }
  }

  onContractorDocumentSelected(contractorId: string) {
    const contractor = this.contractors.find(c => c.id === contractorId);
    if (contractor) {
      this.masterInfoForm.patchValue({
        contractor: String(contractor.id),
        expeditionAddress: contractor.expeditionAddress,
        birthDate: contractor.birthDate,
        genre: contractor.genre,
      });
    }
  }

  // Evento para prevenir recarga o cierre de la página
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: BeforeUnloadEvent): void {
    if (this.masterInfoForm.dirty) {
      $event.preventDefault();
      $event.returnValue = '';
    }
  }
  #atLeastOneCostCenterValidator(group: AbstractControl): ValidationErrors | null {
    const value = group.value;
    // value = { aqueduct: boolean, sewer: boolean, cleaning: boolean, ... }
    const oneChecked = Object.values(value).some(v => v);
    return oneChecked ? null : { atLeastOne: true };
  }
}
