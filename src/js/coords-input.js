const coordsRegex = /^[-+]?([1-8]?\d([\.,]\d+)?|90(\.0+)?)\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))([\.,]\d+)?)$/gi;

const formSearchByCoords = document.getElementById('formSearchByCoords');

const coordInputs = formSearchByCoords.querySelectorAll('input');

coordInputs.forEach(input =>
{
    input.addEventListener('paste', e =>
    {
        const clipboardText = e.clipboardData.getData('text');
        fillCoords(e, clipboardText);
        formSearchByCoords.dispatchEvent(new SubmitEvent('submit'));
    });

    input.addEventListener('keydown', e =>
    {
        if(e.code == 'Enter')
        {
            formSearchByCoords.dispatchEvent(new SubmitEvent('submit'));
        }
    });
});

function fillCoords(e, text)
{
    if(text.match(coordsRegex))
    {
        e.preventDefault();
        const [lat, lon] = text.split(' ');
        coordInputs.item(0).value = lat;
        coordInputs.item(1).value = lon;
    }
}

coordInputs.item(0).addEventListener('keydown', e =>
{
    if((e.code == 'Space' || e.code == 'ArrowRight') && isCaretAt(e.target, e.target.value.length))
    {
        coordInputs.item(1).focus();
        e.preventDefault();
    }
});

coordInputs.item(1).addEventListener('keydown', e =>
{
    if(e.code == 'Backspace' && isCaretAt(e.target, 0))
    {
        coordInputs.item(0).focus();
        e.preventDefault();
    }
    else if(e.code == 'ArrowLeft' && e.target.selectionEnd == 0)
    {
        coordInputs.item(0).focus();
    }
});

function isCaretAt(elem, pos)
{
    return elem.selectionStart == pos && elem.selectionEnd == pos;
}