import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(err => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase());
        })
      })
    }

    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist();

    return data;
  }

  update(table, id, data) {
    const indexTask = this.#database[table].findIndex(task => task.id === id)

    if (indexTask > -1) {
      this.#database[table][indexTask] = {
        ...this.#database[table][indexTask],
        updated_at: new Date(),
        ...data
      }
      this.#persist();
      return true;
    }
    return false;
  }

  updateTaskCompleted(table, id) {
    const indexTask = this.#database[table].findIndex(task => task.id === id)

    if (indexTask > -1) {
      this.#database[table][indexTask] = {
        ...this.#database[table][indexTask],
        updated_at: new Date(),
        completed_at: new Date()
      }
      this.#persist();

      return true;
    }
    return false;
  }

  delete(table, id) {
    const indexTask = this.#database[table].findIndex(task => task.id === id)

    if (indexTask > -1) {
      this.#database[table].splice(indexTask, 1);
      this.#persist();

      return true;
    }
    return false;
  }

}