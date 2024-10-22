import { CALLBACK_URL } from '@/constants/constant';
import { StatusType } from '@/types/types';

/**
 * Injects jQuery into the current document by creating a script element
 * and appending it to the document head. The script source is set to
 * the jQuery CDN URL for version 3.6.0.
 *
 * @returns {string} A string containing the script to be executed, which
 * when run, injects jQuery and returns true to indicate successful injection.
 */
export const INJECT_JQUERY = (): string => {
  // jQuery injection script
  return `
    (function() {
      var script = document.createElement('script');
      script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js';
      script.type = 'text/javascript';
      document.head.appendChild(script);
    })();
    true; // returning true to indicate script has been injected
  `;
};

/**
 * Fills the login form with the provided credentials and submits it.
 *
 * @param {string} username - The username to fill in the form.
 * @param {string} password - The password to fill in the form.
 * @param {string} pin - The pin to fill in the form.
 * @returns {string} A string containing the script to be executed, which
 * when run, fills the form and submits it.
 */
export const FILL_LOGIN_FORM_AND_SUBMIT = (
  username: string,
  password: string,
  pin: string
): string => {
  return `
        (function() {
            document.getElementById('username').value = '${username}';
            document.getElementById('password2').value = '${password}';
            document.getElementById('pin').value = '${pin}';
            document.getElementById('pin2').value = '${pin}';
            let submitButton = document.querySelector('button[type="submit"][name="submit"].btn.btn-primary.btn-block');
            if (submitButton) {
                submitButton.click();
            } else {
                console.error('Submit button not found');
            }
        })();
        true`;
};

/**
 * Sends a GET request to create or retrieve the client key and secret.
 *
 * @param {string} providerNo - The provider number.
 * @returns {string} A string containing the script to be executed, which
 * when run, sends the GET request and handles the response.
 */
export const SEND_GET_REQUEST = (
  base_url: string,
  providerNo: string
): string => {
  return `
        function CREATE_CLIENT() {
            fetch('${base_url}/admin/api/clientManage.json?method=add&name=${providerNo}&uri=${CALLBACK_URL}&lifetime=86400')
                .then((response) => response.json())
                .then((data) => {
                    window.ReactNativeWebView.postMessage(JSON.stringify({ status: "${StatusType.SUCCESS}", message: "Key created successfully" }));
                    GET_CLIENT();
                })
                .catch(error => {
                    window.ReactNativeWebView.postMessage(JSON.stringify({ status: "${StatusType.ERROR}", message: "Failed to create key" }));
                })
        }
        function GET_CLIENT() {
            let keyFound = null;
            fetch('${base_url}/admin/api/clientManage.json?method=list')
                .then((response) => response.json())
                .then((data) => {
                    keyFound = data.find((item) => item.name === '${providerNo}');

                    if (!keyFound) {
                        window.ReactNativeWebView.postMessage(JSON.stringify({ status: "${StatusType.SUCCESS}", message: "Key not found. Creating Key" }));
                        CREATE_CLIENT();
                        return;
                    }
                    window.ReactNativeWebView.postMessage(JSON.stringify({ status: "${StatusType.SUCCESS}", data : { key: keyFound.key, secret: keyFound.secret } }));
                })
                .catch((error) => {
                    window.ReactNativeWebView.postMessage(JSON.stringify({ status: "${StatusType.ERROR}", message: "Failed to get key. Trying again" }));
                });
        }
        GET_CLIENT();
        true;
    `;
};

/**
 * Presses the authorize button on the OAuth page.
 *
 * @returns {string} A string containing the script to be executed, which
 * when run, presses the authorize button.
 */
export const AUTHORIZE_OAUTH = (): string => {
  return `
        (function() {
            let authorizeButton = document.querySelector('input[type="submit"].btn.btn-primary');
            if (authorizeButton) {
                authorizeButton.click();
            } else {
                console.error('Submit button not found');
            }
        })();
        true`;
};
