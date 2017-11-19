'use strict';

// The pronouncing dictionary, encoded in dictionary.words and
// dictionary.phones. We need to decompress it before we can use it.
// The result is two parallel arrays, of words and corresponding phone
// sequences. A phone denotes a basic speech sound.


// Assign arrays for the dictionary words and matching phonetic phrases
// each element of the array in allPhones currently starts with a comma
var all_words  = decodeSequence(dictionary.words);
var all_phones = decodeSequence(dictionary.phones);

var excluded_words = [
	"a",
	"as",
	"at",
	"by",
	"for",
	"from",
	"in",
	"like",
	"of",
	"on",
	"the",
	"to",
	"than",
	"with",
	"or",
	"and",
	"my",
	"no",
	"is"
];

// replace hyphenated phonetic spelling with an array of syllables
// This makes allPhones[] an array of arrays
(function() {
    for (var i = 0; i < all_phones.length; ++i)
        all_phones[i] = all_phones[i].split('-');
})();




/////////////////////////////////////
///// ************************* /////
///// *** F U N C T I O N S *** /////
///// ************************* /////
/////////////////////////////////////

// ************************************************
// *** FUNCTIONS TO PULL DICTIONARY INTO ARRAYS ***
// ************************************************

// Decompress a string into an array
function decodeSequence(s) {
    var strings = s.split(' ');		// split string into an array
    for (var i = 1; i < strings.length; ++i) {		// decode
    	strings[i] = decode(strings[i-1], strings[i]);
    	//if (Contains(prepositions, strings[i]) {alert(strings[i]);}
    }
    return strings;
}

// Expand a string s using the common prefix from the previous string.
function decode(prev, s) {
    var n = parseInt(s[0]);
    return isNaN(n) ? s : prev.substr(0, n) + s.substr(1);
}

// ***************************************
// *** FUNCTION TO CHECK PERFECT RHYME ***
// ***************************************

function CheckPerfectRhyme(word1, word2) {
	
	// assign indexes based on the word matching Phone index
	// if more than one pronunciation, will be an array
	var matching_phone1 = MatchingPhone(word1);
	var matching_phone2 = MatchingPhone(word2);

	// loop through array of positions; only one if one pronunciation
	for (var a = 0; a < matching_phone1.length; a++) {
	for (var b = 0; b < matching_phone2.length; b++) {
		
		// assign index as position 
		var i = matching_phone1[a];
		var j = matching_phone2[b];

		// assign corresponding phones
		var phone1 = all_phones[i];	
		var phone2 = all_phones[j];

		// Determine the position of the primary stressed phone
		var stress_pos1 = FindStress(phone1);
		var stress_pos2 = FindStress(phone2);
	
		// Determine the length of the rest of the word
		var rhyme_length1 = phone1.length - stress_pos1;	// number of elements in the string 
		var rhyme_length2 = phone2.length - stress_pos2; 	// after and including the stress element
		var min_length = Math.min(rhyme_length1, rhyme_length2);
	
		var rhyme = true;		// initialize rhyme indicator at true

		if ((stress_pos1 == -1) || (stress_pos2 == -1)) {rhyme = false;}	// if no stress in one of the words, no rhyme
		else {
		for (var k = 0; k < min_length; k++) {

			if (phone1[stress_pos1 + k] != phone2[stress_pos2 + k]) {
				rhyme = false;			// if any of the remaining phones don't match, 
				break;					// change rhyme to false and break
	
			}

		}}		// end else and for loop
		
		// if one and only one of the words is one syllable, no rhyme
		if (	(CountSyllables(word1) != CountSyllables(word2)) &&
				(CountSyllables(word1) == 1 || 
				 CountSyllables(word2) == 1) ) {rhyme = false;}
			
		if (rhyme == true) {break;}		// if rhyme is true, then break loop
										// this is for multiple pronunciations
										// such that if one rhyme is found, it doesn't
										// test the remaining pronunciations	

		
	}		// end first for loop
	
	if (rhyme == true) {break;}		// if rhyme is true, then break loop; same as above
	
	}		// end second for loops

	return rhyme;						
}


// *************************************
// *** FUNCTION TO CHECK SLANT RHYME ***
// *************************************

function CheckSlantRhyme(word1, word2) {

	// assign index to i and j based on the word index
	var i = MatchingPhone(word1);
	var j = MatchingPhone(word2);
	
	// assign corresponding phones
	var phone1 = all_phones[i];	
	var phone2 = all_phones[j];

	// Determine the position of the primary stressed phone
	var stress_pos1 = FindStress(phone1);
	var stress_pos2 = FindStress(phone2);

}


// **************************************
// *** FUNCTION TO CHECK ALLITERATION ***
// **************************************

