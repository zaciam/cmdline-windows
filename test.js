const addon = require('./build/Release/cmdline');
const { spawn } = require('child_process');

const header = `║ ${'Test'.padEnd(39)}║ ${'Result'.padEnd(11)}║`;
const tableTop = `╔${'═'.repeat(40)}╦${'═'.repeat(12)}╗`;
const tableMiddle = `╠${'═'.repeat(40)}╬${'═'.repeat(12)}╣`;
const tableBottom = `╚${'═'.repeat(40)}╩${'═'.repeat(12)}╝`;

function printTableHeader() {
  process.stdout.write(`${tableTop}\n${header}\n${tableMiddle}\n`);
}

function printTableRow(testName, result) {
  const colors = {
    reset: '\x1b[0m',
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    red: '\x1b[31m',
  };

  const coloredTestName = `${colors.cyan}${testName.padEnd(39)}${colors.reset}`;
  const coloredResult = result === '✅ Passed' ? `${colors.green}${result.padEnd(10)}${colors.reset}` : `${colors.red}${result.padEnd(10)}${colors.reset}`;

  const row = `║ ${coloredTestName}║ ${coloredResult}║`;
  process.stdout.write(`${row}\n`);
}

function runTest(testName, command) {
  const cmdProcess = spawn('cmd.exe', command);

  const pid = cmdProcess.pid;
  const expectedCmdline = `cmd.exe ${command.join(' ')}`;

  const actualCmdline = addon.getCmdline(pid);

  const result = actualCmdline === expectedCmdline ? '✅ Passed' : '❌ Failed';
  printTableRow(testName, result);

  cmdProcess.kill();
  return actualCmdline === expectedCmdline;
}

const testCases = [
  { testName: 'Test 1: Simple Command', command: ['/c', 'echo', 'Test', '42'] },
  { testName: 'Test 2: Special Characters', command: ['/c', 'echo', 'Hello,', '🌍!'] },
  { testName: 'Test 3: List Files', command: ['/c', 'dir'] },
  { testName: 'Test 4: Ping localhost', command: ['/c', 'ping', 'localhost'] },
  { testName: 'Test 5: Echo Current Date', command: ['/c', 'echo', '%DATE%'] },
  { testName: 'Test 6: Create New Directory', command: ['/c', 'mkdir', 'test_dir'] },
  { testName: 'Test 7: Remove Directory', command: ['/c', 'rmdir', 'test_dir'] },
  { testName: 'Test 8: Copy File', command: ['/c', 'copy', 'file1.txt', 'file2.txt'] },
  { testName: 'Test 9: Delete File', command: ['/c', 'del', 'file.txt'] },
  { testName: 'Test 10: Run Node.js Script', command: ['/c', 'node', 'script.js'] },
  { testName: 'Test 11: Change Directory', command: ['/c', 'cd', 'test_dir'] },
  { testName: 'Test 12: Display Environment Variables', command: ['/c', 'echo', '%PATH%'] },
  { testName: 'Test 13: List Running Processes', command: ['/c', 'tasklist'] },
  { testName: 'Test 14: Kill Process', command: ['/c', 'taskkill', '/F', '/IM', 'process.exe'] },
  { testName: 'Test 15: Display System Date and Time', command: ['/c', 'echo', '%DATE%', '&', 'time'] },
  { testName: 'Test 16: Display Free Disk Space', command: ['/c', 'fsutil', 'volume', 'diskfree', 'C:'] },
  { testName: 'Test 17: Display Network Configuration', command: ['/c', 'ipconfig', '/all'] },
  { testName: 'Test 18: Create Empty File', command: ['/c', 'type', 'nul', '->', 'empty.txt'] },
  { testName: 'Test 19: Display System Information', command: ['/c', 'systeminfo'] },
  { testName: 'Test 20: Open Notepad', command: ['/c', 'start', 'notepad'] },
  { testName: 'Test 21: List Installed Programs', command: ['/c', 'wmic', 'product', 'get', 'name'] },
  { testName: 'Test 22: Check Disk Space', command: ['/c', 'wmic', 'logicaldisk', 'get', 'size,freespace,caption'] },
  { testName: 'Test 23: List Network Adapters', command: ['/c', 'wmic', 'nic', 'get', 'name'] },
  { testName: 'Test 24: Display IP Configuration', command: ['/c', 'ipconfig'] },
  { testName: 'Test 25: Generate Random Number', command: ['/c', 'set', '/a', 'var=%random%', '&', 'echo', '%var%'] },
];

printTableHeader();
testCases.forEach((testCase) => runTest(testCase.testName, testCase.command));
process.stdout.write(`${tableBottom}\n`);
