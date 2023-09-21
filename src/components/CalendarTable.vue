<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useBasketStore } from '../stores/BasketStore';
/*import cours from "../assets/data/cours.json";*/
import jours from "../assets/data/jours.json"

const cours = ref();
async function chargerFichier () {
    
    try {
    const response = await fetch('http://localhost:3000/cours')
    
    if (!response.ok) {
      throw new Error('Échec de la requête')
    }

    cours.value = await response.json();
    
  } catch (error) {
    console.error('Une erreur s\'est produite :', error);
  }
}

chargerFichier();
const BasketStore = useBasketStore ();
const {basket, getTotalPrice } = storeToRefs(BasketStore);
const router = useRouter();
function redirect () {
    router.push('/'); 
}

/* Début des fonctions qui gèrent les heures, les jours et le tri des cours par heure, 
                                        par jour dans coursesTable*/ 
    /*
    fonction qui prend en paramètre le tableau des cours et extrait les heures de chaque cours, et 
    les stocke dans un tableau qu'il renvoie
    */
    function mapHoraire(horaires) {
        return horaires.map(item => item.horaires.map(heure => heure.heure));
    }

    /* fonction qui prend en paramètre le tableau d'heures et retourne un nouveau tableau avec des heures uniques  */
    function removeDuplicates(array) {
        const uniqueHoursSet = new Set();  

        array.forEach(item => {
            item.forEach(hour => {
                uniqueHoursSet.add(hour);
            });
        });

        const uniqueHoursArray = Array.from(uniqueHoursSet);

        return uniqueHoursArray;
    }
    /* fonction qui convertie les heures au format string en heure et les trie par ordre croissant */
    function sortHours(hoursArray) {
        // Convertir les heures en minutes et stocker dans un tableau temporaire
        const tempArray = hoursArray.map(hourStr => {
            const [hour, minute] = hourStr.split(':');
            return parseInt(hour, 10) * 60 + parseInt(minute, 10);
        });

        
        tempArray.sort((a, b) => a - b);

        // Convertir les minutes en heures au format "HH:mm"
        const sortedHours = tempArray.map(minutes => {
            const hour = Math.floor(minutes / 60);
            const minute = minutes % 60;
            const hourStr = hour.toString().padStart(2, '0');
            const minuteStr = minute.toString().padStart(2, '0');
            return `${hourStr}:${minuteStr}`;
        });

        return sortedHours;
    }
    const hours = computed (() => {
        return Array.isArray(cours.value) ? mapHoraire(cours.value) : [];
    }) 
    const uniqueHours = computed (() => {
        return removeDuplicates(hours.value);
    }) ;
    const sortedHours = computed (() => {
        return sortHours(uniqueHours.value);
    }) ;
    

    /* fonction qui recherche, trie, par heure, par jour  les cours*/
function createSchedule(heuresUniques, days, coursesData) {
    const schedule = [];

    heuresUniques.forEach(heure => {
        const hourCourses = {
            heure: heure,
            coursParJour: []
        };

        days.forEach(jour => {
            const coursesForDayAndHour = coursesData.filter(course => {
                return course.horaires.some(horaire => horaire.jour === jour && horaire.heure === heure);
            });

            hourCourses.coursParJour.push({
                jour: jour,
                cours: coursesForDayAndHour
            });
        });

        schedule.push(hourCourses);
    });

    return schedule;
}

// Appel de la fonction avec les tableaux appropriés
const coursesTable = computed(() => {
    return Array.isArray(cours.value) ? createSchedule(sortedHours.value, jours, cours.value) : [];
})


/*                                              FIN                                              */

function selectedDiv() {
    const divCours = document.querySelectorAll(".celluleCours");
    divCours.forEach(cellule => {
        if(cellule.classList.contains("selected")) {
            cellule.classList.remove("selected");
        }
    } );
}

function selectedDivTwo () {
    const courses = document.querySelectorAll(".celluleCours");
    let foundItem;
    courses.forEach(cours => {
        foundItem = basket.value.find(p => p.id === parseInt(cours.dataset.cle));
        if(foundItem === undefined && cours.classList.contains('selected')) {
            cours.classList.remove('selected');
        }
    })
}

const foundProduct = ref("");
function ajouterPanier(event, item, elementHeure, jourJour) {
    let coursId = 0;
    foundProduct.value = basket.value.find(p => p.id == item.id);
    const existingCourseAtSameTime = basket.value.find(course => {
        return course.horaires.some(horaire => horaire.jour === jourJour && horaire.heure === elementHeure);
    });
    /*const existingCourseAtSameTime = panier.find(course => {
        return course.horaires.some(horaire => {
            return item.horaires.some(horaire2 => horaire2.jour === horaire2.jour && horaire2.heure === horaire.heure)
        });
    });*/
    // Retirer le cours précédent s'il existe     
    if (foundProduct.value !== undefined) {
        event.target.classList.remove('selected');
        BasketStore.removeFromBasket(foundProduct.value);

    } else {
        if(existingCourseAtSameTime !== undefined) {
            coursId = existingCourseAtSameTime.id;
            document.getElementById(`${elementHeure}-${jourJour}-${coursId}`).classList.remove('selected');
            BasketStore.removeFromBasket(existingCourseAtSameTime);
            BasketStore.addBasket(item);
            event.target.classList.add('selected');
        } else {
            BasketStore.addBasket(item);
            event.target.classList.add('selected');
        }
    }
    selectedDivTwo ();
}


