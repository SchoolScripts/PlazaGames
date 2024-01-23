const input = document.querySelector('input');
const games = document.querySelectorAll('#games img');
var mobile = window.innerWidth < 850;
var settingsDiv = document.getElementById('settings');

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

    function hideAds() {
        const adElements = document.querySelectorAll('.when');
        
        adElements.forEach(ad => {
            ad.style.display = 'block';
        });
    }
}, 100);

const urlParams = new URLSearchParams(window.location.search);

if (urlParams.get('category')) {
    function loadGamesByCategory() {
        const categoryToDisplay = urlParams.get('category');
        console.log("Category from URL:", categoryToDisplay);
        document.getElementById('top').style.display = 'none';
        document.getElementById('games').style.marginTop = '6vw';

        fetch('games.json')
            .then(response => response.json())
            .then(gamesData => {
                console.log("All game categories:", Object.keys(gamesData));

                if (categoryToDisplay) {
                    document.getElementById("games").innerHTML = '';
                }

                Object.keys(gamesData).forEach(category => {
                    if (categoryToDisplay && category.toLowerCase() !== categoryToDisplay.toLowerCase()) {
                        console.log("Skipping category:", category); 
                        return;
                    }

                    const categoryElement = document.createElement("h1");
                categoryElement.innerHTML = category + ": <a href='/'><button>View Less</button></a>" ;
                categoryElement.classList.add("category-header");
                document.getElementById("games").appendChild(categoryElement);

                const categoryShadowWrapper = document.createElement("div");
                categoryShadowWrapper.style.position = 'relative';
                categoryShadowWrapper.style.overflow = 'hidden';

                const categoryWrapper = document.createElement("div");
                categoryWrapper.classList.add("category-wrappers");

                gamesData[category].forEach(gameArray => {
                    const gameElement = document.createElement("div");
                    gameElement.classList.add("game");
                    gameElement.innerHTML = `
                        <img data-src="${gameArray[2]}" alt="${gameArray[0]}">
                        <div class="overlay" onclick="play('${gameArray[4] || gameArray[3]}', '${gameArray[3]}', '${gameArray[0]}', '${gameArray[1]}')">
                            <h1>${gameArray[0]}</h1>
                            <p>${gameArray[0]}</p>
                        </div>
                    `;
                    categoryWrapper.appendChild(gameElement);
                    observeImage(gameElement.querySelector("img"));
                });

                categoryShadowWrapper.appendChild(categoryWrapper);
                document.getElementById("games").appendChild(categoryShadowWrapper);

                categoryWrapper.addEventListener("scroll", function() {
                    adjustButtonVisibility(categoryWrapper, scrollLeftButton, scrollRightButton);
                });
                });

            setTimeout(() => {
                document.getElementById('loader').style.display = 'none';
            }, 100);
            document.getElementById('games').style.display = 'block';
            addEventListeners();
        });
    }

    loadGamesByCategory();
} else {

if (mobile) {
    fetch('games.json')
    .then(response => response.json())
    .then(categories => {
        let allGames = [];
        
        for (let category in categories) {
            allGames = allGames.concat(categories[category]);
        }

        let uniqueGames = [];
        let titles = new Set();

        allGames.forEach(game => {
            if (!titles.has(game[0])) {
                titles.add(game[0]);
                uniqueGames.push(game);
            }
        });

        uniqueGames.forEach(game => {
            const gameElement = document.createElement("div");
            gameElement.classList.add("game");
            gameElement.innerHTML = `
                <img src="${game[2]}" class="img" onclick="play('${game[4] || game[3]}', '${game[3]}', '${game[0]}', '${game[1]}')">
                <h1>${game[0]}</h1>
                <button class="install" onclick="play('${game[4] || game[3]}', '${game[3]}', '${game[0]}', '${game[1]}')">Play</button>
            `;
            document.getElementById("games").appendChild(gameElement);
            observeImage(gameElement.querySelector(".img"));
        });

        setTimeout(() => {
            document.getElementById('loader').style.display = 'none';
        }, 100);
        document.getElementById('games').style.display = 'grid';
    });

    function observeImage(imgElement) {
        const options = {
            root: null,
            rootMargin: "0px",
            threshold: [0]
        };

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    imgElement.style = `background-image: url(${imgElement.dataset.src}); background-size: cover; background-position: center;`;
                    observer.unobserve(imgElement);
                }
            });
        }, options);

        observer.observe(imgElement);
    }
} else {
    fetch('games.json')
    .then(response => response.json())
    .then(gamesData => {
        Object.keys(gamesData).forEach(category => {

            const categoryElement = document.createElement("h1");
            categoryElement.innerHTML = category + `: <a href='/?category=${category}'><button>View All</button></a>` ;
            categoryElement.classList.add("category-header");
            document.getElementById("games").appendChild(categoryElement);

            const categoryShadowWrapper = document.createElement("div");
            categoryShadowWrapper.style.position = 'relative';
            categoryShadowWrapper.style.overflow = 'hidden';

            const categoryWrapper = document.createElement("div");
            categoryWrapper.classList.add("category-wrapper");

            let hasPopularGame = false;

            gamesData[category].forEach(gameArray => {
                const gameElement = document.createElement("div");
                gameElement.classList.add("game");

                let popularHTML = '';

                if (gameArray.includes("popular")) {
                    hasPopularGame = true; 
                    popularHTML = '<i class="fa-solid fa-fire-flame-simple fa-shake" role="button" aria-label="popular icon"></i>';
                }

                gameElement.innerHTML = `
                    <img data-src="${gameArray[2]}" alt="${gameArray[0]}">
                    ${popularHTML}
                    <div class="overlay" onclick="play('${gameArray[4] || gameArray[3]}', '${gameArray[3]}', '${gameArray[0]}', '${gameArray[1]}')">
                        <h1>${gameArray[0]}</h1>
                        <p>${gameArray[0]}</p>
                        <p style="display:none;" class="description-search">${gameArray[1]}</p>
                        <p style="display:none;" class="game-url">${gameArray[3]}</p>
                    </div>
                `;

                categoryWrapper.appendChild(gameElement);
                observeImage(gameElement.querySelector("img"));
            });

            categoryShadowWrapper.appendChild(categoryWrapper);
            document.getElementById("games").appendChild(categoryShadowWrapper);

            const scrollLeftButton = document.createElement("button");
            scrollLeftButton.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
            scrollLeftButton.setAttribute("aria-label", "Scroll left");
            scrollLeftButton.setAttribute("role", "button");
            scrollLeftButton.addEventListener("click", function() {
                let vw = window.innerWidth;
                let scrollAmount = vw * 0.4;
                categoryWrapper.scrollLeft -= scrollAmount;
            });
            scrollLeftButton.classList.add("scroll-btn", "left-btn");
            scrollLeftButton.style.display = "none";
            categoryShadowWrapper.appendChild(scrollLeftButton);

            const scrollRightButton = document.createElement("button");
            scrollRightButton.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
            scrollRightButton.setAttribute("aria-label", "Scroll right");
            scrollRightButton.setAttribute("role", "button");
            scrollRightButton.addEventListener("click", function() {
                let vw = window.innerWidth;
                let scrollAmount = vw * 0.4;
                categoryWrapper.scrollLeft += scrollAmount;
            });
            scrollRightButton.classList.add("scroll-btn", "right-btn");
            scrollRightButton.style.display = "none";
            categoryShadowWrapper.appendChild(scrollRightButton);

            setTimeout(() => {
                adjustButtonVisibility(categoryWrapper, scrollLeftButton, scrollRightButton);
            }, 0);

            categoryWrapper.addEventListener("scroll", function() {
                adjustButtonVisibility(categoryWrapper, scrollLeftButton, scrollRightButton);
            });
        });

        setTimeout(() => {
            document.getElementById('loader').style.display = 'none';
        }, 100);
        document.getElementById('games').style.display = 'block';
        addEventListeners();
    });
}
}
function observeImage(imgElement) {
    const options = {
        root: null,
        rootMargin: "0px",
        threshold: [0]
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                imgElement.src = imgElement.dataset.src; // Setting the src from data-src
                observer.unobserve(imgElement);
            }
        });
    }, options);

    observer.observe(imgElement);
}

