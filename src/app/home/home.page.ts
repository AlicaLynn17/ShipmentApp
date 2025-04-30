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

        // Parse the scanned content
        this.parseScannedInfo(this.scannedResult);

        // Navigate to details after parsing
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

  parseScannedInfo(content: string) {
    try {
      // Attempt to parse content as JSON
      const parsedData = JSON.parse(content);
      console.log('Parsed Data:', parsedData);

      // Example: Extract specific fields
      if (parsedData.shipmentId) {
        console.log('Shipment ID:', parsedData.shipmentId);
      }
    } catch (error) {
      console.warn('Scanned content is not JSON. Treating as plain text:', content);
      // If content is not JSON, log it as plain text
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
      console.log('Navigating to index2.html with scanned data:', this.scannedResult);

      try {
        let shipmentId: string | null = null;

        // Check if the scanned result is JSON
        if (this.scannedResult.trim().startsWith('{')) {
          const parsedData = JSON.parse(this.scannedResult);
          shipmentId = parsedData.id || null; // Extract `id` as `shipmentId`
        } else {
          // Handle query string format
          const decodedResult = decodeURIComponent(this.scannedResult);
          const urlParams = new URLSearchParams(decodedResult);
          shipmentId = urlParams.get('shipmentId');
        }

        if (shipmentId) {
          // Construct the URL with the extracted shipmentId
          const baseUrl = 'http://localhost:8080/index2.html';
          const url = new URL(baseUrl);
          url.searchParams.set('shipmentId', shipmentId);

          // Navigate to the constructed URL
          window.location.href = url.toString();
        } else {
          console.error('No valid shipmentId found in the scanned data.');
        }
      } catch (error) {
        console.error('Failed to process scanned result:', error);
      }
    } else {
      console.error('No scanned result to navigate with');
    }
  }

  fetchHtmlContent(fileName: string) {
    // Construct the URL properly without duplicating query parameters
    const fileUrl = `http://localhost:8080/${fileName}`;
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
