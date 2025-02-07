# LSB Steganography in Images

This script implements Least Significant Bit (LSB) steganography to hide text messages within images.  It provides functionality for both encoding (embedding) and decoding (extracting) the hidden message.

## Features

*   **LSB Encoding:**  Hides a text message within an image by modifying the least significant bits of the pixel RGB values.
*   **Length Prefix:** Stores the length of the message at the beginning of the hidden data, allowing for reliable decoding.
*   **Handles RGB Images:** Works with images in RGB format.
*   **Encoding and Decoding:** Provides separate functions for encoding and decoding.
*   **User-Friendly Interface:** Prompts the user for image path and message input.

## Prerequisites

*   Python 3.x
*   PIL (Pillow) library:  Install using `pip install Pillow`

## Usage

1.  Save the code as a Python file (e.g., `steganography.py`).
2.  Run the script from the command line:

```bash
python3 steganography.py
```
