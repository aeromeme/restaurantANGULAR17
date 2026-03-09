import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signalsample',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    FormsModule,
  ],
  templateUrl: './signalsample.component.html',
  styleUrl: './signalsample.component.css',
})
export class SignalsampleComponent {
  // Signal para la lista de tareas (array reactivo)
  tasks = signal<{ title: string; done: boolean }[]>([]);

  // Computed: cuenta tareas pendientes automáticamente cuando cambia 'tasks'
  pendingCount = computed(
    () => this.tasks().filter((task) => !task.done).length,
  );

  // Effect: se ejecuta cada vez que cambia 'tasks' o 'pendingCount', loggea en consola
  constructor() {
    effect(() => {
      console.log('Tareas actualizadas:', this.tasks());
      console.log('Pendientes:', this.pendingCount());
    });
  }

  // Métodos para manipular el estado
  addTask(title: string) {
    if (title.trim()) {
      this.tasks.update((tasks) => [...tasks, { title, done: false }]);
    }
  }

  toggleTask(index: number) {
    this.tasks.update((tasks) =>
      tasks.map((task, i) =>
        i === index ? { ...task, done: !task.done } : task,
      ),
    );
  }

  removeTask(index: number) {
    this.tasks.update((tasks) => tasks.filter((_, i) => i !== index));
  }
}
