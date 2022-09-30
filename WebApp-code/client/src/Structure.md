## Route in App.js

- Route `/` : In App.js se l'user non è loggato viene renderizzato a `/login`, altrimenti si mostra il componente HomePage
- Route `/training-creation` : si accede solo se loggati, se non si è loggati si torna a `/login`. Renderizza il componente TrainingCreation a cui passa l'user
- Route `/training` : componente Training

## Componenti

### HomePage:

- useEffect-> getTrainings(userid)
- Componente TrainingList a cui passiamo i Trainings
- Bottone Calendario
- Bottone + Creazione -> Link to `/training-creation`

### TrainingCreation

- se è settato un training id viene renderizzato il componente ExerciseCreation (passandogli training id), altrimente la cosa con il nome e il confirm
  Confirm -> API. createTraining -> ottengo id training
- se abbiamo un training id facciamo getExercisesByTrainingId, si devono già scaricare tutti gli esercizi che stanno nel training
- Si stampano gli esercizi già presenti con pulsanti di edit e delete

### ExerciseCreation

- useEffect getExercise (prendiamo gli esercizi che abbiamo nel db, quelli standard + quelli che hanno quell'userid - NON TUTTI)
  exercise {id: 1, nome : dsad, info: adds, video : banane}
- select che stampa tutti gli esercizi
- al click aggiorniamo il selectedExercise
- se esiste un selected exercise aggiungiamo info + bottone confirm
- Se clicchiamo confirm si settano le altre robe
- gestire creazione serie

### Training List

- Stampiamo tutti i trainings con il pulsante play, il nome e un pulsante info
- Se clicchiamo su un training cosa si apre il componente Training, a cui passiamo l'id del training

### Training

- useEffect tutti gli esercizi di quel training api getExercisesByTrainingId
- Stampiamo tutti gli esercizi con il pulsante start
- Nella stessa pagina ci sta il back button e le info su quanti esercizi sono stati completati (variabile SOLO in locale)

Allo start si apre pagina con info esercizio e pulsanti per info, video e timer.

Info -> Modale
Video -> Modale

Timer componente a cui passiamo il restingTime, allo scadere del timer al click su continue settiamo gli esercizi completati +1 e l'esercizio svolto come completato
