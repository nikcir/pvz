const addSunflowerBtn = document.getElementById('addSunflowerBtn');
const addPeashooterBtn = document.getElementById('addPeashooterBtn');
const addCabbadgepultBtn = document.getElementById('addCabbadgepultBtn');
const addWallnutBtn = document.getElementById('addWallnutBtn');
const addRepeaterBtn = document.getElementById('addRepeaterBtn');
const addSnowpeaBtn = document.getElementById('addSnowpeaBtn');

const addPotatomineBtn = document.getElementById('addPotatomineBtn');
const addMelonpultBtn = document.getElementById('addMelonpultBtn');
const addWintermelonBtn = document.getElementById('addWintermelonBtn');
const addCherrybombBtn = document.getElementById('addCherrybombBtn');
const addTallnutBtn = document.getElementById('addTallnutBtn');

const shovel = document.getElementById('shovelBtn');
const gridItems = document.querySelectorAll('.grid-item');
const sunDisplay = document.getElementById('sun');

let isAddingImage = false;
let sun = 5000;
let suncounter = 0;
let zombiekills = 0;
let selectedImageSource = 'pics/sunflower-pvz.gif';
running = true;


function updateDisplay() {
    sunDisplay.textContent = sun;
}

addSunflowerBtn.addEventListener('click', () => {
    isAddingImage = true;
    selectedImageSource = 'pics/sunflower-pvz.gif'; 
});

addPeashooterBtn.addEventListener('click', () => {
    isAddingImage = true;
    selectedImageSource = 'pics/peashooter.gif'; 
});

addCabbadgepultBtn.addEventListener('click', () => {
    isAddingImage = true;
    selectedImageSource = 'pics/cabbadgepult.gif'; 
});

addWallnutBtn.addEventListener('click', () => {
    isAddingImage = true;
    selectedImageSource = 'pics/wallnut1.png'; 
});

addRepeaterBtn.addEventListener('click', () => {
    isAddingImage = true;
    selectedImageSource = 'pics/repeater.gif'; 
});

addSnowpeaBtn.addEventListener('click', () => {
    isAddingImage = true;
    selectedImageSource = 'pics/snowpea.png'; 
});

addPotatomineBtn.addEventListener('click', () => {
    isAddingImage = true;
    selectedImageSource = 'pics/potatoDisarmed.png'; 
});

addMelonpultBtn.addEventListener('click', () => {
    isAddingImage = true;
    selectedImageSource = 'pics/Melonpult.png'; 
});

addWintermelonBtn.addEventListener('click', () => {
    isAddingImage = true;
    selectedImageSource = 'pics/wintermelon.png'; 
});

addCherrybombBtn.addEventListener('click', () => {
    isAddingImage = true;
    selectedImageSource = 'pics/Cherrybomb.gif'; 
});

addTallnutBtn.addEventListener('click', () => {
    isAddingImage = true;
    selectedImageSource = 'pics/Tallnut1.png'; 
});

shovel.addEventListener('click', () => {
    isAddingImage = false; 
    selectedImageSource = null; 
    shovelActive = true; 
});

let shovelActive = false;

function spawnSunFromSunflower(item) {
    const newImg = document.createElement('img');
    newImg.src = 'pics/sun.png';
    newImg.classList.add('floating-image');
    item.appendChild(newImg);

    newImg.addEventListener('mouseover', () => {
        if (newImg.src.includes('sun.png')) {

            sun += 50;
            suncounter+=50;
            sunDisplay.textContent = sun;
            newImg.style.display = 'none';
        }
    });
}

function initPlant(img,hp) {
    img.dataset.hp = hp; 
    img.dataset.intervalId = null;
}

function findCorrespondingZombie(plant) {
    const plantBoundingBox = plant.getBoundingClientRect();

    const zombies = document.querySelectorAll('.zombie');

    for (const zombie of zombies) {
        const zombieBoundingBox = zombie.getBoundingClientRect();

        if (
            plantBoundingBox.left < zombieBoundingBox.right &&
            plantBoundingBox.right > zombieBoundingBox.left &&
            plantBoundingBox.top < zombieBoundingBox.bottom &&
            plantBoundingBox.bottom > zombieBoundingBox.top
        ) {
            return zombie;
        }
    }
    return null;
}

