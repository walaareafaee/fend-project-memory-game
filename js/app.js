/*
 * Create a list that holds all of your cards
 */

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
/* list of open cards and icons */
let openedCards= [];
let Cards=  ['fa-anchor', 'fa-anchor', 'fa-bicycle', 'fa-bolt', 'fa-cube', 'fa-diamond', 'fa-diamond', 'fa-plane', 'fa-leaf', 'fa-bomb', 'fa-leaf', 'fa-bomb', 'fa-bolt', 'fa-bicycle', 'fa-plane', 'fa-cube'];
let compareIcon='';
let Deck=document.querySelector('.deck'); 
let moves=document.querySelector('.moves');
let lastMoves=document.querySelector('.last-moves');
let matched=document.querySelector('.matched');
let time=document.querySelector('.time');
let stars=document.querySelector('.stars');
let finalStars=document.querySelector('.final-stars');
let lastTime=document.querySelector('.last-time');
let winingPanel=document.querySelector('.wining-panel');
let scorePanel=document.querySelector('.score-panel');
/* game controls */
let Moves=0;
let Matched=0,Unmatched=0;
let starsCount=3;
let minutes = 0;
let seconds = 0;
let gameInterval;



function IncrementMoves(){
    Moves=parseInt(moves.textContent)+1; 
    if (Moves%5==0) {
        StarsRating(); 
        console.log('numberOfMoves'+Moves%5);
    }  
    moves.textContent=Moves;
    lastMoves.textContent=Moves;
}
function StarsRating(){
   if(starsCount!=0){
        let star=stars.querySelector('li:not(.lost-star)');   
        star.className+='lost-star';
        starsCount=starsCount-1 ;
        finalStars.textContent=starsCount;
   }
}

//Timer Function from  https://stackoverflow.com/questions/20618355/the-simplest-possible-javascript-countdown-timer
function Timer(){
   
    gameInterval = setInterval(function () {
        seconds = parseInt(seconds, 10) + 1;
        minutes = parseInt(minutes, 10);
        if (seconds >= 60) {
            minutes += 1;
            seconds = 0;
        }
        seconds = seconds < 10 ? "0" + seconds : seconds;
        minutes = minutes < 10 ? "0" + minutes : minutes;

        time.innerHTML = minutes + ":" + seconds;
        lastTime.textContent = time.textContent;
    }, 1000);
   
}
function MatchedCounter(){
    Matched+=1;
    matched.textContent=Matched;
    if(Matched==8){
      ShowWiningPanel();
    }
  }
  
function ResetGameControls(){
    moves.textContent=0;
    minutes = 0;
    seconds = 0;
    starsCount= 3;
    Matched=0;
    matched.textContent=0;
    let lis=stars.querySelectorAll('li');
    for(const star of lis ){
        star.className='';
    }
}

function ClickedCard(){
    this.classList.toggle('open');
    let currenticon=this.querySelector('.back > em').className;
    this.querySelector('div.back').classList.remove('match','notmatch'); 
    if (compareIcon==''){
        compareIcon=currenticon;
        openedCards.push(this);
        
    }else if (compareIcon!='' && this===openedCards[0]){
        compareIcon='';
        openedCards=[];
    }
    else if(compareIcon==currenticon){
        openedCards.push(this);
        console.log('match');
        for(const card of openedCards ){
            card.querySelector('div.back').classList.remove('notmatch');  
            setTimeout(function(){card.querySelector('div.back').classList.add('match'); }, 100);
            card.removeEventListener('click',ClickedCard,false);
        } 
        MatchedCounter();
        compareIcon='';
        openedCards=[];
    }else if(compareIcon!=currenticon){
        openedCards.push(this);
        console.log('not match');
        IncrementMoves();
        for(const card of openedCards ){
            card.querySelector('div.back').classList.remove('match'); 
            card.querySelector('div.back').classList.add('notmatch'); 
            setTimeout(function(){card.classList.toggle('open'); }, 600);
        }
        openedCards=[];
        compareIcon='';   
    }
}
//removeAllChildren function from https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
function removeAllChildren(theParent){

    // Create the Range object
    var rangeObj = new Range();

    // Select all of theParent's children
    rangeObj.selectNodeContents(theParent);

    // Delete everything that is selected
    rangeObj.deleteContents();
}
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
   
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

   
function createCards(shuffledIcons){

   for(const icon of shuffledIcons ){   

    let cardFront=document.createElement('div');
    cardFront.className='card-face front';
    let cardFrontIcon=document.createElement('em');
    cardFrontIcon.className='fa fa-question'; 
    cardFront.appendChild(cardFrontIcon);
    /***/
    let cardBack=document.createElement('div');
    cardBack.className='card-face back';
    let cardBackIcon=document.createElement('em');
    cardBackIcon.className='fa '+icon;
    cardBack.appendChild(cardBackIcon);
    let card=document.createElement('li');
    card.className='card';
    /***/
    card.appendChild(cardFront);
    card.appendChild(cardBack);
    Deck.appendChild(card);

   }
}

function ShowWiningPanel(){
    Deck.classList.toggle('hide');
    scorePanel.classList.toggle('hide');
    winingPanel.classList.toggle('hide');
    clearInterval(gameInterval);
}

function ShowGame(){
    Deck.classList.remove('hide');
    scorePanel.classList.remove('hide');
    winingPanel.classList.add('hide');
}

 function startMatchingGame(){
    ShowGame();
    removeAllChildren(Deck);
    ResetGameControls();
    Timer();
    let shuffledIcons=shuffle(Cards);
    createCards(shuffledIcons);
    /* generate Listener for each card and flipped */
    let cards= document.querySelectorAll('li.card');
    for(const card of cards ){
        card.addEventListener('click', ClickedCard
         , false);
    }
 }

 let restart=document.querySelector('.restart').addEventListener('click', function () {
    startMatchingGame();
}, true); 
let playAgain=document.querySelector('.play-again').addEventListener('click', function () {
    startMatchingGame();
}, true); 

 /*intiate the game */
 startMatchingGame();

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