function Alliteration(word1, word2) {

	// assign indexes based on the word matching Phone index
	// if more than one pronunciation, will be an array
	var matching_phone1 = MatchingPhone(word1);
	var matching_phone2 = MatchingPhone(word2);

	// loop through array of positions; only one if one pronunciation
	for (var a = 0; a < matching_phone1.length; a++) {
	for (var b = 0; b < matching_phone2.length; b++) {
		
		// assign index as position 
		var i = matching_phone1[a];
		var j = matching_phone2[b];
	
		// assign allit = true if the first and second phonemes matches
		var allit = (all_phones[i][0] == all_phones[j][0] &&
			all_phones[i][1] == all_phones[j][1]);

		// if one and only one of the words is one syllable, no alliteration
		if (	(CountSyllables(word1) != CountSyllables(word2)) &&
				(CountSyllables(word1) == 1 || 
				 CountSyllables(word2) == 1) ) {allit = false;}

		if (allit == true) {break;}		// if allit is true, then break loop;
										// this is for multiple pronunciations
										// such that if one rhyme is found, it doesn't
										// test the remaining pronunciations	
	
	}		// end first for loop
	
	if (allit == true) {break;}		// if rhyme is true, then break loop; same as above
	
	}		// end second for loops
	return allit;
}


// **********************************************
// *** FUNCTION TO FIND CELEBRITY COUPLE NAME ***
// **********************************************

function CelebCouple(word1, word2) {

	// assign index to i and j based on the array index
	var i = MatchingPhone(word1);
	var j = MatchingPhone(word2);
	
		

}



// ****************************************************
// *** FUNCTION TO FIND THE PRIMARY STRESS POSITION ***
// ****************************************************

function FindStress(phone) {		// takes an array as input

	var stress_pos = -1;	// initialize at -1; if no stress, then remains -1

	for (var i = 0; i < phone.length; i++) {		// cycle each element
	
		if (phone[i].substring(phone[i].length - 1) == "1") {  // check if last char is 1
		
			stress_pos = i;			// assign stress_pos
			break;
		
		}
	}
	return stress_pos;
}

// ******************************************************
// *** FUNCTION TO GENERATE AN ARRAY OF RHYMING WORDS ***
// ******************************************************

function GenRhymeArray(string) {

	var rhymes = [];					// array of rhyming words
	// generate array of rhyming words by checking each phone individually
	for (var j = 0; j < all_words.length; j++) {
		var rhyme = CheckPerfectRhyme(string, all_words[j]); // var is true if rhymes
		if (string == all_words[j]) {rhyme = false;} 		// no rhyme if its the same word
		
		// if rhyme, add new element to rhymes[] with the corresponding word
		if (rhyme) {rhymes[rhymes.length] = all_words[j];} 
	}

	return rhymes;	
}

// **********************************************
// *** FUNCTION TO FIND CORRESPONDING PHONEME ***
// **********************************************

function MatchingPhone(string) {

	var i = [];
	
	for (var j = 0; j < all_words.length; j++) {
	
		if (string == all_words[j]) {
			i[i.length] = j;}
		
	}
	
	if (i == "") {
		alert(string + " is not in dictionary! Please try an alternate spelling");
		throw new FatalError();	// trigger error
	}

	return i;	// returns array of positions; only one position if one pronunciation
}


// ********************************************
// *** FUNCTION TO CHECK IF OBJ IS IN ARRAY ***
// ********************************************

function Contains(arr, obj) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === obj) {
            return true;
        }
    }
    return false;
}


// *************
// *** ERROR ***
// *************

// creates a new exception type:
function FatalError(){ Error.apply(this, arguments); this.name = "FatalError"; }
FatalError.prototype = Object.create(Error.prototype);


// ***********************
// *** COUNT SYLLABLES ***
// ***********************

function CountSyllables(string) {
	
	// assign index based on the word matching Phone index
	// if more than one pronunciation, will be an array
	var matching_phone = MatchingPhone(string);

	// loop through array of pronunciations
	for (var a = 0; a < matching_phone.length; a++) {

		// assign index as position
		var i = matching_phone[a];
		
		var count = 0;						// init a count variable
		
		// loop through each term of phone, for each pronunciation; if last char is number, it's a syllable	
		for (var j = 0; j < all_phones[i].length; j++) {

		
			// test for number of syllables
			if (all_phones[i][j].substring(all_phones[i][j].length - 1) == "0" ||
				all_phones[i][j].substring(all_phones[i][j].length - 1) == "1" ||
				all_phones[i][j].substring(all_phones[i][j].length - 1) == "2") {
					
				count += 1;		// if stressed, add syllable
		
			}
		}
	}
	
	// if no stress, define as one syllable
	if (count == 0) {count = 1;}
	return count;
}

