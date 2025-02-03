#LSB Steganography in Images

from PIL import Image

def encode_image(image_path, message):
    img = Image.open(image_path).convert("RGB")
    pixels = img.load()
    width, height = img.size

    # Length-prefix: Store message length in the first few bytes
    message_length_bits = format(len(message), '032b')  # 32 bits for length
    message_bits = ''.join(format(ord(char), '08b') for char in message)
    all_bits = message_length_bits + message_bits  # Combine length and message

    index = 0
    for x in range(width):
        for y in range(height):
            if index < len(all_bits):
                r, g, b = pixels[x, y]
                r = (r & 254) | int(all_bits[index])
                index += 1
                if index < len(all_bits):
                    g = (g & 254) | int(all_bits[index])
                    index += 1
                if index < len(all_bits):
                    b = (b & 254) | int(all_bits[index])
                    index += 1
                pixels[x, y] = (r, g, b)
            else:
                break
        else:
            continue
        break

    img.save("stego_image.png")
    print("Image Encoded")



def decode_image(image_path):
    img = Image.open(image_path).convert("RGB")
    pixels = img.load()
    width, height = img.size
    binary_message = ""

    for x in range(width):
        for y in range(height):
            r, g, b = pixels[x, y]
            binary_message += str(r & 1)
            binary_message += str(g & 1)
            binary_message += str(b & 1)

    # Extract message length
    message_length_bits = binary_message[:32]
    message_length = int(message_length_bits, 2)

    # Extract the actual message (using the length)
    message_bits = binary_message[32: 32 + (message_length * 8)] # Corrected Slice
    decoded_message = ""
    for i in range(0, len(message_bits), 8):
        byte = message_bits[i:i+8]
        decoded_message += chr(int(byte, 2))

    return decoded_message

if __name__ == "__main__":
    m = input(''' Select one of these
    1. encode image
    2. decode image\n''')
    
    m=int(m)
    image_path = input("Enter the path to the image file: ")
    
    if(m==1):
        secret_msg = input("Enter the Secret Message: ")
        encode_image(image_path, secret_msg)
    
    elif(m==2):
        hidden_message = decode_image(image_path)
        print("Hidden Message : ", hidden_message)
    
    else:
        print("Incorrect option : ", m)
