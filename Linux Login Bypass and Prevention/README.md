<h1 align="center">Bypass Linux Login Screen</h1>

## Requirement

Laptop with Linux OS

Steps

## Resetting Linux Password using GRUB

Resetting a Linux password using the GRUB bootloader involves booting into single-user mode or recovery mode and then using the command line to reset the password. Here’s a step-by-step guide:

1. Access the GRUB menu. GRUB (Grand Unified Bootloader) is the default bootloader for most Linux distributions. First, restart or power on your computer.  As soon as the boot process begins, press and hold the Shift key (for some systems it might be the Esc key) to bring up the GRUB menu.

<img width="931" alt="image" src="https://github.com/may-sec/Projects/blob/main/Linux%20Login%20Bypass%20and%20Prevention/pics/01.png" />

2. Enter the Edit Mode. Before booting into the system, you need to edit the boot parameters. First, highlight the default boot entry (usually the first in the list) using arrow keys. 

Press ‘E’ to edit the entry.

3. Modify Boot Parameters. To boot into single-user mode, you need to modify the Linux boot parameters. Here are the following steps:
• Find the line that starts with linux or linux16. This line specifies the boot parameters.
• At this line, locate ‘ro quiet’, replace ‘ro’ to ‘rw’ then add the word single or init=/bin/bash, depending on your distribution and setup.
• Press Ctrl + X or F10 to boot with the modified parameters.

<img width="931" alt="image" src="https://github.com/may-sec/Projects/blob/main/Linux%20Login%20Bypass%20and%20Prevention/pics/02.png" />

4. Remount the File System with Write Permissions. By default, the filesystem might be in read-only mode in this state. To change the password, you’ll need write permissions. Enter the following command:

```bash
mount -n -o remount,rw /
```

5. Reset the Password. Use the passwd command to reset the password for a user. Enter the command below, replacing ‘username’ with the actual username for which you want to reset the password:

```bash
passwd username
```
(change password for user(system user))

```bash
#passwd
```
(change password for root user)

<img width="931" alt="image" src="https://github.com/may-sec/Projects/blob/main/Linux%20Login%20Bypass%20and%20Prevention/pics/03.png" />

6. Reboot the System. Now that the password is reset, it’s best to reboot the system to return to normal operation. Enter the following command:
```bash
sync
```

Then, force a reboot with:
```bash
reboot -f
```

The new password should now be active, and you can test it.
