#!/bin/bash

url="$1"

# Create directories (improved)
mkdir -p "$url/recon"

# Function to run a tool and handle output
run_tool() {
    local tool_name="$1"
    local command="$2"
    local output_file="$3"

    echo -e "[+] Harvesting subdomains with $tool_name..."
    eval "$command"  # Execute the command
    if [[ $? -eq 0 ]]; then # Check if the command exited successfully
        echo -e "[+] Found \e[31m$(wc -l < "$output_file")\e[0m Domains from $tool_name"  # Count lines efficiently
        echo -e "[+] Output saved in $output_file"
    else
        echo -e "\e[31m[-]\e[0m Error running $tool_name"
        return 1 # Return error code
    fi
    echo "--------------------------------------------------"
    sort -u "$output_file" >> "$url/recon/final.txt"
}

# Run the tools using the function
run_tool "assetfinder" "assetfinder --subs-only $url >> $url/recon/assetfinder.txt" "$url/recon/assetfinder.txt"
run_tool "subfinder" "subfinder -all -silent -d $url >> $url/recon/subfinder.txt" "$url/recon/subfinder.txt"
run_tool "sublist3r" "sublist3r -d $url -o $url/recon/sublist3r.txt" "$url/recon/sublist3r.txt"
run_tool "crt" "./crt_v2.sh -d $url >> $url/recon/crt.txt" "$url/recon/crt.txt"
run_tool "amass" "amass enum -d $url -o $url/recon/amass.txt" "$url/recon/amass.txt"

# Combine and deduplicate final.txt (only if no tool had an error)
if [[ $? -eq 0 ]]; then
    sort -u "$url/recon/final.txt" -o "$url/recon/final.txt" # Deduplicate in place
    echo "[+] Final subdomain list saved in $url/recon/final.txt"

    echo "[+] Probing for alive domains (HTTPS)..."
    cat "$url/recon/final.txt" | httprobe -s -p https:443 | sed 's/https?:\/\///' | tr -d ':443' >> "$url/recon/alive.txt"

    echo "[+] Probing for alive domains (HTTP)..."
    cat "$url/recon/final.txt" | httprobe -s -p http:80 | sed 's/http?:\/\///' | tr -d ':80' >> "$url/recon/alive.txt"

    sort -u "$url/recon/alive.txt" -o "$url/recon/alive.txt"  # Deduplicate alive.txt
    echo "[+] Alive domains saved in $url/recon/alive.txt"

    echo "[+] Reconnaissance complete for $url"

    # eyewitness -f $url/recon/alive.txt --timeout 4 --max-retries 2 --web
    gowitness scan file -f $url/recon/alive.txt

    echo "[+] Screenshot done for $url"
else
    echo -e "\e[31m[-] Reconnaissance failed for $url due to errors in tools.\e[0m"
fi

echo "--------------------------------------------------"
