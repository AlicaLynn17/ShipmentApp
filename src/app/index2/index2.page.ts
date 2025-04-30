import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-index2',
  templateUrl: './index2.page.html',
  styleUrls: ['./index2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule], // Add CommonModule here
})
export class Index2Page {
  shipmentId: string | null = null;
  shipmentDetails: any = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.shipmentId = this.route.snapshot.queryParamMap.get('shipmentId');
    if (this.shipmentId) {
      const details = localStorage.getItem(`shipment_${this.shipmentId}`);
      this.shipmentDetails = details ? JSON.parse(details) : null;
    }
  }
}
