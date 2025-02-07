# EXIF Data Analysis for Forensic Insights

This script extracts and analyzes EXIF (Exchangeable Image File Format) data from image files to provide forensic insights.  EXIF data can contain valuable information about the image, including camera settings, date/time, GPS location, and more.

## Features

*   **EXIF Data Extraction:** Extracts a wide range of EXIF tags from image files.
*   **Forensic Analysis:**  Analyzes the extracted data to provide insights relevant to forensic investigations.
*   **GPS Data Processing:** Handles GPS information, including conversion to decimal degrees for latitude and longitude.
*   **Error Handling:** Includes error handling for file not found and other potential issues.
*   **Clear Output:** Presents the extracted and analyzed data in a readable format.

## Prerequisites

*   Python 3.x
*   `exifread` library: Install using `pip install exifread`
*   `pandas` library (optional, for data manipulation or export): Install using `pip install pandas`

## Usage

1.  Save the code as a Python file (e.g., `exif_analyzer.py`).
2.  Run the script from the command line:

```bash
python3 exif_analyzer.py
