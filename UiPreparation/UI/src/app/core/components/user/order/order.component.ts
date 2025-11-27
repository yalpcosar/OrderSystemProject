import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderDetailDto } from './models/order-detail-dto';
import { Customer } from '../customer/models/customer';
import { ProductDetailDto } from '../product/models/product-detail-dto';
import { OrderService } from './services/order.service';
import { AlertifyService } from 'app/core/services/Alertify.service';
import { CustomerService } from '../customer/services/customer.service';
import { ProductService } from '../product/services/product.service';
import { Order } from './models/order';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  
  orderForm: FormGroup;
  orderList: OrderDetailDto[] = [];
  
  customerList: Customer[] = [];
  productList: ProductDetailDto[] = [];

  isUpdate: boolean = false;
  selectedOrderId: number;
  
  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private customerService: CustomerService,
    private formBuilder: FormBuilder,
    private alertify: AlertifyService
  ) {}
  
  ngOnInit(): void {
    this.createOrderForm();
    this.loadData();
  }

  createOrderForm() {
    this.orderForm = this.formBuilder.group({
      customerId: [null, Validators.required],
      productId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
    })
  }

  loadData() {
    this.orderService.getOrderList().subscribe(data => this.orderList = data);
    this.customerService.getCustomerList().subscribe(data => this.customerList = data);
    this.productService.getProductList().subscribe(data => this.productList = data);
  }

  save(){
    if(this.orderForm.valid){
      let order: Order = Object.assign({}, this.orderForm.value);

      order.customerId = Number(order.customerId);
      order.productId = Number(order.productId);

      if(this.isUpdate){
        order.id = this.selectedOrderId;
        this.orderService.updateOrder(order).subscribe(data => {
          this.alertify.success("Order updated successfully");
          this.loadData();
          this.clearForm();
        });
      }
      else{
        this.orderService.addOrder(order).subscribe(data => {
          this.alertify.success("Order added successfully");
          this.loadData();
          this.clearForm();
        }, error => {
          this.alertify.error("Error " + error.error);
        });
      }
    }
    else{
      this.alertify.error("Please fill all required fields correctly.");
    }
  }

  updateOrder(order: OrderDetailDto) {
    this.selectedOrderId = order.orderId;

    this.orderForm.patchValue({
      customerId: order.customerId,
      productId: order.productId,
      quantity: order.quantity
    });

    this.isUpdate = true;
    window.scroll({ top: 0, behavior: 'smooth' });
  }

  deleteOrder(orderId: number) {
    this.orderService.deleteOrder(orderId).subscribe(data => {
      this.alertify.success("Order deleted successfully");
      this.loadData();
    });
  }

  clearForm() {
    this.orderForm.reset();
    this.orderForm.patchValue({ quantity: 1});
    this.isUpdate = false;
  }

}
