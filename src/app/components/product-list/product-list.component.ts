import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ProductService, Product, Sector, SECTOR_LABELS } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  activeSector: string = '';
  isLoading = true;

  sectorLabels = SECTOR_LABELS;
  sectorKeys: Sector[] = ['hospitality', 'residential', 'office', 'retail', 'healthcare'];

  constructor(private productService: ProductService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.activeSector = params['sector'] || '';
      this.loadProducts();
    });
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getAllProducts(this.activeSector || undefined).subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: () => (this.isLoading = false)
    });
  }

  filterBy(sector: string) {
    this.activeSector = sector;
    this.loadProducts();
  }

  imageUrl(path: string): string {
  return 'https://khashab-home-backend-production-71d8.up.railway.app' + path;
}
}
