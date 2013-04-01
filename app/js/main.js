$("#loading").ajaxStart(function() {
    $(this).show();
}).ajaxStop(function() {
    $(this).hide();
});

$(function() {

    $('div.main').on('click', '.messenger', function() {
        $(this).slideUp('slow');
    });
    
    $('div.main').on('click', 'div.comments i.icon-arrow-up', function() {
        $('div.the-comments span').fadeIn('slow');
        $('div.comments i').text(' hide')
                .removeClass('icon-arrow-up')
                .addClass('icon-arrow-down');
    });
    $('div.main').on('click', 'div.comments i.icon-arrow-down', function() {
        $('div.the-comments span').fadeOut('slow');
        $('div.comments i').text(' show')
                .removeClass('icon-arrow-down')
                .addClass('icon-arrow-up');
    });
    

    $('div.main header a .update').click(function() {
        $.ajax({
            url: "http://localhost:3000/gists/",
            crossDomain: true
        })
                .done(function() {
            console.log("success");
        });
    });

});