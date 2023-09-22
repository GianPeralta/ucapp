document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
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

    document.getElementById('logout').addEventListener('click', () => {
        window.cordova.plugins.msalPlugin.signOut(
            function(response) {
                console.log('User signed out successfully:', response);
                window.location.href = "login.html";
            }, 
            function(err) {
                console.error('Sign-out error:', err);
            }
        );
    });

    let currentDate = new Date();
    let options = { year: 'numeric', month: 'long', day: 'numeric' };

    const gearIcon = document.getElementById('gear-icon');
    const sidePanel = document.querySelector('.side-panel');
    const container = document.querySelector('.container');
    const logout = document.querySelector('#logout');
    const centerPanel = document.getElementById('center-panel');
    const closeCenterBtn = document.getElementById('close-center-panel-button');
    const panelText = document.getElementById('panel-text');
    const ucName = document.getElementById('uc-name');
    const ucDate = document.getElementById('uc-date');

    function spinGearIcon() {
        gearIcon.classList.add('spin');
        setTimeout(() => {
            gearIcon.classList.remove('spin');
        }, 1000);
    }

    function toggleSidePanel() {
        sidePanel.classList.toggle('hidden');
    }

    gearIcon.addEventListener('click', () => {
        spinGearIcon();
        toggleSidePanel();
    });
    console.log("TEST");
    container.addEventListener('click', () => {
        sidePanel.classList.add('hidden');
    });

    logout.addEventListener('click', () => {
        window.location.href = "../login.html";
    });

    const cards = document.querySelectorAll('.card');
    cards.forEach((card) => {
      card.addEventListener('click', showCenterPanel);
    });

    function showCenterPanel(event) {
        const dataId = event.currentTarget.getAttribute('data-id');
        if(dataId != null){
            panelText.textContent = dataId;
            centerPanel.style.display = 'flex';
        }
    }

    function closeCenterPanel() {
        centerPanel.style.display = 'none';
    }

    closeCenterBtn.addEventListener('click', () => {
        closeCenterPanel();
    });

    var name = localStorage.getItem("ucName");
    ucName.textContent = name;
    ucDate.textContent = currentDate.toLocaleDateString("en-PH", options);
}

