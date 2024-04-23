document.querySelector("#submit").addEventListener("click", (e) => {
    e.preventDefault();
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {startDate: "", endDate: ""}, {}, function(res) {
            // this function is ran in the popup, with logs being sent to the extension console
        });
    }); 
    // TODO: add progress bar
    // TODO: add handler for generation errors
        // -> could not access patient profile, make sure you are in the patient profile
        // -> could not find patient visits
    window.close();
});