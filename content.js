class Child {
    constructor(tag = "div"){
        this.tag = tag;
        this.id = utilities.getRandomId();
        this.classList = [];
        this.attributes = {};
        this.innerText = "";
    }
    appendTo(parent = document.body){
        let child = this.#create();
        if(parent instanceof Child) document.querySelector(`#${parent.id}`).append(child);
        if(parent instanceof HTMLElement) parent.append(child);
        if(typeof parent === "string") document.querySelector(`${string}`).append(child);
        if(!parent instanceof Child && !parent instanceof HTMLElement && !typeof parent === "string"){
            throw new Error(`Parameter instance of Child or HTMLElement is required at method appendTo() on Child.`)
        }
        return this;
    }
    #create(){
        let child = document.createElement(this.tag);
        child.id = this.id;
        for(const str of this.classList) child.classList.add(str);
        for(const [key, val] of Object.entries(this.attributes)) {
            if(this.tag === "img" && key === "src" ) child.src = chrome.runtime.getURL(val);
            else child.setAttribute(key, val);
        }
        if(typeof this.innerText === "string"){
            let text = document.createTextNode(this.innerText);
            child.appendChild(text);
        }
        return child;
    }
    exists(){
        return this.getNode() === null ? false : true;
    }
    getAttributes(node = document.body){
        // allow the option to pass a querySelector string
        if(typeof node === "string") node = document.querySelector(node);
        // iterate over attributes and return an object of attributes
        // don't include excluded attributes
        let attributes = {}, excluded = ["id", "class"];
        for(let i = 0; i < node.attributes.length; ++i){
            if(!excluded.includes(node.attributes.item(i).name))
                attributes[node.attributes.item(i).name] = node.attributes.item(i).value;
        }
        return attributes;
    }
    getNode(){
        return document.querySelector(`#${this.id}`);
    }
    getParent(){
        return document.querySelector(`#${this.id}`).parentElement;
    }
    setAttribute(object = {}){
        switch(typeof object) {
            case "object":
                if(Array.isArray(object)) console.log(`Warning: setAttribute() method on Child expects parameter type of object but was passed type of array instead. Attributes were not be applied to Child object:`, this);
                else Object.assign(this.attributes, object);
                break;
            case "string":
                Object.assign(this.attributes, { [object]: "" });
                break;
            default:
                console.log(`Warning: setAttribute() method on Child expects parameter type of object but was passed type of ${ object } instead. Attributes were not be applied to Child object:`, this);
                break;
        }
        return this;
    }
    setClassList(array = []){
        if(Array.isArray(array)) for(const str of array) this.classList.push(str);
        else this.classList.push(array.toString());
        return this;
    }
    setId(str=""){
        this.id = str;
        return this;
    }
    setInnerText(str=""){
        this.innerText = str;
        return this;
    }
    objectify(node){
        return new Child(node.tagName)
            .setId(node.id)
            .setClassList(node.classList)
            .setAttribute(this.getAttributes(node))
            .setInnerText(node.innerText);
    }
    update(){
        let outdated = document.querySelector(`#${this.id}`);
        let updated = this.#create();
        outdated.replaceWith(updated);
        return this;
    }
}
class Button extends Child {
    constructor(label = ""){
        super();
        this.id = utilities.getRandomId();
        this.classList = ["button"];
        this.attributes = {};
        this.label = label;
    }
    build(parent = document.body){
        // create the button
        let button = new Child("button")
            .setId(this.id)
            .setClassList(this.classList)
            .appendTo(parent);
        // add children button
        new Child("div")
            .setClassList(["button__state"])
            .appendTo(button);
        new Child("span")
            .setClassList(["button__label"])
            .setInnerText(this.label)
            .appendTo(button);
        return button;
    }
    setLabel(str=""){
        this.label = str;
        return this;
    }
}
class Client {
    constructor(){
        this.oauth = localStorage.getItem("prod:SugarCRM:AuthAccessToken")
            //? quotations marks must be removed
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
        // get the current resource
        let resource = window.location.href.split("/")[3];
        // remove leading pound (#) for front office resources 
        if(resource.split("#").length === 1) return resource;
        else return resource.split("#")[1].toString().toLowerCase();
    }
    getCurrentUser(formatted = false){
        let username = JSON.parse(localStorage.getItem("userdata")).username;
        if(username === undefined){
            if(this.getCurrentResource() === "tjc_backoffice") username = document.querySelector(".username").innerText;
            else username = document.querySelector("#userlist button").title;
        }
        if(formatted) username = utilities.string.capitalize(username, ".");
        return username;
    }
}

