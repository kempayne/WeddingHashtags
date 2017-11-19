
// Define global variables
var h_classic;
var num_classic;         	// number of generic hashtag results
var h_custom; 				// array of custom hashtags				
var name_user;				// First name of the user
var sur_user;				// Last name of the user
var nick_user;				// Nickname of the user
var name_partner;			// First name of partner
var sur_partner;			// Last name of partner
var nick_partner;			// Nickname of partner
var year;					// year of wedding
var month;					// month of wedding
var day;					// day of wedding
var venue;					// venue or setting
var h_custom = [];			// initialize blank array to hold indicator if there's a rhyme match
							// used in GenCustomArray()

// *** FUNCTION TO CHECK IF INPUTS ARE BLANK ***
// *********************************************

function CheckInputs() {

	if (document.getElementById("name_user").value == "" ||
		document.getElementById("sur_user").value == "" ||
		document.getElementById("name_partner").value == "" ||
		document.getElementById("sur_partner").value == "") {
		
		alert("Please complete the form!");	
	}
	else {RunGenerator();}
}

// *** FUNCTION THAT RUNS AFTER INPUTS ARE DETERMINED TO BE NON-BLANK ***
// **********************************************************************

function RunGenerator() {


	// scroll down to the results
	window.location = "#results";
	
	//document.getElementById("results_heading").innerHTML = "test";

	// Define variables
	name_user = document.getElementById("name_user").value;
	sur_user = document.getElementById("sur_user").value;
	name_partner = document.getElementById("name_partner").value;
	sur_partner = document.getElementById("sur_partner").value;
	sur_plural = MakePlural(sur_partner);
	venue = document.getElementById("venue").value;
	
	// Define array of variables for custom hashtags
	var var_array = [
		//name_user,
		//sur_user,
		//name_partner,
		sur_partner
	];

	// Define generic hashtag array = h_generic[]
	h_classic = GenClassicArray();			// No inputs because the phrases are static

	//CountSyllables(var_array[0]);

	// update phrases array for each variable
	for (var i = 0; i < var_array.length; i++) {
	
		GenCustomArray(var_array[i]);
		//h_custom = GenRhymeArray(var_array[i]);		// for testing
	}
	
	// format output for use in HashtagOutput
	CustomArrayOutput();
						
	// update headings
	document.getElementById("results_heading").innerHTML = "Hashtag Results";
	document.getElementById("custom_heading").innerHTML = "Custom Hashtags";
	document.getElementById("classic_heading").innerHTML = "Classic Hashtags";
	
	
	// output hashtags to id="____hashtags"	
	document.getElementById("classic_hashtags").innerHTML = HashtagOutput(h_classic);
	document.getElementById("custom_hashtags").innerHTML = HashtagOutput(h_custom);
	
	// if no custom matches, output statement
	if (h_custom.length == 0) {
    	document.getElementById("custom_hashtags").innerHTML = "Sorry, no matches!";
    }
	


}


// *** FUNCTION TO OUTPUT HASHTAG RESULTS ***
// ******************************************

function HashtagOutput(arr) {		
    var output = "";
    var i;
    
    // converts hashtag array into a string that <br> after every hashtag
    for(i = 0; i < arr.length; i++) {
        output += "#" + arr[i] + "<br>";
    }
    
    return output;
}


// *** FUNCTION TO MAKE A NAME PLURAL ***
// **************************************

function MakePlural(name) {

	// "es" cases
	if (name.substring(name.length-1) == "x" || 
		name.substring(name.length-1) == "s" ||
		name.substring(name.length-1) == "z" ||
		name.substring(name.length-2) == "ch"||
		name.substring(name.length-2) == "sh") {
		
		name += "es";		
	
	}
	
	// regular case
	else {name += "s";}
	
	return name;	

}

// *** FUNCTION TO CAPITALIZE THE FIRST LETTER OF A NAME ***
// *********************************************************

function Capitalize(string) {

    return string.charAt(0).toUpperCase() + string.slice(1);

}

// *** FUNCTION TO GENERATE THE GENERIC HASHTAG ARRAY ***
// ******************************************************

function GenClassicArray() {

	// Capitalize first letter of variables
	name_user = Capitalize(name_user);
	sur_user = Capitalize(sur_user);
	name_partner = Capitalize(name_partner);
	sur_partner = Capitalize(sur_partner);
	sur_plural = Capitalize(sur_plural);
	venue = Capitalize(venue);

	var array = [
		"OnCloud" + sur_partner,
		"HappilyEver" + sur_partner,
		"ThatOne" + venue + "Wedding",
		"HereComeThe" + sur_plural,
		name_user + "And" + name_partner + "GetHitched",
		"MrAndMrs" + sur_partner,
		name_user + "And" + name_partner + "TieTheKnot",
		sur_partner + "PartyOfTwo"
	];
	
	return array;

}


// *** FUNCTION TO GENERATE THE CUSTOM HASHTAG ARRAY ***
// *****************************************************

function GenCustomArray(string) {			// string input, array return

	// Change string to lowercase for the rhyme search
	string = string.toLowerCase();

	// loop through phrases array, which contains the potential hashtag phrases
	for (var i = 0; i < phrases.length; i++) {
		
		// loop through each word in the phrase
		for (var j = 0; j < phrases[i].length; j++) {
			
			// check each word for rhyme/alliteration with string
			var rhyme = CheckPerfectRhyme(string, phrases[i][j]); 	// returns true if rhyme
			//alert (string + "\n" + phrases[i][j]+ "\n" + rhyme);
			//if (CheckSlantRhyme(string, phrases[i][j])) {rhyme = true;}		// true is slant rhyme match
			if (Alliteration(string, phrases[i][j])) {rhyme = true;}		// true if alliterative

			if (string == phrases[i][j]) {rhyme = true;}	// true if it's the same word
			if (Contains(excluded_words,phrases[i][j])) {rhyme = false;}	// no rhyme if preposition
			
			// action if there is a rhyme
			if (rhyme) {
				phrases[i][j] = string;				// replace word with string if it rhymes
				
				var duplicate = 0;			// duplicate indicator
				
				// check hashtag array to make sure phrase hasn't already been matched
				for (var k = 0; k < h_custom.length; k++) {
					if (h_custom[k] == i) {duplicate = 1;}}	
				
				// if no duplicate, update position array to indicate phrases that match
				if (duplicate == 0) {h_custom[h_custom.length] = i;}	
				break;		// if there is a match, exit to next word
							// prevents multiple matches in one phrase	
			}		
		}
	}
}


// *** FUNCTION TO FORMAT THE CUSTOM ARRAY *******
// ***********************************************

function CustomArrayOutput() {
	
	// loop through the phrases array to capitalize each word
	for (var i = 0; i < phrases.length; i++) {
		
		// loop through each word in the phrase
		for (var j = 0; j < phrases[i].length; j++) {
			phrases[i][j] = Capitalize(phrases[i][j]);	
		}
	}


	// format for output
	for (var i = 0; i < h_custom.length; i++) {
	
		// replace hashtag array (currently positions) with actual hashtag phrase
		h_custom[i] = phrases[h_custom[i]];	
		
		// convert each phrase to string to remove the commas, then convert back
		var	hashtag_string = h_custom[i].toString();				//convert array to string
		hashtag_string = hashtag_string.replace(/,/g, "");			// remove commas
		h_custom[i] = hashtag_string;
	}	
}
