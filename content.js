class Button {
    constructor(label = ""){
        this.id = randomId();
        this.classList = [];
        this.attributes = {};
        this.label = label;
    }
    addClass(array = []){
        if(Array.isArray(array)) for(const str of array) this.classList.push(str);
        else this.classList.push(array.toString());
        return this;
    }
    addAttribute(object = {}){
        if(Array.isArray(object)) console.log(`Warning: addAttribute() method on Button expects parameter type of object but was passed type of array instead. Attributes were not be applied to Button object:`, this);
        if(typeof object === "object") Object.assign(this.attributes, object);
        if(typeof object === "string") Object.assign(this.attributes, { [object]: "" });
        else console.log(`Warning: addAttribute() method on Button expects parameter type of object but was passed type of ${ object } instead. Attributes were not be applied to Button object:`, this);
        return this;
    }
    appendTo(parent = document.body){
        let button = this.create();
        if(parent === document.body) parent.appendChild(button);
        else document.querySelector(`#${parent.id}`).appendChild(button);
        return this;
    }
    create(){
        // create the button
        let button = new Child("button")
            .setId(this.id)
            .addClass(this.classList)
            .appendTo(document.body);
        // add children button
        new Child("div")
            .addClass(["button__state"])
            .appendTo(button);
        new Child("span")
            .addClass(["button__label"])
            .setInnerText(this.label)
            .appendTo(button);
        return document.querySelector(`#${button.id}`);
    }
    getChildren(){
        return document.querySelector(`#${this.id}`).children;
    }
    getNode(){
        return document.querySelector(`#${this.id}`);
    }
    getParent(){
        return document.querySelector(`#${this.id}`).parentElement;
    }
    setId(str=""){
        this.id = str;
        return this;
    }
    setLabel(str=""){
        this.label = str;
        return this;
    }
    update(){
        let outdated = document.querySelector(`#${this.id}`);
        let updated = this.create();
        outdated.replaceWith(updated);
        return this;
    }
}
class Child {
    constructor(tag = "div"){
        this.tag = tag;
        this.id = randomId();
        this.classList = [];
        this.attributes = {};
        this.innerText = "";
        return this;
    }
    addAttribute(object = {}){
        if(Array.isArray(object)) console.log(`Warning: addAttribute() method on Child expects parameter type of object but was passed type of array instead. Attributes were not be applied to Child object:`, this);
        if(typeof object === "object") Object.assign(this.attributes, object);
        if(typeof object === "string") Object.assign(this.attributes, { [object]: "" });
        else console.log(`Warning: addAttribute() method on Child expects parameter type of object but was passed type of ${ object } instead. Attributes were not be applied to Child object:`, this);
        return this;
    }
    addClass(array = []){
        if(Array.isArray(array)) for(const str of array) this.classList.push(str);
        else this.classList.push(array.toString());
        return this;
    }
    appendTo(parent = document.body){
        let child = this.create();
        if(parent === document.body) parent.append(child);
        else document.querySelector(`#${parent.id}`).append(child);
        return this;
    }
    create(){
        let child = document.createElement(this.tag);
        child.id = this.id;
        for(const str of this.classList) child.classList.add(str);
        for(const [key, val] in Object.entries(this.attributes)) child.setAttribute(key, val);
        if(typeof this.innerText === "string"){
            let text = document.createTextNode(this.innerText);
            child.appendChild(text);
        }
        return child;
    }
    getChildren(){
        return document.querySelector(`#${this.id}`).children;
    }
    getNode(){
        return document.querySelector(`#${this.id}`);
    }
    getParent(){
        return document.querySelector(`#${this.id}`).parentElement;
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
        let updated = this.create();
        outdated.replaceWith(updated);
        return this;
    }
}
class Client {
    constructor(){
        this.oauth = localStorage.getItem("prod:SugarCRM:AuthAccessToken")
            //! for whatever reason, quotations marks must be removed
            .toString().split(`"`)[1];
    }
    getCurrentResource(){
        return window.location.href.split("#")[1].split("/")[0].toString();
    }
}
class Patient {
    constructor(){
        this.id = this.getPatientId(window.location.href),
        this.fname = this.#nameArray[0],
        this.lname = this.#nameArray[1]
    }
    #nameArray = this.getNameFromAXIS()
    getNameFromAXIS(){
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
    getPatientId(url){
        let active = {
            resource: url.split("#")[1].split("/")[0].toString(),
            isProfile: url.split("#")[1].split("/")[0].toString() === "Contacts" ? true : false,
            patientId: url.split("/")[4].toString()
        };
        if(active.isProfile) return active.patientId;
        else throw new Error(`Expected location of https://axis.thejoint.com/#Contacts. Location is set to ${url} instead.`);
    }
}

// listen for user to click the 
chrome.runtime.onMessage.addListener(function(message, sender, response){
    // access the source of the message
    // it could come from other places (?)
    switch(message.source){
        case "action":
        default:
            // build the extension dialog
            // only if it isn't already part of the DOM
            // otherwise, remove the extension dialog
            if(document.querySelector("#extension-dialog") === null) buildExtensionDialog();
            else document.querySelector("#extension-dialog").remove();
            break;
    }
});

function buildExtensionDialog(){
    // create the dialog container
    let dialog = new Child("dialog")
        .setId("extension-dialog")
        .addClass(["axis-extension-surface"])
        .appendTo(document.body);
    // create a clear label for the dialog
    // the user should know they are interfacing with an extension
    let modalLabel = new Child("span")
        .addClass(["modal-label"])
        .setInnerText("AXIS Extension")
        .appendTo(dialog);
    // create a button to close the dialog
    let closeButton = new Button()
        .addClass(["button", "close-modal"])
        .appendTo(dialog);
    // close the dialog when the user clicks the close button
    closeButton.getNode().addEventListener("click", function (e) {
        e.preventDefault();
        dialog.getNode().remove();
    });   
    // there could be multiple extension features
    // features are dependent on the current resource
    switch(new Client().getCurrentResource()){
        case "Contacts":
            let superbillButton = new Button("Print Superbill")
                .addClass(["button", "surface-button"])
                .appendTo(dialog);
            superbillButton.getNode().addEventListener("click", function (e){
                e.preventDefault();
                // hide the dialog
                dialog.getNode().remove();
                // build the sheet
                let sheet = new Child("div")
                    .setId(["extension-sheet"])
                    .addClass(["axis-extension-surface"])
                    .appendTo(document.body);
                // create a clear label for the sheet
                // the user should know they are interfacing with an extension
                modalLabel.appendTo(sheet);
                // append the superbill
                generateSuperbill();
            });
            break;
        default:
            // no features are available for the current page
            // TODO: tell the user
            break;
    }
}

async function getClinicAddress(clinic = String){
    try{
        // format clinic name for url query
        let urlQuery = "";
        clinic.split(" ").forEach(word => { urlQuery += `${word}%20`; });
        let response = await fetch(new Request(`https://axis.thejoint.com/rest/v11_20/TJ_Clinics?erased_fields=true&view=list&fields=following%2Cmy_favorite&max_num=2&order_by=date_modified%3Adesc&filter%5B0%5D%5Bname%5D%5B%24starts%5D=${urlQuery}`), {headers: { "Oauth-Token": new Client().oauth }});
        if(response.ok) {
            clinic = await response.json();
            if(clinic.records.length > 1) throw new Error(`Function getClinicAddress() returned multiple (${clinic.records.length}) results. 
                Please type the clinic name exactly as it is listed in clinic directory.`);
            else return clinic.records[0];
        } else {
            throw new Error(`Server response at getClinicAddress() returned "Status: ${response.status}"`);
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function generateSuperbill(startDate = Date, endDate = Date, ){
    console.log(readVisits(50));
}

async function readTransactionsFrom(year = Number){
    try{
        // validate year parameter
        let isValid = false, validYears = [], currentYear = new Date().getFullYear();
        for(let i = 1999; i <= currentYear; ++i) validYears.push(i);
        if(typeof year === "number" && validYears.includes(year)) { isValid = true }
        else {
            throw new Error(`${typeof year != "number" ?
            `Function validateYear() requires parameter type of number. Received type of ${typeof year} instead.`:
            `Value of year parameter at function validateYear() is invalid.`}`);
        }
        // request transaction history from year
        let response = await fetch(new Request(`https://axis.thejoint.com/rest/v11_20/Contacts/${ getContactId(window.location.href) }/custom_link/contacts_transactions_refunds?filter%5B0%5D%5Bdate_entered%5D%5B%24dateBetween%5D%5B%5D=01-01-${ year - 1 }&filter%5B0%5D%5Bdate_entered%5D%5B%24dateBetween%5D%5B%5D=01-01-${ year }`), { headers: {"Oauth-Token": new Client().oauth} });
        // process and return response
        if(response.ok) return await response.json() 
        else throw new Error(`Server response at readTransactionsFrom() returned "Status: ${response.status}"`);
    } catch (error){
        console.log(error);
        return error;
    }
}

function randomId(){
    let letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
    let leadingLetters = "";
    for(var i = 0; i < 4; ++i) leadingLetters += letters[Math.floor(Math.random() * 26)];
    let cryptoString = window.crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
    return leadingLetters + cryptoString;
}

async function readVisits(quantity = Number){
    try{
        const client = new Client();
        const patient = new Patient();
        // validate quantity parameter
        if(typeof quantity != "number") 
            throw new Error(`Function readRecentVisits() requires parameter type of number. Received type of ${typeof quantity} instead.`);
        // request quantity of visit records
        let response = await fetch(new Request(`https://axis.thejoint.com/rest/v11_20/Contacts/${ patient.id }/link/contacts_tj_visits_1?erased_fields=true&view=subpanel-for-contacts-contacts_tj_visits_1&fields=date_entered%2Cstatus%2Chas_carecard%2Cmy_favorite&max_num=${quantity}&order_by=date_entered%3Adesc&filter%5B0%5D%5Bstatus%5D=Completed`), { headers: {"Oauth-Token": client.oauth} });
        // get visit data for each visit
        let visits = await response.json();
        if(response.ok) {
            let visitArray = visits.records
            if(Array.isArray(visitArray)){
                let i = 0;
                for(let visit of visitArray){
                    if(i > quantity) throw new Error(``)
                    let res = await fetch(new Request(`https://axis.thejoint.com/rest/v11_20/TJ_Visits/${ visit.id }?erased_fields=true&view=record&fields=date_entered%2Cstatus%2Chas_carecard&viewed=1`), { headers: {"Oauth-Token": client.oauth} });
                    visitArray.splice(++i, 1, await res.json());
                }
            } else { throw new Error(`Expected server response type of array but received type of ${typeof visits} instead.`); }
        } else { throw new Error(`Server response at readVisits() returned "Status: ${response.status}"`); }
        return visits;
    } catch (error){
        console.log(error);
        return error;
    }
}