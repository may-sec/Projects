import random
import string
import argparse

def generate_password(length=15, include_uppercase=True, include_lowercase=True, include_digits=True, include_symbols=True, must_contain=""):

    if not must_contain:  # Handle the case where must_contain is empty
        characters = ""
        if include_uppercase: characters += string.ascii_uppercase
        if include_lowercase: characters += string.ascii_lowercase
        if include_digits: characters += string.digits
        if include_symbols: characters += string.punctuation
        if not characters: return ""  # No character sets selected
        return ''.join(random.choice(characters) for _ in range(length))

    must_contain_len = len(must_contain)
    remaining_len = length - must_contain_len

    if remaining_len < 0:
        return None  # must_contain is longer than the total password length

    characters = ""
    if include_uppercase: characters += string.ascii_uppercase
    if include_lowercase: characters += string.ascii_lowercase
    if include_digits: characters += string.digits
    if include_symbols: characters += string.punctuation

    if not characters: return None  # No character sets selected

    max_retries = 1000

    for _ in range(max_retries):
        remaining_part = ''.join(random.choice(characters) for _ in range(remaining_len))

        # Apply substitutions and creative capitalization to must_contain
        modified_must_contain = ""
        for char in must_contain:
            if random.random() < 0.3:  # 30% chance for substitution
                if char.lower() in "aeiou":  # Examples: a -> @, e -> 3, i -> !, o -> 0, u -> (_)
                    substitutions = {"a": "@", "e": "3", "i": "!", "o": "0", "u": "_"}
                    modified_must_contain += substitutions.get(char.lower(), char)
                elif char.lower() in "ls": # Examples: l -> 1, s -> $
                    substitutions = {"l":"1", "s":"$"}
                    modified_must_contain += substitutions.get(char.lower(), char)
                elif char.lower() in "t": # Example: t -> 7
                    substitutions = {"t":"7"}
                    modified_must_contain += substitutions.get(char.lower(), char)
                else:
                  modified_must_contain += char # if no substitutions available, add the same character
            elif random.random() < 0.2:  # 20% chance for capitalization change
              if char.islower():
                modified_must_contain += char.upper()
              elif char.isupper():
                modified_must_contain += char.lower()
              else:
                modified_must_contain += char
            else:
                modified_must_contain += char

        insert_pos = random.randint(0, length - len(modified_must_contain)) # modified insert position
        password = remaining_part[:insert_pos] + modified_must_contain + remaining_part[insert_pos:]

        if len(password) == length:
            return password

    return None

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate a random password.")
    parser.add_argument("length", type=int, nargs='?', default=20, help="Length of the password (default: 20)") # length is optional now
    parser.add_argument("-c", "--chars", type=str, default="luds", choices=["l", "u", "d", "s", "lu", "ld", "ls", "ul", "ud", "us", "dl", "du", "ds", "sl", "su", "sd", "lud", "lus", "ldu", "lds", "lsu", "lsd", "uld", "uls", "udl", "uds", "usl", "usd", "dlu", "dls", "dul", "dus", "dsl", "dsu", "slu", "sld", "sul", "sud", "sdl", "sdu", "luds", "lusd", "ldus", "ldsu", "lsud", "lsdu", "ulds", "ulsd", "udls", "udsl", "usld", "usdl", "dlus", "dlsu", "duls", "dusl", "dslu", "dsul", "slud", "sldu", "suld", "sudl", "sdlu", "sdul"], help="Character types to include (l=lowercase, u=uppercase, d=digits, s=symbols)")
    parser.add_argument("-t", type=str, default="", help="String that must be included in the password")
    parser.add_argument("-n", type=int, default=20, help="Number of password suggestions to generate (default: 20)")

    args = parser.parse_args()

    # Set the character flags based on the -c argument
    include_lowercase = "l" in args.chars
    include_uppercase = "u" in args.chars
    include_digits = "d" in args.chars
    include_symbols = "s" in args.chars

    try:
        if args.length <= len(args.t) and args.t: # check if the length is greater than must contain string
            print("Error: Length should be greater than the length of must contain string")
            exit(1)
        for _ in range(args.n):
            password = generate_password(args.length, include_uppercase, include_lowercase, include_digits, include_symbols, args.t)

            if password:
                print(password)
            else:
                print("Could not generate a password meeting the criteria.")

    except AttributeError:
        parser.print_help()
        exit(1)
    except TypeError:
        parser.print_help()
        exit(1)
    except Exception as e: # catch all other type of exceptions
        print(f"An error occurred: {e}")
        exit(1)

# Example usage (save as pass.py and run from the terminal):

# 1. Generate a 15-character password with all character types (default):
# python pass.py

# 2. Generate a 20-character password with lowercase and digits only:
# python pass.py 20 -c ld

# 3. Generate 12-character passwords with uppercase and symbols, containing "secret":
# python pass.py 12 -c us -t "secret" -n 5  # Generates 5 suggestions

# 4. Generate 18-character passwords with all character types except symbols:
# python pass.py 18 -c lud -n 3

# 5. Generate 15-character passwords containing "P@$$wOrd" (default length):
# python pass.py -t "P@$$wOrd" -n 10

# 6. Generate 10 passwords with length 20, containing "python", lowercase and uppercase only:
# python pass.py 20 -c lu -t "python" -n 10

# 7.  Generate a password with length 8, containing "short", lowercase and digits only:
# python pass.py 8 -c ld -t "short"

# 8. Generate a password with length 16, containing "Complex!", all character types:
# python pass.py 16 -c luds -t "Complex!"

# 9. If you provide a must contain string longer than the provided length:
# python pass.py 10 -t "ThisIsAVeryLongString"
