/**
 * A nodeJS wrapper for paypal payflow
 *
 * @package paypal\-payflow
 * @author Parvez Rahaman <indparvez@gmail.com>
 */

"use strict";

var Curl = require('node-libcurl').Curl;
var md5 = require('md5');
var promisify = require("promisify-node");

module.exports = PayFlow;

function PayFlow (vendor, partner, user, password, billingType) {

    //var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;

    return new PayPal(vendor, partner, user, password, billingType)
}

function PayPal(vendor, partner, user, password, billingType){

    billingType = billingType || 'single';

    this.vendor = vendor;

    this.partner = partner;

    this.user = user;

    this.password = password;

    this.environment = 'test';

    this.billingType = billingType;

    this.gatewayURL = {
        live: 'https://payflowpro.paypal.com',
        test: 'https://pilot-payflowpro.paypal.com'
    };

    this.NVP = {};

    this.response = '';

    var self = this;

    this.setupDefaults = function(){

        var defaults = {
            VENDOR: self.vendor,
            PARTNER: self.partner,
            USER: self.user,
            PWD: self.password,
            VERBOSITY: 'MEDIUM'
        };

        self.NVP = Object.assign(self.NVP, defaults);


    };

    this.setupDefaults();

    this.setEnvironment = function(environment){

        environment = environment || 'test';

        self.environment = self.gatewayURL[environment] || 'test';

        return this;

    };

    this.getEnvironment = function(){

        return self.environment;

    };

    this.setTransactionType = function(transactionType){

        transactionType = transactionType || 'S';

        var type = {
            TRXTYPE: transactionType
        };

        self.NVP = Object.assign(self.NVP, type);

        return this;

    };

    this.setPaymentMethod = function(paymentMethod){
        paymentMethod = paymentMethod || 'C';

        var method = {
            TENDER: paymentMethod
        };

        self.NVP = Object.assign(self.NVP, method);

        return this;

    }

    this.setPaymentCurrency = function(paymentCurrency){

        paymentCurrency = paymentCurrency || 'USD';

        var currency = {
            CURRENCY: paymentCurrency
        };

        self.NVP = Object.assign(self.NVP, currency);

        return this;

    }

    this.setProfileAction = function(profileAction){

        profileAction = profileAction || 'A';

        var action = {
            ACTION: profileAction
        };

        self.NVP = Object.assign(self.NVP, action);

        return this;

    }

    this.setProfileName = function(profileName){

        profileName = profileName || 'RecurringTransaction';

        var name = {
            PROFILENAME: profileName
        };

        self.NVP = Object.assign(self.NVP, name);

        return this;

    }

    this.setProfileStartDate = function(profileStartDate){

        profileStartDate = profileStartDate || '';

        var date = {
            START: profileStartDate
        };


        self.NVP = Object.assign(self.NVP, date);

        return this;
    }

    this.setProfilePayPeriod = function(profilePayPeriod){

        profilePayPeriod = profilePayPeriod || 'MONT';

        var period = {
            PAYPERIOD: profilePayPeriod
        };

        self.NVP = Object.assign(self.NVP, period);

        return this;

    }

    this.setProfileTerm = function(profileTerm){

        profileTerm = profileTerm || 0;

        var term = {
            TERM: profileTerm
        };

        self.NVP = Object.assign(self.NVP, term);

        return this;

    }

    this.setProfileId = function(profileId){

        profileId = profileId || '';

        var profile = {
            ORIGPROFILEID: profileId
        };

        self.NVP = Object.assign(self.NVP, profile);

        return this;

    }

    this.setProfileId = function(profileId){

        profileId = profileId || '';

        var profile = {
            ORIGPROFILEID: profileId
        };

        self.NVP = Object.assign(self.NVP, profile);

        return this;

    }

    this.setAmount = function(amount){

        amount = amount || 0;

        var amt = {
            AMT: amount
        };

        self.NVP = Object.assign(self.NVP, amt);

        return this;

    }

    this.setCCNumber = function(number){

        number = number || ''

        var cc = {
            ACCT: number
        };

        self.NVP = Object.assign(self.NVP, cc);

        return this;

    }

    this.setExpiration = function(expiration){

        expiration = expiration || '0000';

        var exp = {
            EXPDATE: expiration
        };

        self.NVP = Object.assign(self.NVP, exp);

        return this;

    }

    this.setCVV = function(cvv){

        cvv = cvv || '';

        var security = {
            CVV2: cvv
        };

        self.NVP = Object.assign(self.NVP, security);

        return this;

    }

    this.setCreditCardName = function(cardName){
        cardName = cardName || '';

        var name = {
            NAME: cardName
        };

        self.NVP = Object.assign(self.NVP, name);

        return this;
    }

    this.setCustomerFirstName = function(firstName){

        firstName = firstName || '';

        var first = {
            FIRSTNAME: firstName
        };

        self.NVP = Object.assign(self.NVP, first);

        return this;

    }

    this.setCustomerLastName = function(lastName){

        lastName = lastName || '';

        var last = {
            LASTNAME: lastName
        };

        self.NVP = Object.assign(self.NVP, last);

        return this;

    }

    this.setCustomerAddress = function(customerAddress){

        customerAddress = customerAddress || '';

        var address = {
            STREET: customerAddress
        };

        self.NVP = Object.assign(self.NVP, address);

        return this;

    }

    this.setCustomerCity = function(customerCity){

        customerCity = customerCity || '';

        var city = {
            CITY: customerCity
        };

        self.NVP = Object.assign(self.NVP, city);

        return this;

    }


    this.setCustomerState = function(customerState){

        customerState = customerState || '';

        var state = {
            STATE: customerState
        };

        self.NVP = Object.assign(self.NVP, state);

        return this;

    }

    this.setCustomerZip = function(customerZip){

        customerZip = customerZip || '';

        var zip = {
            ZIP: customerZip
        };

        self.NVP = Object.assign(self.NVP, zip);

        return this;

    }

    this.setCustomerCountry = function(customerCountry){

        customerCountry = customerCountry || '';

        var country = {
            COUNTRY: customerCountry
        };

        self.NVP = Object.assign(self.NVP, country);

        return this;

    }

    this.setCustomerPhone = function(customerPhone){

        customerPhone = customerPhone || '000-000-0000';

        var phone = {
            PHONENUM: customerPhone
        };

        self.NVP = Object.assign(self.NVP, phone);

        return this;

    }

    this.setCustomerEmail = function(customerEmail){

        customerEmail = customerEmail || '';

        var email = {
            EMAIl: customerEmail
        };

        self.NVP = Object.assign(self.NVP, email);

        return this;

    }

    this.setPaymentComment = function(description){

        description = description || '';

        var desc = {
            COMMENT1: description
        };

        self.NVP = Object.assign(self.NVP, desc);

        return this;

    }

    //this.setPaymentComment2 = function(description){
    //
    //    description = description || '';
    //
    //
    //
    //}

    this.getNVP = function(){

        var post = '';

        Object.keys(self.NVP).forEach(function(key) {
            var val = self.NVP[key];
            post+=key+'='+val+'&';
        });

        post = post.replace(/&+$/,'');

        return String(post);

    }

    function asyncCurl(callback){
        var curl = new Curl();

        curl.setOpt(Curl.option.URL, self.getEnvironment());
        curl.setOpt(Curl.option.HTTPHEADER, [true]);
        curl.setOpt(Curl.option.HEADER, 1);
        curl.setOpt(Curl.option.TIMEOUT, 45);
        curl.setOpt(Curl.option.FORBID_REUSE, false);
        curl.setOpt(Curl.option.SSL_VERIFYPEER, false);
        curl.setOpt(Curl.option.POST, 1);
        curl.setOpt(Curl.option.POSTFIELDS, self.getNVP());
        curl.on('error', function(err) {
            this.close();

            callback(null, false)
        });
        curl.on('end', function(statusCode, body, headers){

            var result = {};

            var position = body.indexOf('RESULT');

            body.slice(position).split('&').forEach(function(v, k){
                var tmp = v.split('=');
                result[tmp[0]] = tmp[1];
            })

            callback(null, result)

        })
        curl.perform();
    }

    this.getHeaders = function(){
        var headers = [];
        headers.push('Content-Type: text/namevalue');
        headers.push('X-VPS-Timeout: 30');
        headers.push('X-VPS-VIT-Client-Certification-Id: 33baf5893fc2123d8b191d2d011b7fdc');
        headers.push('X-VPS-Request-ID: '+self.getRequestId());
        return headers;
    }

    this.getRequestId = function(){

        var date = new Date();
        var time = date.getTime();

        return md5(time);

    }

    this.execute = promisify(asyncCurl);

}