function findCorrespondingZombies(plant) {
    const plantBoundingBox = plant.getBoundingClientRect();
    const zombies = document.querySelectorAll('.zombie');
    const correspondingZombies = [];

    for (const zombie of zombies) {
        const zombieBoundingBox = zombie.getBoundingClientRect();

        if (
            plantBoundingBox.left < zombieBoundingBox.right &&
            plantBoundingBox.right > zombieBoundingBox.left &&
            plantBoundingBox.top < zombieBoundingBox.bottom &&
            plantBoundingBox.bottom > zombieBoundingBox.top
        ) {
            correspondingZombies.push(zombie);
        }
    }
    return correspondingZombies;
}

function decreasePlantHP(plant,dmg,type) {
    const hp = parseInt(plant.dataset.hp);
    // console.log(type);
    
    if (hp > 0) {
        plant.dataset.hp = hp - dmg; 
        setTimeout(() => decreasePlantHP(plant, dmg,type), 1000); 
    } else {

        const zombies = findCorrespondingZombies(plant);  
        plant.remove(); 
        
        zombies.forEach((zombie) => {
            // console.log(zombie.dataset.zombietype);
            if (type == "normal") {
                zombie.src = "pics/zombie.png";
                // console.log("r");
            }
            zombie.dataset.isAttacking = "false";
            zombie.dataset.isMoving = "true";
            moveZombie(zombie);
        });
    }
}

function handleCollision(plant,type) {
    if (parseInt(plant.dataset.hp) > 0) {
        if (type==="garg") {
            decreasePlantHP(plant,350,type);
        }
        else {
            decreasePlantHP(plant,20,type);
        }
         

        const zombies = findCorrespondingZombies(plant);
        if (zombies) {
            zombies.forEach((zombie) => {
                // console.log("d");
                if (plant.dataset.hp > 0) {
                    zombie.dataset.isMoving = "false";
                    if (type === "normal") {
                        zombie.src = "pics/eating.gif";
                        // console.log("e");
                    }

                }   
            });

        }

        const intervalId = plant.dataset.intervalId;
        if (intervalId) {
            clearInterval(intervalId);
        }
    }
}



function findZombieinLane(plant) {
    const plantBoundingBox = plant.getBoundingClientRect();
    const zombies = document.querySelectorAll('.zombie');

    let leftmostZombie = null;

    for (const zombie of zombies) {
        const zombieBoundingBox = zombie.getBoundingClientRect();

        if (
            plantBoundingBox.top < zombieBoundingBox.bottom &&
            plantBoundingBox.bottom > zombieBoundingBox.top
        ) {
            if (!leftmostZombie || zombieBoundingBox.left < leftmostZombie.getBoundingClientRect().left) {
                leftmostZombie = zombie;
            }
        }
    }

    return leftmostZombie;
}




function spawnPea(item,type) {

    const plant = item.querySelector('.plants');
    const zombieInLane = findZombieinLane(plant);

    if (zombieInLane) {

        const newImg = document.createElement('img');
        if (type === "icepea") {
            newImg.src = 'pics/icepea.png';
        }
        else {
            newImg.src = 'pics/pea.png';
        }
        
        newImg.classList.add('pea');
        item.appendChild(newImg);

        const gridWidth = item.clientWidth;
        const peaWidth = newImg.width;
        const initialX = (gridWidth - peaWidth) / 2;

        newImg.style.left = initialX + 'px';

        movePea(newImg,type);
    }
}

function spawnCabbadge(item,type) {
    const plant = item.querySelector('.plants');
    const zombieInLane = findZombieinLane(plant);

    if (zombieInLane) {
        const newImg = document.createElement('img');

        if (type === "winter") {
            newImg.src = "pics/frozenmelon.png";
            // plant.src = "pics/wintermelonShooting.gif";
        }

        else if (type === "melon") {
            newImg.src = "pics/Melon.png";
        }

        else {
            newImg.src = 'pics/cabbadge.png';
        }
        
        newImg.classList.add('cabbadge');
        item.appendChild(newImg);

        const plantBoundingBox = plant.getBoundingClientRect();

        const gridSpace = 0.165*window.innerWidth;

        newImg.style.left = plantBoundingBox.left - gridSpace+ 'px';
        
        newImg.style.bottom = plantBoundingBox.bottom + 'px';

        moveCabbadge(newImg, zombieInLane,type);
    }
}




