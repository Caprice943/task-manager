import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../task-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm {

  private taskService = inject(TaskService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private taskId = this.route.snapshot.paramMap.get('id');

  constructor() {
    if (this.taskId) {
      this.form.patchValue(this.taskService.getTask(this.taskId));
    }
  }

  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.minLength(10)]),
  });

  submit() {
    if (this.form.invalid) {
      console.log("Your form is invalid. Please check the fields.");
      console.log("Your Form: ", this.form.value);
      console.log("Title Errors: ", this.form.controls.title.errors);
      console.log(
        "Description Errors: ",
        this.form.controls.description.errors
      );
    }
    if (this.taskId) {
      const existingTask = this.taskService.getTask(this.taskId);
      this.taskService.updateTask({
        ...existingTask,
        ...this.form.value,
      });
    } else {
      this.taskService.addTask(this.form.value);
    }
    this.router.navigate(["/"]);
  }
}
