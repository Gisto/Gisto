$(function () {
    'use strict';
    $('div.main').on('click', '.messenger', function () {
        $(this).slideUp('slow');
    });

    $('div.main').on('click', '.clicky', function () {

        if ($('div.comments i').hasClass('icon-arrow-down')) {
            $('div.the-comments span').slideUp('slow');
            $('div.comments i').text(' show')
                .removeClass('icon-arrow-down')
                .addClass('icon-arrow-up');
            $('div.comments').animate({
                height: '35px'
            }, 500);
        } else {
            $('div.the-comments span').slideDown('slow');
            $('div.comments i').text(' hide')
                .removeClass('icon-arrow-up')
                .addClass('icon-arrow-down');
            $('div.comments').animate({
                height: (window.innerHeight / 2) + 'px'
            }, 500);
        }
    });

});

/*
if (navigator.onLine === false) {
    var message = 'It seems you\'ve lost internet connection.';
    $('.warn').slideDown('slow');
    $('.warn span').text(message);
    setTimeout(function () {
        $('.warn').slideUp();
    }, 2500);
    console.log(message);
}
*/
