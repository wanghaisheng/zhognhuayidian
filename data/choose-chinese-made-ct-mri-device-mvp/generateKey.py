import os
import random
import string

# Path to the key file
key_file_path = os.path.join(os.path.dirname(__file__), 'indexnow_key.txt')

# Function to generate a 32-character hexadecimal key
def generate_hex_key():
    return ''.join(random.choices(string.hexdigits.lower(), k=32))

# Check if the key file exists
if not os.path.exists(key_file_path):
    # If the file does not exist, generate a new key
    new_key = generate_hex_key()

    # Save the generated key to the file
    with open(key_file_path, 'w') as file:
        file.write(new_key)

    print(f'Generated and saved new key: {new_key}')
else:
    # If the file exists, read the key from the file
    with open(key_file_path, 'r') as file:
        saved_key = file.read()

    print(f'Using saved key: {saved_key}')
