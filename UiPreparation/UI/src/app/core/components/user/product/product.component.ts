import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductDetailDto } from './models/product-detail-dto';
import { PColor } from '../pcolor/models/pcolor';
import { ESize } from 'app/core/enums/e-size.enum';
import { ProductService } from './services/product.service';
import { PColorService } from '../pcolor/services/pcolor.service';
import { AlertifyService } from 'app/core/services/Alertify.service';
import { MatDialog } from '@angular/material/dialog';
import { PcolorComponent } from '../pcolor/pcolor.component';
import { Product } from './models/product';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  
  productForm: FormGroup;
  productList: ProductDetailDto[] = [];
  pColorList: PColor[] = [];
  isUpdate: boolean = false;
  selectedProductId: number;

  keys = Object.keys;
  eSize: ESize;
  sizeOptions = Object.keys(ESize).filter(k => !isNaN(Number(k))).map(Number); //???

  constructor(
    private productService: ProductService,
    private pColorService: PColorService,
    private formBuilder: FormBuilder,
    private alertify: AlertifyService,
    private dialog: MatDialog,
  ){}
  
  ngOnInit(): void {
    this.createProductForm();
    this.getProductList();
    this.getPColorList();
  }

  createProductForm(){
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      pColorId: [null, Validators.required],
      size: [null, Validators.required],
      quantity: [0, Validators.required]
    });
  }

  getProductList(){
    this.productService.getProductList().subscribe(data => {
      this.productList = data;
    });
  }

  getPColorList(){
    this.pColorService.getColorList().subscribe(data => {
      this.pColorList = data;
    });
  }

  openColorDialog(){
    const dialogRef = this.dialog.open(PcolorComponent, {
      width: '700px',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getPColorList();
    });
  }

  save() {
    if (this.productForm.valid) {
      let product: Product = Object.assign({}, this.productForm.value);
      
      // Formdan gelen string değerleri sayıya çevirmek gerekebilir
      product.size = Number(product.size);
      product.pColorId = Number(product.pColorId);

      if (this.isUpdate) {
        product.id = this.selectedProductId;
        this.productService.updateProduct(product).subscribe(data => {
          this.alertify.success("Product updated successfully.");
          this.getProductList();
          this.clearForm();
        });
      } else {
        this.productService.addProduct(product).subscribe(data => {
          this.alertify.success("Product added successfully.");
          this.getProductList();
          this.clearForm();
        });
      }
    } else {
      this.alertify.error("Please fill all required fields.");
    }
  }
  
  updateProduct(item: ProductDetailDto) {
    this.selectedProductId = item.productId;
    
    // DTO'dan gelen verileri forma dolduruyoruz
    // Not: Renk ismini biliyoruz ama bize ID lazım. 
    // Bu yüzden DTO'ya pColorId eklemediysek backend'den find yapmak gerekir.
    // Pratik çözüm: Listede renk ismiyle eşleşen rengi buluyoruz (veya DTO'ya ID ekliyoruz).
    const selectedColor = this.pColorList.find(c => c.name === item.colorName);

    this.productForm.patchValue({
      name: item.productName,
      size: item.size,
      quantity: item.quantity,
      pColorId: selectedColor ? selectedColor.id : null
    });
    
    this.isUpdate = true;
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe(data => {
      this.alertify.success("Product deleted successfully.");
      this.getProductList();
    })
  }

  clearForm() {
    this.productForm.reset();
    this.productForm.patchValue({ quantity: 0 }); // Adet varsayılan 0
    this.isUpdate = false;
  }
}
