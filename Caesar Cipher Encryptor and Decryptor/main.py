//A simple substitution cipher where each letter in the plaintext is shifted a certain number of places down the alphabet

def caesar_cipher(text, shift, mode='encrypt'):

  result = ""
  for char in text:
    if char.isalpha():
      # Determine the base character (A for uppercase, a for lowercase)
      base = ord('A') if char.isupper() else ord('a')
      # Calculate the shifted character's position
      shifted_pos = (ord(char) - base + shift) % 26 + base
      # Convert the shifted position back to a character
      result += chr(shifted_pos)
    else:
      # Keep non-alphabetic characters unchanged
      result += char
  return result

# Example usage
text = "Hello, World!"
shift_value = 3

encrypted_text = caesar_cipher(text, shift_value)
print("Encrypted:", encrypted_text) 

decrypted_text = caesar_cipher(encrypted_text, shift_value, mode='decrypt')
print("Decrypted:", decrypted_text)
