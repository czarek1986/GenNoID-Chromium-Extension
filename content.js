var clickedEl = null;

document.addEventListener("mousedown", function(event){
	clickedEl = null;
    //right click
    if(event.button == 2) {
		var tempEl = $(event.target);
		if(tempEl.is("input:text, input[type=number], input[type=search], input:not([type]), textarea")) {
			clickedEl = $(event.target);
		}
    }	
}, true);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if(clickedEl != null && clickedEl.length != 0 && request != null) 
			clickedEl.val(request.generate);
});