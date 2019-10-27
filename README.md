# angular-calendar
Calendar Component for Angular

**Add calendar component to any component template**

```angular
<app-calendar (dateSelected)="onDateSelected($event)"></app-calendar>
```
```typescript
  onDateSelected(date) {
    console.log(date);
  }
```

**Pass date as input to component**
```angular
<app-calendar [selectedDate]="selectedDate" (dateSelected)="onDateSelected($event)"></app-calendar>
```
