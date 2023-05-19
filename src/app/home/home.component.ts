import {Component, OnInit} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {Observable, throwError, of} from 'rxjs';
import {catchError, delay, finalize, map, concat, concatMap} from 'rxjs/operators';
import {CourseService} from "../services/course.service";
import {LoadingService} from "../loading/loading.service";
import {MessagesService} from "../messages/messages.service";


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;


  constructor(readonly courseService: CourseService, readonly loadingService: LoadingService, readonly messageService: MessagesService) {

  }

  ngOnInit() {
    this.loadCourses();
  }

  public loadCourses() {
    const courses$: Observable<Course[]> = this.courseService.loadAllCourses()
      .pipe(
        map(
          courses => courses.sort(sortCoursesBySeqNo)
        ),
        catchError(err => {
          const message = 'Could not load courses !';
          this.messageService.showErrors(message);
          console.log(message, err);
          return throwError(err);
        })
      );
    const loadCourses$ = this.loadingService.showLoaderUntilCompleted(courses$);
    this.beginnerCourses$ = loadCourses$.pipe(
      map(courses => courses.filter(course => course.category == "BEGINNER")));
    this.advancedCourses$ = loadCourses$.pipe(map(courses => courses.filter(course => course.category == "ADVANCED")));
  }
}




