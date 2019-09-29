const $app = document.getElementById('app')
const $observe = document.getElementById('observe')
const API = 'https://rickandmortyapi.com/api/character/'

class Storage {
  constructor(){
    this.next = null;
    this.key = 'next_fetch'
    this.api = API
  }

  getCurrentApi() {
      return this.isFirst() ? this.api : this.getNext()
  }

  isFirst() {
    return localStorage.getItem(this.key) === null ? true : false
  }

  getNext() {
    return localStorage.getItem(this.key)
  }

  setNext(value){
    localStorage.setItem(this.key, value)
  }

  clearAll(){
    localStorage.clear()
  }
}

const store = new Storage()

const getData = api => {
  return fetch(api)
}

const renderResults = ({results}) => {
  const characters = results;
    let output = characters.map(character => {
      return `
        <article class="Card">
          <img src="${character.image}"/>
          <h2>${character.name}<span>${character.species}</span></h2>
        </article>
    `
    }).join('');
    let newItem = document.createElement('section');
    newItem.classList.add('Items');
    newItem.innerHTML = output;
    $app.appendChild(newItem);
}

const loadData = async () => {
  try {
    let response = await getData(store.getCurrentApi())
    response = await response.json()
    store.setNext(response.info.next)
    renderResults(response)
  } catch (error) {
    console.error(`Algo malo ocurrió: ${error}`)  
  }
}

const callBack = (entries) => {
  if (entries[0].isIntersecting) {
    loadData();
  }
}

const intersectionObserver = new IntersectionObserver( callBack, { rootMargin: '0px 0px 100% 0px',})

intersectionObserver.observe($observe);

document.addEventListener('DOMContentLoaded', store.clearAll())