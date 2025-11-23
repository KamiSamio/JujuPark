# Copyright 2024 <Samuel Masse, MASS83060001>

from flask import Flask, render_template, request, redirect, url_for
import sqlite3
import random
import os
#Pour aider a trouver un matching avec les expression regex du courriel et du code postal
import re
from database import Database
# Creation d'une instance
base_donnees = Database()


app = Flask(__name__)

#Connection a la database
def get_db_connection():
    #Creer connexion a la database animaux.db
    cheminDatabase = os.path.join(os.path.dirname(__file__), 'db', 'animaux.db')
    connexion = sqlite3.connect(cheminDatabase)
    #Fait en sorte que conn.row.... donne des resultat SQL accessible comme dictionnaires
    connexion.row_factory = sqlite3.Row
    return connexion


#Affichage animaux aleatoire a l'index
@app.route('/')
def index():
    connexion = get_db_connection()
    #Prend tous les animaux de la database
    animaux = connexion.execute('SELECT * FROM animaux').fetchall()
    connexion.close()

    #Choisie au hasard 5 animal pour afficher a l'index
    animauxRandom = random.sample(animaux, min(5, len(animaux)))
    #Affiche l'index.html en envoyant la liste d'animaux aleatoire
    return render_template('index.html', animaux=animauxRandom)

#Envoie page statique page2.html
@app.route('/page2')
def page2():
    return render_template('page2.html')

#Vas chercher tous les animaux dans la database pour afficher
@app.route('/page3')
def page3():
    #Ouvre connexion SQL vers la database
    dataBase = Database()
    #Recupere tous les animaux
    animaux = dataBase.get_animaux()
    #Deconnecte connexion a la database
    dataBase.disconnect()
    #Afficher tous les animaux dans la page3.html
    return render_template('page3.html', animaux=animaux)

#Envoie page statique page4.html
@app.route("/page4")
def page4():
    return render_template("page4.html")



#Trouver aninal avec un id
@app.route('/animal/<int:id>')
def animal_detail_redirect(id):
    # Redirige proprement vers le format officiel
    return redirect(f"/{id}")



