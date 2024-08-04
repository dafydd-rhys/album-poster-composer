// designSelection.js
$(document).ready(function () {
    // Set the default design as selected
    const defaultDesign = 'design1';
    $(`.design[data-design="${defaultDesign}"]`).addClass('selected');

    // Handle design selection
    $('.design').click(function () {
        $('.design').removeClass('selected');
        $(this).addClass('selected');
    });
});