function addEventListeners() {
    const items = document.querySelectorAll('.game');

    items.forEach(item => {
        item.addEventListener('mousemove', e => {
            const img = item.querySelector('img');
            const itemRect = item.getBoundingClientRect();
            const xPos = e.clientX - itemRect.left - itemRect.width / 2;
            const yPos = e.clientY - itemRect.top - itemRect.height / 2;
            const xPercent = xPos / itemRect.width * 100;
            const yPercent = yPos / itemRect.height * 100;
            img.style.transform = `translate(${xPercent}px, ${yPercent}px) scale(1.9)`;
        });
        
        item.addEventListener('mouseout', () => {
            const img = item.querySelector('img');
            img.style.transform = 'none';
        });

        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            img.style.transform = 'none';
        });
    });
}

function adjustButtonVisibility(wrapper, leftBtn, rightBtn) {
    if (wrapper.scrollLeft === 0) {
        leftBtn.style.opacity = "0";
        setTimeout(() => {
            if (leftBtn.style.opacity === "0") { // Ensure it hasn't changed in the meantime
                leftBtn.style.display = "none";
            }
        }, 400);
    } else {
        leftBtn.style.display = "block";
        setTimeout(() => {
            leftBtn.style.opacity = "1";
        }, 0); // Immediate change after display is set to block
    }

    if (wrapper.scrollLeft + wrapper.offsetWidth >= wrapper.scrollWidth) {
        rightBtn.style.opacity = "0";
        setTimeout(() => {
            if (rightBtn.style.opacity === "0") { // Ensure it hasn't changed in the meantime
                rightBtn.style.display = "none";
            }
        }, 400);
    } else {
        rightBtn.style.display = "block";
        setTimeout(() => {
            rightBtn.style.opacity = "1";
        }, 0); // Immediate change after display is set to block
    }
}


