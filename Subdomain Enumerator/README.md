# Subdomain Enumeration and Reconnaissance Script

This Bash script performs subdomain enumeration and basic reconnaissance on a given target URL. It uses various popular tools to discover subdomains, combines the results, and probes for alive domains (HTTP/HTTPS). It also integrates `gowitness` for website screenshots.

## Features

*   **Subdomain Enumeration:** Uses multiple tools (`assetfinder`, `subfinder`, `sublist3r`, `crt`, `amass`) to discover subdomains.
*   **Combined Output:** Combines the output from all tools into a single file.
*   **Deduplication:** Removes duplicate subdomains from the combined list.
*   **Alive Domain Probing:** Checks for alive domains using `httprobe` (both HTTP and HTTPS).
*   **Website Screenshots:** Integrates `gowitness` for full-page website screenshots.
*   **Error Handling:** Basic error handling to catch failures in individual tools.
*   **Organized Output:** Creates a directory structure to store the results of each tool and the final output.

## Prerequisites

*   Bash shell
*   `assetfinder`
*   `subfinder`
*   `sublist3r`
*   `crt.sh` (file present)
*   `amass`
*   `httprobe`
*   `gowitness`

You'll need to install these tools separately.  It is highly recommended to install them in a dedicated directory and add that directory to your `PATH` environment variable.  For example, you might install them in `/opt/recon-tools` and then add `/opt/recon-tools/bin` to your `PATH`.

# Installation Instructions for Reconnaissance Tools

# 1. assetfinder:
go install [github.com/tomnomnom/assetfinder@latest](https://www.google.com/search?q=https://github.com/tomnomnom/assetfinder%40latest)

# 2. subfinder:
go install [github.com/projectdiscovery/subfinder/v2@latest](https://www.google.com/search?q=https://github.com/projectdiscovery/subfinder/v2%40latest)

# 3. sublist3r:
pip3 install sublist3r

# 4. amass:
go install [github.com/OWASP/Amass/v3@latest](https://www.google.com/search?q=https://github.com/OWASP/Amass/v3%40latest)

# 5. httprobe:
go install [github.com/tomnomnom/httprobe@latest](https://www.google.com/search?q=https://github.com/tomnomnom/httprobe%40latest)

# 6. gowitness:
go install [github.com/sensepost/gowitness@latest](https://www.google.com/search?q=https://github.com/sensepost/gowitness%40latest)

# 7. crt.sh (requires a custom script - example):
Create a script (e.g., crt_v2.sh) to query the crt.sh API and place it in your PATH.
Example (using curl and jq - install jq with apt-get install jq or yum install jq):
#!/bin/bash
domain="$1"
curl -s "[https://crt.sh/?q=%.$domain&output=json](https://www.google.com/search?q=https://crt.sh/%3Fq%3D%25.%24domain%26output%3Djson)" | jq -r '.[].name_value' | sort -u


## Usage

```bash
./recon.sh <target_url>
```
