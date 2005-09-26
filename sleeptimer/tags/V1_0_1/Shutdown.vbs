Const SHUTDOWN = 1

Set objWMIService = GetObject("winmgmts:{(Shutdown)}")
Set colOperatingSystems = objWMIService.InstancesOf("Win32_OperatingSystem")

For Each objOperatingSystem in colOperatingSystems
  objOperatingSystem.Win32Shutdown SHUTDOWN
  Exit For
Next
