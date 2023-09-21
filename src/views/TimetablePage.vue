<script setup>
import CalendarTable from '../components/CalendarTable.vue';
import ModalPaiement from '../components/ModalPaiement.vue';
import FooterForm from '../components/FooterForm.vue';
import { storeToRefs } from "pinia";
import { useBasketStore } from '../stores/BasketStore.js'
import { ref, computed } from "vue";

document.title = "Calendar Table";
const basketStore = useBasketStore ();
const { basket, getTotalPrice } = storeToRefs(basketStore);
basketStore.getBasket();
const modal = ref(false);
const showModal = computed (() => {
    return modal.value;
})
const titreModal = ref("Inscription");
const contenu = ref();
const contenuModal = computed (() => {
    return contenu.value;
});
const sInscrire = async () => {
    contenu.value = `Inscription validée, vous devrez vous acquicter de ${getTotalPrice.value}$ !`;
    modal.value = true;
    await new Promise((resolve) => {
        const interval = setInterval(() => {
        if (!showModal.value) {
            clearInterval(interval);
            resolve();
        }
        }, 100); // Vérifie toutes les 100 millisecondes si showModal est false
    });
    for (let product of basket.value) {
        basketStore.removeFromBasket(product);
    }
}

</script>

<template>
    <CalendarTable @inscription-valide="sInscrire"/>
    <ModalPaiement :showModal="showModal" :titreModal="titreModal" :contenuModal="contenuModal" @fermer-modal="modal = false"/>
    <FooterForm />
</template>

<style scoped> 
</style>