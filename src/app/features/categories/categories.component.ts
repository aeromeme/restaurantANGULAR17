import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../api/services/category.service';
import { CategoryDto } from '../../api/models/category-dto';

@Component({
  selector: 'app-categories',
  imports: [CommonModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  categories: CategoryDto[] = [];
  private categoryService = inject(CategoryService);

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.categoryService.apiCategoryGet$Json().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.categories = []; // Set empty array on error
      },
    });
  }
}