let gameFunctions = {
    "retrobowl": retroBowl,
    "vexsix": vexSix,
    "templeruntwo": templeRunTwo,
    "bobtherobbertwo": bobTheRobberTwo,
    "cookieclicker": cookieClicker,
    "jetpackjoyride": jetPackJoyride,
    "monkeymart": monkeyMart,
    "eggycar": eggyCar,
};

function play(game, url, name, description) {
    gtag('event', 'play', {
        'event_category': 'game',
        'event_label': name
    });
    
    clearSearch()
    if (!mobile) {
        document.getElementById('game-banner').style.position = 'fixed';
        document.getElementById('game-banner').style.marginTop = '5vw';
        document.getElementById('game-banner-right').style.position = 'fixed';
        document.getElementById('game-banner-right').style.marginTop = '5vw';
        document.getElementById('game-banner').style.zIndex = '99999';
        document.getElementById('game-banner-right').style.zIndex = '99999';
    }

    if (mobile) {
        if (document.getElementById('game-frame').style.display === 'block') {
            document.getElementById('game-ad').style.display = 'none';
            document.getElementById('game-frame').style.display = 'none';
            document.getElementById('game-content').style.display = 'none';
            document.getElementById('iframe').src = '';
            document.body.style.overflowY = 'visible';
        } else {
            document.getElementById('game-ad').style.display = 'block';
            document.getElementById('game-frame').style.display = 'block';
            document.getElementById('game-content').style.display = 'none';
            document.getElementById('game-frame').style.height = '98vh';
            document.getElementById('game-frame').style.marginTop = '2vh';
            document.getElementById('game-frame').style.overflow = 'hidden';
            document.getElementById('iframe').style.width = '100vw';
            document.getElementById('iframe').style.height = '98vh';
            document.getElementById('iframe').src = url;
            document.body.style.overflowY = 'hidden';
        }
    } else {
        if (localStorage.getItem('hacks') === '[]' || localStorage.getItem('hacks') === undefined) {
            /*if (document.getElementById('game-frame').style.display === 'block') {
                document.getElementById('game-ad').style.display = 'none';
                document.getElementById('game-frame').style.display = 'none';
                document.getElementById('iframe').src = '';
                document.body.style.overflowY = 'visible';
            } else {*/
                document.getElementById('game-ad').style.display = 'block';
                document.getElementById('game-frame').style.display = 'block';
                document.getElementById('iframe').src = url;
                document.body.style.overflowY = 'hidden';
            //}
        } else {
            let hacks = JSON.parse(localStorage.getItem('hacks'));
            game = game.toLowerCase().replace(/[\s-]/g, '');

            /*if (document.getElementById('game-frame').style.display === 'block') {
                document.getElementById('game-ad').style.display = 'none';
                document.getElementById('game-frame').style.display = 'none';
                document.getElementById('iframe').src = '';
                document.getElementById('game-name').innerHTML = '';
                document.getElementById('game-desc').innerHTML = '';
                document.body.style.overflowY = 'visible';

                document.getElementById('hack').style.display = 'none';
                document.getElementById('hack').onclick = null;
            } else {*/
                document.getElementById('game-ad').style.display = 'block';
                document.getElementById('game-frame').style.display = 'block';
                document.getElementById('iframe').src = url;
                document.getElementById('game-name').innerHTML = name;
                document.getElementById('game-desc').innerHTML = description;
                document.body.style.overflowY = 'hidden';

                if (hacks.includes(game)) {
                    document.getElementById('hack').style.display = 'block';
                    document.getElementById('hack').onclick = gameFunctions[game];
                } else {
                    localStorage.setItem('game', game);
                    document.getElementById('hack').style.display = 'none';
                    document.getElementById('hack').onclick = null;
                }
            //}
        }
    }   
}

function gamesPerspective() {
    const gameContent = Array.from(document.getElementsByClassName('game-content'));
    const games = Array.from(document.getElementsByClassName('game'));
    const images = Array.from(document.getElementsByClassName('img'));
    
    if (document.getElementById('games').style.gridTemplateColumns === 'repeat(9, 9.5vw)') {
        gameContent.forEach(game => {
            games.forEach(gameTab => {
                gameTab.style.backgroundColor = '#222222';
                gameTab.style.padding = '1.2vw';
                gameTab.style.display = 'flex';
            })
            game.style.display = 'block';
            document.getElementById('games').style.gridTemplateColumns = '.1fr .1fr';
            document.getElementById('games').style.marginLeft = '.6vw';
            function hideAds() {
                const adElements = document.querySelectorAll('.when');
                
                adElements.forEach(ad => {
                    ad.style.display = 'block';
                });
            }
            
            hideAds();
        })
    } else {    
        gameContent.forEach(game => {
            games.forEach(gameTab => {
                gameTab.style.backgroundColor = 'transparent';
                gameTab.style.padding = '0px';
                gameTab.style.display = 'block';
            })
            game.style.display = 'none';
            document.getElementById('games').style.gridTemplateColumns = 'repeat(9, 9.5vw)';
            document.getElementById('games').style.marginLeft = '1vw';
        })
        images.forEach(image => {
            image.style.width = '10vw';
            image.style.height = '10vw';
        })

        function hideAds() {
            const adElements = document.querySelectorAll('.when');
            
            adElements.forEach(ad => {
                ad.style.display = 'none';
            });
        }
        
        hideAds();
    }
}

