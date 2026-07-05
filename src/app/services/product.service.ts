import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export type Sector = 'hospitality' | 'residential' | 'office' | 'retail' | 'healthcare';
export type WorkType = 'wall-cladding' | 'custom-furniture' | 'kitchens-closets' | 'doors-facades' | 'office-fitout';

export interface Product {
  _id?: string;
  name: string;
  sector: Sector;
  workType: WorkType;
  location: string;
  description: string;
  images: string[];
  createdAt?: string;
}

export const SECTOR_LABELS: Record<Sector, string> = {
  'hospitality': 'فنادق ومطاعم',
  'residential': 'سكني',
  'office': 'مكاتب إدارية',
  'retail': 'محلات ومعارض',
  'healthcare': 'منشآت صحية'
};

export const WORKTYPE_LABELS: Record<WorkType, string> = {
  'wall-cladding': 'تكسيات وديكورات حوائط',
  'custom-furniture': 'أثاث مخصص',
  'kitchens-closets': 'مطابخ وخزائن',
  'doors-facades': 'أبواب وواجهات',
  'office-fitout': 'تجهيز مكاتب كامل'
};

@Injectable({
  providedIn: 'root'
})
export class ProductService {
 private apiUrl = 'https://khashab-home-backend-production-71d8.up.railway.app/api/products';

  constructor(private http: HttpClient) {}

  getAllProducts(sector?: string, workType?: string): Observable<Product[]> {
    const params: string[] = [];
    if (sector) params.push(`sector=${sector}`);
    if (workType) params.push(`workType=${workType}`);
    const url = params.length ? `${this.apiUrl}?${params.join('&')}` : this.apiUrl;
    return this.http.get<Product[]>(url);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(formData: FormData, adminPassword: string): Observable<Product> {
    const headers = new HttpHeaders({ 'admin-password': adminPassword });
    return this.http.post<Product>(this.apiUrl, formData, { headers });
  }

  updateProduct(id: string, formData: FormData, adminPassword: string): Observable<Product> {
    const headers = new HttpHeaders({ 'admin-password': adminPassword });
    return this.http.put<Product>(`${this.apiUrl}/${id}`, formData, { headers });
  }

  deleteProduct(id: string, adminPassword: string): Observable<any> {
    const headers = new HttpHeaders({ 'admin-password': adminPassword });
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
}