class Textfield extends Child {
    constructor(label = "", isParagraph = false){
        super();
        this.id = utilities.getRandomId();
        this.name = label;
        this.isParagraph = isParagraph;
        this.classList = ["text-field"];
        this.attributes = {type: "text", name: label};
        this.label = label;
        this.hint = false;
    }
    build(parent = document.body){
        // build the textfield
        let container = new Child("div")
            .setId(this.id)
            .setClassList(this.classList)
            .appendTo(parent);
        // add label and input to textfield
        new Child("label")
            .setAttribute({for: this.id})
            .setClassList(["text-field__label"])
            .setInnerText(this.label)
            .appendTo(container);
        // input can also be a textarea for paragraph responses
        let input = this.isParagraph ? new Child("textarea"): new Child("input");
            input.setAttribute(this.attributes)
                .setClassList(["text-field__input"])
                .appendTo(container);
        // add a hint element if there is a hint
        if(this.hint) new Child("span")
            .setClassList(["text-field__hint"])
            .setInnerText(this.hint)
            .appendTo(container);
        return container;
    }
    setHint(str=""){
        this.hint = str;
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
        return document.querySelector("[data-fieldname=birthdate] .ellipsis_inline").innerText;
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
                .index span .record-cell[data-type=fullname] .ellipsis_inline`).innerText.split(" ");
    
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
            fullName: `${nameArray[0]} ${nameArray[1]}`,
            firstName: `${nameArray[0]}`, 
            lastName: `${nameArray[1]}`,
            initials: `${nameArray[0].charAt(0) + nameArray[1].charAt(0)}`
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
class Progressbar extends Child {
    constructor(value = 0){
        super();
        this.attributes = {
            role: "progressbar",
            "data-value": `${value}`
        };
        this.classList = ["progress"];
        this.id = utilities.getRandomId();
        this.value = value;
    }
    build(parent = document.body){
        let container = new Child()
            .setId(this.id)
            .setAttribute(this.attributes)
            .setClassList(this.classList)
            .appendTo(parent);
        new Child().setClassList(["progress__indicator"]).appendTo(container);
        new Child().setClassList(["progress__stop"]).appendTo(container);
        return this;
    }
    async complete(){
        await this.setProgress(100);
        this.getNode().remove();
    }
    async setProgress(percent = 0){

        let a, indicator = this.getNode().querySelector(".progress__indicator");
        percent > 100 ? false : percent;

        for(const each of indicator.getAnimations()) {
            each.pause();
            each.commitStyles();
            each.cancel();
        };

        // only indeterminate progress has a right value
        if(indicator.style.right.length > 0){
            a = indicator.animate([
                {left: indicator.style.left, right: indicator.style.right},
                {right: "0%"},
                {left: "100%"}
            ], {
                duration: apply.duration.long,
                easing: apply.easing.standard
            });
            await a.finished;
            a.cancel();
            // reset all styles
            indicator.removeAttribute("style");
        }

        const dimensions = {
            progressbar: utilities.getDimensions(this.getNode()),
            progressIndicator: utilities.getDimensions(indicator)
        }

        if(percent){
            const totalWidth = dimensions.progressbar.width;
            const startWidth = dimensions.progressIndicator.width;
            const stopWidth = totalWidth * (percent / 100);
            a = indicator.animate({
                width: [`${startWidth}px`, `${stopWidth}px`]
            }, {
                duration: apply.duration.long * (Math.abs(stopWidth - startWidth) / totalWidth),
                easing: apply.easing.standard
            });
            await a.finished;
            a.commitStyles();
            a.cancel();
        } else {
            a = indicator.animate({
                left: ["0%","0%","66%","100%"],
                right: ["100%","33%","0%","0%"]
            }, {
                duration: apply.duration.long, 
                iterations: Infinity, 
                easing: apply.easing.standard
            });
        }
        return this;
    }
}
const animation = {
    fade: async (node = document.body, fadeIn = false) => {
        let a;
        if(fadeIn){
            a = node.animate([
                {opacity: "0%"},{opacity: "100%"}
            ], {duration: 250, iterations: 1, easing: apply.easing.standard, fill: "forwards"});
            await a.finished;
            a.commitStyles();
            a.cancel();
            // allow for chaining
            return node;
        } else {
            a = node.animate([
                {opacity: "100%"},{opacity: "0%"}
            ], {duration: 250, iterations: 1, easing: apply.easing.standard, fill: "forwards"});
            await a.finished;
            a.commitStyles();
            a.cancel();
            node.remove();
        }
    },
    slide: async (node = document.body, from = "right", slideIn = false) => {
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
        let a = node.animate(keyframes,
            {duration: apply.duration.short, iterations: 1, easing: apply.easing.standard, fill: "forwards"});
        await a.finished;
        a.commitStyles();
        a.cancel();
        if(slideIn) return node;
        else node.remove(0);
    }
}

const apply = {
    duration: { short: 200, medium: 600, long: 1000 },
    easing: {
        standard: "cubic-bezier(0.2, 0.0, 0, 1.0)",
        accelerate: "cubic-bezier(0, 0, 0, 1)",
        decelerate: "cubic-bezier(0.3, 0, 1, 1)"
    }
}

const axis = {
    getClinicDetails: async (clinicName = "") => {
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
                clinicId = clinic.records[0].id;
                if(clinic.records.length > 1) console.log(`Expected 1 results. Received ${clinic.records.length} results at method getClinicDetails().`);
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
    },
    getDetailedVisits: async (startDate = dateTime.presentYearStart, endDate = dateTime.today) => {
        try{
            const client = new Client();
            const patient = new Patient();
            // the visits api calls a certain number of visits, starting with the most recent visit
            // set the max_num query equal to the difference between present and startDate
            let maxNum = Math.ceil((dateTime.today.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    
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
                segmentList = ["sub_c0_c", "sub_c1", "sub_c2", "sub_c3", "sub_c4", "sub_c5", "sub_c6", "sub_c7", "sub_t1", "sub_t2", "sub_t3", "sub_t4", "sub_t5", "sub_t6", "sub_t7", "sub_t8", "sub_t9", "sub_t10", "sub_t11", "sub_t12", "sub_l1", "sub_l2", "sub_l3", "sub_l4", "sub_l5", "sub_sacrum", "sub_pelvis-c"];
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
    },
    getSuperbillBody: async (startDate = dateTime.presentYearStart, endDate = dateTime.today) => {

        // access the current client and patient objects
        let client = new Client(), patient = new Patient();
    
        // get all transactions and visits between startDate and endDate
        let transactions, visits;
        try{
            if(startDate instanceof Date && endDate instanceof Date){
                transactions = await axis.getTransactions(startDate, endDate);
                visits = await axis.getVisits(startDate, endDate);
            }  else { throw new Error(`Parameter Instanceof Date is required at getSuperbillBody().`); }
        } catch (error) { console.log(error); return error; }
    
        // the statement body includes three lists: meta info, patient info, and an account summary

        // some of these list item values need to be calculated
        let paid = 0, billed = 0, refunded = 0;
        for(const transaction of transactions){
            if(transaction.type === "Refund/Void") paid -= parseFloat(transaction.amount);
            else paid += parseFloat(transaction.amount);
        }
        for(const transaction of transactions){
            if(transaction.type != "Refund/Void") billed += parseFloat(transaction.amount);
            else billed += parseFloat(transaction.amount);
        }
        for(const transaction of transactions){
            if(transaction.type === "Refund/Void") refunded +=  parseFloat(transaction.amount);
        }

        // put these lists into an array for convenience
        let lists = [
            {   
                title: "Patient Information",
                content: [
                    {label: "Name", value: `${patient.name.fullName}`},
                    {label: "Date of Birth", value: `${dateTime.getNumberString(patient.dob)} (age ${patient.age})`},
                    {label: "Address", value: `${patient.address.primary.street} ${patient.address.primary.city}, ${patient.address.primary.state} ${patient.address.primary.zip}`},
                    {label: "Phone", value: `${patient.phone.mobile}`},
                    {label: "Email", value: `${patient.email}`}
                ]
            },
            {   
                content: [
                    {label: "Issue Date", value: dateTime.getNumberString(dateTime.today)},
                    {label: "Period", value: `${dateTime.getNumberString(startDate)} - ${dateTime.getNumberString(endDate)}`},
                    {label: "Reference Number", value: `${patient.name.initials}${dateTime.getNumberString(patient.dob,"mmddyyyy")}`},
                    {label: "Prepared By", value: `${client.getCurrentUser(true)}`}
                ]
            },
            {
                title: "Account Summary",
                content: [
                    {label: "Total Paid", value: utilities.showPlaceValues(paid, 2)},
                    {label: "Total Billed", value: utilities.showPlaceValues(billed, 2)},
                    {label: "Total Refunded", value: utilities.showPlaceValues(refunded, 2)},
                    {label: "Total Visits", value: `${visits.length}`}
                ]
            }
        ];
    
        // the statement includes two separate tables: transaction history and visit history
        let transactionTableContent = [], problemTableContent = [], visitTableContent = [];
        // the content of these tables needs to be populated before a table can be generated
        for(const transaction of transactions){
            transactionTableContent.push({
                Date: dateTime.getNumberString(transaction.date_entered), 
                Purchase: transaction.product_purchased, 
                Method: transaction.cc_type === "Cash" ? "Cash" : `${transaction.cc_type} (${transaction.last_four})`, 
                Payment: transaction.type === "Refund/Void" ? 0 : transaction.amount, 
                Refund: transaction.type === "Refund/Void" ? transaction.amount : 0
            });
        }
        let problemList = []
        for(const visit of visits){
            for(const diagnosis of visit.diagnosis){
                if(!problemList.includes(diagnosis)){
                    problemList.push(diagnosis);
                    problemTableContent.push({
                        Diagnosis: diagnosis
                    });
                }
            }
        }
        for(const visit of visits){
            visitTableContent.push({
                Date: dateTime.getNumberString(visit.date_entered), 
                Procedure: visit.procedure, 
                Charge: utilities.showPlaceValues(visit.visitCost, 2), 
                Physician: visit.users_tj_visits_2_name, 
                Location: visit.tj_clinics_tj_visits_1_name
            });
        }
    
        // put these tables into an array for convenience
        let tables = [
            {
                title: "Transaction History",
                subtitle: "",
                content: transactionTableContent
            },
            {
                title: "Problem List",
                subtitle: "",
                content: problemTableContent
            },
            {
                title: "Visit History",
                subtitle: "",
                content: visitTableContent
            }
        ];
    
        // build the lists and tables
        // push their container objects to a body array
        let body = [];
    
        // build each list and push each container object to body
        for(const list of lists){
            // create the container object
            let container = new Child().setClassList(["superbill__list"]).appendTo();
            // append the title if supplied
            if(list.title != undefined) new Child("span").setClassList(["list__title"]).setInnerText(list.title).appendTo(container);
            // append the subtitle if supplied
            if(list.subtitle != undefined) new Child("span").setClassList(["list__subtitle"]).setInnerText(list.subtitle).appendTo(container);
            // append the list if supplied
            if(Array.isArray(list.content)) container.getNode().append(build.list(list.content));
            // push the container to the body
            body.push(container);
        }
    
        // build each list and push each container object to body
        for(const table of tables){
            // create the container object
            let container = new Child().setClassList(["superbill__table"]).appendTo();
            // append the title if supplied
            if(table.title != undefined) new Child("span").setClassList(["table__title"]).setInnerText(table.title).appendTo(container);
            // append the subtitle if supplied
            if(table.subtitle != undefined) new Child("span").setClassList(["table__subtitle"]).setInnerText(table.subtitle).appendTo(container);
            // append the list if supplied
            if(Array.isArray(table.content)) container.getNode().append(build.table(table.content));
            // push the container to the body
            body.push(container);
        }
    
        return body;
    },
    getTransactions: async (startDate = dateTime.presentYearStart, endDate = dateTime.today) => {
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
    }, 
    getVisits: async (startDate = dateTime.presentYearStart, endDate = dateTime.today) => {
        try{
            const client = new Client();
            const patient = new Patient();
            // the visits api calls a certain number of visits, starting with the most recent visit
            // set the max_num query equal to the difference between present and startDate
            let maxNum = Math.ceil((dateTime.today.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    
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
            let detailedVisits = await axis.getDetailedVisits(startDate, endDate);
    
            // for each record, merge the visit details
            records.forEach((record, i) => {
                // compare each record to each detailedVisit
                for(const detailedVisit of detailedVisits){
                    // merge them if they match
                    if(record.id === detailedVisit.id) {
                        Object.assign(record, detailedVisit);
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
}

const build = {
    dialog: async () => {
        // create the dialog container
        let dialog = new Child("dialog")
            .setId("extension-dialog")
            .setClassList(["extension-variables", "extension-surface"])
            .appendTo(document.body);
        // create a clear label for the dialog
        // the user should know they are interfacing with an extension
        new Child("span")
            .setClassList(["modal-label"])
            .setInnerText("The AXIS Extension")
            .appendTo(dialog);
        // create a button to close the dialog
        new Button()
            .setClassList(["close-modal"])
            .build(dialog)
            .getNode().addEventListener("click", async function (e) {
                e.preventDefault();
                animation.fade(dialog.getNode(), false);
            });
        // there could be multiple extension features
        // features are dependent on the current resource
        switch(new Client().getCurrentResource()){
            case "contacts":
                // on the contacts page, the user can...
                //* (1) generate a superbill for the current patient
                let superbillTool = new Child("div").setClassList().appendTo(dialog).getNode();
                // create a date range selector
                let superbillDateRange = new Child("div").setClassList(["flex-row"])
                    .appendTo(superbillTool).getNode();
                // add start date text field to date range selector
                let startDateTextfield = new Textfield("Start Date")
                    .setType("date").build(superbillDateRange);
                // add end date text field to date range selector
                let endDateTextfield = new Textfield("End Date")
                    .setType("date").build(superbillDateRange);
                // add a button to trigger superbill generation
                new Button("Print Superbill")
                    .setClassList(["surface-button", "width--full"])
                    .build(dialog)
                    .getNode().addEventListener("click", async function (e){
                        e.preventDefault();
                        // remove the dialog
                        animation.fade(dialog.getNode(), false);
                        // build a sheet for the superbill
                        let sheet = build.sheet().getNode();
                        // show indeterminate progress indicator
                        let progressbar = new Progressbar().build(sheet)
                        progressbar.setProgress(0);
                        // get the superbill body content
                        let bodyContent = await axis.getSuperbillBody();
                        // create a page to contain the superbill body
                        let page = await build.page("Superbill", ["tjc-document"]);
                        // update the progressbar to show complete
                        await progressbar.complete();
                        // put the page in a preview
                        let preview = build.preview(page, bodyContent, ["superbill"]);
                        // append the preview to the sheet
                        sheet.append(preview);
                    });
                break;
            default:
                // no features are available for the current page
                // TODO: tell the user
                break;
        }
        // show dialog (animation.fade of)
        animation.fade(dialog.getNode(), true);
    },
    list: (content = [], editable = { label: false,  value: false}) => {
        // this method accepts an array of objects and outputs an unordered list
        let ul = new Child("ul").appendTo().getNode();
        // only some content keys are valid
        const validKeys = ["label", "value"];
        
        // allow editable content fields
        let element = {};
        for(const key of validKeys) { 
            // if an element is editable, it needs to be an <input>
            if(editable[key] === true) element[key] = "input";
            // otherwise, it should be a "span"
            else element[key] = "span";
        }

        // for each content object
        for(const obj of content){
            // create a list item
            let li = new Child("li").appendTo(ul).getNode();
            // create an element containing each key value
            for(const key of validKeys) { 
                if(Object.hasOwn(obj, key)) {
                    new Child(element[key])
                        .setClassList([])
                        .setInnerText(obj[key])
                        // and append it to the containing list item
                        .appendTo(li);
                }
            }
        }
        return ul;
    },
    page: async (title = "Untitled", classList = []) => {
        // create a page
        let page = new Child().setClassList(["page", ...classList]).appendTo().getNode();
    
        // create a header for the page
        let header = new Child().setClassList(["page__header"])
            .appendTo(page).getNode();

        // create a body for the page
        let body = new Child('div').setClassList(["page__body"])
            .appendTo(page).getNode();

        // create a footer for the page
        let footer = new Child().setClassList(["page__footer"])
            .appendTo(page).getNode();
    
        // get clinic details to populate the header and footer
        let clinicDetails = await axis.getClinicDetails(new Client().getCurrentClinic());
    
        // populate the header with a logo, title, and topline
        new Child("img").setAttribute({src: "assets/the-joint-logo/small.png"})
            .setClassList(["header__logo"])
            .appendTo(header);
        new Child("h1").setInnerText(title)
            .setClassList(["header__title"])
            .appendTo(header);
        // clinic details are not always complete :(
        if(clinicDetails.pc.length > 1 && clinicDetails.bussiness_entity.length > 1){
            new Child("span").setClassList(["header__topline"])
                .setInnerText(`This clinic is owned and operated by ${clinicDetails.pc} and managed by ${clinicDetails.bussiness_entity}.`)
                .appendTo(header);
        }
    
        // populate the footer with this clinic's name, address, phone, and email
        new Child("span")
            .setInnerText(`The Joint Chiropractic - ${clinicDetails.name} | ${clinicDetails.billing_address_street} ${clinicDetails.billing_address_city}, ${clinicDetails.billing_address_state} ${clinicDetails.billing_address_postalcode}`)
            .appendTo(footer);
        new Child("span")
            .setInnerText(`${clinicDetails.phone1} | ${clinicDetails.email}`)
            .appendTo(footer);

        return { node: page, header: header, body: body, footer: footer };
    },
    preview: (page = {}, bodyContent = [], classList = []) => {
        // create a preview container
        let preview = new Child("div").setId("extension-preview").setClassList(["extension-variables", "extension-surface"]).appendTo().getNode();

        // add print options to the preview
        let printButton = new Button("Print Preview").setClassList(["surface-button", "fab"]).build(preview);
        // 
        window.addEventListener("beforeprint", () => {
            // fix the preview height
            preview.style.height = `${utilities.getDimensions(preview).content.height}px`;
            // move the preview to the body
            document.body.append(preview);
        });
        window.addEventListener("afterprint", () => {
            // reset the preview height
            preview.removeAttribute("style");
            // move the preview to the sheet
            document.querySelector("#extension-sheet").append(document.querySelector("#extension-preview"));
        });
        // print the preview when the print button is clicked
        printButton.getNode().addEventListener("click", () => {
            // actually print the preview
            window.print();
        });
        
        // and append the page to the preview
        preview.append(page.node);

        // create a container for body content
        let contentContainer = new Child().setClassList(classList).appendTo(page.body).getNode();
        // populate the page body with the body content
        for(const obj of bodyContent) contentContainer.append(obj.getNode());

        // get dimensions of the page body and header
        const body = utilities.getDimensions(page.body),
            header = utilities.getDimensions(page.header);

        // add pages if the body content is too tall
        if(body.content.height > body.height){
            for(let i = 0; i < Math.ceil(body.content.height / body.height) - 1; ++i){
                // duplicate the page with the full body content
                let clone = utilities.duplicateNode(page.node);
                // subsequent pages shouldn't have a header
                clone.querySelector(".page__header").remove();
                // append the modified duplicate to the preview
                preview.append(clone);
                // shift the body content to show overflow from the previous page
                clone.querySelector(".page__body > div").style.transform = `translateY(-${((header.height * i) + (body.height * (i + 1)))}px`;
            }
        }
        
        return preview;
    },
    sheet: () => {
        let sheet = new Child("div")
            .setId(["extension-sheet"])
            .setClassList(["extension-variables", "extension-surface"])
            .appendTo(document.body);
        // create a clear label for the sheet
        new Child("span")
            .setClassList(["modal-label"])
            .setInnerText("AXIS Extension")
            .appendTo(sheet);
        // create a button to close the sheet
        new Button()
            .setClassList(["close-modal"])
            .build(sheet)
            .getNode().addEventListener("click", async function (e) {
                e.preventDefault();
                // slide sheet out to right
                animation.slide(sheet.getNode(), "right", false);
            });
        // slide the sheet of from right
        animation.slide(sheet.getNode(), "right", true);
        return sheet;
    },
    table: (content = [], filter = [], wrapContent = false, editable = false) => {
        // this function accepts an array of objects and outputs a semantic html table
        let table = new Child("table").appendTo().getNode();

        // if there is no content, just return the table
        if(!content.length) return table;

        // a filter can be specified to only output specified key values
        // if the filter is an empty array or falsy, this filter should default to all keys on the first object
        if(!filter.length || filter){
            for(const [key, val] of Object.entries(content[0])) filter.push(key);
        }
        // create a table header
        let thead = new Child("thead").appendTo(table);
        // add a row to the table head
        let headerRow = new Child("tr").appendTo(thead);
        // populate the header with each key of filter
        for(const key of filter) new Child("th").setInnerText(key).appendTo(headerRow);

        // create a table body
        let tbody = new Child("tbody").appendTo(table);
        // for each object of content
        for(const obj of content){
            //create a row
            let row = new Child("tr").appendTo(tbody);
            // for each key of filter
            for(const key of filter){
                // populate the cell with the key value
                let value = obj[key];
                // values need to be strings
                if(typeof value != "string") value = value.toString();
                // longer strings should get wider cells
                let classList = [];
                if(!wrapContent) classList.push("no-wrap");
                if(value.length > 24) classList.push("column--wide");
                // create a cell
                let cell = new Child("td").setClassList(classList).appendTo(row);
                // make the cell editable if it should be
                if(editable) new Child("input").setAttribute({value: value}).appendTo(cell);
                else cell.getNode().innerText = value;
                // ! this will create some cells in a column that are wider than others
            }
        }

        // adjust cell widths
        // create an array representing the index of every wide column
        let wideColumns = [];
        // for each row in the table
        table.querySelectorAll("tr").forEach(row => {
            // check if a cell
            row.querySelectorAll("td").forEach((cell, i) => {
                // check if the cell is part of a wide column and store the index of that column
                // only store indices that haven't been stored already
                if(cell.classList.contains("column--wide") && !wideColumns.includes(i)) wideColumns.push(i);
            });
        });
        // style headers for wide columns
        table.querySelectorAll("thead tr th").forEach((header, i) => {
            if(wideColumns.includes(i)) header.classList.add("column--wide");
        })
        // style cells for wide columns
        table.querySelectorAll("tr").forEach(row => {
            row.querySelectorAll("td").forEach((cell, i) => {
                if(wideColumns.includes(i)) cell.classList.add("column--wide");
            });
        });

        return table;
    }
}

const dateTime = {
    today: new Date(),
    presentYearStart: new Date(new Date().getFullYear(), 0, 1),
    getNumberString: (date = new Date(), model = "") => {
        // dates come in many forms, but only some are valid
        const validModels = [
            'mm-dd-yyyy', 'dd-mm-yyyy', 'mm-dd-yy', 'dd-mm-yy',
            'mm/dd/yyyy', 'dd/mm/yyyy', 'mm/dd/yy', 'dd/mm/yy',
            'mmddyyyy', 'ddmmyyyy', 'mmddyy', 'ddmmyy'
        ];
        // if the supplied date model is invalid, reset it
        if(!validModels.includes(model)) model = "mm/dd/yyyy";

        // check that the date parameter is also valid
        // try coercing invalid parameters to dates first
        if(!date instanceof Date) date = new Date(date);
        // if the parameter can't be coerced, throw an error
        if(date == "Invalid Date") throw new Error(`Method getNumberString() at dateTime requires a valid date parameter.`)

        // format the supplied date
        let year = new Date(date).getFullYear(),
            month = new Date(date).getMonth() + 1;
            date = new Date(date).getDate();
            // convert each to strings
            year = year.toString();
            month = month.toString();
            date = date.toString();
            // add leading zeros if applicable
            month = String(month).length === 1 ? "0" + month : month;
            date = String(date).length === 1 ? "0" + date : date;

        // test the model to determine the desired delimiter
        let delimiter = "";
        if(model.split("-").length > 1) delimiter = "-";
        if(model.split("/").length > 1) delimiter = "/";

        // shorten year if applicable
        if(model.length < 9) year = year.substring(2);

        // for testing character position, remove delimiters
        let strArray = model.split(delimiter), modelString = "";
        for(const str of strArray) modelString += str;
        // rearrange the string if the date or year leads
        let numberString = `${month}${delimiter}${date}${delimiter}${year}`;
        if(modelString.charAt(0) === "d") numberString = `${date}${delimiter}${month}${delimiter}${year}`;
        if(modelString.charAt(0) === "y" && modelString.charAt(year.length) === "m") 
            numberString = `${year}${delimiter}${month}${delimiter}${date}`;
        if(modelString.charAt(0) === "y" && modelString.charAt(year.length) === "d") 
            numberString = `${year}${delimiter}${date}${delimiter}${month}`;

        return numberString;
    }
}

const utilities = {
    disableStyles: (disable = true) => {
        if(disable) for(const sheet of document.styleSheets) sheet.disabled = true;
        else for(const sheet of document.styleSheets) sheet.disabled = false;
    },
    duplicateNode(node = HTMLElement){
        let clone = node.cloneNode(true);
        clone.id = utilities.getRandomId();
        clone.querySelectorAll("*").forEach(child => {
            child.id = utilities.getRandomId();
        });
        return clone;
    },
    getDimensions: (node = document.body) => {
        // get height and width
        let height = window.getComputedStyle(node).getPropertyValue("height"),
            width = window.getComputedStyle(node).getPropertyValue("width");
            // convert height and width to number values
            height = parseFloat(height.split("p")[0]);
            width = parseFloat(width.split("p")[0]);

        return {
            content: {
                height: Math.ceil(node.scrollHeight),
                width: Math.ceil(node.scrollWidth)
            },
            height: Math.ceil(height),
            width: Math.ceil(width)
        };
    },
    getRandomId: () => {
        let letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
        let leadingLetters = "";
        for(var i = 0; i < 4; ++i) leadingLetters += letters[Math.floor(Math.random() * 26)];
        let cryptoString = window.crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
        return leadingLetters + cryptoString;
    },
    showPlaceValues: (number = 0, quantity = 2) => {
        // the number parameter can be typeof string or number
        // coerce it to a string, regardless of type, and split at the decimal
        let str = number.toString().split('.');
        // if the string doesn't have a decimal, add trailing zeros
        if(str.length === 1) return `${str[0]}.00`;
        // if it does has a decimal
        if(str.length > 1) {
         // make sure there are at least place values to match quantity
            if(str[1].length < quantity){
                let trailingZeros = "";
                for(let i = 0; i < quantity; ++i) trailingZeros += "0";
                str[1] += trailingZeros;
            }
            // trim the place values to match quantity
            return `${str[0]}.${str[1].substring(0, quantity)}`;
        }
    },
    string: {
        capitalize: (string, delimiter = " ") => {
            let capitalized = "";
            string.split(delimiter).forEach((str, i) => {
                if(i += 1 < string.length) capitalized += `${str.charAt(0).toUpperCase() + str.slice(1)} `;
                else `${str.charAt(0).toUpperCase() + str.slice(1)}`;
            })
            return capitalized;
        }
    }
}

// listen for user to click the action (extension) button
chrome.runtime.onMessage.addListener(function(message, sender, response){
    // access the source of the message
    // it could come from other places (?)
    switch(message.source){
        case "action":
        default:
            // build the extension dialog
            // only if it isn't already part of the DOM
            // otherwise, remove the extension dialog
            if(document.querySelector("#extension-dialog") === null) build.dialog();
            else document.querySelector("#extension-dialog").remove();
            break;
    }
});