function toggleIcon() {
    var icon = document.getElementById('gamePerspectiveIcon');
    if (icon.classList.contains('fa-regular')) {
        icon.classList.remove('fa-regular');
        icon.classList.remove('fa-down-left-and-up-right-to-center');
        icon.classList.add('fa-solid');
        icon.classList.add('fa-up-right-and-down-left-from-center');
        gamesPerspective()
    } else {
        icon.classList.remove('fa-solid');
        icon.classList.remove('fa-up-right-and-down-left-from-center');
        icon.classList.add('fa-regular');
        icon.classList.add('fa-down-left-and-up-right-to-center');
        gamesPerspective()
    }
}

// document.getElementById('changePerspective').addEventListener('click', function(e) {
        // gamesPerspective()
// });

document.getElementById('start-button').addEventListener('click', function(e) {
    var scrollDiv = document.getElementById("games").offsetTop - 110;
    window.scrollTo({ top: scrollDiv, behavior: 'smooth'});
});

window.addEventListener("scroll", function(){
    var main = document.getElementById("main");
    if (window.scrollY > main.offsetTop + main.offsetHeight - 110) {
        // something after first content passed
    }
})

window.addEventListener('scroll', function() {
    const main = document.getElementById('main');
    const gameBanner = document.getElementById('game-banner');
    const gameBannerTwo = document.getElementById('game-banner-right');
    const footer = document.getElementById('footer'); // Get the footer element
    
    const rect = main.getBoundingClientRect();
    const footerRect = footer.getBoundingClientRect(); // Get the position of the footer

    // Check if the top of the footer is visible in the viewport
    const isFooterInView = footerRect.top <= window.innerHeight && footerRect.bottom >= 0;

    if (rect.bottom < -100 && !isFooterInView) {
        gameBanner.style.position = 'fixed';
        gameBanner.style.marginTop = '5.5vw';
        gameBanner.style.top = '';
        gameBanner.style.bottom = '';
        
        gameBannerTwo.style.position = 'fixed';
        gameBannerTwo.style.marginTop = '5.5vw';
        gameBannerTwo.style.top = '';
        gameBannerTwo.style.bottom = '';
    } else if (isFooterInView) {
        const distanceFromFooter = window.innerHeight - footerRect.top + 'px';

        gameBanner.style.position = 'fixed';
        gameBanner.style.marginTop = `calc(4vw - ${distanceFromFooter})`; // Adjust marginTop dynamically
        
        gameBannerTwo.style.position = 'fixed';
        gameBannerTwo.style.marginTop = `calc(4vw - ${distanceFromFooter})`; // Adjust marginTop dynamically
    } else {
        gameBanner.style.position = 'absolute';
        gameBanner.style.marginTop = '37vw';
        gameBanner.style.top = '';
        gameBanner.style.bottom = '';
        
        gameBannerTwo.style.position = 'absolute';
        gameBannerTwo.style.marginTop = '37vw';
        gameBannerTwo.style.top = '';
        gameBannerTwo.style.bottom = '';
    }
});

// var slideIndex = 0;
//showSlides();

//function showSlides() {
    //var i;
    //var slides = document.getElementsByClassName("item");
    //for (i = 0; i < slides.length; i++) {
        //slides[i].style.display = "none"; 
    //}
    //slideIndex++;
    //if (slideIndex > slides.length) {slideIndex = 1} 
    //slides[slideIndex-1].style.display = "block"; 
    //setTimeout(showSlides, 5000); // Change image every 5 seconds
//}

function checkScreenWidth() {
    var mobile = window.innerWidth < 850;

    if (mobile) {
        document.getElementById('navigation').classList.add("mobile");
        document.getElementById('footer').classList.add("mobile");
        document.getElementById('top').style.display = 'none';
        document.getElementById('games').classList.add("mobile");
        document.getElementById('controls').classList.add("mobile");
        document.getElementById('game-banner').style.display = 'none';
        document.getElementById('game-banner-right').style.display = 'none';
    } else {
        document.getElementById('navigation').classList.remove("mobile");
        document.getElementById('footer').classList.remove("mobile");
        document.getElementById('games').classList.remove("mobile");
        document.getElementById('controls').classList.remove("mobile");
    }
}

setInterval(checkScreenWidth, 1);

