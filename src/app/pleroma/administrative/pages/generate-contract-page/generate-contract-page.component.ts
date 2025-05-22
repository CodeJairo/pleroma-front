import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-generate-contract-page',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './generate-contract-page.component.html',
})
export class GenerateContractPageComponent implements OnInit {
  fb = inject(FormBuilder);

  generateOptions = [
    { label: 'Exportar Contratos', icon: '📄' },
    { label: 'Certificado de Disponibilidad', icon: '✅' },
    { label: 'Reporte de Ejecución Presupuestal', icon: '📊' },
    { label: 'Exportar Listado de Contratistas', icon: '🧾' },
  ];

  recentContracts = [
    { name: 'Contrato Alfa', url: 'https://example.com/contrato-alfa', date: '2025-05-21' },
    { name: 'Contrato Beta', url: 'https://example.com/contrato-beta', date: '2025-05-20' },
    { name: 'Contrato Gamma', url: 'https://example.com/contrato-gamma', date: '2025-05-19' },
    { name: 'Contrato Delta', url: 'https://example.com/contrato-delta', date: '2025-05-19' },
  ];

  historicalContracts = [
    { name: 'Contrato Épsilon', url: 'https://example.com/contrato-epsilon', date: '2023-09-10' },
    { name: 'Contrato Zeta', url: 'https://example.com/contrato-zeta', date: '2023-09-12' },
    { name: 'Contrato Eta', url: 'https://example.com/contrato-eta', date: '2023-09-15' },
    { name: 'Contrato Theta', url: 'https://example.com/contrato-theta', date: '2023-09-20' },
  ];

  procesos = [
    { id: 1, name: 'Proceso Omega' },
    { id: 2, name: 'Proceso Sigma' },
    { id: 3, name: 'Proceso Tau' },
    { id: 4, name: 'Proceso Phi' },
  ];

  selectedOption: any = null;
  generateForm!: FormGroup;

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.generateForm = this.fb.group({
      processId: [null, Validators.required],
      format: ['pdf', Validators.required],
      customFields: [''],
    });
  }

  selectOption(option: any) {
    this.selectedOption = option;
    this.initForm();
    if (!option.customizable) {
      this.generateForm.get('customFields')?.disable();
    } else {
      this.generateForm.get('customFields')?.enable();
    }
  }

  generateDocument() {
    if (this.generateForm.invalid) return;
    const values = this.generateForm.value;
    // tu lógica de generación usando values
  }
}
