Const REBOOT = 2

Set objWMIService = GetObject("winmgmts:{(Shutdown)}")
Set colOperatingSystems = objWMIService.InstancesOf("Win32_OperatingSystem")

For Each objOperatingSystem in colOperatingSystems
  objOperatingSystem.Win32Shutdown REBOOT
  Exit For
Next
