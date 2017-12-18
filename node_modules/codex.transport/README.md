# codex.transport

One click file uploader

## Usage

```js
transport.init({
   url: '/ajax/transport',
   multiple: true,
   accept: 'image/*',
   data: {},
   before: function () {},
   progress: function (percentage) {
       console.log(percentage + '%');
       // ...
   },
   success: function (response) {
       console.log(response);
       // ...
   },
   error: function (response) {
       console.log(response);
       // ...
   },
   after: function () {},
});
```

You can handle all of this event like:
- what should happen before data sending with XMLHTTP
- what should after success request
- error handler