#
@app.route('/ajouter', methods=['POST'])
def ajouter_animal():
    #Creer la liste d'erreur (vide) potentiels
    erreurs = []

    #Prend tous les champ du formulaire HTML et leur donne une cle (.strip() enleve espaces avant ou/et apres)
    nom = request.form.get('nom', '').strip()
    espece = request.form.get('espece', '').strip()
    race = request.form.get('race', '').strip()
    age = request.form.get('age', '').strip()
    description = request.form.get('description', '').strip()
    courriel = request.form.get('courriel', '').strip()
    adresse = request.form.get('adresse', '').strip()
    ville = request.form.get('ville', '').strip()
    cp = request.form.get('cp', '').strip()
    province = request.form.get('province', '').strip()

    #Nom ne doit pas etre vide, pas contenir de virgule, doit etre en 3 et 20 caracteres
    if not nom or ',' in nom or len(nom) < 3 or len(nom) > 20:
        erreurs.append("Nom invalide.")
    #Espece ne doit pas etre vide, pas contenir de virgule
    if not espece or ',' in espece:
        erreurs.append("Espèce invalide.")
    #Race ne doit pas etre vide, pas contenir de virgule
    if not race or ',' in race:
        erreurs.append("Race invalide.")
    #Verifie que la veleur de l'age est nombre entier entre 0 et 30, sinon message erreur
    try:
        ageValeur = int(age)
        if ageValeur < 0 or ageValeur > 30:
            erreurs.append("Âge invalide.")
    except ValueError:
        erreurs.append("Âge invalide.")
    #Description ne doit pas etre vide, pas contenir de virgule
    if not description or ',' in description:
        erreurs.append("Description invalide.")
    #Adresse ne doit pas etre vide, pas contenir de virgule
    if not adresse or ',' in adresse:
        erreurs.append("Adresse invalide.")
    #Ville ne doit pas etre vide, pas contenir de virgule
    if not ville or ',' in ville:
        erreurs.append("Ville invalide.")
    #Province ne doit pas etre vide, doit etre Québec
    if province != "Quebec":
        erreurs.append("Province invalide (doit être Québec).")
    #La forme voulus minimale d'un email
    emailFormat = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    #Email ne doit pas etre vide, doit suivre le format minimal d'un courriel
    if not re.match(emailFormat, courriel):
        erreurs.append("Courriel invalide.")
    #La forme voulus d'un code postal canadien
    cp_regex = r'^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ ]?\d[ABCEGHJ-NPRSTV-Z]\d$'
    #Code Postal ne doit pas etre vide, doit suivre le format standart Canadien
    if not re.match(cp_regex, cp, re.I):
        erreurs.append("Code postal invalide.")

    #Si il y 1 erreur ou plus, affiche la page d'erreur de validation du formulaire avec code d'erreur HTTP 400
    if erreurs:
        print("Validation échouée :", erreurs)
        return render_template('erreur_validation.html', erreurs=erreurs), 400


    try:
        #Ouvre connexion vers la database et prepare un cursor
        connexion = get_db_connection()
        cursor = connexion.cursor()
        #Requete dans la database (parametrer securiser) et insere valeurs
        cursor.execute('''
            INSERT INTO animaux (nom, espece, race, age, description, courriel, adresse, ville, cp)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (nom, espece, race, ageValeur, description, courriel, adresse, ville, cp))
        #Valide insertion avec .commit et prend id du nouvelle animal
        connexion.commit()
        #id animal = deriere row de la database
        nouveauID = cursor.lastrowid
        connexion.close()

        #Insere variable dans chaine de caractere, fait message debug et vas vers page du nouvel animal creer
        print(f"Animal ajouté avec succès ! ID = {nouveauID}")
        return redirect(f'/animal/{nouveauID}')

    #Si inserer l'animal ne marche pas, affiche message d'erreur et code d'erreur HTTP 500
    except Exception as e:
        print("ERREUR d'insertion :", str(e))
        return "Erreur serveur", 500


#Bar recherche
@app.route('/recherche')
def recherche():
    #Prend la recherche et le q dans l'URL (ex:/rechercher?q=chat) et .strip pour enlever les espaces
    terme = request.args.get('q', '').strip()

    connexion = get_db_connection()
    #Chercher le terme dans les champ animal : nom, espece, race, description
    query = """
        SELECT * FROM animaux
        WHERE id LIKE ? OR ville LIKE ? OR adresse LIKE ? OR description LIKE ?
    """
    #Fait en sorte que termeRecherche soit pret pour une recherche incomplete (ex : cha)
    termeRecherche = f'%{terme}%'
    #Faire la requete et ferme la connexion a la database
    animaux = connexion.execute(query, (termeRecherche, termeRecherche, termeRecherche, termeRecherche)).fetchall()
    connexion.close()

    #Affiche la page de resultat avec les animaux qui correspondent
    return render_template('recherche.html', terme=terme, animaux=animaux)

# -------------------------------------------------------------
# Route dynamique : /42 ouvre automatiquement les parkometre 
# -------------------------------------------------------------
@app.route("/<int:parcometre_id>")
def parcometre(parcometre_id):
    # Ouvre la connexion à la DB
    connexion = get_db_connection()

    # Cherche l'animal/parcomètre dans la DB
    query = """
        SELECT * FROM animaux
        WHERE id = ?
    """
    animal = connexion.execute(query, (parcometre_id,)).fetchone()
    connexion.close()

    # Si aucun parcomètre trouvé
    if animal is None:
        return render_template('404.html'), 404

    # Sinon on réutilise ta page animal_detail.html
    return render_template('animal_detail.html', animal=animal)