function movePea(peaImage,type) {
    const speedX = 6;
    let x = parseFloat(peaImage.style.left) || 0;

    function step() {
        x += speedX;
        peaImage.style.left = x + 'px';

        const peaBoundingBox = peaImage.getBoundingClientRect();
        const zombies = document.querySelectorAll('.zombie');


        zombies.forEach((zombie) => {
            const zombieBoundingBox = zombie.getBoundingClientRect();

            if (
                peaBoundingBox.left < zombieBoundingBox.right &&
                peaBoundingBox.right > zombieBoundingBox.left &&
                peaBoundingBox.top < zombieBoundingBox.bottom &&
                peaBoundingBox.bottom > zombieBoundingBox.top
            ) {

                const hp = parseInt(zombie.dataset.hp);
                
                let dmg;


                if (type === "icepea") {
                    zombie.dataset.speedX = -0.2;
                    dmg = 30;
                }

                else {
                    dmg = 20;
                }

                let newHP = hp - dmg;
                zombie.dataset.hp = newHP;

                if (newHP <= 0) {

                    zombie.remove();
                    zombiekills++;
                }

                peaImage.remove();
            }
        });

        if (x < container.clientWidth) {
            requestAnimationFrame(step);
        }
        else {
            peaImage.remove();
        }
    }

    requestAnimationFrame(step);
}

function moveCabbadge(cabbadgeImage, targetZombie,type) {
    

    const curve = 150;
    const targetX = targetZombie.getBoundingClientRect().left;// - cabbadgeImage.width;

    const currentLeft = cabbadgeImage.getBoundingClientRect().left;
    // console.log(currentLeft);
    const distance = targetX - currentLeft;
    // console.log(targetX);
    // console.log(currentLeft);
    const gridSpace = 0.165*window.innerWidth; 

    let x = currentLeft-gridSpace;

    let calcX = 0; 

    cabbadgeImage.classList.add('cabbadge');

    const increment = 0.35;
    const funcNUllPunkt = 36;

    let deltaX = distance/(funcNUllPunkt/increment); 

    function Path(x) {
        return (x**2-funcNUllPunkt*x);
    }
    
    function stepCab() {
                                                        
        calcX +=increment;
        
        let y = Path(calcX);
        // console.log(cabbadgeImage.style.left + "y" +y);   

        x += deltaX;
        cabbadgeImage.style.left = x + 'px';
        cabbadgeImage.style.top = y + 'px';
        // console.log("e");

        const cabbadgeBoundingBox = cabbadgeImage.getBoundingClientRect();
        const zombieBoundingBox = targetZombie.getBoundingClientRect();

        if (
            cabbadgeBoundingBox.left < zombieBoundingBox.right &&
            cabbadgeBoundingBox.right > zombieBoundingBox.left &&
            cabbadgeBoundingBox.top < zombieBoundingBox.bottom &&
            cabbadgeBoundingBox.bottom > zombieBoundingBox.top
        ) {

            const zombies = document.querySelectorAll('.zombie');

            zombies.forEach((zombie) => {
                const zombieBoundingBox = zombie.getBoundingClientRect();
    
                if (
                    cabbadgeBoundingBox.left < zombieBoundingBox.right &&
                    cabbadgeBoundingBox.right > zombieBoundingBox.left &&
                    cabbadgeBoundingBox.top < zombieBoundingBox.bottom &&
                    cabbadgeBoundingBox.bottom > zombieBoundingBox.top
                ) {
    
                    const hp = parseInt(zombie.dataset.hp);
                    
                    let dmg;
    
                    if (type==="winter") {
                        dmg = 80;
                        zombie.dataset.speedX = -0.2;
                        cabbadgeImage.remove();
                    }
                    else if (type ==="melon") {
                        dmg = 100;
                        cabbadgeImage.src = "pics/melonbroken.png";
                        cabbadgeImage.classList.remove('cabbadge');
                        cabbadgeImage.style.transform = "scale(3)"; 
                        cabbadgeImage.classList.add('splash');
                        setTimeout(() => {
                            cabbadgeImage.remove();
                        }, 400);
                    }
                    else {
                        cabbadgeImage.remove();
                        dmg = 40;
                    }
    
                    let newHP = hp - dmg;
                    zombie.dataset.hp = newHP;
    
                    if (newHP <= 0) {
    
                        zombie.remove();
                        zombiekills++;
                    }
  
                }
            });
        
        } else if (x < targetX) {
           
            requestAnimationFrame(stepCab);
        } else {
            
            
            cabbadgeImage.remove();
           
            
        }
    }

    requestAnimationFrame(stepCab);
}
    
