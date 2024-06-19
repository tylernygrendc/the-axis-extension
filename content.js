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
            //? quotations marks must be removed
            .toString().split(`"`)[1];
        this.userData = localStorage.getItem("userdata")
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
        else return resource.split("#")[1].toString().toLowerCase();
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
        // check that the client is on a patient profile
        if(new Client().getCurrentResource() === "contacts") {
            // attach basic patient information to the patient object
            this.id = this.getId(),
            this.name = this.getName(),
            this.age = this.getAge(),
            this.dob = this.getDOB(),
            this.address = this.getAddress(),
            this.phone = this.getPhone(),
            this.email = this.getEmail()
        } else {
            throw new Error(`A patient's profile must be open to access the Patient class.`);
        }
    }
    getAddress(){
        // access the node containing primary address details
        let primaryAddress = document.querySelector("[data-name=primary_address]");
        // access the node containing billing address details
        let altAddress = document.querySelector("[data-name=alt_address]");
        // create and return an object containing all of the address information available on axis
        return {
            primary: {
                street: primaryAddress.querySelector("[data-name=primary_address_street]").innerText,
                city: primaryAddress.querySelector("[data-name=primary_address_city]").innerText,
                state: primaryAddress.querySelector("[data-name=primary_address_state]").innerText,
                zip: primaryAddress.querySelector("[data-name=primary_address_postalcode]").innerText
            },
            billing: {
                street: altAddress.querySelector("[data-name=alt_address_street]").innerText,
                city: altAddress.querySelector("[data-name=alt_address_city]").innerText,
                state: altAddress.querySelector("[data-name=alt_address_state]").innerText,
                zip: altAddress.querySelector("[data-name=alt_address_postalcode]").innerText
            }
        }
    }
    getAge(){
        return document.querySelector("[data-fieldname=age_c] .ellipsis_inline").innerText;
    }
    getDOB(){
        return document.querySelector("[data-name=birthdate] [data-original-title]").innerText;
    }
    getEmail(){
        return document.querySelector("[data-name=email] a").innerText;
    }
    getId(){
        return window.location.href.split("/")[4].toString();
    }
    getName(){
        // get the patient's printed name form axis
        let nameArray = document.querySelector(`h1 .record-cell[data-type=fullname] .table-cell-wrapper 
                .index span .record-cell[data-type=fullname] .ellipsis_inline`).innerText.split("");
    
        // remove any shenanigans
        nameArray.forEach((name, i) => {
            if(name.toLowerCase() === "see notes" || name.charAt(0) === `"`) nameArray.splice(i, 1);
        });
    
        // consolidate multiple last names
        if(nameArray.length > 2){
            // create a string to store the output name(s)
            let lastNames = "";
            // add each last name to the lastNames string
            for(let i = 1; i < nameArray.length; ++i){
                if(i === 1) lastNames += `${nameArray[i]}`;
                // don't forget spacing
                if(i > 1) lastNames += ` ${nameArray[i]}`;
            }
            // update nameArray to reflect changes
            nameArray = [nameArray[0], lastNames];
        }
    
        // return name as object
        return {
            fullName: nameArray[0] + nameArray[1],
            firstName: nameArray[0], 
            lastName: nameArray[1],
            initials: nameArray[0].charAt(0) + nameArray[1].charAt(0)
        };
    }
    getPhone(){
        let mobilePhone = document.querySelector("[data-fieldname=phone_mobile] a");
        let otherPhone = document.querySelector("[data-fieldname=phone_other] a");
        return {
            mobile: mobilePhone === null ? "" : mobilePhone.innerText,
            other: otherPhone === null ? "" : otherPhone.innerText
        }
    }
}

