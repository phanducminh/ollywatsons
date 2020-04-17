var listObjShowup = [], totalTime = 60, remainingTime, pickedCards = [], successCount = 0, isPause = false, pauseClickTime = 0;
var soundStart, soundEnd, soundFlip, soundPaired;
var shuffle = function (a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
var startGame = function () {

    $('.card').addClass('flip-active');

    setTimeout(() => {
        closeAllCard();
        countDownTime();

        $('#titleGame').text('Pairs');

        $('#preCountDown').css('display', 'none');

        $('#play-pause-section').css('display', 'block')
        $('#successCount').css('display', 'block');
        $('#countTimer').css('display', 'block');
    }, 5000);
}
var closeAllCard = function () {
    $('.card').each(function () {
        if ($(this).hasClass("locked")) {

        } else {
            $(this).removeClass('flip-active');
        }
    });
}
var countDownTime = function () {
    remainingTime = totalTime;
    var interVal = setInterval(function () {
        if (isPause) {
            return;
        }
        remainingTime--;
        var percentTime = remainingTime / totalTime * 100 + '%';
        $('#percentTime').css('width', percentTime)
        $('#time').html(remainingTime)
        if (remainingTime == 1) {
            soundEnd.play();
        }
        if (remainingTime <= 0) {
            clearInterval(interVal);
            if (successCount == 0) {
                alert('oh no')
            } else {
                window.location.pathname = './submit.html'

            }

        }
    }, 1000)
}
var init = function () {
    /** init sounds**/
    soundStart = new Howl({
        src: ['./TemplateData/sounds/start.mp3']
    })
    soundEnd = new Howl({
        src: ['./TemplateData/sounds/end.mp3']
    });
    soundFlip = new Howl({
        src: ['./TemplateData/sounds/flip.mp3']
    });
    soundPaired = new Howl({
        src: ['./TemplateData/sounds/paired.mp3']
    });
    soundStart.once('load', function () {
        console.log('loaded')
        soundStart.play();
    });


    listObjShowup = shuffle(listObj).slice(0, 12);
    /* bind img to card*/
    for (var i = 0; i < listObjShowup.length; i++) {
        var frontId = '#front' + (i + 1);
        $(frontId).attr("src", listObjShowup[i]);
    }
    /* init logic */
    startGame();

}
var pair = function (pickedCards) {
    console.log(pickedCards)
    group.forEach(function (e, index) {
        if (e.includes(pickedCards[0].url) && e.includes(pickedCards[1].url)) {
            console.log('paired', index);
            successCount++;
            $('#card' + pickedCards[0].index).addClass('locked')
            $('#card' + pickedCards[1].index).addClass('locked')
            $('#successCount').text(successCount);
            soundPaired.play();
            setTimeout(function () {
                pause(pauseModeImg[index]);
                pauseClickTime = index
            }, 500)
            if (successCount === 6) {
                setTimeout(() => {
                    window.location.pathname = './submit.html';
                }, 2000);
            }
        }
    })
}
var resume = function () {
    $('#play').css('display', 'none');
    $('#pause').css('display', 'inline-block');
    isPause = false;
    $('#pause-mode').css('display', 'none');
}
var pause = function (imgSrc) {
    $('#pause').css('display', 'none');
    $('#play').css('display', 'inline-block');
    isPause = true;
    if (imgSrc) {
        $('#pause-mode').css('display', 'block');
        $("#pause-mode-img").attr('src', imgSrc);
    }

}
var getPauseImage = function () {
    let image = pauseModeImg[pauseClickTime % pauseModeImg.length];

    return image;
}
$(function () {
    init();
    $('.card').click(function () {
        if (pickedCards.length >= 2 || $(this).hasClass("flip-active") || $(this).hasClass("locked") || isPause) {
            return;
        } else {
            var index = $(this).attr('index');
            var frontUrl = $('#front' + index).attr('src');
            pickedCards.push({ url: frontUrl, index: index });
            $(this).addClass('flip-active');
            soundFlip.play();

        }
        /*pair*/
        if (pickedCards.length === 2) {
            pair(pickedCards);
            setTimeout(() => {
                closeAllCard();
                pickedCards = [];
            }, 1000);
        }
    });


    $('#pause').click(function () {
        pause(null);
        // $(this).css('display', 'none');
        // $('#play').css('display', 'inline-block');
        // isPause = true;
        // $('#pause-mode').css('display', 'block');
        // $("#pause-mode-img").attr('src', getPauseImage());
    });
    $('#play').click(function () {
        resume()
    });
    $('#resume_btn').click(function () {
        resume()
    });
    $('#pause-mode-img').click(function () {
        pauseClickTime++;
        $("#pause-mode-img").attr('src', getPauseImage());
    })
});

