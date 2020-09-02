function somma (x, y)
{
    var i;
    var z = x;
    //
    for (i = 1; i <= y; i++)
    {
        z++;
    }
    return z;
}
//
function esegui () {
    var x = parseInt (document.modulo.x.value);
    var y = parseInt (document.modulo.y.value);
    var z;
    var risultato = "";
    z = somma (x, y);
    //
    risultato = risultato
        + x
        + "+"
        + y
        + "="
        + z;
    alert (risultato);
}