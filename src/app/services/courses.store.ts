import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, throwError, of} from "rxjs";
import {catchError, map, shareReplay, tap} from 'rxjs/operators'
import {Course, sortCoursesBySeqNo} from "../model/course";
import {MessagesService} from "../messages/messages.service";
import {LoadingService} from "../loading/loading.service";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {LogService} from "./log.service";

@Injectable({
  providedIn: 'root'
})
export class CoursesStore {
  private subject = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.subject.asObservable();


  constructor(private log: LogService, private messagesService: MessagesService, private loadingService: LoadingService, private http: HttpClient) {
    this.loadAllCourses();
  }

  private loadAllCourses(){
    const loadCourses$: Observable<Course[]> = this.http.get<Course[]>('/api/courses')
      .pipe(
        map(courses => courses['payload']),
        catchError((err: HttpErrorResponse) => {
          const message = 'Could not load courses !';
          this.log.log(message, err.message);
          this.messagesService.showErrors(message);
          return throwError(err);
        }),
        tap((courses) => this.subject.next(courses))
      )
    this.loadingService.showLoaderUntilCompleted(loadCourses$).subscribe();
  }

  public saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    const courses = this.subject.getValue();
    const index = courses.findIndex(course => course.id === courseId);
    const newCourse: Course = {
      ...courses[index],
      ...changes
    }
    const newCourses: Course[] = courses.slice(0);
    newCourses[index] = newCourse;
    this.subject.next(newCourses);
    return this.http.put(`/api/courses/${courseId}`, changes)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          const message = "Could not save course";
          this.log.log(message, err.message);
          this.messagesService.showErrors(message);
          return throwError(err);
        }),
        shareReplay()
      )
  }

  filterCoursesByCategory(category: string): Observable<Course[]> {
    return this.courses$
      .pipe(
        map(
          courses => courses
            .filter(course => course.category === category)
            .sort(sortCoursesBySeqNo)
        )
      )
  }
}
