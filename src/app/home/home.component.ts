import {Component, OnInit} from '@angular/core';
import {Course} from '../model/course';
import {Observable} from 'rxjs';
import {CoursesStore} from "../services/courses.store";
import {AuthStore} from "../services/auth.store";


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;


  constructor(readonly courseStore: CoursesStore) {

  }

  ngOnInit() {
    this.loadCourses();
  }

  public loadCourses() {
    this.beginnerCourses$ = this.courseStore.filterCoursesByCategory('BEGINNER');
    this.advancedCourses$ = this.courseStore.filterCoursesByCategory("ADVANCED");
  }
}