function checkDmg(item,type) {
    const plant = item.querySelector('.plants');
    
    function check() {

        if (type === "Tallnut") {
            if (parseInt(plant.dataset.hp) < 600) {
                plant.src = "pics/Tallnut3.png";
    
            }
    
            else if (parseInt(plant.dataset.hp) < 1300) {
                plant.src = "pics/Tallnut2.png";
    
            }
        }

        else {
            if (parseInt(plant.dataset.hp) < 300) {
                plant.src = "pics/wallnut3.png";

            }

            else if (parseInt(plant.dataset.hp) < 600) {
                plant.src = "pics/wallnut2.png";

            }
        }
        requestAnimationFrame(check);
    }
    requestAnimationFrame(check);
    
}

function checkMine(item) {
    const plant = item.querySelector('.plants');

    function check() {
        let zombies = findCorrespondingZombies(item);

        zombies.forEach((zombie) => {
        // if (zombie) {
            let left = zombie.getBoundingClientRect().left;
            let potato = item.getBoundingClientRect().left + window.innerWidth*0.04;
        

            // console.log(left, "   " + potato);

            if ((~~left) == (~~potato)) {
                const hp = parseInt(zombie.dataset.hp);
                let damage = 200;
                let newHP = hp-damage;
                
                if (newHP <= 0) {
                    zombie.dataset.isMoving = "false";
                    zombie.src = "pics/burntZombie.png";
                    setTimeout(() => {
                        zombie.remove();
                        zombiekills++;
                    }, 2000);
                    
                }
                
                else {
                    zombie.dataset.hp = newHP;
                }
                // console.log(newHP);
                // console.log("e");
                item.src = "pics/PotatoBoom.gif";
                setTimeout(() => {
                    item.remove();
                }, 1000);
            }
        });
        requestAnimationFrame(check);
    }
    requestAnimationFrame(check);
}


