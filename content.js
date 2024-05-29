const present = new Date()
const yearStart = new Date(present.getFullYear(), 0, 1);

class Button {
    constructor(label = ""){
        this.id = randomId();
        this.classList = ["button"];
        this.attributes = {};
        this.label = label;
    }
    addClass(array = []){
        if(Array.isArray(array)) for(const str of array) this.classList.push(str);
        else this.classList.push(array.toString());
        return this;
    }
    addAttribute(object = {}){
        switch(typeof object) {
            case "object":
                if(Array.isArray(object)) console.log(`Warning: addAttribute() method on Button expects parameter type of object but was passed type of array instead. Attributes were not be applied to Button object:`, this);
                else Object.assign(this.attributes, object);
                break;
            case "string":
                Object.assign(this.attributes, { [object]: "" });
                break;
            default:
                console.log(`Warning: addAttribute() method on Button expects parameter type of object but was passed type of ${ object } instead. Attributes were not be applied to Button object:`, this);
                break;
        }
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
        switch(typeof object) {
            case "object":
                if(Array.isArray(object)) console.log(`Warning: addAttribute() method on Child expects parameter type of object but was passed type of array instead. Attributes were not be applied to Child object:`, this);
                else Object.assign(this.attributes, object);
                break;
            case "string":
                Object.assign(this.attributes, { [object]: "" });
                break;
            default:
                console.log(`Warning: addAttribute() method on Child expects parameter type of object but was passed type of ${ object } instead. Attributes were not be applied to Child object:`, this);
                break;
        }
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
        for(const [key, val] of Object.entries(this.attributes)) child.setAttribute(key, val);
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
    getCurrentClinic(){
        if(this.getCurrentResource() === "tjc_backoffice"){
            return document.querySelector("#currentClinic").innerText;
        } else {
            return document.querySelector(".header-current-clinic").innerText;
        }
    }
    getCurrentResource(){
        let resource = window.location.href.split("/")[3];
        // remove leading pound (#) for front office resources 
        if(resource.split("#").length === 1) return resource;
        else return resource.split("#")[1].toString();
    }
}

class Textfield {
    constructor(label = "", isParagraph = false){
        this.id = randomId();
        this.name = label;
        this.isParagraph = isParagraph;
        this.classList = ["text-field"];
        this.attributes = {type: "text", name: label};
        this.label = label;
        this.hint = false;
    }
    addClass(array = []){
        if(Array.isArray(array)) for(const str of array) this.classList.push(str);
        else this.classList.push(array.toString());
        return this;
    }
    addAttribute(object = {}){
        switch(typeof object) {
            case "object":
                if(Array.isArray(object)) console.log(`Warning: addAttribute() method on Textfield expects parameter type of object but was passed type of array instead. Attributes were not be applied to Textfield object:`, this);
                else Object.assign(this.attributes, object);
                break;
            case "string":
                Object.assign(this.attributes, { [object]: "" });
                break;
            default:
                console.log(`Warning: addAttribute() method on Textfield expects parameter type of object but was passed type of ${ object } instead. Attributes were not be applied to Textfield object:`, this);
                break;
        }
        return this;
    }
    appendTo(parent = document.body){
        let textfield = this.create();
        if(parent === document.body) parent.appendChild(textfield);
        else document.querySelector(`#${parent.id}`).appendChild(textfield);
        return this;
    }
    create(){
        // create the textfield
        let textfieldContainer = new Child("div")
            .setId(this.id)
            .addClass(this.classList)
            .appendTo(document.body);
        // add label and input to textfield
        new Child("label")
            .addAttribute({for: this.id})
            .addClass(["text-field__label"])
            .setInnerText(this.label)
            .appendTo(textfieldContainer);
        // input can also be a textarea for paragraph responses
        let input = this.isParagraph ? new Child("textarea"): new Child("input");
            input.addAttribute(this.attributes)
                .addClass(["text-field__input"])
                .appendTo(textfieldContainer);
        // add a hint element if there is a hint
        if(this.hint) new Child("span")
            .addClass(["text-field__hint"])
            .setInnerText(this.hint)
            .appendTo(textfieldContainer);
        return document.querySelector(`#${textfieldContainer.id}`);
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
    setHint(str=""){
        this.hint = str;
        return this;  
    }
    setId(str=""){
        this.id = str;
        return this;
    }
    setName(str=""){
        this.name = str;
        Object.assign(this.attributes, { name: str });
        return this;
    }
    setType(str=""){
        const validTypes = ["text", "search", "email", "tel", "password", "date"];
        if(validTypes.includes(str)) { 
            this.type = str; 
            Object.assign(this.attributes, { type: str });
        }
        else { 
            this.type = "text"; 
            console.log(`Warning: Input type "${str}" is invalid.`)
        }
        return this;
    }
    update(){
        let outdated = document.querySelector(`#${this.id}`);
        let updated = this.create();
        outdated.replaceWith(updated);
        return this;
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
    new Child("span")
        .addClass(["modal-label"])
        .setInnerText("AXIS Extension")
        .appendTo(dialog);
    // create a button to close the dialog
    new Button()
        .addClass(["close-modal"])
        .appendTo(dialog)
        .getNode().addEventListener("click", async function (e) {
            e.preventDefault();
            fade(dialog.getNode(), false);
        });
    // there could be multiple extension features
    // features are dependent on the current resource
    switch(new Client().getCurrentResource()){
        case "Contacts":
            // on the contacts page, the user can...
            //* (1) generate a superbill for the current patient
            let superbillTool = new Child("div").addClass().appendTo(dialog).getNode();
            // create a date range selector
            let superbillDateRange = new Child("div").addClass(["flex-row"])
                .appendTo(superbillTool).getNode();
            // add start date text field to date range selector
            let startDateTextfield = new Textfield("Start Date")
                .setType("date").appendTo(superbillDateRange);
            // add end date text field to date range selector
            let endDateTextfield = new Textfield("End Date")
                .setType("date").appendTo(superbillDateRange);
            // add a button to trigger superbill generation
            new Button("Print Superbill")
                .addClass(["surface-button", "width--full"])
                .appendTo(dialog)
                .getNode().addEventListener("click", async function (e){
                    e.preventDefault();
                    // remove the dialog
                    fade(dialog.getNode(), false);
                    // build a sheet for the superbill
                    let sheet = buildExtensionSheet();
                    // TODO: show status
                    // append the superbill to he sheet
                    sheet.getNode().append(generateSuperbill(
                        // startDateTextfield.getNode().value, 
                        // endDateTextfield.getNode().value
                    ));
                });
            break;
        default:
            // no features are available for the current page
            // TODO: tell the user
            break;
    }
    // show dialog (fade in)
    fade(dialog.getNode(), true);
}

function buildExtensionSheet(){
    let sheet = new Child("div")
        .setId(["extension-sheet"])
        .addClass(["axis-extension-surface"])
        .appendTo(document.body);
    // create a clear label for the sheet
    new Child("span")
        .addClass(["modal-label"])
        .setInnerText("AXIS Extension")
        .appendTo(sheet);
    // create a button to close the sheet
    new Button()
        .addClass(["close-modal"])
        .appendTo(sheet)
        .getNode().addEventListener("click", async function (e) {
            e.preventDefault();
            // slide sheet out to right
            sheetSlide(sheet.getNode(), "right", false);
        });
    // slide the sheet in from right
    sheetSlide(sheet.getNode(), "right", true);
    return sheet;
}

function buildSuperbillTemplate(){
    // create the containing document
    let template = new Child("div").setId("extension-superbill-template").appendTo(document.body);
    // access the node, since we'll be adding stuff to this
    let templateNode = template.getNode();
    // add topline to template
    // this will hold "The Joint Chiropractic - [location]..."
    let topline = new Child("span").addClass(["topline"]).appendTo(templateNode);
    // add The Joint's official svg logo
    // TODO: pick a size
    // ? does this come with a background
    let brandIcon = new Child("img").addClass(["brand-icon"])
        .addAttribute({src: "./joint_logo.svg"}).appendTo(templateNode);
    // add a div to show information about this document
    // this will include date created, period, reference number, prepared by, etc
    let metaInformation = new Child("div").addClass(["meta-information"]).appendTo(templateNode);
    // add a div to show the relevant patient information
    // this will include name, date of birth, address, phone, email, and diagnosis
    let patientInformation = new Child("div").addClass(["patient-information"]).appendTo(templateNode);
    // add a div to show the patient's account summary for the set period
    // this includes the total paid and any refunds
    let accountSummary = new Child("div").addClass(["account-summary"]).appendTo(templateNode);
    // add a div to show the patient's transaction history
    let transactionHistory = new Child("div").addClass(["transaction-history"]).appendTo(templateNode);
    // add a div to show the patient's visit history
    let visitHistory = new Child("div").addClass(["visit-history"]).appendTo(templateNode);
    // add a signature line that shows "if you have questions contact..."
    let signatureLine = new Child("div").addClass(["signature-line"]).appendTo(templateNode);
    // add a footer that shows "managed by..."
    let footerLine = new Child("span").addClass(["footer-line"]).appendTo(templateNode);
    // return the template as an object of objects
    return {
        template: template,
        brandIcon: brandIcon,
        metaInformation: metaInformation,
        patientInformation: patientInformation,
        accountSummary: accountSummary,
        transactionHistory: transactionHistory,
        visitHistory: visitHistory,
        signatureLine: signatureLine,
        footerLine: footerLine
    }
}

async function fade(node = Element, fadeIn = false){
    let animation;
    if(fadeIn){
        animation = node.animate([
            {opacity: "0%"},{opacity: "100%"}
        ], {duration: 250, iterations: 1, easing: "linear", fill: "forwards"});
        await animation.finished;
        animation.commitStyles();
        animation.cancel();
        // allow for chaining
        return node;
    } else {
        animation = node.animate([
            {opacity: "100%"},{opacity: "0%"}
        ], {duration: 250, iterations: 1, easing: "linear", fill: "forwards"});
        await animation.finished;
        animation.commitStyles();
        animation.cancel();
        node.remove();
    }
}

async function generateSuperbill(startDate = yearStart, endDate = present){
    // check transactions to see how many visits occurred
    let transactions = await readTransactionsFrom(startDate, endDate);
    if(Array.isArray(transactions.records)) transactions = transactions.records;
    else throw new Error(`Expected array but received ${typeof transactions.records} instead. Server responded with ${transactions} at function generateSuperbill.`)
    // return transactions;

}

async function getClinicDetails(clinicName = ""){
    try{
        // format clinic name for url query
        let urlQuery = "";
        clinicName.split(" ").forEach(word => { urlQuery += `${word}%20`; });
        
        // first request to get clinic id
        let firstResponse = await fetch(new Request(`https://axis.thejoint.com/rest/v11_20/TJ_Clinics?erased_fields=true&view=list&fields=following%2Cmy_favorite&max_num=2&order_by=date_modified%3Adesc&filter%5B0%5D%5Bname%5D%5B%24starts%5D=${urlQuery}`), {headers: { "Oauth-Token": new Client().oauth }});

        // create a variable to store the clinic id
        let clinicId = "";

        // process request response and set value of clinicId
        if(firstResponse.ok) {
            let clinic = await firstResponse.json();
            if(clinic.records.length === 1) clinicId = clinic.records[0].id;
            else throw new Error(`Expected 1 results, but received ${clinic.records.length} results.`);
        } else { throw `status: ${firstResponse.status}`; }

        // second request to get detailed information for clinic
        let secondResponse = await fetch(new Request(`https://axis.thejoint.com/rest/v11_20/TJ_Clinics/${clinicId}?erased_fields=true&view=record&fields=my_favorite&viewed=1`), {headers: { "Oauth-Token": new Client().oauth }});

        // process second request and return detailed clinic information
        if(secondResponse.ok) return details; 
        else throw `status: ${secondResponse.status}`;
    } catch (error) {
        error = error instanceof Error ? error : 
            new Error(`Server response at getClinicDetails() returned "${error}"`);
        console.log(error);
        return error;
    }
}

async function readTransactionsFrom(startDate = yearStart, endDate = present){
    try{
        // check that the input values are *probably* valid
        // ? what could go wrong
        if(startDate instanceof Date === false) 
            throw new Error(`Expected instance of Date at parameter startDate.`);
        if(endDate instanceof Date === false) 
            throw new Error(`Expected instance of Date at parameter endDate.`);
        // create variables for start date, month, and year
        let ds = new Date(startDate).getDate().toString();
        if(ds.length < 2) ds = `0${ds}`;
        let ms = new Date(startDate).getMonth() + 1;
        let ys = new Date(startDate).getFullYear().toString();
        // create variables for end date, month, and year
        let de = new Date(endDate).getDate().toString();
        if(de.length < 2) de = `0${de}`;
        let me = new Date(endDate).getMonth() + 1;
        let ye = new Date(endDate).getFullYear();
        // request transaction history
        let response = await fetch(new Request(`https://axis.thejoint.com/rest/v11_20/Contacts/${ new Patient().getPatientId(window.location.href) }/custom_link/contacts_transactions_refunds?filter%5B0%5D%5Bdate_entered%5D%5B%24dateBetween%5D%5B%5D=${ys}-${ms}-${ds}&filter%5B0%5D%5Bdate_entered%5D%5B%24dateBetween%5D%5B%5D=${ye}-${me}-${de}`), { headers: {"Oauth-Token": new Client().oauth} });
        // process and return response
        if(response.ok) return await response.json() 
        else throw `status: ${response.status}`;
    } catch (error){
        error = error instanceof Error ? error : 
            new Error(`Server response at readTransactionsFrom() returned "${error}"`);
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
        let records = [];
        if(response.ok) {
            if(Array.isArray(visits.records)){
                let i = 0;
                for(const visit of visits.records){
                    if(i > quantity) throw new Error(`visitArray exceeded expected length.`);
                    let res = await fetch(new Request(`https://axis.thejoint.com/rest/v11_20/TJ_Visits/${ visit.id }?erased_fields=true&view=record&fields=date_entered%2Cstatus%2Chas_carecard&viewed=1`), { headers: {"Oauth-Token": client.oauth} });
                    records.push(await res.json());
                }
                console.log(records);
            } else { throw new Error(`Expected type of array, but received type of ${typeof visits.records} instead.`); }
        } else { throw new Error(`Server response at readVisits() returned "Status: ${response.status}"`); }
        return records;
    } catch (error){
        console.log(error);
        return error;
    }
}

async function sheetSlide(node = Element, from = "right", slideIn = false){
    let keyframes, position;
    if(slideIn) position = { start: 100, end: 0 };
    else position = { start: 0, end: 100 };
    switch(from){
        case `top`:
            keyframes = [
                {transform: `translateY(${position.start}%)`}, 
                {transform: `translateY(${position.end}%)`}
            ];
            break;
        case `right`:
            keyframes = [
                {transform: `translateX(${position.start}%)`}, 
                {transform: `translateX(${position.end}%)`}
            ];
            break;
        case `bottom`:
            keyframes = [
                {transform: `translateY(-${position.start}%)`}, 
                {transform: `translateY(-${position.end}%)`}
            ];
            break;
        case `left`:
            keyframes = [
                {transform: `translateX(-${position.start}%)`}, 
                {transform: `translateX(-${position.end}%)`}
            ];
            break;
        default:
            console.log(`Warning: "from" parameter at function slide() is invalid.`);
            return node;
    }
    let animation = node.animate(keyframes,
        {duration: 350, iterations: 1, easing: "linear", fill: "forwards"});
    await animation.finished;
    animation.commitStyles();
    animation.cancel();
    if(slideIn) return node;
    else node.remove(0);
}