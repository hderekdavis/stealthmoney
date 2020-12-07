const xlsx = require('node-xlsx');
const sgMail = require('@sendgrid/mail');
const SENDGRID_KEY = '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';

async function main () {
    
    const workSheetsFromFile = xlsx.parse(`${__dirname}/newLeads.xlsx`);

    sgMail.setApiKey(SENDGRID_KEY);

    for (const lead of workSheetsFromFile[0].data) {

        const leadName = lead[0] + ' ' + lead[1];
        const email = lead[2];
        const password = lead[9];

        const email = {
            to: email,
            from: {
              email: 'admin@greengrowthcpas.com',
              name: 'GreenGrowth CPAs'
            },
            templateId: 'd-d4c8a62466bd4decba50e59ce9096f3f',
            dynamicTemplateData: {
              "leadName": leadName,
              "email": email,
              "password": password
            }
        };
        
        // await sgMail.send(email); THIS WILL SEND THE EMAILS, UNCOMMENT ONLY TO SEND THEM
        console.log('Email sent to ' + email);
    }

}

main();