const partnerPopup = {
    'weblfg': {
        title: 'WebLFG',
        image: 'assets/WebLFG.png',
        description: 'From internet classics to present-day favorites, it\'s online entertainment right at your fingertips.',
        discordLink: 'https://discord.gg/nZ8GAV9kNA',
        bgColor: '#1b1c24',
        closeColor: '#ffffff',
        discordClass: '',
        titleStyle: ''
    },
    'kazwire': {
        title: 'Kazwire',
        image: 'assets/kazwire.png',
        description: 'From the gaming classics to the internet, access YouTube, TikTok, and even your favorite games freely and securely.',
        discordLink: 'https://discord.gg/kazchat-785577600219086881',
        bgColor: '#f49625',
        closeColor: '#0875bb',
        discordClass: 'kazwire',
        titleStyle: ''
    },
    'totally science': {
        title: 'Totally Science',
        image: 'assets/totally-science.png',
        description: 'Totally Science - your one-stop destination for free online games and unblocked content! Youtube, multiplayer games, Minecraft, and more.',
        discordLink: 'https://discord.gg/StA8kCGTwd',
        bgColor: '#1f0336',
        closeColor: '#f75dfc',
        discordClass: 'totally-science',
        titleStyle: 'font-size:4vw;'
    }
};

function partner(name) {
    const details = partnerPopup[name];
    if (!details) return;

    popup.style.display = 'block';
    popupContent.innerHTML = `
        <div class="flex">
            <h1 id="popup-text" style="${details.titleStyle}">${details.title}</h1>
            <img src="${details.image}" alt="${name}">
        </div>
        <p>${details.description}</p>
        <div class="discord">
        <a href="${details.discordLink}" target="_blank" class="${details.discordClass}">
            <i class="fa-brands fa-discord"></i>
            <span>Join their Discord</span>
        </a>
        </div>
        <div class="close" onclick="closePopup()">
            <i class="fa-solid fa-circle-xmark"></i>
        </div>
    `;
    popupContent.style.backgroundColor = details.bgColor;
    document.querySelector('.close i').style.color = details.closeColor;
}

if (document.querySelector('#clickBox')) {
    document.getElementById('clickBox').addEventListener('click', () => {
        popup.style.display = 'none';
    });
}

if (document.querySelector('.discord')) {
    document.querySelector('.discord').addEventListener('click', () => {
        popup.style.display = 'none';
    });
}

function closePopup() {
    popup.style.display = 'none';
}

window.onload = function() {
    var isMobileSafari = /iP(ad|od|hone)/i.test(navigator.platform) && /WebKit/i.test(navigator.userAgent) && !(/(CriOS|FxiOS)/i.test(navigator.userAgent));
    if (!CSS.supports('backdrop-filter', 'blur(18px)') || isMobileSafari) {
        var navigation = document.querySelector('#navigation');
        if (navigation) {
            navigation.style.backdropFilter = '';
            navigation.style.backgroundColor = '#2b2b2bf1';
        }
    }
}

var partners = [
    {
        name: 'WebLFG',
        url: 'https://weblfg.com/',
        img: 'assets/WebLFG.png',
        desc: 'From internet classics to present-day favorites, it\'s online entertainment right at your fingertips.',
        class: 'weblfg'
    },
    {
        name: 'Kazwire',
        url: 'https://kazwire.com/',
        img: 'assets/kazwire.png',
        desc: 'From the gaming classics to the internet, access YouTube, TikTok, and even your favorite games freely and securely.',
        class: 'kazwire'
    },
    {
        name: 'Totally Science',
        url: 'https://totallyscience.co/',
        img: 'assets/totally-science.png',
        desc: 'Totally Science, your one-stop destination for free online games and unblocked content! Youtube, multiplayer games, Minecraft, and more.',
        class: 'totally',
        pStyle: 'font-size:1.2vw;'
    }
];

function generateSlide(partner1, partner2) {
    return `
        <a href="${partner1.url}" target="_blank" rel="noreferrer">
        <div class="partner ${partner1.class}" onclick="partner('${partner1.name.toLowerCase()}')" id="${partner1.name.toLowerCase()}">
            <img src="${partner1.img}" alt="${partner1.name}">
            <h3 style="color:#fff;">${partner1.name}</h3>
            <p style="${partner1.pStyle || ''}">${partner1.desc}</p>
        </div>
        </a>
        <a href="${partner2.url}" target="_blank" rel="noreferrer">
        <div class="partner ${partner2.class}" onclick="partner('${partner2.name.toLowerCase()}')" id="${partner2.name.toLowerCase()}">
            <img src="${partner2.img}" alt="${partner2.name}">
            <h3 style="color:#fff;">${partner2.name}</h3>
            <p style="${partner2.pStyle || ''}">${partner2.desc}</p>
        </div>
        </a>
    `;
}

var pcElement = document.getElementById('pc');
var currentSlide = 0;

