import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product, Sector, WorkType, SECTOR_LABELS, WORKTYPE_LABELS } from '../../services/product.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  // ===== Login =====
  adminPassword = '';
  isLoggedIn = false;
  loginError = '';

  // ===== Data =====
  products: Product[] = [];
  selectedFiles: File[] = [];
  editingId: string | null = null;

  // ===== Labels =====
  sectorLabels = SECTOR_LABELS;
  sectorKeys: Sector[] = ['hospitality', 'residential', 'office', 'retail', 'healthcare'];

  workTypeLabels = WORKTYPE_LABELS;
  workTypeKeys: WorkType[] = ['wall-cladding', 'custom-furniture', 'kitchens-closets', 'doors-facades', 'office-fitout'];

  // ===== Form =====
  form = {
    name: '',
    sector: 'residential' as Sector,
    workType: 'custom-furniture' as WorkType,
    location: '',
    description: ''
  };

  // ===== UI state =====
  isSubmitting = false;
  message = '';

  constructor(private productService: ProductService) {}

  // =========================
  // LOGIN (FIXED)
  // =========================
  login() {
    if (!this.adminPassword) {
      this.loginError = 'اكتبي الباسورد';
      return;
    }

    const correctPassword = '';

    if (this.adminPassword !== correctPassword) {
      this.loginError = 'الباسورد غلط';
      return;
    }

    this.isLoggedIn = true;
    this.loginError = '';
    this.loadProducts();
  }

  // =========================
  // LOAD PRODUCTS
  // =========================
  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (data) => (this.products = data),
      error: () => (this.message = 'حصل خطأ في تحميل المنتجات')
    });
  }

  // =========================
  // FILE UPLOAD
  // =========================
  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  // =========================
  // SUBMIT (CREATE / UPDATE)
  // =========================
  submit() {
    if (!this.form.name || !this.form.description || !this.form.location) {
      this.message = 'من فضلك املأ كل الحقول';
      return;
    }

    if (!this.editingId && this.selectedFiles.length === 0) {
      this.message = 'من فضلك اختر صورة واحدة على الأقل';
      return;
    }

    const formData = new FormData();
    formData.append('name', this.form.name);
    formData.append('sector', this.form.sector);
    formData.append('workType', this.form.workType);
    formData.append('location', this.form.location);
    formData.append('description', this.form.description);

    this.selectedFiles.forEach((file) => formData.append('images', file));

    this.isSubmitting = true;

    const request$ = this.editingId
      ? this.productService.updateProduct(this.editingId, formData, this.adminPassword)
      : this.productService.createProduct(formData, this.adminPassword);

    request$.subscribe({
      next: () => {
        this.message = this.editingId ? 'تم تعديل المشروع بنجاح' : 'تم رفع المشروع بنجاح';
        this.resetForm();
        this.loadProducts();
        this.isSubmitting = false;
      },
      error: (err) => {
        this.message = err.status === 403 ? 'الباسورد غلط' : 'حصل خطأ، حاول تاني';
        this.isSubmitting = false;
      }
    });
  }

  // =========================
  // EDIT
  // =========================
  editProduct(product: Product) {
    this.editingId = product._id!;
    this.form = {
      name: product.name,
      sector: product.sector,
      workType: product.workType,
      location: product.location,
      description: product.description
    };
    this.selectedFiles = [];
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // =========================
  // DELETE
  // =========================
  deleteProduct(id: string) {
    if (!confirm('متأكد إنك عايز تحذف المشروع ده؟')) return;

    this.productService.deleteProduct(id, this.adminPassword).subscribe({
      next: () => {
        this.message = 'تم الحذف';
        this.loadProducts();
      },
      error: () => (this.message = 'حصل خطأ أثناء الحذف')
    });
  }

  // =========================
  // RESET
  // =========================
  resetForm() {
    this.editingId = null;
    this.form = {
      name: '',
      sector: 'residential',
      workType: 'custom-furniture',
      location: '',
      description: ''
    };
    this.selectedFiles = [];
  }

  cancelEdit() {
    this.resetForm();
  }
}
Khashab2026!
