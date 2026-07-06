import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService, Product, SECTOR_LABELS, WORKTYPE_LABELS } from '../../services/product.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  activeImage = '';
  isLoading = true;
  notFound = false;
  sectorLabels = SECTOR_LABELS;
  workTypeLabels = WORKTYPE_LABELS;

  constructor(private route: ActivatedRoute, private productService: ProductService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.activeImage = this.imageUrl(data.images[0]);
        this.isLoading = false;
      },
      error: () => {
        this.notFound = true;
        this.isLoading = false;
      }
    });
  }

  imageUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) {
    return path;
  }
  return 'https://khashab-home-backend-production-71d8.up.railway.app' + path;
}

  setActiveImage(path: string) {
    this.activeImage = this.imageUrl(path);
  }

  get whatsappLink(): string {
    if (!this.product) return '';
    const text = encodeURIComponent(`أستفسر عن مشروع: ${this.product.name}`);
    return `https://wa.me/966539047536?text=${text}`;
  }
}
