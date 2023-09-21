const http = require('http')
const fs = require('fs')

const PORT = 3000

const server = http.createServer((req, res) => {
  // Autoriser l'accès depuis n'importe quelle origine
  res.setHeader('Access-Control-Allow-Origin', '*')

  // Méthodes autorisées
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

  // En-têtes autorisés
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )

  if (req.url === '/cours' && req.method === 'GET') {
    fs.readFile('cours.json', 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Erreur de lecture du fichier.' }))
        return
      }

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(data))
    })
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Route non trouvée.' }))
  }
})

server.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`)
})
