import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.css'],
  encapsulation:ViewEncapsulation.None
})
export class ImageModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ImageModalComponent>,@Inject(MAT_DIALOG_DATA) public data: any ) { }

  ngOnInit() {
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
