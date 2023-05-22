# cmdline

This is a Node.js addon for retrieving the command line of a process in Windows based on its process ID (PID).

## Installation

To install the `cmdline-windows` addon, use the following command:

```
npm i --save cmdline-windows
```

## Usage

```javascript
const cmdline = require('cmdline-windows');

const pid = 1234; // Replace with the actual process ID

const commandLine = cmdline.getCmdline(pid);
console.log('Command Line:', commandLine);
```