function displaySlides() {
    pcElement.innerHTML = generateSlide(partners[currentSlide % partners.length], partners[(currentSlide + 1) % partners.length]);
    currentSlide = (currentSlide + 2) % partners.length;

    // reattach onclick event handlers
    partners.forEach(partnerObj => {
        var partnerElement = document.getElementById(partnerObj.name.toLowerCase());
        if (partnerElement) {
            partnerElement.onclick = () => partner(partnerObj.name.toLowerCase());
        }
    });

    setTimeout(displaySlides, 3000);
}

displaySlides();

function settings() {
    var settings = document.getElementById('settings')
    if (settings.style.right === '-35%'){
        settings.classList.toggle('open');
    } else {
        settings.classList.toggle('open');
    }
}

document.querySelectorAll('.option').forEach(function(option) {
    option.addEventListener('click', function() {
        document.querySelectorAll('.page').forEach(function(page) {
            page.style.display = 'none';
        });

        document.querySelectorAll('.option').forEach(function(opt) {
            opt.classList.remove('active');
        });

        option.classList.add('active');

        const pageId = option.getAttribute('data-page');
        document.getElementById(pageId).style.display = 'block';
    });
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 3)) + min;
}

/**function insertAdBlock() {
    var targetElement = document.getElementById('games');
    if (targetElement) {
        var adBlocks = [
            '<div id="container-7f53b716d808d941b115b9cf942ade50" class="when"></div>',
            '<div id="container-96c826402ef9b8a425cd1953e62d98dd" class="when"></div>',
            '<div id="container-f5e6d7132d6a1b21bfd46753419b4ff0" class="when"></div>'
        ];
        
        var insertionPoint = 5;
        for (let i = 0; i < adBlocks.length; i++) {
            if (targetElement.children.length >= insertionPoint) {
                var nthChild = targetElement.children[insertionPoint];
                if (nthChild) {
                    nthChild.insertAdjacentHTML('afterend', adBlocks[i]);
                    insertionPoint += getRandomInt(7, 17);
                } else {
                    targetElement.innerHTML += adBlocks[i];
                }
            } else {
                console.error(`Not enough child elements to insert the ad block after the ${insertionPoint}th element!`);
            }
        }
    } else {
        console.error('Target element not found!');
    }
}

setTimeout(() => {
    insertAdBlock()
}, 100);*/

function addHack(target, button) {
    let hacks = JSON.parse(localStorage.getItem('hacks')) || [];

    if (hacks.includes(target)) {
        hacks = hacks.filter(hack => hack !== target);
        button.innerHTML = 'Install<i class="fa-solid fa-circle-down"></i>';
        button.classList.remove('remove');
    } else {
        hacks.push(target);
        button.innerHTML = 'Remove<i class="fa-solid fa-trash"></i>';
        button.classList.add('remove');
    }

    localStorage.setItem('hacks', JSON.stringify(hacks));
    console.log(hacks);
}
  
fetch('/hacks.json')
    .then(response => response.json())
    .then(data => {
        const gameHacksElement = document.getElementById('game-hacks');
      
        data.forEach(hack => {
            const pluginDiv = document.createElement('div');
            pluginDiv.className = 'plugin';
  
            const img = document.createElement('img');
            img.src = hack.image;
            img.alt = 'plugin icon';
            pluginDiv.appendChild(img);
  
            const span = document.createElement('span');
  
            const h2 = document.createElement('h2');
            h2.textContent = hack.name;
            span.appendChild(h2);
  
            const button = document.createElement('button');
            button.innerHTML = 'Install<i class="fa-solid fa-circle-down"></i>';
            button.addEventListener('click', () => addHack(hack.target, button));
            span.appendChild(button);
  
            pluginDiv.appendChild(span);
            gameHacksElement.appendChild(pluginDiv);

            let hacks = JSON.parse(localStorage.getItem('hacks')) || [];
            if (hacks.includes(hack.target)) {
                button.innerHTML = 'Remove<i class="fa-solid fa-trash"></i>';
                button.classList.add('remove');
            }
        });
        const suggestionMessage = document.createElement('h3');
        suggestionMessage.innerHTML = "Any suggestions? Join the <a href='https://discord.gg/emsQEqKyqh' target='_blank'>Discord</a>.";
        gameHacksElement.appendChild(suggestionMessage);
    })
    .catch(error => console.error('An error occurred:', error));


function hacks(name) {
    name();
}

// game options drag thing
/*function makeDraggable(dragHandle) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  dragHandle.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    document.getElementById('drag-box').style.cursor = 'grabbing'
    document.getElementById('drag-box').style.backgroundColor = 'rgba(35, 156, 255, 0.897)'
    e = e || window.event;
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    let elem = dragHandle.parentElement;
    let newTop = elem.offsetTop - pos2;
    let newLeft = elem.offsetLeft - pos1;

    let boundingRect = elem.getBoundingClientRect();
    let windowHeight = window.innerHeight;
    let windowWidth = window.innerWidth;

    let boundary = 0;

    if(newTop < boundary) newTop = boundary;
    if(newLeft < boundary) newLeft = boundary;
    if(newTop + boundingRect.height > windowHeight - boundary) {newTop = windowHeight - boundary - boundingRect.height; closeDragElement()};
    if(newLeft + boundingRect.width > windowWidth - boundary) {newLeft = windowWidth - boundary - boundingRect.width; closeDragElement()};

    elem.style.top = newTop + "px";
    elem.style.left = newLeft + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
    document.getElementById('drag-box').style.cursor = 'grab';
    document.getElementById('drag-box').style.backgroundColor = 'rgba(29, 29, 29, 0.897)'
  }
  
  document.getElementById('game-frame').onclick = closeDragElement;
  
  dragHandle.parentElement.onmouseleave = closeDragElement;
}

let controls = document.querySelector('.drag-box');
makeDraggable(controls);*/

function closeControls(e) {
    e.stopPropagation();
    document.getElementById('game-ad').style.display = 'none';
    document.getElementById('game-frame').style.display = 'none';
    document.getElementById('game-banner').style.zIndex = '9';
    document.getElementById('game-banner-right').style.zIndex = '9';

    var mainElement = document.getElementById('main');
    var mainElementBottom = mainElement.offsetTop + mainElement.offsetHeight;

    if (window.scrollY < mainElementBottom) {
        document.getElementById('game-banner').style.position = 'absolute';
        document.getElementById('game-banner').style.marginTop = '37vw';
        document.getElementById('game-banner-right').style.position = 'absolute';
        document.getElementById('game-banner-right').style.marginTop = '37vw';
    }
        
    document.getElementById('iframe').src = '';
    document.body.style.overflowY = 'visible';
}

//settings, tab title and icon cloak function

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

// fullscreen game

document.addEventListener("keydown", function(e) {
    if (e.code === 'F11') {
        e.preventDefault();
        fullScreenGame();
    }
});

function fullScreenGame() {
    const gameIframe = document.getElementById("iframe");

    if (!document.fullscreenElement) {
        gameIframe.requestFullscreen().catch(err => {
            alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
}

const watermark = document.getElementById('fullscreen-menu');

document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
        watermark.style.display = 'block';  // Show watermark in fullscreen mode
    } else {
        watermark.style.display = 'none';  // Hide watermark when not in fullscreen mode
    }
});

// search function

if (mobile) {
    function search() {
        let inputValue = document.getElementById('search').value.toLowerCase();
        let games = document.querySelectorAll('#games .game');
        let noResults = true; 
    
        games.forEach(function(game) {
            let gameTitle = game.querySelector('h1').textContent.toLowerCase();
    
            if (gameTitle.includes(inputValue)) {
                game.style.display = 'flex';
                noResults = false;
            } else {
                game.style.display = 'none';
            }
        });
    
        let existingMessage = document.getElementById('noResultsMessage');
        if (existingMessage) {
            existingMessage.remove();
        }
    
        if (noResults) {
            let message = document.createElement('div');
            message.id = 'noResultsMessage';
            message.textContent = 'Sorry, no results :(';
            message.style.fontSize = '6vw';
            message.style.textAlign = 'center';
            message.style.fontWeight = '700';
            message.style.width = '100vw';
            document.getElementById('games').appendChild(message);
        }
    }
} else {
    function search() {
        var games = document.getElementsByClassName('game');
        var input = document.getElementById('search');
        var filter = input.value.toUpperCase();
        var ul = document.getElementById("games");
        var li = ul.getElementsByClassName('game');
        
        var searchResults = document.getElementById("searchResults");
        
        if (input.value === '') {
            searchResults.innerHTML = '';
        }
    }


    function clearSearch() {
        const searchInput = document.getElementById("search");
        const searchResults = document.getElementById("searchResults");
        const searchButton = document.getElementById("settings-button-div");
        searchInput.style.borderBottomLeftRadius = '1vw';
        searchButton.style.borderBottomRightRadius = '1vw';
        searchResults.innerHTML = ''; 
        searchInput.value = ''; 
        searchResults.style.opacity = '0';
    }

    document.getElementById('search').addEventListener('input', search);
    let uniqueGames = new Set();

    document.addEventListener("DOMContentLoaded", function() {
        const searchInput = document.getElementById("search");
        const searchResults = document.getElementById("searchResults");
        const searchButton = document.getElementById("settings-button-div");
        const uniqueGames = new Set();  // Initialize the uniqueGames set if it's not already defined

        window.search = function() {
            uniqueGames.clear(); // Clear the set at the beginning of a new search
            const query = searchInput.value;
        
            let filteredGames = [];
            const allGames = document.querySelectorAll("#games .game");
        
            allGames.forEach(game => {
                const title = game.querySelector("h1").textContent;
                const imageSrc = game.querySelector("img").dataset.src;
                const description = game.querySelector(".description-search").textContent; // Fetch the description
                const gameUrl = game.querySelector(".game-url").textContent; // Fetch the game URL
                
                if (title.toLowerCase().includes(query.toLowerCase())) {
                    if (!uniqueGames.has(title)) { // Check if the game is unique
                        uniqueGames.add(title); // Add to unique set
                        filteredGames.push({ title, imageSrc, description, gameUrl }); // Add description and game URL here
                    }
                }
            });
        
            searchResults.innerHTML = '';
        
            if (filteredGames.length > 0) {
                searchInput.style.borderBottomLeftRadius = '0';
                searchInput.style.borderBottomRightRadius = '0';
                searchButton.style.borderBottomRightRadius = '0';
                searchResults.style.opacity = '1';
                searchResults.style.zIndex = '9999999';
                
                filteredGames.forEach(game => {
                    const resultDiv = document.createElement("div");
                    resultDiv.classList.add("result");
                    resultDiv.innerHTML = `
                        <img data-src="${game.imageSrc}" alt="${game.title}">
                        <h1>${game.title}</h1>
                    `;
                    observeImage(resultDiv.querySelector("img"));
                    resultDiv.addEventListener("click", function() {
                        play(game.title, game.gameUrl, game.title, game.description);
                        clearSearch();
                    });
        
                    searchResults.appendChild(resultDiv);
                });
            } else {
                const noResultsDiv = document.createElement("h2");
                noResultsDiv.classList.add("no-results");
                noResultsDiv.textContent = "Sorry, no results :(";
                noResultsDiv.style.fontSize = "19px";
                noResultsDiv.style.textAlign = "center";
                noResultsDiv.style.paddingBottom = ".8vw";
                searchResults.appendChild(noResultsDiv);
            }

            document.addEventListener('mousedown', function(event) {
                if (!searchInput.contains(event.target) && !searchResults.contains(event.target) && event.target !== searchInput && event.target !== searchResults) {
                    clearSearch();
                }
            });
        }; 
    });
}

