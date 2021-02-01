const xlsx = require('node-xlsx');
const axios = require('axios')

async function main () {
    
    const workSheetsFromFile = xlsx.parse(`${__dirname}/newLeads.xlsx`);

    let count = 0;

    for (const lead of workSheetsFromFile[0].data) {
        count++;

        let email = lead[2];
        let businessName = lead[0] + ' ' + lead[1];
        let password = lead[10];
        let phoneNumber = lead[3];
        let addresses = [];
        addresses.push({
            addressFirstLine: '',
            addressSecondLine: '',
            city: lead[6],
            state: lead[7],
            county: '',
            zipcode: '',
            businessVertical: getVerticals(lead[5]),
        })

        await saveToAuth0(email, password);
        await createBusiness(email, businessName, phoneNumber, addresses);
        
        console.log('created lead number ' + count);
    }

}

async function saveToAuth0 (email, password)  {
    try {
        const body = {
            client_id: 'ITcab3ln4IopywbhJZ1A1bcqhDwcST7u',
            email: email,
            password: password,
            connection: 'Username-Password-Authentication'
        };
        let auth0SignUpURL = 'https://greengrowthcpas.us.auth0.com/dbconnections/signup';
        return await axios.post(auth0SignUpURL, body);
    } catch(error) {
        console.log(error);
    }
};

async function createBusiness (email, businessName, phoneNumber, addresses)  {
    try {
        const body = {
            email, businessName, phoneNumber, legalEntity: 7, addresses
        };
        return await axios.post('http://localhost:3000/api/business', body);
    } catch(error) {
        console.log(error);
    }
};

const getVerticals = function(text) {
    let verticals = [];
    if (text.indexOf('Cultivation') >= 0) {
        verticals.push(1);
    }
    if (text.indexOf('Manufacturing') >= 0) {
        verticals.push(2);
    }
    if (text.indexOf('Distribution') >= 0) {
        verticals.push(3);
    }
    if (text.indexOf('Retail') >= 0) {
        verticals.push(4);
    }
    if (text.indexOf('Delivery') >= 0) {
        verticals.push(5);
    }
    return verticals;
};

main();

