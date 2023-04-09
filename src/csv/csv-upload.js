import http from 'node:http'
import fs from 'node:fs'

import { parse } from 'csv-parse'


const server = http.createServer(async (req, res) => {
  let filePath = new URL('./file.csv', import.meta.url)

  const raws = [];

  const parser = fs.createReadStream(filePath)
    .pipe(parse())

  for await (const raw of parser) {
    raws.push(raw);

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  raws.splice(0, 1)

  let data;

  for await (const raw of raws) {

    data = {
      "title": raw[0],
      "description": raw[1]
    }

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
      duplex: 'half' // adicione essa linha
    }).then(response => {
      return response.text()
    }).then(data => {
      console.log(data)
    })

  }

  return res.end()
})

server.listen(3334)