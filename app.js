/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var express    = require('express'),
  app          = express(),
  watson       = require('watson-developer-cloud');

// Bootstrap application settings
require('./config/express')(app);

// Create the service wrapper
var nlClassifier = watson.natural_language_classifier({
  url : 'https://gateway.watsonplatform.net/natural-language-classifier/api',
  username : 'b9daf7a7-78b9-4335-b1c3-e9373cbe8c9c',
  password : 'Vcy26ETQqNRy',
  version  : 'v1'

});

// render index page
app.get('/', function(req, res) {  // '/' is teh get method
  //console.log('CUNY-TECH')
  res.render('index', {
    ct: req._csrfToken,
    ga: process.env.GOOGLE_ANALYTICS
  });

    console.log('Finished rendering');
});

// Call the pre-trained classifier with body.text
// Responses are json
app.post('/api/classify', function(req, res, next) {
  var params = {
    classifier: process.env.CLASSIFIER_ID || '3a84cfx63-nlc-635', // pre-trained classifier
    text: req.body.text
  };

  console.log('PARAMETERS:', params);
  console.log('In app.post');

  nlClassifier.classify(params, function(err, results) {
    if (err) {
      console.log(err);
      return next(err);
    }
    else
      res.json(results);
  });
});

require('./config/error-handler')(app);

module.exports = app;
