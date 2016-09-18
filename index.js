let path = require('path')
let http = require('http')
let fs = require('fs')
let request = require('request')
let argv = require('yargs').argv


// ======== Variable =========
let logfile = argv.logfile && path.join(__dirname, argv.logfile)
let logStream = logfile ? fs.createWriteStream(logfile) : process.stdout

let url = argv.url

let localhost = '127.0.0.1'
let scheme = 'http://'
let host = argv.host || localhost
let port = argv.port || (host == localhost ? 8000 : 80)

let destinationUrl = url || (scheme + host + ':' + port)

// ======== Logging Input Arguments =========
logStream.write(`\n logfile : ${logfile}`)
logStream.write(`\n url : ${url}`)
logStream.write(`\n host : ${host}`)
logStream.write(`\n port : ${port}`)
logStream.write(`\n destinationUrl : ${destinationUrl}`)


// ======== Echo Server =========
let echoServer = http.createServer((req, res) => {
    logStream.write('\n echoServer ... ')
    logStream.write(req.url)
    for (let header in req.headers) {
      res.setHeader(header, req.headers[header])
    }
    req.pipe(res)
    req.pipe(logStream, {end: false})
    logStream.write(`\n`)
    // res.end('hello world again\n')
})
echoServer.listen(8000)

// ======== Proxy Server =========
let proxyServer = http.createServer((req, res) => {
    logStream.write('\n proxyServer ... ')
    logStream.write('\n Request headers: ' + JSON.stringify(req.headers))
    logStream.write('\n Request method: ' + JSON.stringify(req.method))

    let url = destinationUrl
    if (req.headers['x-destination-url']) {
      url = scheme + req.headers['x-destination-url']
    }

    let options = {
      url : url + req.url
    }
    logStream.write(`\n Proxing to : ${url}`)
    options.method = req.method
    req.pipe(logStream, {end: false})
    logStream.write(`\n`)
    req.pipe(request(options)).pipe(res)
})
proxyServer.listen(9000)