gridItems.forEach((item) => {
    item.addEventListener('click', () => {

        if (shovelActive) {
           
            const plant = item.querySelector('.plants');
            if (plant) {
                const intervalId = plant.dataset.intervalId;
                if (intervalId) {
                clearInterval(intervalId);
                }   
                plant.remove();
                
            }
            shovelActive = false; 
        }
        else if (isAddingImage && !item.querySelector('img')) {


            if ((selectedImageSource === 'pics/sunflower-pvz.gif') && (sun >= 50)) {
                const img = document.createElement('img');  
                img.src = selectedImageSource; 
                item.appendChild(img);
                isAddingImage = false;
                img.classList.add('plants');
                sun -= 50;
                initPlant(img,100);
                

                const intervalId = setInterval(() => {
                    if (img.dataset.hp > 0) {
                        spawnSunFromSunflower(item);
                    } else {
                        clearInterval(intervalId);
                    }       
                }, 5000);

                img.dataset.intervalId = intervalId;
            }

            else if ((selectedImageSource === 'pics/peashooter.gif') && (sun >= 100)) {
                const img = document.createElement('img');
                img.src = selectedImageSource; 
                item.appendChild(img);
                isAddingImage = false;
                img.classList.add('plants');
                sun -= 100;
                initPlant(img,100);

                const intervalId = setInterval(() => {
                    if (img.dataset.hp > 0) {
                       spawnPea(item);
                    } else {

                        clearInterval(intervalId);
                    }       
                }, 4000);

                img.dataset.intervalId = intervalId;
            }

            else if ((selectedImageSource === 'pics/snowpea.png') && (sun >= 175)) {
                const img = document.createElement('img');
                img.src = selectedImageSource; 
                item.appendChild(img);
                isAddingImage = false;
                img.classList.add('plants');
                sun -= 175;
                initPlant(img,130);

                const intervalId = setInterval(() => {
                    if (img.dataset.hp > 0) {
                       spawnPea(item,"icepea");
                    } else {

                        clearInterval(intervalId);
                    }       
                }, 5000);

                img.dataset.intervalId = intervalId;
            }

            else if ((selectedImageSource === 'pics/repeater.gif') && (sun >= 200)) {
                const img = document.createElement('img');
                img.src = selectedImageSource; 
                item.appendChild(img);
                isAddingImage = false;
                img.classList.add('plants');
                sun -= 200;
                initPlant(img,100);

                const intervalId = setInterval(() => {
                    if (img.dataset.hp > 0) {
                       spawnPea(item);
                       setTimeout(() => {
                        spawnPea(item);
                    }, 500); 
                    } else {

                        clearInterval(intervalId);
                    }       
                }, 4000);

                img.dataset.intervalId = intervalId;
            }

            else if ((selectedImageSource === 'pics/cabbadgepult.gif') && (sun >= 100)) {
                const img = document.createElement('img');
                img.src = selectedImageSource; 
                item.appendChild(img);
                isAddingImage = false;
                img.classList.add('plants');
                sun -= 100;
                initPlant(img,100);

                const intervalId = setInterval(() => {
                    if (img.dataset.hp > 0) {
                       spawnCabbadge(item);
                    } else {

                        clearInterval(intervalId);
                    }       
                }, 5000);

                img.dataset.intervalId = intervalId;
            }

            else if ((selectedImageSource === 'pics/potatoDisarmed.png') && (sun >= 25)) {
                const img = document.createElement('img');
                img.src = selectedImageSource; 
                item.appendChild(img);
                isAddingImage = false;
                // img.classList.add('plants');
                sun -= 25;
                // initPlant(img,0);
                
                setTimeout(() => {
                    img.src = "pics/Potatomine.gif";
                    
                    checkMine(img);

                }, 5000); 
                // img.dataset.intervalId = intervalId;
            }

            else if ((selectedImageSource === 'pics/Melonpult.png') && (sun >= 300)) {
                const img = document.createElement('img');
                img.src = selectedImageSource; 
                item.appendChild(img);
                isAddingImage = false;
                img.classList.add('plants');
                sun -= 300;
                initPlant(img,100);

                const intervalId = setInterval(() => {
                    if (img.dataset.hp > 0) {
                       spawnCabbadge(item,"melon");
                    } else {

                        clearInterval(intervalId);
                    }       
                }, 3000);

                img.dataset.intervalId = intervalId;
            }

            else if ((selectedImageSource === 'pics/wintermelon.png') && (sun >= 100)) {
                const img = document.createElement('img');
                img.src = selectedImageSource; 
                item.appendChild(img);
                isAddingImage = false;
                img.classList.add('plants');
                sun -= 100;
                initPlant(img,100);

                const intervalId = setInterval(() => {
                    if (img.dataset.hp > 0) {
                        if (findZombieinLane(img)) {
                            img.src = "pics/wintermelonShooting.gif";
                            setTimeout(() => {
                                spawnCabbadge(item,"winter");
                            }, 500);
                            setTimeout(() => {
                                img.src = "pics/wintermelon.png";
                            }, 1700);      

                        }
                    } else {

                        clearInterval(intervalId);
                    }       
                }, 5000);

                img.dataset.intervalId = intervalId;
            }

            else if ((selectedImageSource === 'pics/cabbadgepult.gif') && (sun >= 100)) {
                const img = document.createElement('img');
                img.src = selectedImageSource; 
                item.appendChild(img);
                isAddingImage = false;
                img.classList.add('plants');
                sun -= 100;
                initPlant(img,100);

                const intervalId = setInterval(() => {
                    if (img.dataset.hp > 0) {
                       spawnCabbadge(item);
                    } else {

                        clearInterval(intervalId);
                    }       
                }, 1000);

                img.dataset.intervalId = intervalId;
            }

            else if ((selectedImageSource === 'pics/wallnut1.png') && (sun >= 50)) {
                
                const img = document.createElement('img');
                img.src = selectedImageSource; 
                item.appendChild(img);
                isAddingImage = false;
                img.classList.add('plants');
                sun -= 50;
                initPlant(img,900);

                checkDmg(item,"wallnut");
            }

            else if ((selectedImageSource === 'pics/Tallnut1.png') && (sun >= 100)) {
                
                const img = document.createElement('img');
                img.src = selectedImageSource; 
                item.appendChild(img);
                isAddingImage = false;
                img.classList.add('plants');
                sun -= 100;
                initPlant(img,2000);

                checkDmg(item,"Tallnut");
            }

            else if ((selectedImageSource === 'pics/Cherrybomb.gif') && (sun >= 150)) {
                
                const img = document.createElement('img');
                img.src = selectedImageSource; 
                item.appendChild(img);
                isAddingImage = false;
                // img.classList.add('plants');
                sun -= 150;
                setTimeout(() => {

                    let width = img.width;
                    let height = img.height;

                    let centerx = img.getBoundingClientRect().left-(width/2); 
                    let centery = img.getBoundingClientRect().top-(height/2);

                    // console.log(centerx, centery);

                    img.remove();
                    
                    const newimg = document.createElement('img');
                    newimg.src = "pics/powie.png";
                    newimg.classList.add("trextre");
                    document.body.appendChild(newimg);

                    newimg.style.left = centerx + "px";
                    newimg.style.top = centery + "px";
                    // console.log(newimg.style.left,newimg.style.top,newimg.width,newimg.height);

                    let zombies = findCorrespondingZombies(newimg);

                    zombies.forEach(zombie => {
                        
                        const hp = parseInt(zombie.dataset.hp);
                        let damage = 250;
                        let newHP = hp-damage;
                        
                        if (newHP <= 0) {
                            zombie.dataset.isMoving = "false";
                            // console.log(zombie);
                            if (zombie.className != "garg zombie") {
                                zombie.src = "pics/burntZombie.png";
                            }
                            else {
                                zombie.remove();
                            }
                            setTimeout(() => {
                                zombie.remove();
                                zombiekills++;
                            }, 2000);
                        }
                        else {
                            zombie.dataset.hp = newHP;
                        }
                    });

                    setTimeout(() => {
                        newimg.remove();
                    }, 800);
                }, 1500);
                
                
            }

            updateDisplay();
        }

        
        
    });
});


