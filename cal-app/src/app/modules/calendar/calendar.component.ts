import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

export class CalendarComponent implements OnInit {
  calendarVM: CalendarVM;
  @Input() public selectedDate: Date;
  @Output() public dateSelected: EventEmitter<Date> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    if (this.selectedDate == undefined || this.selectedDate == null)
      this.selectedDate = new Date();
    this.initCalendar(this.selectedDate.getMonth(), this.selectedDate.getFullYear());
  }

  initCalendar(month, year) {
    let calendarData: CalendarData = {
      currentMonth: month
      , currentMonthStr: moment(month + 1, 'M').format('MMMM')
      , currentYear: year
      , selectedDate: this.selectedDate
    }
    let rows = this.calculateRows(calendarData.currentMonth, calendarData.currentYear);
    let calendarVM: CalendarVM = {
      calendarData: calendarData,
      rows: rows,
      days: new Array(rows)
    }
    let _firstDay = this.getFirstDayInMonth(calendarData.currentMonth, calendarData.currentYear);
    let startDate: Date = moment(
      new Date(calendarData.currentYear, calendarData.currentMonth, 1))
      .add(_firstDay * -1, 'days')
      .toDate();
    let counter = 0;
    for (let row = 0; row < rows; row++) {
      calendarVM.days[row] = new Array(7);
      for (let col = 0; col < 7; col++) {
        let _date = moment(startDate).add(counter, 'days').toDate();
        calendarVM.days[row][col] = {
          date: _date
          , current: false
          , selected: false
        }
        calendarVM.days[row][col].selected = this.isSame(this.selectedDate, _date);
        counter++;
      }
    }

    this.calendarVM = calendarVM;
  }
  calculateRows(month: number, year: number) {
    let totalDays = this.daysInMonth(month + 1, year) + this.getFirstDayInMonth(month, year);
    return Math.ceil(totalDays / 7);
  }
  //#region Date Helper Methods
  getFirstDayInMonth(month: number, year: number) {
    var _day = new Date(year, month, 1).getDay();
    return _day;
  }

  daysInMonth(month, year) {
    let days = new Date(year, month, 0).getDate();
    return days;
  }

  isSame(dt1, dt2) {
    return (dt1.getDate() == dt2.getDate()
      && dt1.getMonth() == dt2.getMonth()
      && dt1.getFullYear() == dt2.getFullYear()
    )
  }
  createRange(number) {
    var items: number[] = [];
    for (var i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }
  //#endregion

  //#region  UI events
  onDateSelected(day: CalendarCellVM) {
    for (let row = 0; row < this.calendarVM.rows; row++) {
      for (let col = 0; col < 7; col++) {
        this.calendarVM.days[row][col].selected = this.isSame(this.calendarVM.days[row][col].date, day.date);
      }
    }
    this.dateSelected.emit(day.date);
  }
  movePrev() {
    let month = this.calendarVM.calendarData.currentMonth;
    let year = this.calendarVM.calendarData.currentYear;
    this.initCalendar(month == 0 ? 11 : --month, month == 1 ? --year : year);
  }
  moveNext() {
    let month = this.calendarVM.calendarData.currentMonth;
    let year = this.calendarVM.calendarData.currentYear;
    this.initCalendar(month == 11 ? 0 : ++month, month == 11 ? ++year : year);
  }
  //#endregion
}

export class CalendarData {
  selectedDate: Date;
  currentMonth: number;
  currentYear: number;
  currentMonthStr: string;
}

export class CalendarVM {
  calendarData: CalendarData;
  rows: number;
  days: CalendarCellVM[][];
}

export class CalendarCellVM {
  date: Date;
  current: boolean;
  selected: boolean;
}
