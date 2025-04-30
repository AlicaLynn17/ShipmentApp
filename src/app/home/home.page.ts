import { Component } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Camera } from '@capacitor/camera'; // Updated import for camera permissions

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule],
})
export class HomePage {
  scannedResult: string | null = null;

  constructor(private router: Router, private http: HttpClient) {}

  async startScanner() {
    console.log('Requesting camera permissions...');
    const cameraPermission = await Camera.requestPermissions();
    if (cameraPermission.camera !== 'granted') {
      console.error('Camera permission not granted');
      return;
    }

    const barcodePermission = await BarcodeScanner.checkPermission({ force: true });
    if (!barcodePermission.granted) {
      console.error('Barcode scanner permission not granted');
      return;
    }

    console.log('Starting the scanner...');
    await this.startScan();
  }

  async startScan() {
    try {
      console.log('Starting QR code scan...');
      const result = await BarcodeScanner.startScan();

      if (result.hasContent) {
        this.scannedResult = result.content;
        console.log('Scanned Result:', this.scannedResult);

        // Navigate to details after scanning
        this.navigateToDetails();
      } else {
        console.warn('No content found in the scanned QR code');
      }
    } catch (error) {
      console.error('Scan failed:', error);
    } finally {
      this.stopScanner();
    }
  }

  stopScanner() {
    console.log('Stopping the scanner...');
    BarcodeScanner.stopScan();
  }

  navigateToIndex() {
    // Redirect to index.html for QR code generation
    window.location.href = 'C:/Users/Alica Lynn/Documents/Apache24/htdocs/WEB 2A/rest-api-v2/mvc/mvc/new/index.html'; // Update the path
  }

  navigateToDetails() {
    if (this.scannedResult) {
      console.log('Navigating to index2.html with shipmentId:', this.scannedResult);
      // Use URL encoding for spaces
      window.location.href = `http://localhost:8080/index2.html?shipmentId=${this.scannedResult}`;
    } else {
      console.error('No scanned result to navigate with');
    }
  }

  fetchHtmlContent(fileName: string) {
    const fileUrl = `/path/to/your/folder/${fileName}`; // Update the path
    this.http.get(fileUrl, { responseType: 'text' }).subscribe(
      (htmlContent) => {
        console.log(`HTML content of ${fileName}:`, htmlContent);
      },
      (error) => {
        console.error(`Failed to fetch ${fileName}:`, error);
      }
    );
  }
}
