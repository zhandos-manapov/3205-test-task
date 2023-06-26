# 3205 Test Task

## Installation

Make sure you have Nodejs installed. Otherwise go to https://nodejs.org and install it.

```
git clone https://github.com/zhandos-manapov/3205-test-task.git
cd 3205-test-task
```

Run backend

```
cd backend
npm install
npm run dev
```

Run frontend

```
cd frontend
npm install
npm run dev
```

<br>

## API docs

## **GET** &nbsp; Get Many Users

```
http://localhost:3000/api/v1/user?email=jill@gmail.com&number=822287
```

Get users by query

### Query Params


<hr>

| Key    | Type   | Value          |
| ------ | ------ | -------------- |
| email  | string | jill@gmail.com |
| number | string | 822287         |