document.getElementById('container');

function spawnSunAtRandomPosition() {
    const newImg = document.createElement('img');
    newImg.src = 'pics/sun.png';
    newImg.classList.add('floating-image');

    const maxX = container.clientWidth - newImg.width;
    const randomX = Math.random() * maxX;

    newImg.style.left = `${randomX}px`;
    newImg.style.top = `${-200}px`; 

    newImg.addEventListener('mouseover', () => {
        if (newImg.src.includes('sun.png')) {
            sun += 50;
            suncounter+=50;
            sunDisplay.textContent = sun;
            newImg.style.display = 'none';
        }
    });

    container.appendChild(newImg);

    
    moveSun(newImg);
}


function moveSun(sunImage) {
    const speedY = 1;
    
    let y = parseFloat(sunImage.style.top) || 0;

    function step() {
        y += speedY;
        sunImage.style.top = y + 'px';

        if (y < window.innerHeight/2) {
            requestAnimationFrame(step);
        } else {
        }
    }

    requestAnimationFrame(step);
}
    

setTimeout(() => {
    setInterval(spawnSunAtRandomPosition, 10000);
}, 0); 

function gameover() {
    running = false;
    const newIm = document.createElement("img");
    newIm.src = "pics/losescreen.png";
    newIm.classList.add("Losescreen");
    document.body.appendChild(newIm);
    // console.log("sun"+suncounter);
    // console.log("score"+(~~(zombiekills*difficultyMultiplier)));

    const button = document.createElement("button");
    button.innerHTML = "Continiue to Leaderboard";
    button.id = "leaderboardBtn";

    let suntxt = document.getElementById('scores').getElementsByTagName('p')[0];
    let scoretxt = document.getElementById('scores').getElementsByTagName('p')[1];

    suntxt.innerHTML = 'Sun collected: '+suncounter;
    scoretxt.innerHTML = 'Score: '+(~~(zombiekills*difficultyMultiplier));

    button.addEventListener("click", function() {
        document.getElementById('innsetning').style.display = 'block';
    
    });
    document.body.appendChild(button);
}
    
let leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];

function addToLeaderboard() {
    let nameInput = document.getElementById('nameInput').value;

    if (nameInput.trim() === '') {
        alert('Please enter your name.');
        return;
    }

    let newItem = {
        name: nameInput,
        sun: suncounter,
        score: Math.floor(zombiekills*difficultyMultiplier)
    };

    leaderboardData.push(newItem);
    updateLeaderboard();
    saveToLocalStorage();

    document.getElementById('nameInput').value = '';
    lists.style.display = "block";
}

function updateLeaderboard() {
    let leaderboard = document.getElementById('leaderboard');
    leaderboard.innerHTML = ''; 
            
    leaderboardData.forEach(item => {
        let listItem = document.createElement('div');
        listItem.classList.add('list-item');
            
        let nameDiv = document.createElement('div');
        nameDiv.textContent = item.name;
            
        let sunDiv = document.createElement('div');
        sunDiv.textContent = item.sun;
        
        let scoreDiv = document.createElement('div');
        scoreDiv.textContent = item.score;
        
        listItem.appendChild(nameDiv);
        listItem.appendChild(sunDiv);
        listItem.appendChild(scoreDiv);
        
        leaderboard.appendChild(listItem);
    });
}

function saveToLocalStorage() {
    localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));
}

function sortByName() {
    leaderboardData.sort((a, b) => a.name.localeCompare(b.name));
    updateLeaderboard();
}

function sortBySun() {
    leaderboardData.sort((a, b) => b.sun - a.sun);
    updateLeaderboard();
}

function sortByScore() {
    leaderboardData.sort((a, b) => b.score - a.score);
    updateLeaderboard();
}

function clearstorage() {
    localStorage.clear();
}


const gridItem = document.querySelector('.grid-item');
const gridItemHeight = gridItem.offsetHeight;

let initialZombieX = window.innerWidth/100*80;

function moveZombie(zombieImage,type) {
    let isMoving = true;
    // let speedX = parseFloat(zombieImage.dataset.speedX) || -0.3;
    let zombietype = type;
    
    function step() {

        if (zombieImage.dataset.isMoving === "false" || (!isMoving)) { 
            return;
        }

        let speedX = parseFloat(zombieImage.dataset.speedX) || -0.4;

        const x = parseFloat(zombieImage.style.left) || 0;
        const newX = x + speedX;
        zombieImage.style.left = newX + 'px';
        if (x>0) {
            if ((newX + zombieImage.width) < (window.innerWidth*10/100)) {
                zombieImage.dataset.isMoving = "false";
                zombieImage.remove();
                gameover();

                return;
            }
        }

        const zombieBoundingBox = zombieImage.getBoundingClientRect();
        const plants = document.querySelectorAll('.plants');

        let isAttacking = false;

        plants.forEach((plant) => {
            const plantBoundingBox = plant.getBoundingClientRect();

            if (
                zombieBoundingBox.left < plantBoundingBox.right &&
                zombieBoundingBox.right > plantBoundingBox.left &&
                zombieBoundingBox.top < plantBoundingBox.bottom &&
                zombieBoundingBox.bottom > plantBoundingBox.top
            ) {
                handleCollision(plant,type);
                isAttacking = true;
               
                setTimeout(() => {
                    isMoving = true; 
                }, 3000); 
            }
            else {
                isAttacking = false;
            }
        });

        if (!isAttacking) {
            // console.log("moving");
            requestAnimationFrame(step);
        }
    }

    step();
}

function spawnZombie(type) {
    let lane = Math.floor(Math.random() * 5)+1;

    targetY = window.innerHeight/100*5+gridItemHeight * (lane-1);
    const targetGridItem = document.querySelector(`.grid-item:nth-child(${lane})`);
    const targetRect = targetGridItem.getBoundingClientRect();

    let newImg = document.createElement('img');
    

    if (type === 'normal') {
        newImg.src = 'pics/zombie.png';
        newImg.dataset.hp = 100;

    } else if (type === 'cone') {

        newImg.src = 'pics/conehead.png';
        newImg.dataset.hp = 200;

    } else if (type === 'bucket') {
        newImg.src = 'pics/buckethead.png';
        newImg.dataset.hp = 300;

    } else if (type === 'garg') {
        newImg.src = 'pics/gargwalking.gif';
        newImg.dataset.hp = 1000;
        newImg.classList.add('garg');

    } else {
        console.error('Unsupported zombie type:', type);
    }

        newImg.classList.add('zombie');

    document.body.appendChild(newImg);

    newImg.style.left = initialZombieX + 'px';
    newImg.style.bottom = targetY + 'px';
    newImg.style.height = gridItemHeight + 'px';

    moveZombie(newImg,type); 

}

