import os

def load_bad_words():
    try:
        # Go up two levels to find the root folder
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        file_path = os.path.join(base_dir, 'bad_words.txt')
        
        with open(file_path, 'r') as f:
            return [line.strip().lower() for line in f if line.strip()]
    except FileNotFoundError:
        print("Warning: bad_words.txt not found.")
        return []

BAD_WORDS = load_bad_words()

def contains_bad_words(text):
    if not text: return False
    text_lower = text.lower()
    for word in BAD_WORDS:
        if word in text_lower:
            return True
    return False