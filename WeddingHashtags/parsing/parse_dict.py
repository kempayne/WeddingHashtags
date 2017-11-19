import sys
import string

# Run this as 'python parse_dict.py'; outputs file 'dictionary.js'

all_words = list()		# initialize empty list of words
all_phones = list()		# initialize empty list of phrases
file_object = open('data/cmudict-0.7b.txt')
lines = file_object.readlines()		# read dictionary into lines variable
i = 0 		# count variable 
first = 127 # first relevant line to output

# Loop through each line (contains one word and phone)
for line in lines:
	line = line.strip()						# remove blanks at beginning and end of word
	i += 1									
	if line.startswith(';'): continue		# skip if intro lines
	if i < first: continue					# skip if irrelevant at beginning
	word, phones = line.split("  ")			# split line into word and phone, which are separated by double space
	phones = phones.replace(" ", "-")
	word = word.replace("(1)","")			# eliminate (1) which indicates second pronunciation
	word = word.replace("(2)","")
	word = word.replace("(3)","")

	all_words.append(word.lower())			# add the new word to the list
	all_phones.append(phones.lower())

# Compressed encoding: strip out prefix in common with the previous
# entry, replace it with its length.
def append(xs, prev, x):
    if not xs:
        xs.append(x)
    else:
        xs.append(prefix_encode(prev, x))

def prefix_encode(prev, s):
    n = min(9, common_prefix_length(prev, s))
    return s if n < 2 else '%d%s' % (n, s[n:])

def common_prefix_length(s, t):
    n = 0
    for si, ti in zip(s, t):
        if si != ti: break
        n += 1
    return n

words, phones = [], []
wprev, pprev = None, None
for w in all_words:
    append(words, wprev, w);  wprev = w

for p in all_phones:    
    append(phones, pprev, p); pprev = p

# convert array to string, separated by space
words = ' '.join(words)		
phones = ' '.join(phones)

# format in JSON
words = 'words:"' + words + '"'		
phones = 'phones:"' + phones + '"'
dictionary = "var dictionary = {\n" + words + ",\n" + phones + "\n};"

# write to file
f = open('dictionary.js', 'w+')
f.write(dictionary)




	# syllable_count = phones.count('0') + phones.count('1') + phones.count('2')
	#if phones.startswith('S ') and syllable_count == 1:
