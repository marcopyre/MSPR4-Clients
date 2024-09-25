Connexion à l'application:

Création de l’utilisateur avant la première connexion:

Post a l’adresse http://<ip/adresse>:3007/user des informations au format JSON dans le body

contenant:

{
    “username”: ”<your username>”,
    “password”: ”<your password>”
}


CLIENT:
création d’un client:
Post a l’adresse http://<ip/adresse>:3007/clients des informations au format JSON dans le body

{
    “name”: ”<your client name>”
}


Récupération des clients:

Get a l’adresse http://<ip/adresse>:3007/clients

Modification des clients:

Put a l’adresse http://<ip/adresse>:3007/clients/<id client> des informations au format JSON dans le body

contenant:

{
    “name”: ”<your username>”
}



Supression des clients:


Get a l’adresse http://<ip/adresse>:3007/clients/<id client> 



PRODUIT


création d’un produit:
Post a l’adresse http://<ip/adresse>:3005/product des informations au format JSON dans le body

{
    “name”: ”<your client name>”,
    “quantity”: ”<your client quantity>”
}



Récupération des produits:

Get a l’adresse http://<ip/adresse>:3005/product

Modification des produits:

Put a l’adresse http://<ip/adresse>:3005/product/<id client> des informations au format JSON dans le body

contenant:


{
    “name”: ”<your client name>”,
    “quantity”: ”<your client quantity>”
}




Supression des produits:


Get a l’adresse http://<ip/adresse>:3005/product/<id produit> 








COMMANDES


création d’une commande:
Post a l’adresse http://<ip/adresse>:3006/orders des informations au format JSON dans le body

{
    “user”:  ”<your client name>”,
    “content”:  [
          {
               “product”: “<productId>”,
               “quantity”: “<productId>”
          }
     ]
}



Récupération des commandes:

Get a l’adresse http://<ip/adresse>:3006/orders

Modification des commandes:

Put a l’adresse http://<ip/adresse>:3006/orders/<id client> des informations au format JSON dans le body

contenant:


{
    “user”: ”<your client name>”,
    “content”: ”<your client quantity>”
}




Supression des commandes:


Get a l’adresse http://<ip/adresse>:3006/orders/<id produit> 
