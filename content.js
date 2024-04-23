class Child {
    constructor(tag="div"){
        this.tag = tag;
        this.id = window.crypto.getRandomValues(new Uint32Array(1)[0].toString(16))
        this.classList = []
        return this;
    }
    addClass(array=[]){
        if(Array.isArray(array)) for(const str in array) this.classList.push(str).toString();
        else this.classList.push(array.toString());
        return this;
    }
    appendTo(parent=document.body){
        let child = this.#create();
        parent.append(child);
        return this;
    }
    #create(){
        let child = document.createElement(this.tag);
        child.id = this.id;
        for(const str in this.classList) child.classList.add(str);
        if(typeof this.innerText === "string"){
            let text = document.createTextNode(this.innerText);
            child.appendChild(text);
        }
        return child;
    }
    setId(str=""){
        this.id = str;
        return this;
    }
    setInnerText(str=""){
        this.innerText = str;
        return this;
    }
    update(){
        let outdated = document.querySelector(`#${this.id}`);
        let updated = this.#create();
        outdated.replaceWith(updated);
        return this;
    }
}

// list for user input from extension popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // let req = JSON.parse(request);
    let visits = getVisits();
    // TODO: sendResponse({data: data, success: true});
});

function isProfileOf(firstName, lastName){
    // check if url includes the "Contacts" anchor
    const anchor = getAnchor(window.location.href);
    if(anchor === "Contacts"){
        // if yes, get the patient's first and last name from h1
        let patient = getNameFromAXIS();
    }
    // does the current profile and desired patient match?
    if(patient.firstName === firstName && patient.lastName === lastName){
        // if yes, return true
        return true;
    } else {
        // TODO: send an error to the popup
        return false;
    }
}

function getAnchor(url){
    return url.split("#")[1].split("/")[0].toString();
}

function getContactId(url){
    return url.split("/")[2].toString();
}

function getNameFromAXIS(){
    let name = document.querySelector(`h1 .record-cell[data-type=fullname] .table-cell-wrapper 
            .index span .record-cell[data-type=fullname] .ellipsis_inline`);
    let nameArray = name.innerText.split(" ");

    // remove any shenanigans
    nameArray.forEach((name, i) => {
        if(name.toLowerCase() === "see notes" || name.charAt(0) === `"`) nameArray.splice(i, 1);
    });

    if(nameArray.length > 2){
        // consolidate multiple last names
        // TODO: add an option to change how multiple last names are dealt with
        let lastNames = "";
        for(let i = 0; i < nameArray.length; ++i){
            if(i === 1) lastNames += `${nameArray[i]}`;
            // don't forget spacing
            if(i > 1) lastNames += ` ${nameArray[i]}`;
        }
        // update nameArray to reflect changes
        nameArray = [nameArray[0], lastNames];
    }

    // return name as object
    return {firstName: nameArray[0], lastName: nameArray[1]};
}

function getVisits(patient = {}, query={}){
    // make sure you are getting the correct patient information
    // TODO: don't let this default to "true" in production
    if(isProfileOf() || true){
        // if it's the right patient, find the transaction history and visit history in their profile
        let tables = document.querySelectorAll(`.main-content .subpanels-layout .subpanel .flex-list-view 
                .flex-list-view-container .flex-list-view-content table`);
    }
}

function subpanelIndex(subpanel=""){
    let headers = document.querySelectorAll("h4");
    headers.forEach((header, i) => { 
        if(header.innerText === subpanel.toString()) return i;
    });
    throw new Error("Subpanel does not exist.");
}

function parseTable(element){
    // it will be helpful to store column headers and rows separately
    let rows = [];
    let headers = [];
    // populate headers array with data from AXIS
    element.querySelectorAll(`thead tr th .sortable-row-header-container .sortable-row-header-column-name`).forEach(element => {
        headers.push(element.innerText());
    });
    // populate rows array with data from AXIS
    element.querySelectorAll(`tbody tr`).forEach(tr => {
        let row = [];
        // get the data from each row
        tr.querySelectorAll(`td span .ellipsis_inline`).forEach(td => {
            row.push(td.innerText());
        });
        // add each row to the rows array
        rows.push(row);
    });
    // create an array of row objects where key = th and value = td
    let data = [];
    rows.forEach(row => {
        let i = 0, obj = {};
        for(const td in row){
            obj[headers[i++]] = td;
        }
        data.push(obj);
    });
    return data;
}

async function readTransactionsFrom(contactURL="", startDate=Date, endDate=Date){
    let req = new Request(`https://axis.thejoint.com/rest/v11_20/Contacts/${getContactId(contactURL)}/custom_link/contacts_transactions_refunds?filter%5B0%5D%5Bdate_entered%5D%5B%24dateBetween%5D%5B%5D=${startDate}&filter%5B0%5D%5Bdate_entered%5D%5B%24dateBetween%5D%5B%5D=${endDate}`);
    try{
        await fetch(req);
    } catch (err){
        console.log(err);
        return err;
    }
    return res;
}

