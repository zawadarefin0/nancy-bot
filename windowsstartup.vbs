' enable_and_run_task.vbs

Set shell = CreateObject("Shell.Application")
If WScript.Arguments.Count = 0 Then
    ' Relaunch as admin
    shell.ShellExecute "wscript.exe", Chr(34) & WScript.ScriptFullName & Chr(34) & " run", "", "runas", 1
    WScript.Quit
End If

taskName = "NancyBot" ' Replace with your task name, include folder path if needed

' Enable the task
Set shellExec = CreateObject("WScript.Shell")
shellExec.Run "schtasks /change /tn """ & taskName & """ /enable", 0, True

' Run the task
shellExec.Run "schtasks /run /tn """ & taskName & """", 0, False
