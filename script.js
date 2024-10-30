document.getElementById('deliveryZone').addEventListener('change', updateDeliveryFee);
document.getElementById('deliveryForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const deliveryAddress = document.getElementById('deliveryAddress').value;
    const deliveryZone = document.getElementById('deliveryZone').value;
    const deliveryFee = calculateDeliveryFee(deliveryZone);
    const foodAmount = parseFloat(document.getElementById('foodAmount').value);
    const foodPaymentMethod = document.getElementById('foodPaymentMethod').value;

    const deliveriesTableBody = document.getElementById('deliveriesTable').getElementsByTagName('tbody')[0];
    const newRow = deliveriesTableBody.insertRow();

    newRow.insertCell(0).textContent = customerName;
    newRow.insertCell(1).textContent = customerPhone;
    newRow.insertCell(2).textContent = deliveryAddress;
    newRow.insertCell(3).textContent = deliveryZone;

    const statusCell = newRow.insertCell(4);
    statusCell.textContent = "En cours";
    
    const deliveryPaymentCell = newRow.insertCell(5);
    deliveryPaymentCell.textContent = "Non défini";

    newRow.insertCell(6).textContent = `${deliveryFee} FCFA`;
    newRow.insertCell(7).textContent = `${foodAmount} FCFA`;
    newRow.insertCell(8).textContent = foodPaymentMethod;

    const actionCell = newRow.insertCell(9);
    const markDeliveredButton = document.createElement("button");
    markDeliveredButton.textContent = "Marquer Livrée";
    markDeliveredButton.addEventListener('click', () => markAsDelivered(newRow, deliveryFee, foodPaymentMethod));
    actionCell.appendChild(markDeliveredButton);

    document.getElementById('deliveryForm').reset();
    updateDeliveryFee();
});

let totalDeliveries = 0;
let izouaFoodTotal = 0;
let cashFoodTotal = 0;
let moiFoodTotal = 0;
let deliveryRevenue = 0;
let izouaDeliveryTotal = 0;
let cashDeliveryTotal = 0;
let moiDeliveryTotal = 0;
let balance = 0;

function calculateDeliveryFee(zone) {
    switch(zone) {
        case "zone1":
            return 1000;
        case "zone2":
            return 1500;
        case "zone3":
            return 2000;
        default:
            return 0;
    }
}

function updateDeliveryFee() {
    const selectedZone = document.getElementById('deliveryZone').value;
    const deliveryFee = calculateDeliveryFee(selectedZone);
    document.getElementById('deliveryFee').textContent = deliveryFee;
}

function markAsDelivered(row, deliveryFee, foodPaymentMethod) {
    const statusCell = row.cells[4];
    const deliveryPaymentCell = row.cells[5];

    if (statusCell.textContent === "Livrée") {
        alert("Cette livraison est déjà marquée comme livrée.");
        return;
    }

    const deliveryPaymentMethod = prompt("Mode de Paiement de la Livraison (Izoua, Espèces, Moi):");
    deliveryPaymentCell.textContent = deliveryPaymentMethod;

    if (deliveryPaymentMethod === "Izoua") {
        izouaDeliveryTotal += deliveryFee;
    } else if (deliveryPaymentMethod === "Espèces") {
        cashDeliveryTotal += deliveryFee;
    } else if (deliveryPaymentMethod === "Moi") {
        moiDeliveryTotal += deliveryFee;
    }

    if (foodPaymentMethod === "izoua") {
        izouaFoodTotal += parseFloat(row.cells[7].textContent);
    } else if (foodPaymentMethod === "especes") {
        cashFoodTotal += parseFloat(row.cells[7].textContent);
    } else if (foodPaymentMethod === "moi") {
        moiFoodTotal += parseFloat(row.cells[7].textContent);
    }

    deliveryRevenue += deliveryFee;
    balance += deliveryFee + parseFloat(row.cells[7].textContent);
    totalDeliveries += 1;
    statusCell.textContent = "Livrée";

    updateSummary();
}

function updateSummary() {
    document.getElementById('izouaDeliveryTotal').textContent = izouaDeliveryTotal;
    document.getElementById('cashDeliveryTotal').textContent = cashDeliveryTotal;
    document.getElementById('moiDeliveryTotal').textContent = moiDeliveryTotal;

    document.getElementById('izouaFoodTotal').textContent = izouaFoodTotal;
    document.getElementById('cashFoodTotal').textContent = cashFoodTotal;
    document.getElementById('moiFoodTotal').textContent = moiFoodTotal;

    document.getElementById('balance').textContent = balance;
}
document.getElementById('livrerBtn').addEventListener('click', function() {
    const row = document.querySelector('tr.selected'); // Trouve la ligne sélectionnée
    if (!row) {
        alert('Veuillez sélectionner une livraison à marquer comme livrée.');
        return;
    }

    const modeLivraison = row.cells[3].innerText; // Récupère le mode de paiement de livraison
    row.cells[5].innerText = 'Livrée'; // Met à jour le statut
    row.cells[4].innerText = modeLivraison; // Met à jour le mode de paiement affiché

    // Proposer les modes de paiement pour la livraison
    const proposeModes = ['OM chez Izoua', 'Wave chez Izoua', 'Espèces'];
    const modeChoisi = prompt('Sélectionnez un mode de paiement pour la livraison: ' + proposeModes.join(', '));
    
    if (proposeModes.includes(modeChoisi)) {
        row.cells[6].innerText = modeChoisi; // Met à jour le mode de paiement
    } else {
        alert('Mode de paiement invalide.'); // Gérer le cas d'un mode de paiement invalide
    }

    // Logique pour mettre à jour le solde en fonction du mode de paiement
    if (modeChoisi === 'OM chez Izoua' || modeChoisi === 'Wave chez Izoua') {
        const fraisLivraison = parseFloat(row.cells[2].innerText);
        const solde = parseFloat(document.getElementById('solde').innerText);
        document.getElementById('solde').innerText = (solde - fraisLivraison).toFixed(2); // Met à jour le solde
    }
    
    // Réinitialiser les valeurs de champ
    resetFields();
});

function resetFields() {
    document.getElementById('clientName').value = '';
    document.getElementById('clientPhone').value = '';
    document.getElementById('adresse').value = '';
    document.getElementById('montantNourriture').value = '';
    document.getElementById('fraisLivraison').value = '';
}