class Preview {
    constructor(title = "Untitled"){
        this.id = randomId();
        this.title = title;
        this.sectionList = [];
        this.pageList = 1;
    }
    async create(){
        // create a container for the preview
        let preview = new Child().addClass(["preview"]).appendTo(document.body);

        // create a doc inside of the preview container
        let previewDocument = new Child().addClass(["preview__document"])
            .appendTo(preview.getNode());

        // create a header for the previewed document
        let previewHeader = new Child().addClass(["document__header"])
            .appendTo(previewDocument.getNode());
        // create a footer for the previewed document
        let previewFooter = new Child().addClass(["document__footer"])
            .setInnerText()
            .appendTo(previewDocument.getNode());

        // get clinic details to populate the header and footer
        let clinicDetails = await getClinicDetails(new Client().getCurrentClinic());

        // grab the nodes for both the header and footer
        let headerNode = previewHeader.getNode(),
            footerNode = previewFooter.getNode()

        // populate the header with a logo, title, and topline
        new Child("img").addAttribute({src: "assets/joint_logo.png"})
            .addClass(["logo"])
            .appendTo(headerNode);
        new Child("h1").setInnerText(this.title)
            .addClass(["title"])
            .appendTo(headerNode);
        new Child("span").addClass(["topline"])
            .setInnerText(`This clinic is owned and operated by ${clinicDetails.pc} and managed by ${clinicDetails.business_entity}.`)
            .appendTo(headerNode);
        
        // populate the footer with this clinic's name, address, phone, and email
        new Child("span")
            .addClass(["company"])
            .setInnerText(`The Joint Chiropractic - ${clinicDetails.name}`)
            .appendTo(footerNode);
        new Child("address")
            .addClass(["clinic"])
            .setInnerText(`${clinicDetails.billing_address_street} ${clinicDetails.billing_address_city}, ${clinicDetails.billing_address_state} ${clinicDetails.billing_address_postalcode}`)
            .appendTo(footerNode);
        new Child("span")
            .addClass(["contact"])
            .setInnerText(`${clinicDetails.phone1} | ${clinicDetails.email}`)
            .appendTo(footerNode);
    }
    async addSection(children = [], classList = []){
        // a section cannot be added if the this.create() has not been called
        if(document.querySelector(`${this.id}`) === null) 
            throw new Error("Method create() must be called on Preview before a new section can be added.");
        // create a section container
        let section = new Child()
            .addClass(["section"]).addClass(classList)
            .appendTo(document.querySelector(`${this.id}`));
        // add this section to this object
        this.sectionList.push(section);
        // populate the section container with the supplied children 
        for(const child in children) child.appendTo(section);
        return this;
    }
    async appendTo(parent){
        let preview = await this.create();
        parent.append(preview);
        return this;
    }
    setId(id = this.id){
        this.id = id;
        return this;
    }
    setTitle(title = "Untitled"){
        this.title = title;
        return this;
    }
}

class Progressbar {
    constructor(){
        this.progress = 0;
    }
    appendTo(parent){

    }
    setProgress(value){
        this.progress = value;
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
        case "contacts":
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
                    // TODO: append superbill
                    // append the superbill to the sheet
                    // sheet.getNode().append(generateSuperbill(
                    //     startDateTextfield.getNode().value, 
                    //     endDateTextfield.getNode().value
                    // ));
                    generateSuperbill();
                });
            break;
        default:
            // no features are available for the current page
            // TODO: tell the user
            break;
    }
    // show dialog (fade of)
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
    // slide the sheet of from right
    sheetSlide(sheet.getNode(), "right", true);
    return sheet;
}

