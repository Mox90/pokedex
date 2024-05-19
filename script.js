//window.alert('Hello from Javascript...')
//window.alert(`pathname is ${window.location.pathname}`)
const global = {
  currentPage: window.location.pathname,
  api: {
    apiUrl: 'https://pokeapi.co/api/v2',
  },
}

const capitalizeFirst = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

const extractedIdFromURL = (url) => {
  const urlObj = new URL(url)

  const pathSegments = urlObj.pathname.split('/').filter(Boolean)

  //console.log(urlObj.pathname.split('/'))
  //console.log(pathSegments)

  return formatNumber(pathSegments[pathSegments.length - 1])
}

const formatNumber = (number) => {
  //console.log(number)
  const numStr = number.toString()

  const zerosNeeded = (numStr.length <= 4 ? 4 : 6) - numStr.length

  const zeros = '0'.repeat(zerosNeeded)

  return '#' + zeros + numStr
}

// Fetch the pokemon from the API
const fetchAPI = async (url) => {
  console.log(url)
  const API_URL = url === '' ? global.api.apiUrl : url

  const result = await fetch(`${API_URL}`)

  if (result.status === 404) {
    return showNoData()
  }

  const data = await result.json()

  //console.log(data)

  return data
}

// Fetch data of Pokemon
/*const getPokemonDetails = async (url) => {
  //console.log(url)
  const result = await fetch(`${url}`)
  //console.log(result)
  if (result.status === 404) {
    return showNoData()
  }
  const data = await result.json()

  return data
}*/

const bgType = (type) => {
  const typeStyles = {
    fighting: 'bg-red-900',
    flying: 'bg-sky-500',
    poison: 'bg-violet-500',
    ground: 'bg-stone-700',
    rock: 'bg-zinc-900',
    bug: 'bg-stone-500',
    ghost: 'bg-slate-700 text-slate-50',
    steel: 'bg-stone-400',
    fire: 'bg-red-500',
    water: 'bg-cyan-500',
    grass: 'bg-green-500',
    electric: 'bg-yellow-300 text-slate-800',
    psychic: 'bg-fuchsia-500',
    ice: 'bg-slate-50 text-gray-800',
    dragon: 'bg-red-950',
    dark: 'bg-gray-900 text-slate-600',
    fairy: 'bg-rose-400',
    stellar: 'bg-red-300 text-amber-800',
  }

  return typeStyles[type] || 'bg-slate-500'
}

const getPokemonType = (type) => {
  const pokemonType = {
    normal: 1,
    fighting: 2,
    flying: 3,
    poison: 4,
    ground: 5,
    rock: 6,
    bug: 7,
    ghost: 8,
    steel: 9,
    fire: 10,
    water: 11,
    grass: 12,
    electric: 13,
    psychic: 14,
    ice: 15,
    dragon: 16,
    dark: 17,
    fairy: 18,
    stellar: 19,
  }

  return displayPokemonCard(`${global.api.apiUrl}/type/${pokemonType[type]}`)
  //console.log('Type in number: ', pokemonType[type])
}

//fetchAPI()

// Show Pokemon lists in the browser
const displayPokemonCard = async (url) => {
  const { results, next, previous, pokemon } = await fetchAPI(url)
  //console.log(url)
  let pokemons = results

  destroySectionCard()
  if (pokemon) {
    pokemons = pokemon
    if (pokemons.length === 0) {
      return showNoData()
    }
    return pokemons.forEach(async (element) => {
      showPokemonDetail(element.pokemon.url)
      //console.log(element.pokemon.url)
    })
  }

  //console.log(pokemon)

  pokemons.forEach(async (element) => {
    showPokemonDetail(element.url)
  })
  displayButtonSection(previous, next)
}

