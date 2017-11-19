import sys
import string

# Run this as 'python parse_phrases.py' with 'phrases.txt' in the 'data' folder
# Outputs file 'phrases.js'

phrases = "var phrases = [\n"			# initialize blank phrase string
file_object = open('data/phrases.txt', 'rU')		# open file; rU reads lines with carriage returns
lines = file_object.readlines()		# read dictionary into lines variable

# Loop through each line (contains phrase)
for phrase in lines:
	phrase = phrase.strip()				# remove newline escape
	phrase = phrase.split(" ")		# convert phrase into array of words
	phrase_string = ""							# will output to file
	for word in phrase:				
		phrase_string += '"' + word + '",'			# add quotes around each word

	phrase_string = phrase_string[:-1]				# remove the last comma
	phrases += ('[' + phrase_string + '],\n')			# add the new phrase to the list of all phrases

phrases = phrases[:-2]		# remove the last comma and '\n' that was added in the for loop
phrases += '\n];'			# finish the array declaration

# write to file
f = open('phrases.js', 'w+')
f.write(phrases)




