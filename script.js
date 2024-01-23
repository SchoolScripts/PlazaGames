const input = document.querySelector('input');
const games = document.querySelectorAll('#games img');

input.addEventListener('input', () => {
  const searchTerm = input.value.toLowerCase();
  games.forEach(game => {
    if (game.alt.toLowerCase().includes(searchTerm)) {
      game.style.display = 'block';
    } else {
      game.style.display = 'none';
    }
  });
});

function handleOutsideClick(event) {
    if (event.target === settingsDiv) return;
    
    if (settingsDiv.contains(event.target)) {
        console.log('hey');
        return;
    }
    
    settingsDiv.classList.remove("open");
    document.removeEventListener('click', handleOutsideClick);
}

function handleScroll() {
    settings();
    document.removeEventListener('click', handleOutsideClick);
    window.removeEventListener('scroll', handleScroll);
}

setInterval(() => {
    if (settingsDiv.classList.contains("open")) {
        document.addEventListener('click', handleOutsideClick);
        console.log('hey');
        window.addEventListener('scroll', handleScroll);
    }
    const searchInput = document.getElementById('search');

    searchInput.addEventListener('input', function() {
        if (!this.value.trim()) { // Check if the input is empty or just whitespace
            hideAds();
        }
    });

function settings() {
    var settings = document.getElementById('settings')
    if (settings.style.right === '-35%'){
        settings.classList.toggle('open');
    } else {
        settings.classList.toggle('open');
    }
}

function cloak(icon, title, id) {
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = icon;
    document.title= title;
    document.getElementsByTagName('head')[0].appendChild(link);
    
    localStorage.setItem('icon', icon);
    localStorage.setItem('title', title);
    localStorage.setItem('activeTab', id);

    document.querySelectorAll('#settings #pages #general .icons div').forEach(div => div.classList.remove('active'));

    document.querySelector(`#${id}`).classList.add('active');
}

var savedIcon = localStorage.getItem('icon');
var savedTitle = localStorage.getItem('title');
var savedTab = localStorage.getItem('activeTab');

if (savedIcon && savedTitle && savedTab) {
    cloak(savedIcon, savedTitle, savedTab);
} else {
    cloak('./assets/phantom.png', 'Phantom Games', 'phantom-set');
}
  
var record = document.getElementById('record');
var saveButton = document.getElementById('save');
var displayKey = document.querySelector('.key h2');

window.onload = function() {
    var preferredKey = localStorage.getItem('preferredKey');
    if (preferredKey) {
        displayKey.innerHTML = preferredKey;
    }
};

var logKeyCode = function(event) {
    var key = event.key;

    // Filter out unwanted keys
    var unwantedKeys = ['Shift', 'Control', 'CapsLock', 'Enter', 'Delete', 'NumLock', 'Insert', 'Home', 'PageUp', 'PageDown', 'End', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'a', 's', 'w', 'd', 'Meta', 'PrintScreen', 'ScrollLock', 'Pause', 'AudioVolumeMute', 'AudioVolumeDown', 'AudioVolumeUp'];

    if (!unwantedKeys.includes(key)) {
        localStorage.setItem('key', key);
        localStorage.setItem('preferredKey', key)
        displayKey.innerHTML = key;
    }
};

record.onclick = function() {
    if (record.innerHTML === '<i class="fa-solid fa-circle-microphone-lines"></i>Record Keystroke') {
        record.classList.add("flicker");
        record.innerHTML = 'Stop.';
        document.getElementById("save").style.display = "none"
        document.addEventListener('keydown', logKeyCode);
    } else {
        record.innerHTML = '<i class="fa-solid fa-circle-microphone-lines"></i>Record Keystroke';
        record.classList.remove("flicker");
        document.getElementById("save").style.display = "block"
        document.removeEventListener('keydown', logKeyCode);
    }
}

safetyKey = "https://classroom.google.com/";

if (localStorage.getItem('location')) {
    if (localStorage.getItem('location') === 'c') {
        safetyKey = "https://canvas.com/";
        removeActiveClass();
        document.getElementById("c").classList.add("active");
    } else {
        safetyKey = "https://classroom.google.com/";
        removeActiveClass();
        document.getElementById("gc").classList.add("active");
    }
}

document.getElementById("c").onclick = function() {
    safetyKey = "https://canvas.com/";
    removeActiveClass();
    localStorage.setItem('location', 'c')
    document.getElementById("c").classList.add("active");
}

document.getElementById("gc").onclick = function() {
    safetyKey = "https://classroom.google.com/";
    removeActiveClass();
    localStorage.setItem('location', 'gc')
    document.getElementById("gc").classList.add("active");
}

function removeActiveClass() {
    var btns = document.getElementsByClassName("site-option");
    for (var i = 0; i < btns.length; i++) {
        btns[i].classList.remove("active");
    }
}

var alertPreferredKey = function(event) {
    var preferredKey = localStorage.getItem('preferredKey');
    if (preferredKey) {
        if (event.key === preferredKey) {
            window.location.href = safetyKey;
        }
    } else {
        if (event.key === ']') {
            window.location.href = safetyKey;
            alert()
        }
    }
}

document.addEventListener('keydown', alertPreferredKey);

document.addEventListener('keydown', function(event) {
    if (event.key === "]" && !localStorage.getItem('preferredKey')) {
        if (record.innerHTML === "Stop.") {
            console.log('srry')
        } else {
            window.location.href = safetyKey;
        }
    } else if (event.key === localStorage.getItem('preferredKey')){
        if (record.innerHTML === "Stop.") {
            console.log('srry')
        } else {
            window.location.href = safetyKey;
        }
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === localStorage.getItem('preferredKey')) {
        if (record.innerHTML === "Stop.") {
            console.log('srry')
        } else {
            window.location.href = safetyKey;
        }
    }
});
