def caesar_cipher(text, shift, mode='encrypt'):
    result = ""
    if mode == 'decrypt':
        shift = -shift  # Reverse the shift for decryption

    for char in text:
        if char.isalpha():
            base = ord('A') if char.isupper() else ord('a')
            shifted_pos = (ord(char) - base + shift) % 26 + base
            result += chr(shifted_pos)
        else:
            result += char
    return result


if __name__ == "__main__":
    option = input(''' Select one of these
    1. Encrypt text
    2. Decrypt text\n''')
    option=int(option)
    
    shift = input("Enter the shift : ")    
    shift=int(shift)
    
    if(option==1):
        text = input("Enter the text that you want to encrypt : ")
        encrypted = caesar_cipher(text, shift)
        print(f"Original: {text}")
        print(f"Encrypted: {encrypted}")        
    
    elif(option==2):
        encrypted = input("Enter the text that you want to decrypt : ")        
        decrypted = caesar_cipher(encrypted, shift, mode='decrypt')
        print(f"Encrypted: {encrypted}")
        print(f"Decrypted: {decrypted}")
    
    else:
        print("Incorrect option : ", option)


# Example usage
# text = "Hello, World!"
# shift_value = 3

# encrypted_text = caesar_cipher(text, shift_value)
# print("Encrypted:", encrypted_text)

# decrypted_text = caesar_cipher(encrypted_text, shift_value, mode='decrypt')
# print("Decrypted:", decrypted_text)
