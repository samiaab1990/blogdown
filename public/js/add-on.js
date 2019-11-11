/*
  This js file is for individual users to modify the scripts for their personal site,
  or for the implementation of features specifically for their site. Anything that
  is an official part of the theme (ex. Pull Requests) should be included in main.js
  and follow the formatting and style given.
*/

const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

if (currentTheme) {

document.documentElement.setAttribute('data-theme', currentTheme);
 

if (currentTheme === 'dark') {
toggleSwitch.checked = true;
document.getElementById('name-image').src='/img/main/dark-themename.png';
}
}

function switchTheme(e) {
    if (e.target.checked) {
        
  document.documentElement.setAttribute('data-theme', 'dark');
  document.getElementById('name-image').src='/img/main/dark-themename.png';

  

        localStorage.setItem('theme', 'dark');
    }
    else {
          document.documentElement.setAttribute('data-theme', 'light');
          document.getElementById('name-image').src='/img/main/name.png';
         

          localStorage.setItem('theme', 'light');
    }    
}

toggleSwitch.addEventListener('change', switchTheme, false);


/*For changing header images with dark mode*/

