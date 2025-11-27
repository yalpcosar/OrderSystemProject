import { Component, OnInit } from "@angular/core";
import { PColorService } from "./services/pcolor.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertifyService } from "app/core/services/Alertify.service";
import { MatDialogRef } from "@angular/material/dialog";
import { PColor } from "./models/pcolor";

@Component({
  selector: "app-pcolor",
  templateUrl: "./pcolor.component.html",
  styleUrls: ["./pcolor.component.scss"],
})
export class PcolorComponent implements OnInit {
  pColorForm: FormGroup;
  pColorList: PColor[] = [];
  isUpdate: boolean = false;
  selectedPColor: PColor;

  constructor(
    private pColorService: PColorService,
    private formBuilder: FormBuilder,
    private alertify: AlertifyService,
    public dialogRef: MatDialogRef<PcolorComponent>
  ) {}
  
  ngOnInit(): void {
    this.createPColorForm();
    this.getPColorList();
  }

  createPColorForm() {
    this.pColorForm = this.formBuilder.group({
      name: ["", Validators.required],
      hexCode: ["#000000", Validators.required],
    });
  }

  getPColorList() {
    this.pColorService.getColorList().subscribe((data) => {
      this.pColorList = data;
    });
  }

  save() {
    if (this.pColorForm.valid) {
      let pColorModel: PColor = Object.assign({}, this.pColorForm.value);

      if (this.isUpdate) {
        pColorModel.id = this.selectedPColor.id;
        this.pColorService.updateColor(pColorModel).subscribe((data) => {
          this.alertify.success("Color updated successfully");
          this.getPColorList();
          this.dialogRef.close();
          this.clearForm();
        });
      }
      else{
        this.pColorService.addColor(pColorModel).subscribe((data) => {
          this.alertify.success("Color added successfully");
          this.getPColorList();
          this.dialogRef.close();
          this.clearForm();
        });
      }
    }
    else {
      this.alertify.error("Please fill in all required fields.");
    }
  }

  updatePColor(pColor: PColor) {
    this.selectedPColor = pColor;
    this.pColorForm.patchValue({
      name: pColor.name,
      hexCode: pColor.hexCode,
    });
    this.isUpdate = true;
  }

  deletePColor(id: number) {
    this.pColorService.deleteColor(id).subscribe(data => {
      this.alertify.success("Color deleted successfully");
      this.getPColorList();
    });
  }

  clearForm() {
    this.pColorForm.reset();
    this.pColorForm.patchValue({ hexCode: "#000000" });
    this.isUpdate = false;
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
