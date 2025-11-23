// Copyright 2024 <Samuel Masse, MASS83060001>

window.addEventListener('DOMContentLoaded', () => {
    //Prend les reference des champs du formulaire
    const form = document.getElementById('formPaiement');
    const nomAnimal = document.getElementById('nom_animal');
    const espece = document.getElementById('espece_animal');
    const race = document.getElementById('race_animal');
    const age = document.getElementById('age_animal');
    const email = document.getElementById('email');
    const description = document.getElementById('description_animal');

    const adresse = document.getElementById('adresse');
    const ville = document.getElementById('ville');
    const codePostal = document.getElementById('code_postal');
    const province = document.getElementById('province');
    const accept = document.getElementById('checkbox');

    const carte_credit = document.getElementById('carte_credit');
    const expirationMois = document.getElementById('expiration_mois');
    const expirationAnnee = document.getElementById('expiration_annee');
    const cvv = document.getElementById('cvv');


    const resetButton = document.getElementById('bouton-reinitialiser');

    if (age) {
        for (let an = 2025; an >= 1975; an--) {
            const opt = document.createElement('option');
            opt.value = an;
            opt.textContent = an;
            age.appendChild(opt);
        }
    }

    // Remplit le dropdown pour les heures 1 → 24
    if (description) {
        for (let h = 1; h <= 24; h++) {
            const opt = document.createElement('option');
            opt.value = h;
            opt.textContent = `${h} heure${h > 1 ? 's' : ''}`;
            description.appendChild(opt);
        }
    }

    // Dropdown des mois 01-12
    if (expirationMois) {
        for (let m = 1; m <= 12; m++) {
            const option = document.createElement('option');
            option.value = m.toString().padStart(2, '0');
            option.textContent = m.toString().padStart(2, '0');
            expirationMois.appendChild(option);
        }
    }

    // Dropdown des années (année actuelle → +15 ans)
    if (expirationAnnee) {
        const anneeCourante = new Date().getFullYear();
        for (let y = anneeCourante; y <= anneeCourante + 15; y++) {
            const option = document.createElement('option');
            option.value = y;
            option.textContent = y;
            expirationAnnee.appendChild(option);
        }
    }


    //Stocke tous les champs du formulaire dans un tableau
    const tousInformation = [
        nomAnimal, espece, race, age, email,
        description, adresse, ville, codePostal,
        province, accept,
        carte_credit, expirationMois, expirationAnnee, cvv
    ];


    // Ajouter un champ pour messages d’erreur (en rouge) juste apres le champ du fromulaire
    tousInformation.forEach(input => {
        const erreur = document.createElement('div');
        erreur.classList.add('message-erreur');
        input.insertAdjacentElement('afterend', erreur);
    });

    // Message de confirmation si formulaire envoyer avec toute les bonne informations
    const MessageConfirmation = document.createElement('div');
    MessageConfirmation.classList.add('message-confirmation');
    form.appendChild(MessageConfirmation);

    // Fonction pour afficher une erreur (en rouge) sous le champ et ensuite le vider
    function montreError(input, message) {
        const erreurDiv = input.nextElementSibling;
        if (erreurDiv) {
            //Afficher message
            erreurDiv.textContent = message;
            //En rouge
            erreurDiv.style.color = 'red';
        }
        //Vider le champ
        input.value = '';
    }

    // Validation de tous les champ, s'il ne sont pas vide, contient pas de "," et respecte longeur/format des champs
    function validaterChamp(input, mode = 'full') {
        const valeurChamp = input.value.trim();
        const nom = input.getAttribute('name') || input.getAttribute('id') || input.placeholder;
        const erreurDiv = input.nextElementSibling;

        if (erreurDiv) erreurDiv.textContent = '';

        //Si inclus "," = message d'erreur et champ non valide
        if (input.tagName !== 'SELECT' && valeurChamp.includes(',')) {
            montreError(input, 'Le champ ne doit pas contenir de virgule.');
            return false;
        }

        //Si  champ est vide en mode "full" = affiche erreur et champ non valide
        if (mode === 'full') {
            if (valeurChamp === '') {
                montreError(input, 'Ce champ est requis.');
                return false;
            }

            switch (nom) {
                //Si nom est : < 3 et > 20 char = message d'erreur et champ non valide
                case 'nom':
                    if (valeurChamp.length < 3 || valeurChamp.length > 20) {
                        montreError(input, 'Le nom doit contenir entre 3 et 20 caractères.');
                        return false;
                    }
                    break;

                case 'espece':
                    if (valeurChamp.length < 3 || valeurChamp.length > 20) {
                        montreError(input, 'La marque de la voiture doit contenir entre 3 et 20 caractères.');
                        return false;
                    }
                    break;

                case 'race':
                    if (valeurChamp.length < 3 || valeurChamp.length > 20) {
                        montreError(input, 'Le modele de la voiture contenir entre 3 et 20 caractères.');
                        return false;
                    }
                    break;

                //Si age est : 0 < et > 30 = message d'erreur et champ non valide
                case 'age':
                    // Pour le dropdown d'année, juste vérifier qu'il y a une valeur
                    if (valeurChamp === '') {
                        montreError(input, "Veuillez choisir une année.");
                        return false;
                    }
                    break;



                //Si courriel n'est pas conforme au regex minimum lettre et "@" pour courriel = message d'erreur et champ non 

                case 'courriel':
                    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
                    if (!emailRegex.test(valeurChamp)) {
                        montreError(input, 'Adresse courriel invalide.');
                        return false;
                    }
                    break;

                case 'adresse':
                    const adresseRegex = /^[0-9]{1,5}\s[A-Za-z]{3,20}\s[A-Za-z]{3,20}$/;
                    if (!adresseRegex.test(valeurChamp)) {
                        montreError(input, 'Adresse invalide. Format attendu : Nombre Rue');
                        return false;
                    }
                    break;


                case 'ville':
                    if (valeurChamp.length < 3 || valeurChamp.length > 20) {
                        montreError(input, 'Votre ville doit contenir entre 3 et 20 caractères.');
                        return false;
                    }
                    break;

                //Si code postal n'est pas conforme au regex format code postal canadien (ex : a1a 1a1/b2b2b2/A1A 1A1/ B2B2B2) = message d'erreur et champ non valide
                case 'cp':
                    const cpRegex = /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ ]?\d[ABCEGHJ-NPRSTV-Z]\d$/i;
                    if (!cpRegex.test(valeurChamp)) {
                        montreError(input, 'Code postal canadien invalide. Format attendu : A1A 1A1');
                        return false;
                    }
                    break;

                case 'description':
                    const heures = parseInt(valeurChamp);
                    if (isNaN(heures) || heures < 1 || heures > 24) {
                        montreError(input, 'Vous devez choisir entre 1 et 24 heures.');
                        return false;
                    }
                    break;

                case 'carte_credit':
                    const carteRegex = /^[0-9]{16}$/;
                    if (!carteRegex.test(valeurChamp)) {
                        montreError(input, 'Numéro de carte invalide (16 chiffres obligatoires).');
                        return false;
                    }
                    break;

                case 'cvv':
                    const cvvRegex = /^[0-9]{3}$/;
                    if (!cvvRegex.test(valeurChamp)) {
                        montreError(input, 'Code de sécurité invalide (3 chiffres).');
                        return false;
                    }
                    break;


            }
        }
        return true;
    }

    // Champs texte qui est a valider en direct
    const champTempReel = [nomAnimal, espece, race, age, email, description, adresse, ville, codePostal, carte_credit, cvv];

    champTempReel.forEach(input => {
        input.addEventListener('input', () => {
            // Verifier si il y a virgules en temps reel
            validaterChamp(input, 'light');
        });

        // Sur bur,on fait une validation complete des regles apres quitter le champ
        input.addEventListener('blur', () => {
            validaterChamp(input, 'full');
        });
    });

    // Verifie que la province selectionner est bien Québec
    province.addEventListener('change', () => {
        const erreurProvince = province.nextElementSibling;
        //Si province pas Québec, message d'erreur afficher en rouge
        if (province.value !== 'Quebec') {
            erreurProvince.textContent = 'La province doit être le Québec.';
            erreurProvince.style.color = 'red';
        } else {
            //Efface erreur
            erreurProvince.textContent = '';
        }
    });

    // Verifie si la case est bien cocher
    accept.addEventListener('change', () => {
        const erreurCase = accept.nextElementSibling;
        //Si case n'est pas cocher, message d'erreur afficher en rouge
        if (!accept.checked) {
            erreurCase.textContent = 'Vous devez accepter les conditions.';
            erreurCase.style.color = 'red';
        } else {
            //Eface erreur
            erreurCase.textContent = '';
        }
    });

    form.addEventListener('submit', (e) => {
        //Empeche fureteur de recharger page automatiquement
        e.preventDefault();

        //Si tous est bon, affiche message confirmation
        let valide = true;
        MessageConfirmation.textContent = '';

        // Reinitialiser messages erreurs
        form.querySelectorAll('.message-erreur').forEach(div => div.textContent = '');

        //Tous les champ sont valider en entiereter
        champTempReel.forEach(input => {
            const estValide = validaterChamp(input, 'full');
            //Si une erreur, le formulaire est bloquer d'etre envoyer
            if (!estValide) valide = false;
        });

        //Doit etre de valeur egal a Quebec
        if (province.value !== 'Quebec') {
            const erreurEnvoyerProvince = province.nextElementSibling;
            //Sinon message erreur en rouge
            erreurEnvoyerProvince.textContent = 'La province doit être le Québec.';
            erreurEnvoyerProvince.style.color = 'red';
            valide = false;
        }

        //Doit etre cocher pour passer
        if (!accept.checked) {
            const erreurEnvoyerCase = accept.nextElementSibling;
            //Sinon message erreur en rouge
            erreurEnvoyerCase.textContent = 'Vous devez accepter les conditions.';
            erreurEnvoyerCase.style.color = 'red';
            valide = false;
        }

        //Si formulaire est valide, envoie requete AJAX avec fetch vers /ajouter pour mettre dans le database
        // Si le formulaire est valide, on affiche simplement un message, sans rien envoyer
        if (valide) {
            const heuresPayees = parseInt(description.value);
            const nomClient = nomAnimal.value.trim();

            MessageConfirmation.style.color = "green";
            MessageConfirmation.style.fontSize = "1.3rem";
            MessageConfirmation.style.textAlign = "center";

            MessageConfirmation.textContent =
                `Votre JujuPark Parcomètre est payé pour ${heuresPayees} heure(s). Merci, ${nomClient} !`;
        }

        // Vérifier mois
        if (expirationMois.value === "") {
            montreError(expirationMois, "Veuillez choisir un mois.");
            valide = false;
        }

        // Vérifier année
        if (expirationAnnee.value === "") {
            montreError(expirationAnnee, "Veuillez choisir une année.");
            valide = false;
        }

        // Optionnel : Vérifier que la carte n'est pas expirée
        const nowYear = new Date().getFullYear();
        const nowMonth = new Date().getMonth() + 1;

        if (parseInt(expirationAnnee.value) === nowYear &&
            parseInt(expirationMois.value) < nowMonth) {
            montreError(expirationMois, "Cette carte est expirée.");
            valide = false;
        }

    });



    // Bouton pour reinitialiser tous les champs du formulaire
    resetButton.addEventListener('click', () => {
        //Vide tous les champ
        form.reset();
        form.querySelectorAll('.message-erreur').forEach(div => div.textContent = '');
        //Supprime message de confirmation
        MessageConfirmation.textContent = '';
    });
});
