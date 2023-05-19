import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {catchError, map, tap} from 'rxjs/operators'
import {Course, sortCoursesBySeqNo} from "../model/course";
import {MessagesService} from "../messages/messages.service";
import {LoadingService} from "../loading/loading.service";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CoursesStore {
  private subject = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.subject.asObservable();


  constructor(private messagesService: MessagesService, private loadingService: LoadingService, private http: HttpClient) {
    this.loadAllCourses();
  }

  private loadAllCourses(){
    const loadCourses$: Observable<Course[]> = this.http.get<Course[]>('/api/courses')
      .pipe(
        map(courses => courses['payload']),
        catchError((err: HttpErrorResponse) => {
          const message = 'Could not load courses !';
          console.log(message, err);
          this.messagesService.showErrors(message);
          return throwError(err);
        }),
        tap((courses) => this.subject.next(courses))
      )
    this.loadingService.showLoaderUntilCompleted(loadCourses$).subscribe();
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
