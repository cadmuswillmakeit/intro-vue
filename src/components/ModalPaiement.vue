<script setup>
    import { computed } from "vue";

    const props = defineProps(['titreModal', 'contenuModal', 'showModal']);
    const title = computed (()=> {
        return props.titreModal;
    })
    const contenu = computed (()=> {
        return props.contenuModal;
    })
    const afficherModal = computed (()=> {
        return props.showModal == undefined ? false : props.showModal;
    })
    const classeActive = computed (() => {
        return afficherModal.value ? "actif" : ""
    })

</script>

<template>
        <Teleport to="body">
            <div v-if="afficherModal" class="modal-container" :class="classeActive">

                <div class="overlay modal-trigger" showModal="false" @click="$emit('fermerModal')"></div>
            
                <div class="modale" role="dialog" aria-labelledby="modalTitle" aria-describedby="dialogDesc">
                <button 
                aria-label="close modal"
                class="close-modal modal-trigger" showModal="false" @click="$emit('fermerModal')">X</button>
                <h1 id="modalTitle">{{title}}</h1>
                <p id="dialogDesc">{{ contenu }}</p>
                </div>
        
            </div>                          
        </Teleport>
    </template>

    <style scoped>
        
    ::before,
    ::after,.modal-container {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    .modal-btn {
        padding: 10px 14px;
        font-size: 18px;
        margin: 100px auto;
        display: block;
        min-width: 150px;
        cursor: pointer;
    }

    .modal-container {
        font-family: Raleway, Helvetica, sans-serif;
        position: fixed;
        top: 0;
        max-width: 1440px;
        width: 100%;
        height: 100%;
        transition: visibility 0.4s;
    }

    .overlay {
        opacity: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        background: #333333d3;
        transition: opacity 0.4s 0.2s ease-out;
    }
    .modal-container.actif {
        visibility: visible;
    }
    
    .modal-container.actif .overlay {
        opacity: 1;
        transition: opacity 0.4s ease-out;
    }

    .modale {
        opacity: 0;
        width: 95%;
        max-width: 500px;
        min-width: 300px;
        padding: 30px;
        background: #fff;
        border-radius: 5px;
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%, calc(-50% - 50px));
        transition: opacity 0.4s ease-out,
        transform 0.4s ease-out;
    }

    .modal-container.actif .modale {
        opacity: 1;
        transform: translate(-50%, -50%);
        transition: opacity 0.4s 0.2s ease-out,
        transform 0.4s 0.2s ease-out;
        z-index: 99999999999999999;
    }

    .close-modal {
        padding: 8px 10px;
        border: none;
        border-radius: 5px;
        font-size: 18px;
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
        background: #ff365e;
        color: #fff;
    }
    .modal h1 {
        margin-bottom: 10px;
        font-family: Montserrat, sans-serif;
        font-weight: 500;
    }
    .modal p {
        line-height: 1.4;
        margin-bottom: 5px;
    }

</style>