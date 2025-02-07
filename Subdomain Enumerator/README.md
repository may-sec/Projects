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
*   `crt.sh` script (or equivalent)
*   `amass`
*   `httprobe`
*   `gowitness`

You'll need to install these tools separately.  It is highly recommended to install them in a dedicated directory and add that directory to your `PATH` environment variable.  For example, you might install them in `/opt/recon-tools` and then add `/opt/recon-tools/bin` to your `PATH`.

## Usage

```bash
./recon.sh <target_url>