zombies = ["normal", "cone", "bucket", "garg"];
let delay = 10;
let countvalue = 1;
let difficultyMultiplier = 0;
let count = 0;

function survivalMode() {
    if (Math.random() <= (countvalue-Math.floor(countvalue))) {
        count = Math.ceil(countvalue);
    }
    else {
        count = Math.floor(countvalue);
    }
    console.log(~~delay,count,difficultyMultiplier);

    difficultyMultiplier += 0.1;
    if (delay > 5) {
        delay /= 1.05;
    }
    if (countvalue < 7) {
        countvalue += 0.3;
    }
    
    setTimeout(function () {
        if (running) {
            survivalMode();
        }

        for (let i = 0; i < count; i++) {
            if (difficultyMultiplier < 3) {
                if (Math.random() <= (difficultyMultiplier-Math.floor(difficultyMultiplier))) {
                    type = zombies[Math.ceil(difficultyMultiplier)];
                }
                else {
                    type = zombies[Math.floor(difficultyMultiplier)];
                }
            }
            else {
                type = zombies[3];
            }
            spawnZombie(type);
        }
    }, delay*1000);
}

survivalMode();

// const spawningConfig = '0 1 garg 20 15 bucket 1 10 normal 1 10 normal 6 5 normal 3 1 cone 4s 1 normal 0s 2 normal 8 2 cone 4s 1 bucket 0s 2 normal 10s 2 bucket 0s 2 cone 0s 2 normal 0 10 bucket 0 10 cone 1 10 cone 1 10 bucket';

// let spawningActions = spawningConfig.split(' ');

// function handleSpawningActions(actions) {
//     if (actions.length === 0) {
//         return;
//     }

//     let delay = parseInt(actions.shift());
//     let count = parseInt(actions.shift());
//     let type = actions.shift();

//     setTimeout(function () {
//         handleSpawningActions(actions);

//         for (let i = 0; i < count; i++) {
//             spawnZombie(type);
//         }
//     }, delay * 1000);
// }

// handleSpawningActions(spawningActions);

function checkmower(img) {

    function check() {
    const mowers = document.querySelectorAll('.mowers');

    mowers.forEach((mower) => {
        let zombie = findZombieinLane(mower)
        if (zombie) {
        if (zombie.getBoundingClientRect().left<mower.getBoundingClientRect().left) {
            mower.src = "pics/Lawnmower.gif";
            let newX = mower.getBoundingClientRect().left;
            function step() {
                let zombie = findZombieinLane(mower)
                if (zombie) {
                    if (zombie.getBoundingClientRect().left<mower.getBoundingClientRect().right) {

                        zombie.remove();
                        zombiekills++;
                    }
                }
                
                newX += 3; 
                if (newX >= window.innerWidth/100*82) {
                    mower.remove();
                }
                // console.log(newX);
                mower.style.left = newX + "px";
                // console.log(mower.style.left);

                requestAnimationFrame(step);

            }
            step()

        }
    }
    

    });
    requestAnimationFrame(check);
    }
    check();
}

function spawnLawnmower(lane) {
    const targetGridItem = document.querySelector(`.grid-item:nth-child(${lane})`);
    const targetRect = targetGridItem.getBoundingClientRect();
    const targetY = targetRect.top + gridItemHeight * (lane);

    const newImg = document.createElement('img');

    newImg.src = 'pics/lawnmower.png';

    newImg.classList.add('mowers');
    document.body.appendChild(newImg);

    newImg.style.left = window.innerWidth*0.1 + 'px';
    newImg.style.top = targetY-newImg.height*1.1 + 'px';
    checkmower(newImg); 
}

for (let index = 1; index < 6; index++) {
    spawnLawnmower(index);
}

updateDisplay();
