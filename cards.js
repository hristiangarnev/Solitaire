var cards = [],
    deck = new deck(),
    newArray = [],
    flippedCards = 0,
    lastAdded;

function card(value, name, suit){
	this.value = value;
	this.name = name;
	this.suit = suit;
}

function deck(){
	this.names = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J','Q','K','A'];
	this.suits = ['hearts', 'spades', 'diams', 'clubs'];
    
    for( var s = 0; s < this.suits.length; s++ ) {
        for( var n = 0; n < this.names.length; n++ ) {
            cards.push(new card(n+1, this.names[n], this.suits[s]));
        }
    }
}

for(var i = 0; i < 14; i++) {
    var randomEl = Math.floor(Math.random() * cards.length);
    newArray.push(cards[randomEl]);
    cards.splice(randomEl, 1);
}

function whichTransitionEvent(){
    var t,
        el = document.createElement('fakeelement'),
        transitions = {
        'transition':'transitionend',
        'OTransition':'oTransitionEnd',
        'MozTransition':'transitionend',
        'WebkitTransition':'webkitTransitionEnd'
    }

    for(t in transitions){
        if( el.style[t] !== undefined ){
            return transitions[t];
        }
    }
}

window.addEventListener("load", function(){
    for(var i in newArray) {
        var rotation = 3 * Math.random(),
            data,
            side = Math.random();

        if(side > 0.5) {
            where = '';
        } else {
            where = '-';
        }
        
        data = '<div class="container"';
        data += 'id="' + newArray[i].suit + '-' + newArray[i].value;
        data += '" style="transform: rotateZ('+ where + rotation + 'deg);">';
        data += '<div class="card ' + newArray[i].suit + ' ' + newArray[i].name + '" style="left: ' + i + 'px;">'
        data += '<div class="front">';
        data += '<div class="index">' + newArray[i].name + '<br />';
        data += '&' + newArray[i].suit + ';';
        data += '</div>';
        data += '<div class="spotB3">&' + newArray[i].suit + ';</div>';
        data += '<div class="index">' + newArray[i].name + '<br />';
        data += '&' + newArray[i].suit + ';'
        data += '</div>';
        data += '</div>';
        data += '<div class="back"></div>';
        data += '</div>';
        data += '</div>';
        document.getElementById('deck').innerHTML += data;
    }
    
    var cardEl = document.getElementsByClassName('container');

    for (var i=0; i < cardEl.length; i++) {
        var el = cardEl[i];
        el.addEventListener('click', function() {
            var $this = this,
                transitionEvent = whichTransitionEvent();
            if(!$this.classList.contains("flipped")) {
                $this.className += ' flipped';
            }
            
            transitionEvent && $this.addEventListener(transitionEvent, function() {
                $this.classList += ' draggable';
                $this.setAttribute('draggable', true);
                $this.setAttribute('ondragstart', "drag(event)");
            });
            flippedCards++;
        });
    };

    document.getElementById('change').addEventListener('click', function(e) {
        e.preventDefault();
        var flippedCard = document.getElementsByClassName('flipped').length;
        if(flippedCard) {
            var cardsToAppend = document.querySelectorAll("#deck .container");
            cardsToAppend[cardsToAppend.length - 1].parentNode.insertBefore(cardsToAppend[cardsToAppend.length - 1], cardsToAppend[0]).classList.remove("flipped", "draggable");
        }
    });

    document.getElementById('undo').addEventListener('click', function(e) {
        e.preventDefault();
        var flippedCard = document.getElementsByClassName('flipped').length;
        if(!flippedCard && flippedCards > 0) {
            var cardsToAppend = document.querySelectorAll("#deck .container");
            cardsToAppend[0].parentNode.insertBefore(cardsToAppend[0], cardsToAppend[cardsToAppend.length]);
        }
    });

    document.getElementById('refresh').addEventListener('click', function(e) {
        e.preventDefault();
        location.reload();
    });
});
    
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var target = document.getElementById('ready');
    var data = ev.dataTransfer.getData("text");
    if(typeof lastAdded == 'undefined') {
        if(document.getElementById(data).id.split('-')[1] == '1') {
            lastAdded = document.getElementById(data).id;
            target.appendChild(document.getElementById(data));
            document.getElementById(data).style.marginTop = parseInt(document.getElementById(data).id.split('-')[1] - 1) * 20 + 'px';
            var readyCardsHeight = document.getElementById('ready').clientHeight;
            document.getElementById('ready').style.height = readyCardsHeight + 20 + 'px';
            flippedCards++;
        }
    } else {
        if(lastAdded.split('-')[0] == document.getElementById(data).id.split('-')[0]) {
            if(document.getElementById(data).id.split('-')[1] == parseInt(lastAdded.split('-')[1]) + 1) {
                target.appendChild(document.getElementById(data));
                document.getElementById(data).style.marginTop = parseInt(document.getElementById(data).id.split('-')[1] - 1) * 20 + 'px';
                lastAdded = document.getElementById(data).id;
                var readyCardsHeight = document.getElementById('ready').clientHeight;
                document.getElementById('ready').style.height = readyCardsHeight + 20 + 'px';

                if(parseInt(document.getElementById(data).id.split('-')[1]) == 14) {
                    console.log('Победа!');
                }
            }
            flippedCards++;
        } else {
            return 0;
        }
    }
}