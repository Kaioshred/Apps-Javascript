const form = document.querySelector('#form')
const searchInput = document.querySelector('#search')
const songsContainer = document.querySelector('#songs-container')
const prevAndNextContainer = document.querySelector('#prev-and-next-container')
const apiUrl = `https://api.lyrics.ovh`

const getMoreSongs = async url => {
    const data = await fetchData(`https://cors-anywhere.herokuapp.com/${url}`)
    

    insertSongsIntoPage(data)
}

const fetchData = async url =>{
    const response = await fetch(url)
    return await response.json()
}

const insertLyricsIntoPage = ({artist, lyrics, songTitle}) =>
    songsContainer.innerHTML = `<li class="lyrics-container">
                                    <h2><strong>${songTitle}</strong>- ${artist}</h2>
                                    <p class="lyrics">${lyrics}</p>
                                </li>`


const fetchLyrics = async (artist, songTitle) =>{
    const data = await fetchData(`${apiUrl}/v1/${artist}/${songTitle}`)
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>')

    insertLyricsIntoPage({artist, lyrics, songTitle})                           
}

const insertNextAndPrevButtons = (prev, next) =>{
    if(prev || next){
        prevAndNextContainer.innerHTML = `${prev ? `<button class="btn" onClick="getMoreSongs('${prev}')">Anterior</button>` : ''}
        ${next ? `<button class="btn" onClick="getMoreSongs('${next}')">Próxima</button>` : ''}`
        return 
    }
    prevAndNextContainer.innerHTML = ''
}
//destructuring é literalmente pegar um objeto de forma a acessar o valor das propriedades dele diretamente
//como por exemplo, o objeto obj = {nome : 'kaio', idade: 28}
//considera a chamada da função "função(obj)""
//na declaração da função, seria function função ({nome, idade}){console.log(nome, idade)}
//no log estaria 'kaio' 28
const insertSongsIntoPage = ({data, prev, next}) =>{
    
    songsContainer.innerHTML = data.map( ({artist : {name}, title}) => {
        return `<li class="song"><span class="song-artist"><strong>${name}</strong> - ${title} 
        <button class="btn" data-artist="${name}" data-song-title="${title}">Ver letra</button></span></li>`
    }).join('')

    insertNextAndPrevButtons(prev, next);
    
    
}


const fetchSongs = async term => {
    const data = await fetchData(`${apiUrl}/suggest/${term}`)

    insertSongsIntoPage(data)
}


form.addEventListener('submit', e => {
    e.preventDefault()
    songsContainer.innerHTML = ''
    const searchTerm = searchInput.value.trim();
    console.log(searchTerm);

    if(!searchTerm){
        songsContainer.innerHTML = `<li class="warning-message">Por favor, digite um termo válido.</li>`
        return 
    }
    
    fetchSongs(searchTerm)
    
})

songsContainer.addEventListener('click', e => {
    const clickedElement = e.target
    if(clickedElement.tagName === 'BUTTON'){
        const artist = clickedElement.getAttribute('data-artist');
        const songTitle = clickedElement.getAttribute('data-song-title')

        prevAndNextContainer.innerHTML = ''
        fetchLyrics(artist, songTitle);
    }
    //teste de mudança de branch
})