// Show pokemon information
const showPokemonDetail = async (url) => {
  console.log(url)
  const { sprites, types, forms } = await fetchAPI(url) //getPokemonDetails(url)
  //console.log(forms[0])
  const div = document.createElement('div')
  div.classList.add(
    ...'flex flex-col col-span-1 bg-slate-600 rounded-xl'.split(' ')
  )

  const imgContainer = document.createElement('div')
  imgContainer.className =
    'w-4/5 h-3/5 mt-5 mb-10 self-center rounded-md flex justify-center'
  const imgWrapper = document.createElement('div')
  imgWrapper.className =
    'flex justify-center items-center bg-zinc-100 bg-opacity-50 rounded-full h-[280px] w-[280px]'
  const img = document.createElement('img')
  img.src = sprites.other.home.front_default
  img.className = 'object-contain self-center z-10'
  img.alt = forms[0].name
  imgWrapper.appendChild(img)
  imgContainer.appendChild(imgWrapper)

  const idDiv = document.createElement('div')
  idDiv.className = 'text-3xl ml-5 mb-3'
  idDiv.textContent = extractedIdFromURL(forms[0].url)

  const nameDiv = document.createElement('div')
  nameDiv.className = 'text-3xl ml-5 mb-2'
  nameDiv.textContent = capitalizeFirst(forms[0].name)

  const typesDiv = document.createElement('div')
  typesDiv.className = 'text-3xl ml-5 flex flex-row gap-5 mb-5'
  typesDiv.id = 'pokemon-types'
  types.forEach((t) => {
    const p = document.createElement('p')
    p.className = `${bgType(t.type.name)} p-2 rounded-md`
    p.textContent = capitalizeFirst(t.type.name)
    typesDiv.appendChild(p)
  })

  div.appendChild(imgContainer)
  div.appendChild(idDiv)
  div.appendChild(nameDiv)
  div.appendChild(typesDiv)

  //document.querySelector('#pokemon-card').appendChild(div)
  const pkCard = document.querySelector('#pokemon-card')
  pkCard.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
  pkCard.appendChild(div)
}

// Show Previous & Next button
const displayButtonSection = (prevUrl, nextUrl) => {
  //console.log('previous', prevUrl)
  //console.log('next', nextUrl)

  const prevBtn = document.createElement('button')
  prevBtn.className = 'p-5 w-1/12'
  /*if (window.innerWidth <= 768) {
    prevBtn.textContent = '<'
  } else {
    prevBtn.textContent = 'Previous'
  }*/
  prevBtn.textContent = 'Previous'
  if (!prevUrl) {
    prevBtn.disabled = true
  } else {
    prevBtn.classList.add(
      'cursor-pointer',
      'bg-[#de4d56]',
      'p-5',
      'w-1/12',
      'rounded-sm'
    )
    prevBtn.addEventListener('click', () => {
      destroySectionCard()
      displayPokemonCard(prevUrl)
    })
  }

  const nextBtn = document.createElement('button')
  nextBtn.className = 'p-5 w-1/12'
  nextBtn.textContent = 'Next'
  // if (window.innerWidth <= 768) {
  //   nextBtn.textContent = '>'
  // } else {
  //   nextBtn.textContent = 'Next'
  // }
  if (!nextUrl) {
    nextBtn.disabled = true
  } else {
    nextBtn.classList.add(
      'cursor-pointer',
      'bg-[#de4d56]',
      'p-5',
      'w-1/12',
      'rounded-sm'
    )
    nextBtn.addEventListener('click', () => {
      destroySectionCard()
      displayPokemonCard(nextUrl)
    })
  }

  document.querySelector('#btn-section').appendChild(prevBtn)
  document.querySelector('#btn-section').appendChild(nextBtn)
}

const onChangeInput = async () => {
  const inputElement = document.querySelector('#name_input')
  console.log('Text is ', inputElement.value)
  if (inputElement.value) {
    //console.log(inputElement.value)
    destroySectionCard()
    showPokemonDetail(
      `${global.api.apiUrl}/pokemon/${inputElement.value.toLowerCase()}`
    )
  } else {
    displayPokemonCard(`${global.api.apiUrl}/pokemon/`)
  }
}

const onClickType = async (type) => {
  //console.log('Types is: ', type)
  document.getElementById('name_input').value = ''
  getPokemonType(type)
  //toggleFilter()
  document.getElementById('filter').className =
    'relative flex flex-col gap-5 z-50 mx-auto hidden'
}

const destroySectionCard = () => {
  const divPkCard = document.querySelector('#pokemon-card')
  while (divPkCard.firstChild) {
    divPkCard.removeChild(divPkCard.firstChild)
  }

  const divPkBtn = document.querySelector('#btn-section')
  while (divPkBtn.firstChild) {
    divPkBtn.removeChild(divPkBtn.firstChild)
  }
}

const showNoData = () => {
  const div = document.createElement('div')
  div.className = 'flex justify-center items-center col-span-1 bg-slate-600 p-5'

  div.innerHTML = `
    <h1 class='text-3xl text-rose-500'>No Pokemon found!!!</h1>
  `

  const pkCard = document.querySelector('#pokemon-card')
  pkCard.className = 'flex justify-center items-center'

  pkCard.appendChild(div)
}

const toggleFilter = () => {
  const toggleButton = document.getElementById('filterButton')
  const filterSection = document.getElementById('filter')

  toggleButton.addEventListener('click', function () {
    filterSection.classList.toggle('hidden')
  })
}

const init = () => {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      displayPokemonCard(`${global.api.apiUrl}/pokemon`)
      toggleFilter()
      break
    default:
      break
  }
}

document.addEventListener('DOMContentLoaded', init)
