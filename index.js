const http = require('http');
const fs = require('fs');

// Funzione per ottenere una battuta casuale dalla API
const fetchChuckNorrisJoke = async () => {
    try {
        const response = await fetch('https://api.chucknorris.io/jokes/random');
        const data = await response.json();
        return data.value; 
    } catch (error) {
        console.error('Errore durante il recupero della battuta:', error);
        return null;
    }
};

// Funzione per caricare le battute dal file JSON
const loadJokesFromJson = () => {
    try {
        const jsonString = fs.readFileSync('norrisDb.json');
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Errore durante il caricamento del file JSON:', error);
        return [];
    }
};

// Funzione per salvare le battute nel file JSON
const saveJokesToJson = (jokes) => {
    try {
        fs.writeFileSync('norrisDb.json', JSON.stringify(jokes, null, 2));
    } catch (error) {
        console.error('Errore durante il salvataggio nel file JSON:', error);
    }
};

// funzioe per creare una frase carina in html
const styleHtmlJoke = (joke) => {
    return `
        <h1>Chuck Norris Joke</h1>
        <h3>${joke}</h3>
`;
};


// Creazione del server
const server = http.createServer(async (req, res) => {
    if (req.url === '/') {
        const joke = await fetchChuckNorrisJoke();
        if (joke) {
            // Carica le battute esistenti
            const jokes = loadJokesFromJson(); 

            // Aggiungi la nuova battuta
            jokes.push(joke); 

            // Salva le battute aggiornate
            saveJokesToJson(jokes); 
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(styleHtmlJoke(joke));
        } else {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end('Errore nel recupero della battuta!');
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('Not Found');
    }
});

// Avvio del server
const port = 3000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});