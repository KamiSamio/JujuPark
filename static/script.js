// Copyright 2024 <Samuel Masse, MASS83060001>

window.addEventListener('DOMContentLoaded', () => {
    const boutonTheme = document.getElementById('changer-mode');
    const iconTheme = document.getElementById('image-mode');

    //Met a jour l'image du bouton darkMode/lightMode
    const updateThemeIcon = (darkMode) => {
        //Si le darkMode est activer, icone devient soleil.png,sinon affiche moon.png
        if (iconTheme) {
            iconTheme.src = darkMode
                ? iconTheme.dataset.sun || '/static/images/sun.png'
                : iconTheme.dataset.moon || '/static/images/moon.png';
        }
    };


    // Regarde si utilisateur a deja utiliser le darkMode dans le storage local
    const dejaDarkMode = localStorage.getItem('darkMode') === 'true';
    //Si deja utiliser, ajoute "dark-mode" au <body> pour activer sont CSS
    if (dejaDarkMode) {
        document.body.classList.add('dark-mode');
        //Met a jour l'icon
        updateThemeIcon(true);
    }

    // Sert a changer entre le darkMode et lightMode en retirant/ajoutant la classe darkMode quand demander
    //Si bouton existe et est cliquer, retire ou ajoute la classe darkMode sur le <body>
    if (boutonTheme) {
        boutonTheme.addEventListener('click', () => {
            //Sauvegarde le mode dans storage local
            const darkMode = document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', darkMode);
            //Met a jour l'icon
            updateThemeIcon(darkMode);
        });
    }
})

