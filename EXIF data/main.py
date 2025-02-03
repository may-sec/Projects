#analyze EXIF data for forensic insights.

import exifread
import pandas as pd

def extract_exif_data(image_path):
    with open(image_path, 'rb') as f:
        tags = exifread.process_file(f)
        return tags

def analyze_exif_data(tags):
    insights = {}

    # Basic Information
    insights['Camera Make'] = tags.get('Image Make')
    insights['Camera Model'] = tags.get('Image Model')
    insights['Serial Number'] = tags.get('Image BodySerialNumber') # Might not always be present
    insights['Lens Model'] = tags.get('EXIF LensModel') # Lens used
    insights['Software'] = tags.get('Image Software')
    insights['Date/Time Original'] = tags.get('EXIF DateTimeOriginal')
    insights['Date/Time Digitized'] = tags.get('EXIF DateTimeDigitized')

    # Exposure Information
    insights['Exposure Time'] = tags.get('EXIF ExposureTime')
    insights['Aperture Value'] = tags.get('EXIF ApertureValue')
    insights['ISO Speed'] = tags.get('EXIF ISOSpeedRatings')
    insights['Exposure Bias'] = tags.get('EXIF ExposureBiasValue')
    insights['Metering Mode'] = tags.get('EXIF MeteringMode')
    insights['Flash'] = tags.get('EXIF Flash') # Check Flash Fired or not

    # Image Properties
    insights['Focal Length'] = tags.get('EXIF FocalLength')
    insights['White Balance'] = tags.get('EXIF WhiteBalance')
    insights['Image Width'] = tags.get('EXIF ExifImageWidth')
    insights['Image Height'] = tags.get('EXIF ExifImageLength')
    insights['Orientation'] = tags.get('Image Orientation') # Portrait or Landscape

    # GPS Processing (with error handling and decimal conversion)
    try:
        latitude = tags.get('GPS GPSLatitude')
        longitude = tags.get('GPS GPSLongitude')
        latitude_ref = tags.get('GPS GPSLatitudeRef')  # N or S
        longitude_ref = tags.get('GPS GPSLongitudeRef') # E or W

        if latitude and longitude:
            lat_deg = latitude[0].num / latitude[0].den
            lat_min = latitude[1].num / latitude[1].den
            lat_sec = latitude[2].num / latitude[2].den
            lat_decimal = lat_deg + (lat_min/60) + (lat_sec/3600)
            if latitude_ref == 'S':  # South latitude is negative
                lat_decimal *= -1
            insights['GPS Latitude'] = lat_decimal

            lon_deg = longitude[0].num / longitude[0].den
            lon_min = longitude[1].num / longitude[1].den
            lon_sec = longitude[2].num / longitude[2].den
            lon_decimal = lon_deg + (lon_min/60) + (lon_sec/3600)
            if longitude_ref == 'W':  # West longitude is negative
                lon_decimal *= -1
            insights['GPS Longitude'] = lon_decimal

        insights['GPS Altitude'] = tags.get('GPS GPSAltitude')
        insights['GPS Altitude Ref'] = tags.get('GPS GPSAltitudeRef')
        insights['GPS TimeStamp'] = tags.get('GPS GPSTimeStamp')
        insights['GPS DateStamp'] = tags.get('GPS GPSDateStamp')
        insights['GPS Map Datum'] = tags.get('GPS GPSMapDatum')
        insights['GPS Version ID'] = tags.get('GPS GPSVersionID')

    except Exception as e:
        insights['GPS Latitude'] = "Not Available"
        insights['GPS Longitude'] = "Not Available"
        print(f"Error processing GPS data: {e}")


    # More Potential Data:
    insights['Digital Zoom Ratio'] = tags.get('EXIF DigitalZoomRatio')
    insights['Scene Capture Type'] = tags.get('EXIF SceneCaptureType')
    insights['User Comment'] = tags.get('Image UserComment')
    insights['DateTime Original'] = tags.get('EXIF DateTimeOriginal')
    insights['DateTime Digitized'] = tags.get('EXIF DateTimeDigitized')
    insights['File Source'] = tags.get('EXIF FileSource')
    insights['Custom Rendered'] = tags.get('EXIF CustomRendered')
    insights['Exposure Mode'] = tags.get('EXIF ExposureMode')
    insights['WhiteBalance Mode'] = tags.get('EXIF WhiteBalanceMode')
    insights['Scene Type'] = tags.get('EXIF SceneType')
    insights['Subject Distance'] = tags.get('EXIF SubjectDistance')
    insights['Light Source'] = tags.get('EXIF LightSource')
    insights['Flash Fired'] = tags.get('EXIF Flash')
    insights['Compressed Bits Per Pixel'] = tags.get('EXIF CompressedBitsPerPixel')
    insights['Focal Length In 35mm Film'] = tags.get('EXIF FocalLengthIn35mmFilm') # 35mm equivalent focal length
    insights['Gain Control'] = tags.get('EXIF GainControl')
    insights['Contrast'] = tags.get('EXIF Contrast')
    insights['Saturation'] = tags.get('EXIF Saturation')
    insights['Sharpness'] = tags.get('EXIF Sharpness')
    insights['Subject Area'] = tags.get('EXIF SubjectArea') # Area of the subject
    insights['Color Space'] = tags.get('EXIF ColorSpace')
    insights['Metering Mode'] = tags.get('EXIF MeteringMode')
    insights['Sensitivity Type'] = tags.get('EXIF SensitivityType')
    insights['Recommended Exposure Index'] = tags.get('EXIF RecommendedExposureIndex')
    insights['Exposure Program'] = tags.get('EXIF ExposureProgram')
    insights['Spectral Sensitivity'] = tags.get('EXIF SpectralSensitivity')

    # Interoperability (Often related to thumbnail images)
    insights['Interoperability Index'] = tags.get('Interoperability InteroperabilityIndex')
    insights['Interoperability Version'] = tags.get('Interoperability InteroperabilityVersion')

    # SubSecTime (Sub-second timing information)
    insights['SubSecTime Original'] = tags.get('EXIF SubSecTimeOriginal')
    insights['SubSecTime Digitized'] = tags.get('EXIF SubSecTimeDigitized')

    # More potential data:
    insights['Digital Zoom Ratio'] = insights.get('EXIF DigitalZoomRatio')
    insights['Scene Capture Type'] = insights.get('EXIF SceneCaptureType')
    insights['DateTime Original'] = insights.get('EXIF DateTimeOriginal')
    insights['DateTime Digitized'] = insights.get('EXIF DateTimeDigitized')
    insights['User Comment'] = insights.get('Image UserComment')

    return insights

if __name__ == "__main__":
    image_path = input("Enter the path to the image file: ")
    try:
        exif_data = extract_exif_data(image_path)
        forensic_insights = analyze_exif_data(exif_data)

        print("\nForensic Insights:")
        for key, value in forensic_insights.items():
            print(f"{key}: {value}")

    except FileNotFoundError:
        print(f"Error: Image file not found at {image_path}")
    except Exception as e:  # Catch other potential errors
        print(f"An error occurred: {e}")
