
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    const testFin = document.getElementById('test-fin');

    let isAvailable = typeof(cordova.plugins.msalPlugin) !== "undefined";
    console.log(isAvailable);

    window.cordova.plugins.msalPlugin.msalInit(
        function () {
            console.log('MSAL initialization successful');
        },
        function (err) {
            console.error('MSAL initialization error:', err);
        },
        {
            clientId: '9bff8bd5-413f-462a-bf97-ba2ad2872c30',
            tenantId: 'c7fe96f8-62a1-4925-81ff-318bb8d54d3b'
        }
    );
          
    document.getElementById('login-btn').addEventListener('click', () => {
        window.cordova.plugins.msalPlugin.signInSilent(
            function(resp) {
                console.log('User is already signed in:');
                logObject(resp);
                const name = resp.account.claims.find(claim => claim.key === "name");

                var optionalParams = {
                  allowBackup: true,
                };
            
                Fingerprint.isAvailable(isAvailableSuccess, isAvailableError, optionalParams);
                  function isAvailableSuccess(result) {
                    Fingerprint.show({
                      title: "Ucordilleras biometrics",
                      description: "Some biometric description"
                    }, successCallback, errorCallback);
                
                    function successCallback(){
                      localStorage.setItem("ucName", name.value);
                      window.location.href = "index.html";
                    }
                
                    function errorCallback(error){
                      alert(error.message);
                    }
                  }
              
                  function isAvailableError(error) {
                    var onSuccess = function (strSuccess) {
                      var authenticateSuccess = function (strSuccess) {
                        localStorage.setItem("ucName", name.value);
                        window.location.href = "index.html";
                      };
                    
                      var authenticateError = function (strError) {
                        alert(error.message);
                      };
                    
                      var optionalParams = {
                        title: "Login as "+name.value,
                        subtitle: "Verify with biometrics to continue",
                      };
          
                      cordova.plugins.BiometricAuth.authenticate(authenticateSuccess, authenticateError, optionalParams);
                    };

                    var onError = function (strError) {
                      if(strError === "BIOMETRIC_ERROR_NONE_ENROLLED"){
                        alert("Please enroll biometrics on your device for added protection to your account.")
                        localStorage.setItem("ucName", name.value);
                        window.location.href = "index.html";
                      }else if(strError === "BIOMETRIC_ERROR_UNSUPPORTED" || strError === "BIOMETRIC_ERROR_HW_UNAVAILABLE" || strError === "BIOMETRIC_ERROR_NO_HARDWARE"){
                        localStorage.setItem("ucName", name.value);
                        window.location.href = "index.html";
                      }else{
                        alert(strError);
                      }
                    };

                    cordova.plugins.BiometricAuth.isAvailable(onSuccess, onError);
                  }   
            }, 
            function(err) {
              console.warn('Silent sign-in failed, initiating interactive sign-in:', err);
              window.cordova.plugins.msalPlugin.signInInteractive(
                function(resp) {
                  console.log('User signed in interactively:');
                  logObject(resp);
                  const name = resp.account.claims.find(claim => claim.key === "name");
                  localStorage.setItem("ucName", name.value);
                  window.location.href = "index.html";
                }, 
                function(err) {
                  console.error('Sign-in error:', err);
                },
                {
                    prompt: 'LOGIN'
                }
              );
            }
        );
    });
}
function logObject(obj, prefix = '') {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (typeof value === 'object') {
          console.log(`${prefix}${key}:`);
          logObject(value, `${prefix}  `);
        } else {
          console.log(`${prefix}${key}:`, value);
        }
      }
    }
  }

