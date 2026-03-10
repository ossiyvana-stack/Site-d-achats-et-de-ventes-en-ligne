const apiURL = "https://fakestoreapi.com/products";
const listeProduits = document.getElementById("listeProduits");
const panierList = document.getElementById("listePanier");
const totalPanier = document.getElementById("totalPanier");
const btnCommander = document.getElementById("btnCommander");
const modalPaiement = document.getElementById("modalPaiement");
const btnAnnulerPaiement = document.getElementById("btnAnnulerPaiement");
const espaceVendeur = document.getElementById("espaceVendeur");
const btnEspaceVendeur = document.getElementById("btnEspaceVendeur");
const formAjouterProduit = document.getElementById("formAjouterProduit");
const produitsVendeurDiv = document.getElementById("produitsVendeur");
const espaceCommande = document.getElementById("espaceCommande");
const btnEspaceCommande = document.getElementById("btnEspaceCommande");
const listeCommandesDiv = document.getElementById("listeCommandes");
const btnPanier = document.getElementById("btnPanier");
const zonePanier = document.getElementById("panier");

btnPanier.addEventListener("click", () => {
    zonePanier.classList.toggle("hidden");
});

let produits = [];
let panier = [];
let commandes = [];
let vendeurProduits = [];

async function fetchProduits() {
    const res = await fetch(apiURL);
    produits = await res.json();
    afficherProduits();
}

function afficherProduits() {
    listeProduits.innerHTML = "";
    produits.forEach(p => {
        const div = document.createElement("div");
        div.className = "produit";
        div.innerHTML = `
            <img src="${p.image}" alt="${p.title}">
            <h3>${p.title}</h3>
            <p>${p.price} €</p>
            <button onclick="ajouterPanier(${p.id})">Ajouter au panier</button>
            ${p.vendeurId ? `<button onclick="supprimerProduit(${p.id})">Supprimer</button>` : ''}
        `;
        listeProduits.appendChild(div);
    });
}

function ajouterPanier(id) {
    const produit = produits.find(p => p.id === id);
    panier.push(produit);
    afficherPanier();
}

function afficherPanier() {
    panierList.innerHTML = "";
    let total = 0;
    panier.forEach((p, index) => {
        total += p.price;

        const li = document.createElement("li");
        li.innerHTML = `
            ${p.title} - ${p.price.toFixed(2)} €
            <button class="supprimerPanier" onclick="supprimerDuPanier(${index})">Supprimer</button>
        `;
        panierList.appendChild(li);
    });
    totalPanier.textContent = total.toFixed(2);
}


function supprimerDuPanier(index) {
    panier.splice(index, 1);
    afficherPanier();
}
btnCommander.addEventListener("click", () => {
    if (panier.length === 0) return alert("Le panier est vide !");
    modalPaiement.classList.remove("hidden");
});

btnAnnulerPaiement.addEventListener("click", () => {
    modalPaiement.classList.add("hidden");
});

document.getElementById("formPaiement").addEventListener("submit", (e) => {
    e.preventDefault();
    const infoPaiement = Object.fromEntries(new FormData(e.target));
    commandes.push({ panier: [...panier], infoPaiement, etat: "En attente" });
    panier = [];
    afficherPanier();
    modalPaiement.classList.add("hidden");
    afficherCommandes();
    alert("Commande passée !");
});


btnEspaceVendeur.addEventListener("click", () => {
    espaceVendeur.classList.toggle("hidden");
    espaceCommande.classList.add("hidden");
});

btnEspaceCommande.addEventListener("click", () => {
    espaceCommande.classList.toggle("hidden");
    espaceVendeur.classList.add("hidden");
});

formAjouterProduit.addEventListener("submit", (e) => {
    e.preventDefault();
    const produit = {
        id: Date.now(),
        title: document.getElementById("produitNom").value,
        price: parseFloat(document.getElementById("produitPrix").value),
        image: document.getElementById("produitImage").value,
        vendeurId: "vendeur1"
    };
    produits.push(produit);
    vendeurProduits.push(produit);
    afficherProduits();
    afficherProduitsVendeur();
});

function afficherProduitsVendeur() {
    produitsVendeurDiv.innerHTML = "";
    vendeurProduits.forEach(p => {
        const div = document.createElement("div");
        div.className = "produit";
        div.innerHTML = `
            <img src="${p.image}" alt="${p.title}">
            <h3>${p.title}</h3>
            <p>${p.price} €</p>
            <button onclick="supprimerProduit(${p.id})">Supprimer</button>
        `;
        produitsVendeurDiv.appendChild(div);
    });
}

function supprimerProduit(id) {
    const index = produits.findIndex(p => p.id === id && p.vendeurId === "vendeur1");
    if (index !== -1) {
        produits.splice(index, 1);
        vendeurProduits = vendeurProduits.filter(p => p.id !== id);
        afficherProduits();
        afficherProduitsVendeur();
    } else {
        alert("Vous ne pouvez supprimer que vos produits !");
    }
}


function afficherCommandes() {
    listeCommandesDiv.innerHTML = "";
    commandes.forEach((c, i) => {
        const div = document.createElement("div");
        div.innerHTML = `
            <h4>Commande ${i+1} - ${c.etat}</h4>
            <ul>${c.panier.map(p => `<li>${p.title} - ${p.price} €</li>`).join('')}</ul>
            <button onclick="confirmerReception(${i})">Confirmer réception</button>
        `;
        listeCommandesDiv.appendChild(div);
    });
}

function confirmerReception(index) {
    commandes[index].etat = "Reçue";
    afficherCommandes();
}

fetchProduits();
function rechercher() {

    let texte = document.getElementById("recherche").value.toLowerCase();

    let produits = document.querySelectorAll(".produit");

    produits.forEach(function(produit){

        let nom = produit.textContent.toLowerCase();

        if(nom.includes(texte)){
            produit.style.display = "block";
        } else {
            produit.style.display = "none";
        }

    });

}
