// Pre-defined variables.
var contact = [];
const department = [];
const newContact = [];
const org = [];
const title = [];

const T = new Date(Date.now());

var fileName = "contact.vcf";
var downloadFileName;
var handle = 1;

// Core functions.
// Initialize and add listeners to 'buttons'.
window.onload = function () {

    document.getElementById('open-button').onchange = readfile;
    clickOpen();
  
};



// Intercept users' click event to trigger true <input> button.
/*
  Reference source code & author:

    https://developer.mozilla.org/zh-TW/docs/Web/API/File/Using_files_from_web_applications, by Mozilla

*/
function clickOpen() {

    var open = document.getElementById('open-link');
    open.addEventListener("click", openListener , false);
  
}



// A click event listener is implemented on 'Open' button.
function openListener (e) {

    var open = document.getElementById('open-button');
    if (open) {
  
      open.click();
  
    }
  
    e.preventDefault();
  
}



// Read files opened by users.
/*
  Reference source code & author:

    https://www.kangting.tw/2012/09/html5-filereader.html, by 康廷數位
    https://kknews.cc/zh-tw/code/e6p2ygq.html, by IT人一直在路上
    https://stackoverflow.com/questions/1804745/get-the-filename-of-a-fileupload-in-a-document-through-javascript, by @vanessen on stackoverflow

*/
function readfile() {

    var file = this.files[0];
    fileName = file.name;
    fileManager = new FileReader();
  
    fileManager.onload = function (event) {
  
      contact = fileManager.result.split(/(?<=END:VCARD\r\n)/);  // Split each vcard

      document.getElementById('open-section').style.display = "none";
      var parents = document.getElementById('convert-section');
      parents.style.display = "block";
    
      // Insert a <p> tag to indicate user which file he/she just uploaded.
      /*
        Reference source code & author:

            https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore, by Mozilla
      */
      var child = document.createElement('p');
      child.setAttribute('id','convert-info');
      var childText = document.createTextNode(fileName);
      child.appendChild(childText);
      parents.insertBefore(child , document.getElementById('convert-link'));

      // Remove old click event listener and add new one.
      var open = document.getElementById('open-link');
      open.removeEventListener("click", openListener , false);
      var convertL = document.getElementById('convert-link');
      convertL.addEventListener("click", convertListener , false);
  
    };
  
    fileManager.readAsText(file,"utf-8");
  
}



// A click event listener is implemented on 'Convert' button.
function convertListener (e) {

    var convertL = document.getElementById('convert-link');
    if (convertL) {
  
      convert();
  
    }
  
    e.preventDefault();

}



// Convert roundcube-generated .vcf file into standard vCard format.
function convert() {

    for (i = 0 ; i < contact.length ; i++ ) {

      if ( contact[i].match(/(?<=X-DEPARTMENT:).*/) ) {

        department[i] = contact[i].match(/(?<=X-DEPARTMENT:).*/);

      } else {

        department[i] = "";

      }
      
      if ( contact[i].match(/(?<=ORG:).*/) ) {

        org[i] = contact[i].match(/(?<=ORG:).*/);

        if ( org[i].join().search(";") != -1 ) {

          org[i] = contact[i].match(/(?<=ORG:).*?(?=;)/);

        }

      } else {

        org[i] = "";

      }

      if ( contact[i].match(/(?<=TITLE:).*/) ) {

        title[i] = contact[i].match(/(?<=TITLE:).*/);
        
      } else {

        title[i] = "";

      }

    }

    for (i = 0 ; i < contact.length ; i++ ) {

      newContact[i] = contact[i].replace(/(?<=ORG:).*/,`${org[i]};${department[i]};${title[i]}`);

      if ( newContact[i].search(/(?<=REV:).*/) != -1 ) {

        newContact[i] = newContact[i].replace(/(?<=REV:).*/,`${T.getUTCFullYear()}${T.getUTCMonth()}${T.getUTCDay()}T${T.getUTCHours()}${T.getUTCMinutes()}${T.getUTCSeconds()}Z`);

      } else {

        newContact[i] = newContact[i].replace(/(?=END:VCARD)/,`REV:${T.getUTCFullYear()}${T.getUTCMonth()}${T.getUTCDay()}T${T.getUTCHours()}${T.getUTCMinutes()}${T.getUTCSeconds()}Z\r\n`);

      }

      if ( newContact[i].search(/(?<=ROLE:).*/) == -1 ) {

        newContact[i] = newContact[i].replace(/(?=END:VCARD)/,`ROLE:${title[i]}\r\n`);

      }

      if ( newContact[i].search(/(?<=X-ORIGIN:).*/) == -1 ) {

        newContact[i] = newContact[i].replace(/(?=END:VCARD)/,`X-ORIGIN:Roundcube Webmail\r\n`);
        handle = 0;

      }

    }

    var convertL = document.getElementById('convert-link');
    convertL.removeEventListener("click", convertListener , false);
    downloadBlobFile();

}



// Download new contacts.vcf file.
/*
  Reference source code & author:

    https://www.tinytsunami.info/javascript-file-process/, by 羊羽手札

*/
function downloadBlobFile() {

  var output = newContact.join("");
  let outputBlob = new Blob([output],{type : 'data:text/vcard; charset=utf-8'});
  blobUrl = URL.createObjectURL(outputBlob);
  downloadNode = document.createElement('a');
  downloadNode.id = 'convert-download';
  downloadNode.style.display = 'none';
  downloadNode.href = blobUrl;

  if (fileName.match(/^new_/) != -1 ) {

    if ( handle ) {

      downloadFileName = fileName;

    } else {

      downloadFileName = `new_${fileName}`;

    }

  } else {

    downloadFileName = `new_${fileName}`;

  }

  downloadNode.download = `${downloadFileName}`;
  document.getElementById('convert-section').appendChild(downloadNode);
  downloadNode.click();
  document.getElementById('convert-download').remove();
  document.getElementById('convert-link').style.display = "none";
  document.getElementById('convert-info').style.fontStyle = "inherit";
  document.getElementById('convert-info').innerHTML = `The converted file <code>${downloadFileName}</code> has been downloaded!<br />If you want to convert more files, refresh this page.`;

}


