<script setup>
</script>

<template>
    <footer>
        <div class="conteneur">
            <div class="form-intro">
                <h1 class="texte-uppercase">
                    Nous ecrire
                </h1>
                <div class="ligneIntermediare"></div>
                <div class="">
                    Envoyez-nous vos demandes
                </div>
            </div>
            <div class="form">
                <form>
                    <div class="rangee">
                        <div>
                            <input type="text" class="" id="nom" aria-describedby="name" placeholder="Nom">
                        </div>
                        <div>
                            <input type="email" class="" id="email" aria-describedby="emailHelp" placeholder="Email">
                        </div>
                    </div>
                    <div class="rangee">
                        <div>
                            <input type="text" class="" id="telephone" placeholder="Telephone">
                        </div>
                        <div>
                            <input type="text" class="" id="sujet" placeholder="Sujet">
                        </div>
                    </div>
                    <div class="message">
                            <textarea class="" name="message" id="" cols="30" rows="4" placeholder="Message"></textarea>
                    </div>
                    <div class="button">
                        <button type="submit" class="texte-uppercase Envoyerbtn">Envoyer</button>
                    </div>
                </form>
            </div>
        </div>
    </footer>

</template>

<style scoped>
    .texte-uppercase {
        text-transform: uppercase;
    }
    .conteneur {
        margin: 50px 0 100px 0;
        color : white;
        display: grid;
        grid-template-columns: 1fr 3fr;
        width: 100%;
        gap: 25px;
        height : 250px;
    }

    .ligneIntermediare {
        border: 1px solid white;
        width: 25%;
        margin-bottom: 20px;
    }

    .form-intro {
        background-color: #1a237e;
        padding: 10px 0 0 40px;
    }

    form {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap:15px;
        padding: 40px;
        background-color: rgba(62, 69, 81, 0.1);
    }

    div input {
        padding: 10px;
        width: 100%;
    }
    .rangee {
        display: grid;
        grid-template-columns: 1fr 1fr; 
        gap : 15px;
    }
    .message {
        display: grid;
        grid-template-columns: 1fr; 
    }
    textarea {
        padding: 10px;
    }

    .Envoyerbtn {
        border: none;
        cursor: pointer;
        color: white;
        background-color: red;
        width: 100px;
        height: 45px;
        padding: 10px;
        border-radius: 5px;
    }

    .Envoyerbtn:hover {
        background-color: rgb(243, 26, 14);
    }

    .button {
        margin-top: 15px;
    }
    input {
        height: 30px;
    }

    @media only screen and (max-width : 992px) {
        .conteneur {
            grid-template-columns: 1fr;
            gap : 15px;
        }
        .rangee {
            grid-template-columns: 1fr; 
            gap : 15px;
        }
        .form-intro {
            padding: 10px 0 30px 40px;
        }
    }
</style>