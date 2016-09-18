# Proxy Server

**Project Details**
- Name : nProxyServer

- Description : Proxy Server for Node.js submitted as the [pre-work](http://courses.codepath.com/snippets/intro_to_nodejs/prework) requirement.

- Time spent: 4

**User Stories**

*required*

  - [x] Requests to port `8000` are echoed back with the same HTTP headers and body.
  - [x] Requests/reponses are proxied to/from the destination server.
  - [x] The destination server is configurable via the `--host`, `--port`  or `--url` arguments.
  - [x] The destination server is configurable via the `x-destination-url` header.
  - [x] Client requests and respones are printed to stdout.
  - [x] The `--logfile` argument outputs all logs to the file specified instead of stdout.

*optional*

  - [ ] The `--exec` argument proxies stdin/stdout to/from the destination program
  - [ ] The `--loglevel` argument sets the logging chattiness
  - [ ] Supports HTTPS
  - [ ] `-h` argument prints CLI API

## Video Walkthrough

Here's a walkthrough of implemented user stories:

![](./proxy-server.gif)

## Commands

- Server Startup Commands
  - nodemon --use-strict index.js
  - nodemon --use-strict index.js --host=google.com --port=80
  - nodemon --use-strict index.js --url=http://google.com:80
  - nodemon --use-strict index.js --logfile=proxy.log


- echo server
  - curl -v -X POST http://127.0.0.1:8000 -d "hello node" -H "foo: bar"


- proxy server
  - curl -v -X POST http://127.0.0.1:9000 -d "hello node" -H "x-destination-url: 127.0.0.1:8000"
  - curl -v -X GET http://127.0.0.1:9000


## Features

### Echo Server:

```bash
➜  proxy-server git:(master) ✗ curl -v -X POST http://127.0.0.1:8000 -d "hello node" -H "x-destination-url: 127.0.0.1:8000"
* Rebuilt URL to: http://127.0.0.1:8000/
*   Trying 127.0.0.1...
* Connected to 127.0.0.1 (127.0.0.1) port 8000 (#0)
> POST / HTTP/1.1
> Host: 127.0.0.1:8000
> User-Agent: curl/7.43.0
> Accept: */*
> x-destination-url: 127.0.0.1:8000
> Content-Length: 10
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 10 out of 10 bytes
< HTTP/1.1 200 OK
< host: 127.0.0.1:8000
< user-agent: curl/7.43.0
< accept: */*
< x-destination-url: 127.0.0.1:8000
< content-length: 10
< content-type: application/x-www-form-urlencoded
< Date: Sun, 18 Sep 2016 03:24:00 GMT
< Connection: keep-alive
<
* Connection #0 to host 127.0.0.1 left intact
hello node%
```

### Proxy Server:

Port 9000 will proxy to the echo server on port 8000.

```bash
➜  proxy-server git:(master) ✗ curl -v -X POST http://127.0.0.1:9000 -d "hello node" -H "x-destination-url: 127.0.0.1:8000"
* Rebuilt URL to: http://127.0.0.1:9000/
*   Trying 127.0.0.1...
* Connected to 127.0.0.1 (127.0.0.1) port 9000 (#0)
> POST / HTTP/1.1
> Host: 127.0.0.1:9000
> User-Agent: curl/7.43.0
> Accept: */*
> x-destination-url: 127.0.0.1:8000
> Content-Length: 10
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 10 out of 10 bytes
< HTTP/1.1 200 OK
< host: 127.0.0.1:8000
< user-agent: curl/7.43.0
< accept: */*
< x-destination-url: 127.0.0.1:8000
< content-length: 10
< content-type: application/x-www-form-urlencoded
< connection: close
< date: Sun, 18 Sep 2016 03:27:20 GMT
<
* Closing connection 0
hello node%
```

### Configuration:

#### CLI Arguments:

The following CLI arguments are supported:

##### `--host`

The host of the destination server. Defaults to `127.0.0.1`.

##### `--port`

The port of the destination server. Defaults to `80` or `8000` when a host is not specified.

##### `--url`

A single url that overrides the above. E.g., `http://www.google.com`

##### `--logfile`

Specify a file path to redirect logging to.

#### Headers

The follow http header(s) are supported:

##### `x-destination-url`

Specify the destination url on a per request basis. Overrides and follows the same format as the `--url` argument.
