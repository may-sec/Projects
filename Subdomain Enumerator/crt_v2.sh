#!/bin/bash

Help() {
    echo "Options:"
    echo ""
    echo "-h     Help"
    echo "-d     Search Domain Name       | Example: $0 -d hackerone.com"
    echo "-o     Search Organization Name | Example: $0 -o hackerone+inc"
    echo ""
}

CleanResults() {
    sed 's/\\n/\n/g' | \
    sed 's/\*.//g' | \
    sed -r 's/([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4})//g' | \
    sort | uniq
}

# Function: Domain
Domain() {
    # Check if the domain name is provided
    if [ -z "$req" ]; then
        echo "Error: Domain name is required."
        exit 1
    fi
    
    # Perform the search request to crt.sh
    response=$(curl -s "https://crt.sh?q=%.$req&output=json")
    
    # Check if the response is empty
    if [ -z "$response" ]; then
        echo "No results found for domain $req"
        exit 1
    fi
    
    # Process the response, clean it, and store the results
    results=$(echo "$response" | jq -r ".[].common_name,.[].name_value" | CleanResults)
    
    # Check if there are any valid results after cleaning
    if [ -z "$results" ]; then
        echo "No valid results found."
        exit 1
    fi
        
    # Display the results and summary
    echo ""
    echo "$results"
    echo ""
}

# Main Script Logic

# If no arguments are provided, display the help message
if [ -z "$1" ]; then
    Help
    exit
fi

# Parse command-line options using getopts
while getopts "h:d:o:" option; do
    case $option in
        h) # Display help
            Help
            ;;
        d) # Search for domain name
            req=$OPTARG
            Domain
            ;;
        o) # Search for organization name
            req=$OPTARG
            Organization
            ;;
        *) # Invalid option, display help
            Help
            ;;
    esac
done
