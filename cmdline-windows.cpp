#include <windows.h>
#include <winternl.h>
#include <string>
#include <cstdint>

#pragma comment(lib, "ntdll.lib")

std::string GetCommandLineFromProcess(uint32_t pid) {
  std::string commandLine;
  HANDLE hProcess = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, FALSE, pid);
  if (hProcess != NULL) {
    PVOID pebAddress = NULL;
    PROCESS_BASIC_INFORMATION pbi = { 0 };
    ULONG returnLength = 0;

    if (NT_SUCCESS(NtQueryInformationProcess(hProcess, ProcessBasicInformation, &pbi, sizeof(pbi), &returnLength))) {
      pebAddress = pbi.PebBaseAddress;
    }

    if (pebAddress != NULL) {
      PEB peb;
      if (ReadProcessMemory(hProcess, pebAddress, &peb, sizeof(peb), NULL)) {
        RTL_USER_PROCESS_PARAMETERS params;
        if (ReadProcessMemory(hProcess, peb.ProcessParameters, &params, sizeof(params), NULL)) {
          wchar_t* commandLineBuffer = new wchar_t[params.CommandLine.Length / sizeof(wchar_t) + 1];
          if (ReadProcessMemory(hProcess, params.CommandLine.Buffer, commandLineBuffer, params.CommandLine.Length, NULL)) {
            commandLineBuffer[params.CommandLine.Length / sizeof(wchar_t)] = L'\0';
            int size = WideCharToMultiByte(CP_UTF8, 0, commandLineBuffer, -1, nullptr, 0, nullptr, nullptr);
            commandLine.resize(size - 1);
            WideCharToMultiByte(CP_UTF8, 0, commandLineBuffer, -1, &commandLine[0], size, nullptr, nullptr);
          }
          delete[] commandLineBuffer;
        }
      }
    }
    CloseHandle(hProcess);
  }

  return commandLine;
}