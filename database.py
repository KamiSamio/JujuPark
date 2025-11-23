import random
import sqlite3
#Pour retourne animaux aleatoires

#Prend en entrer ligne de resultats SQL et cree dictionnaire "animal[""]" avec ces entrees
def _build_animal(result_set_item):
    animal = {}
    animal["id"] = result_set_item[0]
    animal["description"] = result_set_item[1]
    animal["courriel"] = result_set_item[2]
    animal["adresse"] = result_set_item[3]
    animal["ville"] = result_set_item[4]
    animal["cp"] = result_set_item[5]
    return animal


class Database:
    #Initialise attrbut de connection
    def __init__(self):
        self.connection = None

    #Creer conenction vers le fichier animaux.db (si connection deja existante, la reutiliser)
    def get_connection(self):
        #Si non existante, la creer
        if self.connection is None:
            self.connection = sqlite3.connect('db/animaux.db')
        return self.connection

    #Deconnecte la connexion si elle existe
    def disconnect(self):
        #Si elle existe .close()
        if self.connection is not None:
            self.connection.close()

    #Requete SQL pour aller chercher touts les animaux dans la database et faire liste formater
    def get_animaux(self):
        cursor = self.get_connection().cursor()
        #Vas chercher tous les attributs de l'animal
        query = ("select id, description, courriel, adresse, ville, cp from animaux")
        cursor.execute(query)
        #Le .fetchall vas recuperer touts les lignes
        all_data = cursor.fetchall()
        #Chaque ligne est transformer en dictionnaire animal[""] avec _build_animal
        return [_build_animal(item) for item in all_data]

    #Afficher 5 animaux aleatoire a la page d'accueil
    def get_animaux_aleatoires(self, n=5):
        #Appele get_animaux() pour obtenir tous les animaux
        tous_les_animaux = self.get_animaux()
        #Selectionne en random n (n=5 das notre cas) nombre animaux
        return random.sample(tous_les_animaux, min(n, len(tous_les_animaux)))

    #Acceder a un animal en particulier
    def get_animal(self, animal_id):
        cursor = self.get_connection().cursor()
        #Cherche animal par id dans la database
        query = ("select id, description, courriel, "
                 "adresse, ville, cp from animaux where id = ?")
        cursor.execute(query, (animal_id,))
        item = cursor.fetchone()
        #Si pas de resultat, return none
        if item is None:
            return item
        #Si id trouver, return l'animal
        else:
            return _build_animal(item)

    #Ajouter des animaux a la database avec le formulaire de la page2
    def add_animal(self, nom, espece, race, age, description, courriel,
                   adresse, ville, cp):
        connection = self.get_connection()
        #Ajoute animal dans la database avec tous ces attributs recus en parametre
        query = ("insert into animaux(nom, espece, race, age, description, "
                 "courriel, adresse, ville, cp) "
                 "values(?, ?, ?, ?, ?, ?, ?, ?, ?)")
        connection.execute(query, (nom, espece, race, age, description,
                                   courriel, adresse, ville, cp))
        cursor = connection.cursor()
        #recuperer id de la dernier ligne inserer pour prochain possible ajout
        cursor.execute("select last_insert_rowid()")
        lastId = cursor.fetchone()[0]
        #Valider operation et return id de la derniere ligne inserer
        connection.commit()
        return lastId

