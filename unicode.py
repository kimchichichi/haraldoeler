import unicodedata

your_text = "Neurologische Grundlagen und musikalische Beweglichkeit im Anfängerunterricht, SynapsePlus – mehr als nur 5 Töne! "

normalized_text = unicodedata.normalize('NFC', your_text)
print(normalized_text)
