# Password Strength Checker Script

This script evaluates the strength of a given password based on several criteria, providing a classification of "Weak," "Medium," or "Strong."

## Features

*   **Length Check:** Checks if the password is at least 8 characters long.
*   **Common Pattern Check:** Checks if the password matches any common or easily guessable patterns (e.g., "password", "123456", "qwerty").  You can easily extend this list.
*   **Digit and Letter Check:** Ensures that the password contains both digits and letters.
*   **Uppercase Letter Check:** Checks for the presence of uppercase letters.
*   **Special Character Check:** Checks for the presence of special (non-alphanumeric) characters.
*   **Combination Estimation:**  Provides a rough estimate of the number of possible password combinations.

## Prerequisites

*   Python 3.x
*   No external libraries are required (standard `string` module is used).

## Usage

The script prompts the user to enter a password and then prints the strength classification.

```bash
python3 password_strength.py
```

---------------------------------------------------------------------------------------------------------------------

# Password Generator Script

This script generates strong, random passwords based on user-specified criteria, including length, character types, and the option to include a specific string.

## Features

*   **Customizable Length:** Specify the desired length of the password.
*   **Character Set Control:** Choose which character types to include (lowercase, uppercase, digits, symbols).
*   **Must-Contain String:** Include a specific string that must be part of the generated password.
*   **Multiple Suggestions:** Generate multiple password suggestions to choose from.
*   **Substitution and Capitalization:** Applies random substitutions (e.g., a -> @, 1 -> l) and creative capitalization to further strengthen passwords.
*   **Error Handling:** Provides informative error messages for invalid input or impossible constraints.
*   **Help Feature:** Displays a help message with usage instructions.

## Prerequisites

*   Python 3.x
*   No external libraries are required (standard `random`, `string`, and `argparse` modules are used).

## Usage

The script is run from the command line:

```bash
python3 generate_pass.py [length] [options]
```
