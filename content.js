var clickedEl = null;

document.addEventListener("mousedown", function(event){
	clickedEl = null;
    //right click
    if(event.button == 2) { 
		if(event.target.tagName.toLowerCase() == "input" || event.target.tagName.toLowerCase() == "textarea") {
			clickedEl = event.target;
		}
    }	
}, true);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if(clickedEl != null && request != null) 
			$(clickedEl.tagName + "[name=\"" + clickedEl.name + "\"]").val(request.generate);
});