// count unique games to console use later idk

async function countUniqueGames() {
    const response = await fetch('games.json');
    const data = await response.json();
  
    const uniqueGames = new Set();
  
    const addGames = (gamesArray) => {
      gamesArray.forEach(game => {
        const gameName = game[0];
        uniqueGames.add(gameName);
      });
    };
  
    for (const category in data) {
      addGames(data[category]);
    }
  
    console.log(`Games: ${uniqueGames.size}`);
}
  
countUniqueGames();

document.getElementById('clickyBox').onclick = function() {
    closeControls(event)
}

const clickyBox = document.getElementById('clickyBox');
const hoverMessage = document.getElementById('hoverMessage');

clickyBox.addEventListener('mousemove', function(e) {
    hoverMessage.style.display = 'block';
    hoverMessage.style.left = (e.clientX - 60) + 'px'; 
    hoverMessage.style.top = (e.clientY - 60) + 'px';
});

clickyBox.addEventListener('mouseleave', function() {
    hoverMessage.style.display = 'none';
});

// ipad crap

function isIpad() {
    //var tru = 1;
    //return tru = 1;
    return /iPad|Macintosh/.test(navigator.userAgent) && 'ontouchend' in document;
}

if (isIpad()) {
    document.getElementById('game-banner').style.display = 'none';
    document.getElementById('game-banner-right').style.display = 'none';
    document.getElementById('navigation').style.backdropFilter = 'none';
    document.getElementById('navigation').style.backgroundColor = '#2b2b2bf6';
    document.getElementById('game-frame').style.backdropFilter = 'none';
    document.getElementById('game-frame').style.backgroundColor = '#181818fb';
    document.getElementById('game-frame').style.height = '100vh';
    document.getElementById('game-frame').style.top = '0';
    document.getElementById('iframe').style.top = '10vw';
    document.getElementById('game-content').style.top = '42vw';
    setInterval(function() {
        document.getElementById('settings').style.backdropFilter = 'none';
    }, 10);
    document.getElementById('settings').style.backdropFilter = 'none';
    document.getElementById('settings').style.backgroundColor = '#181818fb';
    document.getElementById('navigation').style.height = '7.5%';
    document.getElementById('top').style.height = '45vw';
    document.getElementById('top').style.marginTop = '-4vw';
    document.getElementById('paragraph').style.top = '25vw';
    document.getElementById('start-button').style.top = '28vw';
    console.log("The device accessing is an iPad");
}

if (localStorage.getItem('hacks') === "[]") {
    localStorage.removeItem('hacks')
}

if (!window.location.href.includes("phantomgames")) {
    if (!localStorage.getItem("youtube")) {
        document.querySelector('#youtube').style.display = "block";
        document.getElementById('clickbox').style.display = "block";

        document.querySelector('.go').addEventListener('click', function() {
            document.querySelector('#youtube').style.display = "none";
            document.getElementById('clickbox').style.display = "none";
            localStorage.setItem("youtube", "true");
        });
    } else {
        document.querySelector('#popup').style.display = "none";
        document.getElementById('clickbox').style.display = "none";
    }
}
