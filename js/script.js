let currentsong = new Audio();
let songs;
let currfolder;

function SecondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "Invalid input";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder) {
  currfolder = folder;
  let a = await fetch(`/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      // Extract the song name from the URL and push it to the songs array
      let songName = decodeURIComponent(element.href.split(`/${folder}/`).pop().replace(/%20/g, ' '));

      songs.push(songName);
    }
  }
  
  let songul = document
  .querySelector(".songlist")
  .getElementsByTagName("ul")[0];
  songul.innerHTML = ""
for (const song of songs) {
  songul.innerHTML += `<li class="music-item" onclick="playMusic(this)"> <img class="invert" src="img/music.svg" alt="">

                            
                                <div class="info scrolling-text">
                                    ${song}
                                </div>
                            
                            <div class="playnow">
                                <span>play now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div> </li>`;

}
Array.from(document.querySelector(".songlist").querySelectorAll(".music-item")).forEach(
  (e) => {
    e.addEventListener("click", (element) => {
      // console.log(e.querySelector(".info").innerHTML);
      
      playMusic(e.querySelector(".info").innerHTML.trim());
      document.querySelector(".playbar").style.opacity = "1"
      document.querySelectorAll(".music-item").forEach(item => {
        item.classList.remove('active');
      });
      // Add active class to the clicked music item
      e.classList.add('active'); // Changed 'element' to 'e'
    });
  }
);

return songs
}

const playMusic = (track, pause = false) => {
  if (!pause) {
    currentsong.src = `/${currfolder}/${track}`;
    currentsong.play();
    
    play.src = "img/pause.svg";
  } else {
    currentsong.pause();
    play.src = "img/play.svg";
  }
  document.querySelector(".songinfo").innerHTML = track;
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};


async function displayAlbums() {
  let a = await fetch(`songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardcontainer = document.querySelector(".cardcontainer");

  Array.from(anchors).forEach(async e => {
    if (e.href.includes("songs"){
      let folder = e.href.split("/").slice(-1)[0];
      let a = await fetch(`songs/${folder}/info.json`);
      let jsonResponse = await a.json();

      cardcontainer.innerHTML += `<div data-folder="${folder}" class="card">
        <img src="songs/${folder}/cover.jpg" alt="">
        <h2>${jsonResponse.title}</h2>
        <p>${jsonResponse.discription}</p>
      </div>`;
    }
  });

  // Attach a single click event listener to the parent container
  cardcontainer.addEventListener("click", async (event) => {
    const clickedCard = event.target.closest(".card");
    if (clickedCard) {
      songs = await getsongs(`songs/${clickedCard.dataset.folder}`);
        document.querySelector(".left").style.left = "0"
      }
    // playMusic(songs[0])
  });
}



async function main() {
  await getsongs("songs/ncs");
  playMusic(songs[0], true)

 displayAlbums()

  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play()
      play.src = "img/pause.svg"
      // play.style.width = "1%";

    }
    else {
      currentsong.pause()
      play.src = "img/play.svg"
    }
  })

  currentsong.addEventListener("timeupdate", () => {
    // console.log(currentsong.currentTime, currentsong.duration);
    document.querySelector(".songtime").innerHTML = `${SecondsToMinutesSeconds(currentsong.currentTime)} / ${SecondsToMinutesSeconds(currentsong.duration)}`
    document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
  })

  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = ((currentsong.duration) * percent) / 100
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0"
  })
  document.querySelector(".close-svg").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-130%"
  })

  previous.addEventListener("click", () => {
  
    let index = songs.indexOf(document.querySelector(".songinfo").innerHTML);
    if (index > 0) {
      playMusic(songs[index - 1]);
    }
  });
  
  next.addEventListener("click", () => {
  
    let index = songs.indexOf(document.querySelector(".songinfo").innerHTML);
    if (index < songs.length - 1) {
      playMusic(songs[index + 1]);
    }
  });
  
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
      currentsong.volume = parseInt(e.target.value)/100
      if (currentsong.volume > 0){
        document.querySelector(".volume > img").src = document.querySelector(".volume > img").src.replace("mute.svg", "volume.svg")
      }
  })

  
  document.querySelector(".volume > img").addEventListener("click", (e) => {
    const volumeImg = e.target;
    const muteImgSrc = "img/mute.svg";
    const volumeImgSrc = "img/volume.svg";
    const muteClass = "muted";
  
    if (volumeImg.src.includes(volumeImgSrc)) {
      volumeImg.src = volumeImg.src.replace(volumeImgSrc, muteImgSrc);
      currentsong.volume = 0;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
      document.querySelector(".mute").classList.add(muteClass);
    } else {
      volumeImg.src = volumeImg.src.replace(muteImgSrc, volumeImgSrc);
      currentsong.volume = 0.1; // Adjust the volume as needed
      document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
      document.querySelector(".mute").classList.remove(muteClass);
    }
  });
  
}

main();

