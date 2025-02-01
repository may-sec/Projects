<h1 align="center">Bypass Linux Login Screen</h1>

## Requirement

Laptop with Linux OS

## Steps

1. start the machine and wait until its shows the grub boot loader screen

2. press ‘e’ for edit into boot loader setting

3. In here Linux section we have to change ‘ro’ to ‘rw’ and in the last of the line we need to add
```bash
init=/bin/bash
```


4. press CTRL+X for save and exit

5. 
```bash
/etc/shadow
```


6. 
```bash
#passwd [username]
```
(change password for user(system user))

```bash
#passwd
```
(change password for root user)


7. 
```bash
reboot -f
```
