import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from './services/customer.service';
import { Customer } from './models/customer';
import { AlertifyService } from 'app/core/services/Alertify.service';


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  customerForm: FormGroup;
  customerList: Customer[] = [];
  isUpdate: boolean = false;
  selectedCustomerId: number;

  constructor(
    private customerService: CustomerService,
    private formBuilder: FormBuilder,
    private alertify: AlertifyService
  ) {}

  ngOnInit(): void {
    this.createCustomerForm();
    this.getCustomerList();
  }

  createCustomerForm() {
    this.customerForm = this.formBuilder.group({
      // BAŞLANGIÇTA (EKLEME MODU):
      // customerCode boş ve validasyonu yok. Çünkü backend üretecek.
      customerCode: [""], 
      customerName: ["", Validators.required],
      phoneNumber: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      address: ["", Validators.required]
    });
  }

  getCustomerList() {
    this.customerService.getCustomerList().subscribe(data => {
      this.customerList = data;
    });
  }

  save() {
    if (this.customerForm.valid) {
      let customer: Customer = Object.assign({}, this.customerForm.value);

      if (this.isUpdate) {
        customer.id = this.selectedCustomerId;
        this.customerService.updateCustomer(customer).subscribe(data => {
          this.alertify.success("Müşteri başarıyla güncellendi.");
          this.getCustomerList();
          this.clearForm();
        });
      } else {
        // Ekleme yaparken customerCode'u göndermiyoruz (veya boş gidiyor),
        // backend constructor içinde 'GenerateRandomCode()' ile üretiyor.
        this.customerService.addCustomer(customer).subscribe(data => {
          this.alertify.success("Müşteri başarıyla eklendi.");
          this.getCustomerList();
          this.clearForm();
        });
      }
    } else {
      this.alertify.error("Lütfen formu kontrol ediniz.");
    }
  }

  // DÜZENLE BUTONUNA BASILINCA
  updateCustomer(customer: Customer) {
    this.selectedCustomerId = customer.id;
    
    // 1. Adım: customerCode alanına Validasyon ekle (Update modunda zorunlu olsun)
    this.customerForm.get('customerCode').setValidators([
      Validators.required,
      Validators.minLength(11),
      Validators.maxLength(11)
    ]);
    // Validasyonu hemen devreye al
    this.customerForm.get('customerCode').updateValueAndValidity();

    // 2. Adım: Verileri doldur
    this.customerForm.patchValue({
      customerCode: customer.customerCode, // Backend'den gelen kodu yaz
      customerName: customer.customerName,
      phoneNumber: customer.phoneNumber,
      email: customer.email,
      address: customer.address
    });
    
    this.isUpdate = true;
  }

  clearForm() {
    this.customerForm.reset();
    
    // İPTAL EDİLİNCE VEYA KAYDEDİLİNCE (EKLEME MODUNA DÖNÜŞ):
    // customerCode alanındaki validasyonu kaldır.
    this.customerForm.get('customerCode').clearValidators();
    this.customerForm.get('customerCode').updateValueAndValidity();
    
    this.isUpdate = false;
  }

  deleteCustomer(id: number) {
    this.customerService.deleteCustomer(id).subscribe(data => {
      this.alertify.success("Müşteri silindi.");
      this.getCustomerList();
    });
  }
}