const btnEnabled = computed (() => {
    return !(getTotalPrice.value > 0);
})

const emit = defineEmits(['inscriptionValide']);
async function validerInscription () {
    emit('inscriptionValide'); 
    await new Promise((resolve) => {
        const interval = setInterval(() => {
        if (basket.value.length === 0) {
            clearInterval(interval);
            resolve();
        }
        }, 100); // Vérifie toutes les 100 millisecondes si le panier est vide
    });
    selectedDiv();
}
</script>

<template>
    <Main>
            <div class="divBtn">
                <button @click="redirect">Revenir à l'acceuil</button>
            </div>
            <div class="titrePage">
                <h1>
                    Calendrier
                </h1>
                <div class="ligneInter" >
                </div>
            </div>
            <section class="tableau">
                <table>
                    <caption>
                        <div class="captionTable">
                            <div class="contenuCentre"><span class="sessionEmploi">SESSION DECEMBRE</span> 2022</div>
                            <div class="contenuCentre">04 déc. 2022 - 19 jan. 2023</div>
                            <div>
                                <span class="totalPrice" v-if="getTotalPrice > 0">{{ getTotalPrice}}$ </span>
                                <span><button type="button" class="inscriptionBtn" :disabled="btnEnabled" @click="validerInscription">S'inscrire</button></span>    
                            </div>
                        </div>
                    </caption>    
                    <thead>
                        <tr>
                            <th>Horaires</th>
                            <th v-for="jour in jours" :key="jour" >{{ jour }} </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="element in coursesTable" :key="element.heure">
                            <td class="heure" >{{ element.heure }}</td>
                            <td class="tdCours" v-for="jour in element.coursParJour" :key="jour.jour" >
                                <div class="celluleCours" style="" v-for="crs in jour.cours"
                                :key="crs.id" :id="element.heure + '-' + jour.jour + '-' + crs.id" :data-cle="crs.id"
                                 @click="ajouterPanier($event,crs, element.heure, jour.jour)">{{ crs.name }}</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
    
            </section>
    </Main>
    
</template>

<style scoped>
    .divBtn {
        margin-top: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .divBtn button {
        color : white;
        background-color: #81d4fa;
        border-radius: 5px;
        padding: 5px 10px;
        width: auto;
        height: 35px;
        font-weight: bold;
        border: none;
        cursor: pointer
    }
    .divBtn button:hover {
        background-color: #0288d1;
    }
    .totalPrice {
        padding-right: 5px;
    }
    .titrePage {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .titrePage h1 {
        font-family: 'Times New Roman', Times, serif;
        text-transform: uppercase;
    }
    .ligneInter {
        border: 1px solid black;
        width: 8%;
        margin-bottom: 20px;
    }

    /* tableau */
    .tableauResponsive {
        display: none;
    }
    .tableau, .tableauResponsive {
        margin-top: 30px;
    }

    table {
        margin : auto;
        border-collapse: collapse;
    }

    td, th  {
        border: 3px solid rgba(136, 138, 143, 0.5);
        padding: 15px;
        width: 150px;
    }

    th {
        background : #1a237e;
        color : white;
    }

    td {
        color : black;
        height : 150px;
    }

    .tdCours, .tdJours, .tdHoraires {
        text-align: center;
        padding:0;
        vertical-align: top;
    }

    .heure, .coursResponsive {
        text-align : center;
        vertical-align: middle;
    }

    .celluleCours, .jourResponsive, .horaireResponsive {
        border-bottom: 1px solid rgba(62, 69, 81, 0.4);
        background-color : rgba(62, 69, 81, 0.1);
        height:35px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .jourResponsive, .horaireResponsive {
        cursor:default;
    }
    .coursResponsive {
        font-weight: bold;
        cursor: pointer;
    }
    .selected {
        background-color: red;
        color: white;
    }

    .captionTable {
        font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
        background-color: rgba(62, 69, 81, 0.1);
        display: flex;
        justify-content: space-between;
        padding: 10px 15px;
    }
    .contenuCentre {
        padding: 10px 0;
    }
    .inscriptionBtn {
        color : white;
        background-color: #1a237e;
        border-radius: 5px;
        padding: 5px 10px;
        width: 100px;
        height: 35px;
        font-weight: bold;
        border: none;
        cursor: pointer;
    }
    .inscriptionBtn:disabled {
        background-color: rgba(26, 35, 126, 0.6);
    }

    .totalPrice {
        color: rgba(17, 106, 94, 0.9); 
    }

    @media only screen and (max-width : 767px) {
        .ligneInter {
            width: 20%;
        }
        /* tableau */
        .tableau {
            width: auto;
            overflow-x: scroll;
        }

        .tableauResponsive {
            display: table;
            width: 100%;
        }
        .ligneIntermediare {
            width: 24%;
        }
        /*Styles appliquées aux tableau responsive*/
        .captionTable {
            flex-direction: column;
            
        }
        /*Fin des styles*/
    }

    @media only screen and (min-width :768px) and (max-width : 992px) {
        .ligneInter {
            width: 12%;
        }
        /* tableau */
        .tableau {
            width: auto;
            overflow-x: scroll;
        }
    
        .tableauResponsive {
            display: table;
            width: 100%;
        }

        .ligneIntermediare {
            width: 12%;
        }
        
        /*Styles appliquées aux tableau responsive*/

        th {
            width: 250px;
        }
        /*Fin des styles*/

    }
</style>