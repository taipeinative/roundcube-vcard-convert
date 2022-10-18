// Pre-defined variables.
var contact;
var fileName = "contact.vcf";

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
  
    };
  
    fileManager.readAsText(file,"utf-8");
  
  }