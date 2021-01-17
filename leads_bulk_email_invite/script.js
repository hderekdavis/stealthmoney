const xlsx = require('node-xlsx');
const sgMail = require('@sendgrid/mail');
require('dotenv').config()

async function main () {
    
    const workSheetsFromFile = xlsx.parse(`${__dirname}/newLeads.xlsx`);

    sgMail.setApiKey(process.env.SENDGRID_KEY);

    let count = 0;

    for (const lead of workSheetsFromFile[0].data) {
      count++
      const leadName = lead[0] + ' ' + lead[1];
      const address = lead[2];
      const password = lead[10];

      const email = {
          to: address,
          from: {
            email: 'admin@greengrowthcpas.com',
            name: 'GreenGrowth CPAs'
          },
          templateId: 'd-d4c8a62466bd4decba50e59ce9096f3f',
          dynamicTemplateData: {
            "leadName": leadName,
            "email": address,
            "password": password
          },
              hideWarnings: true
      };
      
      await sgMail.send(email);
      console.log('Email sent to ' + address);
    }

    // const email = {
    //   to: [
    //     { email: 'ashmeadmichael@gmail.com'},
    //     { email: 'edubeghe@gmail.com'},
    //   ],
    //   from: {
    //     email: 'admin@greengrowthcpas.com',
    //     name: 'GreenGrowth CPAs'
    //   },
    //   templateId: 'd-d4c8a62466bd4decba50e59ce9096f3f',
    //   dynamicTemplateData: {
    //     "leadName": 'TEST',
    //     "email": 'ashmeadmichael@gmail.com',
    //     "password": "B+,,'P11)H85"
    //   },
    //   hideWarnings: true
  // };

  // await sgMail.send(email);
}

main();
