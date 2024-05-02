class Client {
    constructor(){
        this[oauth] = localStorage.getItem("prod:SugarCRM:AuthAccessToken").toString().split(`"`)[1];
    }
    getCurrentResource(url){
        return url.split("#")[1].split("/")[0].toString();
    }
}
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

class Patient {
    constructor(){
        this[id] = this.getPatientId(window.location.href),
        this[fname] = this.#nameArray[0],
        this[lname] = this.#nameArray[1]
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
            isProfile: url.split("#")[1].split("/")[0].toString() === "Contact" ? true : false,
            patientId: url.split("/")[2].toString()
        };
        if(active.isProfile) return active.patientId;
        else throw new Error(`Expected location of https://axis.thejoint.com/#Contacts. Location is set to https://axis.thejoint.com/#${active.resource}instead.`);
    }
}

// listen for user input from extension popup
chrome.runtime.onMessage.addListener(function(message, sender, response) {
    message = JSON.parse(message);
});

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
        let response = await fetch(new Request(`https://axis.thejoint.com/rest/v11_20/Contacts/${ getContactId(window.location.href) }/custom_link/contacts_transactions_refunds?filter%5B0%5D%5Bdate_entered%5D%5B%24dateBetween%5D%5B%5D=01-01-${ year - 1 }&filter%5B0%5D%5Bdate_entered%5D%5B%24dateBetween%5D%5B%5D=01-01-${ year }`), { headers: {"Oauth-Token": Client.oauth} });
        // process and return response
        if(response.ok) return await response.json() 
        else throw new Error(`Server response at readTransactionsFrom() returned "${response.status}: ${response.statusText}."`);
    } catch (error){
        console.log(error);
        return error;
    }
}
async function readVisits(quantity = Number){
    try{
        // validate quantity parameter
        if(typeof quantity != "number") 
            throw new Error(`Function readRecentVisits() requires parameter type of number. Received type of ${typeof quantity} instead.`);
        // request quantity of visit records
        let response = await fetch(new Request(`https://axis.thejoint.com/rest/v11_20/Contacts/${getContactId(window.location.href)}/link/contacts_tj_visits_1?erased_fields=true&view=subpanel-for-contacts-contacts_tj_visits_1&fields=date_entered%2Cstatus%2Chas_carecard%2Cmy_favorite&max_num=${quantity}&order_by=date_entered%3Adesc&filter%5B0%5D%5Bstatus%5D=Completed`), { headers: {"Oauth-Token": Client.oauth} });
        // get visit data for each visit
        let visits = await response.json();
        if(response.ok) {
            if(Array.isArray(visits)){
                let i = 0;
                for(const visit in visits){
                    let res = await fetch(new Request(`https://axis.thejoint.com/rest/v11_20/TJ_Visits/${ visit.id }?erased_fields=true&view=record&fields=date_entered%2Cstatus%2Chas_carecard&viewed=1`), { headers: {"Oauth-Token": Client.oauth} });
                    visits.splice(++i, 1, await res.json());
                }
            } else { throw new Error(`Expected server response type of array but received type of ${typeof visits} instead.`); }
        } else { throw new Error(`Server response at readTransactionsFrom() returned "${response.status}: ${response.statusText}."`); }
        return visits;
    } catch (error){
        console.log(error);
        return error;
    }
}