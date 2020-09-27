# GetCheck

## Problem Statement
The main challenge while the COVID-19 pandemic is to implement a secure ‘COVID-19 status certificate’ for citizens of Canada and USA who live in a border city. The solution which will outline a diagnostic testing strategy to detect the presence or absence of the COVID19 virus (nasal, saliva) and antibodies (blood), and transfer the results to a secure portal. The secure mechanism is for citizens of both USA/Canada to opt-in to share their COVID-19 test results (COVID-19 status) as a digital verifiable certificate to authorized stakeholders. Certificates could be used for a variety of scenarios: permission to travel to (land border), volunteering, leisure & tourism activities, and health & wellness
services.

## What it does
The web application that we have built can be used by the people of the border areas of USA and Canada to schedule thier testing on thier own. Once they have scheduled the testing, they can get the report of thier test after logging in to their account. It also sends them an email notifying of update in thier reports. The web application provides them a certificate which has all the necessary details mentioned about the patient as well as their status of the result. The COVID certifiacte also has a QR Code which can be scanned by the governing authorities to check if the report has been tampered or not. The QR Code once scanned shows the realtime status of the report of the person. All the patients have unique ID assigned to them which is of 36 alpha numeric characters hence it can't be guessed. The reports are very securely stored in the NoSQL databse and also on the Blockchain. Hence it can be verified by the Blockchain as well. The application also has REST API available using which we can directly itegrate our system into any existing systems which makes easy for the developers.

### API
The following endpoints are to integrate our application with the existing systems. 
```
- /api/verify/:uid   ---> Endpoint to verify any Test report. (Does not requires Key and is open for everyone to use)
- /api/getpdf/:uid ---> Endpoint to get COVID Test Certificate. (Requires Key to verify if the request is authentic or not)
- /api/add/appointment ---> Endpoint to add appointment to database. (Requires Key to verify if the request is authentic or not)
- /update/:uid ---> Endpoint to update status of report. (Requires Key to verify if the request is authentic or not)
```

## How we built it
We started with a NodeJS Express server which was hosted on Google Cloud Platform's App Engine and our Database i.e MongoDB is also on Google Cloud Platform. Our team then distributed the project among ourselves based on our skills. This made us work efficiently and collaborate with each other easily. We used the domain from Domain.com and Cloudflare for the protection of our web application from online attacks. Then we added the A records and AAA records on our domain to point to App engine. This process was easy as the GCP provided us all the steps to follow to achieve this. We used the datasets provided to us along with our own datasets to create the visualizations. The visulatization is made using Google Analytics Charts. The blockchain was made in Python and Flask which helps us in verifying the reports.

## Challenges I ran into
we came across many challenges such as design for our dashboard and the certificate which we resolved by discussion and coming to common conslusion. The deployment in App Enginer (GCP) was also a issue that we encountered during this project which we resolved by going through the official docs and seeing the examples.

## What I learned
Doing this projects we learned how to use the Google Cloud Platform and deploy our web applications on App Engine. Many features that we have added in our application such as PDF generation, QR code was new for us and hence we leanrt those in order to integrate in our application.

## Team:
- Vineet Ranjan : https://github.com/darkpanda08
- Ekta Gupta : https://github.com/eKta37
- Rhea Shashtri : https://github.com/Rio-cyber
- Danwand: https://github.com/DanBrown47