function buildSuperbill(){
    // create a new preview
    let preview = new Preview("Superbill")
        .appendTo(document.querySelector("#extension-sheet"));
    // append the relevant sections to this 
    let obj = {
        id: () => {
            let patient = new Patient();
            let dob = patient.dob.split("/");
            return `${ patient.name.initials + dob[0] + dob[1] + dob[2] }`;
        },
        self: template,
        topline: topline,
        documentTitle: documentTitle,
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

async function createSuperbill(startDate = yearStart, endDate = present){

    // get all transactions and visits between startDate and endDate
    let transactions, visits;
    try{
        if(startDate instanceof Date && endDate instanceof Date){
            transactions = await getTransactionsFrom(startDate, endDate);
            visits = await getVisitsFrom(startDate, endDate);
        }  else { throw new Error(`Parameter Instanceof Date is required at generateSuperbill().`); }
    } catch (error) { console.log(error); return error; }

    // TODO: remove this output log
    console.log(clinic, transactions, visits);

    // access the current client and patient objects
    let client = new Client(), patient = new Patient();

    // create a new preview
    let preview = await new Preview("Superbill")
        .appendTo(document.querySelector("#extension-sheet"));

    // build an object to access meta information, patient information, and account summary
    let lists = [
        {
            content: [
                {label: "Issue Date", value: present},
                {label: "Period Start", value: startDate},
                {label: "Period End", value: endDate},
                {label: "Reference Number", value: `${ patient.name.initials + patient.dob.split("/")[0] + patient.dob.split("/")[1] + patient.dob.split("/")[2] }`},
                {label: "Prepared By", value: client.userData.username}
            ]
        },
        {
            content: [
                {label: "Name", value: patient.name.fullName},
                {label: "Date of Birth", value: `${patient.dob} (age ${patient.age})`},
                {label: "Address", value: `${patient.address.primary.street} ${patient.address.primary.city}, ${patient.address.primary.state} ${patient.address.primary.zip}`},
                {label: "Phone", value: patient.phone.mobile },
                {label: "Email", value: patient.email}
            ]
        },
        {
            // TODO: check that each of these summary items match what the table says
            // ! this will be important because the table is editable (in case something is incorrect)
            // ? should the table be editable
            content: [
                {label: "Total Paid", value: () => {
                    let paid = 0;
                    for(const transaction of transactions)
                        if(transaction.type === "Refund/Void") paid -= parseFloat(transaction.amount);
                        else paid += parseFloat(transaction.amount);
                    return paid;
                }},
                {label: "Total Billed", value: () => {
                    let billed = 0;
                    for(const transaction of transactions)
                        if(transaction.type === "Refund/Void") billed += 0;
                        else billed += parseFloat(transaction.amount);
                    return billed;
                }},
                {label: "Total Refunded", value: () => {
                    let refunded = 0;
                    for(const transaction of transactions)
                        if(transaction.type === "Refund/Void") refunded +=  parseFloat(transaction.amount);
                    return refunded;
                }},
                {label: "Total Visits", value: visits.length}
            ]
        }
    ];
    // for each list, add a li for each list content item
    // populate each li with a label and a value
    // ! stopped here
    for(const list of lists){
        let children = [];
        list.content.forEach(item => {
            let label = new Child("span").setInnerText(item.label)
            children.push()
        });
        let section = preview.addSection(children, [])

        let li = new Child("li").appendTo(list.node);
        new Child("span").addClass(["item__label"])
            .setInnerText(list.content.label).appendTo(li);
        new Child("span").addClass(["item__value"])
            .setInnerText(list.content.value).appendTo(li);
    }

    // create a table to hold all transactions
    let transactionsTable = new Child("table").appendTo(template.transactionHistory.getNode());
    // populate the superbill transaction history table
    for(const transaction of transactions){
        // create a new table row
        let row = new Child("tr").appendTo(transactionsTable.getNode()).getNode();
        // format the transaction date
        let transactionDate = new Date(transaction.date_entered);
        let year = transactionDate.getFullYear(),
            month = transactionDate.getMonth() + 1,
            date = transactionDate.getDate();
            // convert each to strings
            year = year.toString();
            month = month.toString();
            date = date.toString();
            // add leading zeros if applicable
            month = String(month).length === 1 ? "0" + month : month;
            date = String(date).length === 1 ? "0" + date : date;
            transactionDate = `${month}/${date}/${year}`;
        // format the payment method
        const paymentMethod = transaction.cc_type === "Cash" ? "Cash" : `${transaction.cc_type} (${transaction.last_four})`;
        // delineate paid amount and refund amount
        const amount = {
            paid: transaction.type === "Refund/Void" ? 0 : transaction.amount,
            refunded: transaction.type === "Refund/Void" ? transaction.amount : 0
        }
        // create a variable to store all row cell values 
        // transaction date, purchase item, payment method, transaction status, paid amount, refund amount
        let cellValues = [transactionDate, transaction.product_purchased, paymentMethod, amount.paid, amount.refunded];
        // populate the table row with cell values
        for(const value of cellValues){
            // create the semantic td element
            let cell = new Child("td").appendTo(row);
            // put an editable input element inside
            new Child("input").addAttribute({type: "text"}).appendTo(cell)
                // and set the value
                .getNode().value = value;
        }
    }

    // create a table to hold all visit history
    let visitsTable = new Child("table").appendTo(template.visitHistory.getNode());
    // populate the superbill visit history table
    for(const visit of visits){
        // create a new table row
        let row = new Child("tr").appendTo(visitsTable.getNode()).getNode();
        // format the visit date
        let visitDate = new Date(visit.date_entered);
        let year = visitDate.getFullYear(),
            month = visitDate.getMonth() + 1,
            date = visitDate.getDate();
            // convert each to strings
            year = year.toString();
            month = month.toString();
            date = date.toString();
            // add leading zeros if applicable
            month = String(month).length === 1 ? "0" + month : month;
            date = String(date).length === 1 ? "0" + date : date;
            visitDate = `${month}/${date}/${year}`;

        // create a variable to store all row cell values 
        // date, procedure, cost, physician, clinic
        let cellValues = [visitDate, visit.procedure, visit.visitCost, visit.users_tj_visits_2_name, visit.tj_clinics_tj_visits_1_name];
        // populate the table row with cell values
        for(const value of cellValues){
            // create the semantic td element
            let cell = new Child("td").appendTo(row);
            // put an editable input element inside
            new Child("input").addAttribute({type: "text"}).appendTo(cell)
                // and set the value
                .getNode().value = value;
        }
    }

    // populate the superbill signature line
    // populate the superbill footer line
}

async function getClinicDetails(clinicName = ""){
    try{
        // format clinic name for url query
        // create a string to store the clinic name
        // create an iteration counter
        let urlQuery = "", i = 0;
        let clinicNameWordsArray = clinicName.split(" ");
        for(const word of clinicNameWordsArray){
            if(clinicNameWordsArray.length - 1 > i) { 
                urlQuery += `${word}%20`; ++i;
            } else { urlQuery += `${word}`; }
        }

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
        if(secondResponse.ok) return await secondResponse.json(); 
        else throw `status: ${secondResponse.status}`;
    } catch (error) {
        error = error instanceof Error ? error : 
            new Error(`Server response at getClinicDetails() returned "${error}"`);
        console.log(error);
        return error;
    }
}

async function getDetailedVisitsFrom(startDate = yearStart, endDate = present){
    try{
        const client = new Client();
        const patient = new Patient();
        // the visits api calls a certain number of visits, starting with the most recent visit
        // set the max_num query equal to the difference between present and startDate
        let maxNum = Math.ceil((present.getTime() - startDate.getTime()) / (1000 * 3600 * 24));

        // request a quantity of visit records less than or equal to the set maxNum
        let response = await fetch(new Request(`https://axis.thejoint.com/rest/v11_20/Contacts/${ patient.id }/link/contacts_tj_visits_1?erased_fields=true&max_num=${maxNum}`), { headers: {"Oauth-Token": client.oauth} });
        let visits = await response.json();

        // the response will include include visits outside the set date range
        // create an array to store each visit date that matches the date range
        let matchingVisits = [];

        // only store visits that fall between the set startDate and endDate
        if(response.ok) {
            if(Array.isArray(visits.records)){
                for(const visit of visits.records) {
                    // format the visit date for evaluation
                    let visitDate = new Date(visit.date_entered);
                        visitDate = new Date(
                            visitDate.getFullYear(), 
                            visitDate.getMonth(), 
                            visitDate.getDate());
                    // store the matching visits of the matchingVisits array
                    if(visitDate >= startDate && visitDate <= endDate) matchingVisits.push(visit);
                }
            } else { throw new Error(`Expected type of array, but received type of ${typeof visits.records} instead.`); }
        } else { throw response.status; }

        // create an array to store detailed visit information
        let detailedVisits = []
        for(const match of matchingVisits){
            // create variable to store each desired information field
            let visitObject = {
                id: match.id,
                diagnosis: [], 
                procedure: "",
                visitCost: match.visit_price
            }

            // to determine the correct procedure code, count how many regions were manipulated
            // create an array of keys corresponding to adjusted segments
            let segmentList = ["spinal_c0_c", "spinal_c1", "spinal_c2", "spinal_c3", "spinal_c4", "spinal_c5", "spinal_c6", "spinal_c7", "t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9", "t10", "t11", "t12", "l1", "l2", "l3", "l4", "l5", "rpelvis", "lpelvis", "rsacrum", "lsacrum", "shoulderr", "shoulderl", "elbowr", "elbowl", "wristr", "wristl", "hipr", "hipl", "kneer", "kneel", "ankler", "anklel", "ribsr", "ribsl"];
            // create an iteration counter and a place to store manipulated regions
            let i = 0, spinalRegions = [], extremityRegions = [];
            // for each possible segment, check to see if has been manipulated
            for(const segment of segmentList){
                if(String(match[segment]).length != 0 && i < 48){
                    // determine the region that the joint is of and push the region to the manipulatedRegions array
                    if(i === 0) { spinalRegions.push("head"); }
                    if(i > 0 && i <= 7) { spinalRegions.push("cervical"); i = 7; }
                    if(i > 7 && i <= 29) { spinalRegions.push("thoracic"); i = 29; }
                    if(i > 29 && i <= 34) { spinalRegions.push("lumbar"); i = 34; }
                    if(i > 34 && i <= 36) { spinalRegions.push("pelvis"); i = 36; }
                    if(i === 37) { spinalRegions.push("sacrum"); }
                    if(i > 37 && i <= 42) { extremityRegions.push("upper extremity"); i = 41; }
                    if(i > 42) { extremityRegions.push("lower extremity"); i = 47; }
                }
                // increment the counter
                ++i;
            }
            // 98940 is used if two or fewer spinal regions were manipulated
            if(spinalRegions.length < 3) visitObject.procedure = "98940 CHIROPRACTIC MANIPULATIVE TREATMENT, SPINAL (1-2 REGIONS)";
            // 98941 is used if two or more spinal regions were manipulated
            if(spinalRegions.length > 2 ) visitObject.procedure = "98941 CHIROPRACTIC MANIPULATIVE TREATMENT, SPINAL (3-4 REGIONS)";
            // 98942 is used if five or more spinal regions were manipulated
            if(spinalRegions.length > 5 ) visitObject.procedure = "98942 CHIROPRACTIC MANIPULATIVE TREATMENT, SPINAL (5+ REGIONS)";
            // 98943 is used if no spinal regions were manipulated and any extremities were
            if(spinalRegions.length === 0 && extremityRegions > 0) visitObject.procedure = "98943 CHIROPRACTIC MANIPULATIVE TREATMENT, EXTRASPINAL";

            // to determine the correct diagnoses, count how many regions include a subluxation
            // reset the counter
            i = 0;
            // update the segmentList to be consistent with axis naming conventions for subluxation levels
            segmentList = ["sub_c0_c", "sub_c1", "sub_c2", "sub_c3", "sub_c4", "sub_c5", "sub_c6", "sub_c7", "sub_t1", "sub_t2", "sub_t3", "sub_t4", "sub_t5", "sub_t6", "sub_t7", "sub_t8", "sub_t9", "sub_t10", "sub_t11", "sub_t12", "sub_l1", "sub_l2", "sub_l3", "sub_l4", "sub_l5", "sub_pelvis-c", "sub_sacrum"];
            // check each segment for subluxation 
            for(const segment of segmentList){
                if(String(match[segment]) === "1" && i < 36){
                    // determine the region that the joint is of and push the region to the manipulatedRegions array
                    if(i === 0) { visitObject.diagnosis.push("M99.00 SEGMENTAL AND SOMATIC DYSFUNCTION OF HEAD REGION"); }
                    if(i > 0 && i <= 7) { visitObject.diagnosis.push("M99.01 SEGMENTAL AND SOMATIC DYSFUNCTION OF CERVICAL REGION"); i = 7; }
                    if(i > 7 && i <= 29) { visitObject.diagnosis.push("M99.02 SEGMENTAL AND SOMATIC DYSFUNCTION OF THORACIC REGION"); i = 29; }
                    if(i > 29 && i <= 34) { visitObject.diagnosis.push("M99.03 SEGMENTAL AND SOMATIC DYSFUNCTION OF LUMBAR REGION"); i = 34; }
                    if(i === 35) { visitObject.diagnosis.push("M99.04 SEGMENTAL AND SOMATIC DYSFUNCTION OF SACRAL REGION"); }
                    if(i === 36) { visitObject.diagnosis.push("M99.05 SEGMENTAL AND SOMATIC DYSFUNCTION OF PELVIC REGION"); }
                }
                // increment the counter
                ++i;
            }
            detailedVisits.push(visitObject);
        }
        // return detailed visit information
        return detailedVisits;

    } catch (error){
        error = error instanceof Error ? error : 
            new Error(`Server response at readTransactionsFrom() returned "${error}"`);
        console.log(error);
        return error;
    }
}

async function getTransactionsFrom(startDate = yearStart, endDate = present){
    try{
        // check that the input values are *probably* valid
        // ? what could go wrong
        if(startDate instanceof Date === false) 
            throw new Error(`Expected instance of Date at parameter startDate.`);
        if(endDate instanceof Date === false) 
            throw new Error(`Expected instance of Date at parameter endDate.`);

        // create variables for start date, month, and year
        let ds = new Date(startDate).getDate().toString();
        if(String(ds).length < 2) ds = `0${ds}`;
        let ms = new Date(startDate).getMonth() + 1; 
            ms = ms.toString();
        if(String(ms).length < 2) ms = `0${ms}`;
        let ys = new Date(startDate).getFullYear().toString();
        // create variables for end date, month, and year
        let de = new Date(endDate).getDate().toString();
        if(String(de).length < 2) de = `0${de}`;
        let me = new Date(endDate).getMonth() + 1;
            me = me.toString();
        if(String(me).length < 2) me = `0${me}`;
        let ye = new Date(endDate).getFullYear().toString();

        // request transaction history
        let response = await fetch(new Request(`https://axis.thejoint.com/rest/v11_20/Contacts/${ new Patient().id }/custom_link/contacts_transactions_refunds?filter%5B0%5D%5Bdate_entered%5D%5B%24dateBetween%5D%5B%5D=${ys}-${ms}-${ds}&filter%5B0%5D%5Bdate_entered%5D%5B%24dateBetween%5D%5B%5D=${ye}-${me}-${de}`), { headers: {"Oauth-Token": new Client().oauth} });
        // process and return response
        if(response.ok) {
            let obj = await response.json();
            return obj.records;
        }
        else { throw `status: ${response.status}`; }
    } catch (error){
        error = error instanceof Error ? error : 
            new Error(`Server response at readTransactionsFrom() returned "${error}"`);
        console.log(error);
        return error;
    }
}

async function getVisitsFrom(startDate = yearStart, endDate = present){
    try{
        const client = new Client();
        const patient = new Patient();
        // the visits api calls a certain number of visits, starting with the most recent visit
        // set the max_num query equal to the difference between present and startDate
        let maxNum = Math.ceil((present.getTime() - startDate.getTime()) / (1000 * 3600 * 24));

        // request a quantity of visit records less than or equal to the set maxNum
        let response = await fetch(new Request(`https://axis.thejoint.com/rest/v11_20/Contacts/${ patient.id }/link/contacts_tj_visits_1?erased_fields=true&view=subpanel-for-contacts-contacts_tj_visits_1&fields=date_entered%2Cstatus%2Chas_carecard%2Cmy_favorite&max_num=${maxNum}&order_by=date_entered%3Adesc&filter%5B0%5D%5Bstatus%5D=Completed`), { headers: {"Oauth-Token": client.oauth} });
        let visits = await response.json();

        // the response will include include visits outside the set date range
        // create an array to store each visit date that matches the date range
        let matchingVisits = [];
        // records need to be requested for each matching visit
        // create an array to store each visit record
        let records = [];

        if(response.ok) {
            if(Array.isArray(visits.records)){
                // remove visits that do not fall between the set startDate and endDate
                for(const visit of visits.records) {
                    // format the visit date for evaluation
                    let visitDate = new Date(visit.date_entered);
                        visitDate = new Date(
                            visitDate.getFullYear(), 
                            visitDate.getMonth(), 
                            visitDate.getDate());
                    // store the matching visits of the matchingVisits array
                    if(visitDate >= startDate && visitDate <= endDate) matchingVisits.push(visit.id);
                }
                // create an iteration counter
                let i = 0;
                // get detailed records for each matching visit
                for(const id of matchingVisits){
                    // don't create an infinite loop
                    if(i > maxNum) throw new Error(`visitArray exceeded expected length.`);
                    else ++i;
                    // get detailed records for the visit with the current visit id
                    let res = await fetch(new Request(`https://axis.thejoint.com/rest/v11_20/TJ_Visits/${id}?erased_fields=true&view=record&fields=date_entered%2Cstatus%2Chas_carecard&viewed=1`), { headers: {"Oauth-Token": client.oauth} });
                    // store visit details of the records array
                    records.push(await res.json());
                }
            } else { throw new Error(`Expected type of array, but received type of ${typeof visits.records} instead.`); }
        } else { throw response.status; }

        // some details are not included of these records
        // make a separate request to get diagnosis, procedure, and const information
        // ! some of this is inferred or incomplete information
        let detailedVisits = await getDetailedVisitsFrom(startDate, endDate);

        // for each record, merge the visit details
        records.forEach((record, i) => {
            console.log("Test:", record.id, detailedVisits);
            // hopefully they're of the same order
            if(record.id === detailedVisits[i].id){
                // merge
                Object.assign(record, detailedVisits[i]);
                console.log("Matched:", record);
            } else {
                // if they're not of the same order, check each visit id for a match
                for(const detailedVisit of detailedVisits){
                    // and merge them if they match
                    if(record.id === detailedVisit.id) {
                        Object.assign(record, detailedVisit);
                        console.log("Out-of-order Match:", record);
                    } 
                    // ? what if they don't match
                }
            }
        });

        // return an array of all visit records between startDate and endDate
        return records;

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