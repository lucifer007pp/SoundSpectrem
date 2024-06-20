let currentsong = new Audio()
let songs
let currentfolder
let currentindex = 0

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder){
    currentfolder = folder
    let a = await fetch(`/${folder}/`)
    let response = await a.text(); // Convert all link_host element to text 
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a") // Get all anchor tag 

    songs = []
    for(let i=0; i<as.length; i++){
        const element = as[i]
        if(element.href.endsWith(".mp3")){ // Extract links as well as songs's link by .mp3 
            songs.push(element.href.split(`${folder}`)[1]) // Push all song's href vid: 1:49:31
        }
    }

    // show all the songs in the playlist
    let songul = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songul.innerHTML = ""
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li> 
        <img class ="invert" src="music.svg" alt="music icon" srcset="">
        <div class="info">
            <div>${song.replaceAll("%20", " ").split("/")[1]}</div>
            <div>PARTHIB</div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img class ="invert" src="playsong.svg" alt="icon" srcset="">
        </div>  
        </li>`
    }

    // Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic("/" + e.querySelector(".info").firstElementChild.innerHTML)
        })
    })

    return songs
}

const playMusic = (track)=>{
    currentsong.src = `${currentfolder}/${track}`
    currentsong.play()
    play.src = "pause.svg"
    let songName=decodeURI(track).split("/")[1]
    // console.log(songName)
    document.querySelector(".songinfo").innerHTML = songName
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

    currentindex = songs.indexOf(track)
}

async function main(){
    // Get the list of all songs
    await getSongs("songs/Arijit")
    currentsong.src = songs[0]

    // Attach an event listener to play
    play.addEventListener("click", ()=>{
        if(currentsong.paused){
            currentsong.play()
            play.src = "pause.svg"
        }
        else{
            currentsong.pause()
            play.src = "playsong.svg"
        }
    })

    // Listen for timeupdate event
    currentsong.addEventListener("timeupdate", ()=>{
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
    })

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })

    // Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0"
    })

    // Add an event listener for close botton
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-130%"
    })

    // Add an event listener to previous ans next
    previous.addEventListener("click", () => {
        currentsong.pause();
        if ((currentindex - 1) >= 0) {
            playMusic(songs[currentindex - 1]);
        }
    });
    
    next.addEventListener("click", () => {
        currentsong.pause();
        if ((currentindex + 1) < songs.length) {
            playMusic(songs[currentindex + 1]);
        }
    });
    
    // Automatically play the next song when the current song ends
    currentsong.addEventListener("ended", () => {
        if ((currentindex + 1) < songs.length) {
            playMusic(songs[currentindex + 1]);
        }
    });
    
    // Add an event to volune
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentsong.volume = parseInt(e.target.value) / 100
        if (currentsong.volume > 0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })

    // Load the  playlist whenever click the card
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            
            // Check if there are songs in the playlist
            if (songs.length > 0) {
                // Automatically play the first song in the folder
                playMusic(songs[0]);
            }
        });
    })

    // Add an event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentsong.volume = .40;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 40;
        }

    })
}

main()