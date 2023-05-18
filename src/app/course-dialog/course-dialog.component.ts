import {AfterViewInit, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Course} from "../model/course";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import * as moment from 'moment';
import {CourseService} from "../services/course.service";
import {LoadingService} from "../loading/loading.service";

@Component({
  selector: 'course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css'],
  providers: [LoadingService]
})
export class CourseDialogComponent implements AfterViewInit {

  form: FormGroup;

  course: Course;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course,
    readonly courseService: CourseService,
    readonly loadingService: LoadingService) {

    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required]
    });
  }

  ngAfterViewInit() {

  }

  save() {
    const changes = this.form.value;
    const loadSave$ = this.courseService.saveCourse(this.course.id, changes);

    this.loadingService.showLoaderUntilCompleted(loadSave$)
      .subscribe(savedCourse => {
        this.dialogRef.close(savedCourse);
      })
  }

  close() {
    this.dialogRef.close();
  }

}
