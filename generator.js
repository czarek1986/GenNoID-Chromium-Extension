chrome.contextMenus.create({
	title: "Generuj NIP",
	type : "normal",
	contexts : ["editable"],
	onclick: function(info, tab) 
			{ 
				var nip = generateNIP(); 
				sendGeneratedValueToDomElem(tab, nip); 
			}
});


chrome.contextMenus.create({
	title: "Generuj PESEL - mężczyzna",
	type : "normal",
	contexts : ["editable"],
	onclick: function(info, tab) 
			{ 
				var pesel = generatePESEL('M'); 
				sendGeneratedValueToDomElem(tab, pesel); 
			}
});

chrome.contextMenus.create({
	title: "Generuj PESEL - kobieta",
	type : "normal",
	contexts : ["editable"],
	onclick: function(info, tab) 
			{ 
				var pesel = generatePESEL('F'); 
				sendGeneratedValueToDomElem(tab, pesel); 
			}
});

chrome.contextMenus.create({
	title: "Generuj REGON 9",
	type : "normal",
	contexts : ["editable"],
	onclick: function(info, tab) 
			{ 
				var regon = generateREGON(9); 
				sendGeneratedValueToDomElem(tab, regon); 
			}
});

chrome.contextMenus.create({
	title: "Generuj REGON 14",
	type : "normal",
	contexts : ["editable"],
	onclick: function(info, tab) 
			{ 
				var regon = generateREGON(14); 
				sendGeneratedValueToDomElem(tab, regon); 
			}
});

chrome.contextMenus.create({
	title: "Generuj numer dowodu",
	type : "normal",
	contexts : ["editable"],
	onclick: function(info, tab) 
			{ 
				var id = generatePLIDNumber(); 
				sendGeneratedValueToDomElem(tab, id); 
			}
});



function generateNIP(){
	var weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
	var numbers = [0,1,2,3,4,5,6,7,8,9];
	var nip = [], sum;
	
	do {
		numbers.shuffle();
		nip = numbers.slice(0,9);
		sum = 0;
		for(var i = 0; i < weights.length; i++){
				sum += nip[i] * weights[i];
		}                     
		nip[9] = (sum % 11);
	} while(nip[9] == 10)

	return nip.join("");
}


function generatePESEL(sex) {

	function getRandomDate() {
		var from = new Date(1800, 0, 1).getTime();
		var to = new Date(2299, 0, 1).getTime();
		return new Date(from + Math.random() * (to - from));
	}

	function getDigit()
	{
		return Math.floor(Math.random() * 10);
	}
	
	function getLetter(letters)
	{
		letters = letters || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		i = Math.floor(Math.random() * letters.length);
		return letters[i];
	}

    var weights = new Array (1, 3, 7, 9, 1, 3, 7, 9, 1, 3);

	var date = getRandomDate();
    var fullYear = date.getFullYear();
    var y = fullYear % 100;
    var m = date.getMonth()+1;
    var d = date.getDate();
    
    if (fullYear >= 1800 && fullYear <= 1899){
        m += 80;
    } else if (fullYear >= 2000 && fullYear <= 2099){
        m += 20;
    } else if (fullYear >= 2100 && fullYear <= 2199){
        m += 40;
    } else if (fullYear >= 2200 && fullYear <= 2299){
        m += 60;
    }
    
    var numbers = new Array (Math.floor(y/10), y%10, Math.floor(m/10), m%10, Math.floor(d/10), d%10);
    for (var i = numbers.length; i < weights.length - 1; i++) {
        numbers[i] = getDigit();
	}
	
    if (sex == 'M'){
        numbers[weights.length - 1] = getLetter('13579');
    } else if (sex == 'F'){
        numbers[weights.length - 1] = getLetter('02468');
    } else {
        numbers[weights.length - 1] = getDigit();
    }
        
    var controlNumber = 0;
    for (var i = 0; i < numbers.length; i++)
        controlNumber += weights[i] * numbers[i];
		
    controlNumber = (10 - (controlNumber % 10)) % 10;
                
    var pesel = '';
    for (var i=0; i < numbers.length; i++) {
        pesel += numbers[i].toString();
	}
    pesel += controlNumber.toString();  
	
	return pesel; 
}

function generateREGON(length) {
	if(length != 9 && length != 14)
		length = 9;
	
	var weights;
	if(length == 9) 
		weights = [8, 9, 2, 3, 4, 5, 6, 7];
	else
		weights = [2, 4, 8, 5, 0, 9, 7, 3, 6, 1, 2, 4, 8];
		
	var regon = [], sum = 0;
	
	for(var i = 0; i < weights.length; i++) {
		regon[i] = Math.floor(Math.random() * 10);
		sum += regon[i] * weights[i];
	}

	regon[weights.length + 1] = ((sum % 11 == 10) ? 0 : sum % 11);

	return regon.join("");
}

function generatePLIDNumber() {
	var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
	var shuffleLetters = letters.slice(0);
	var weights = [7, 3, 1, 0, 7, 3, 1, 7, 3];
	
	var idArr = [];
	var sum = 0;
	idArr[0] = 'A';
	sum += ((letters.indexOf(idArr[0]) + 10) * weights[0]);
	
	idArr[1] = shuffleLetters.shuffle()[0];
	sum += ((letters.indexOf(idArr[1]) + 10) * weights[1]);
	
	idArr[2] = shuffleLetters.shuffle()[0];
	sum += ((letters.indexOf(idArr[2]) + 10) * weights[2]);
	
	for(var i = 4; i <= 8; i++) {
		idArr[i] = Math.floor(Math.random() * 10);
		sum += idArr[i] * weights[i];
	}
	
	idArr[3] = sum % 10;
	return idArr.join("");	
}


function sendGeneratedValueToDomElem(tab, value) {
	chrome.tabs.sendMessage(tab.id, {"generate": value});
}


Array.prototype.shuffle = function() {
	var i = this.length, j, temp;
	if ( i == 0 ) return this;
	while ( --i ) {
		j = Math.floor( Math.random() * ( i + 1 ) );
		temp = this[i];
		this[i] = this[j];
		this[j] = temp;
	}
	return this;
}