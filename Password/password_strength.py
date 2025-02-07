import hashlib
import string

def check_password_strength(password):
  if len(password) < 8:
    return "Weak"  # Password length should be at least 8 characters

  # Check for common patterns, more common patterns can be addded
  if password.lower() in ["password", "123456", "qwerty", "abcdefg"]:
    return "Weak"

  # Check for digit and letter
  has_digit = False
  has_letter = False
  for char in password:
    if char.isdigit():
      has_digit = True
    if char.isalpha():
      has_letter = True
  if not has_digit or not has_letter:
    return "Weak"

  # Check for uppercase letters
  if not any(char.isupper() for char in password):
    return "Medium"

  # Check for special characters
  if not any(not char.isalnum() for char in password):
    return "Medium"

  # Calculate the number of possible combinations (rough estimate)
  possible_chars = string.ascii_letters + string.digits + string.punctuation
  num_combinations = len(possible_chars) ** len(password)
  if num_combinations < 10 ** 12:  # Adjust threshold as needed
    return "Medium"

  return "Strong"

password = input("Check the strength of password : ")
strength = check_password_strength(password)
print(f"Password: {password} -> Strength: {strength}")

# Example usage
# passwords = ["password123", "MyStrongP@ssw0rd!", "abc123456", "secret"]

# for password in passwords:
#     strength = check_password_strength(password)
#     print(f"Password: {password} -> Strength: {strength}")
