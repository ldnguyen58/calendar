## About

React app to schedule weekly courses.

* Calendar name can be changed by clicking on the name. Any change will be persisted to local storage.
* Each course is assigned a unique color. All slots of the same course are painted using that color.
* When there are overlapping slots, they are all shown in the table with their width properly adjusted to fit in the table cell.
* When there's one or more schedule conflicts, an message is shown and the slots are painted with red border.
* Users can add or remove any course from the calendar.

## Server

* Run this in a terminal

```bash
cd ./server
npm i
npm start
```
* Server will listen on port 3000

## Client (implemented from scratch)

* Run this in a terminal

```bash
cd ./client
npm i
npm start
```

* Access the app at http://localhost:3001
