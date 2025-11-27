import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WarehouseItemDto } from './models/warehouse-item-dto';
import { AlertifyService } from 'app/core/services/Alertify.service';
import { WarehouseService } from './services/warehouse.service';
import { data } from 'jquery';
import { Warehouse } from './models/warehouse';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent implements OnInit {
  
  warehouseForm: FormGroup;
  warehouseList: WarehouseItemDto[] = [];
  selectedItem: WarehouseItemDto | null = null;

  constructor(
    private warehouseService: WarehouseService,
    private formBuilder: FormBuilder,
    private alertify: AlertifyService,
  ) {}

  ngOnInit(): void {
    this.createWarehouseForm();
    this.loadData();
  }
  
  createWarehouseForm(){
    this.warehouseForm = this.formBuilder.group({
      productInfo: [{value: '', disabled: true}],
      quantity:[0, [Validators.required, Validators.min(0)]],
      isAvailableForSale:[false, Validators.required]
    });  
  }

  loadData() {
    this.warehouseService.getWarehouseItemList().subscribe(data =>{
      this.warehouseList = data.items;
    });
  }

  editItem(item: WarehouseItemDto){
    this.selectedItem = item;
    this.warehouseForm.patchValue({
      productInfo: `[ID: ${item.productId}] ${item.productName} - ${item.colorName}`,
      quantity: item.quantity,
      isAvailableForSale: item.isAvailableForSale
    });
    window.scroll({ top: 0, behavior: 'smooth'});
  }

  save(){
    if(this.warehouseForm.valid && this.selectedItem){
      const updateModel: Warehouse = {
        id: this.selectedItem.warehouseId, 
        productId: this.selectedItem.productId, 
        quantity: this.warehouseForm.get('quantity').value,
        isAvailableForSale: this.warehouseForm.get('isAvailableForSale').value,
        status: true,
        isDeleted: false
      };
      this.warehouseService.updateWarehouseItem(updateModel).subscribe(data => {
        this.alertify.success("Warehouse item updated successfully.");
        this.loadData();
        this.cancel();
      })
    }
  }
  cancel() {
    this.selectedItem = null;
    this.warehouseForm.reset();
  }
  
  
}
