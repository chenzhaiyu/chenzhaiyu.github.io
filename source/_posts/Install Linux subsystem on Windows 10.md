---
title: Install Linux subsystem on Windows 10
---
## Installation
1. Turn on WSL feature in Control Panel -> Programs

2. Download and install Ubuntu 18.04 LTS in Windows Store

3. Launch the application and configure the credentials

## Move the directory
4. Move the shell environment from default location  (C:/AppData) to another location
	* A wonderful tool from https://github.com/DDoSolitary/LxRunOffline (v3.3.3)
```
1. Set permissions to the target folder. First, I think you must set some permissions to the folder where the distribution will be moved. You may use icacls <dir> /grant "<user>:(OI)(CI)(F)" to set the proper permissions.

C:\> whoami
test\jaime

C:\> icacls D:\wsl /grant "jaime:(OI)(CI)(F)"

2. Move the distribution. Using lxrunoffline move.

C:\wsl> lxrunoffline move -n Ubuntu-18.04 -d d:\wsl\installed\Ubuntu-18.04
You may check the installation folder using

C:\wsl> lxrunoffline get-dir -n Ubuntu-18.04
d:\wsl\installed\Ubuntu-18.04
```
	* Might ignore the virus alert to proceed the moving operation

## Uninstallation
* Deregistering
```
wslconfig.exe /u Ubuntu-18.04
```
* Regular uninstallation
* Delete the files when possible

References:
1. [How to Install and Use the Linux Bash Shell on Windows 10](https://www.howtogeek.com/249966/how-to-install-and-use-the-linux-bash-shell-on-windows-10/)
2. [Move WSL (Bash on Windows) root filesystem to another hard drive?](https://stackoverflow.com/questions/38779801/move-wsl-bash-on-windows-root-filesystem-to-another-hard-drive)
3. [remove wsl and start again  · Issue #2703 · microsoft/WSL · GitHub](https://github.com/microsoft/WSL/issues/2703)

#developer/windows

