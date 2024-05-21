// Lataa tallennetut tiedot sivun latautuessa
$(document).ready(function() {
    lataaTiedotLocalStoragesta();

    // Kuuntelijan lisääminen seuraa nappiin
    $('#seuraa').click(function() {
        seuraa();
    });
    // Funktio, joka käynnistyy seuraa-nappia painettaessa
    function seuraa() {
        var tuote = $('#tuote').val();
        var määrä = $('#määrä').val();
        var annos = $('#annos').val();

        // Tarkista syöttöjen pituus
        if (tuote.length > 40 || määrä.length > 40 || annos.length > 40) {
            alert("Syötteiden pituus saa olla enintään 40 merkkiä!");
            return;
        }

        if (tuote && määrä && annos) {
            var päiviäJäljellä = laskePäivätJäljellä(määrä, annos);
            var loppumisPäivä = laskeLoppumisPäivä(päiviäJäljellä);

            lisääTaulukkoon(tuote, määrä, annos, päiviäJäljellä, loppumisPäivä);
            tallennaTiedotLocalStorageen(tuote, määrä, annos, päiviäJäljellä, loppumisPäivä);

            // Lomakkeen tyhjennys
            $('#tuote').val("");
            $('#määrä').val("");
            $('#annos').val("");
        } else {
            alert('Täytä kaikki kentät!');
        }
    }

    // Funktio, joka laskee jäljellä olevat päivät ja palauttaa tuloksen pyöristettyna ylöspäin
    function laskePäivätJäljellä(määrä, annos) {
        var päiviäJäljellä = määrä / annos;
        return Math.ceil(päiviäJäljellä);
    }

    // Funktio, joka laskee loppumisPäivä ja muokkaa päivään haluttuun formaattiin
    function laskeLoppumisPäivä(päiviäJäljellä) {
        var tänään = new Date();
        var expiryDate = new Date(tänään.getTime() + päiviäJäljellä * 24 * 60 * 60 * 1000);

        // Muotoile päivämäärä "pp-kk-vvvv"
        var muutettuPäiväys = expiryDate.toLocaleDateString().split('T')[0];
        return muutettuPäiväys;
    }

    // Funktio,  joka lisää tuotteet taulukkoon hidastetusti
    function lisääTaulukkoon(tuote, määrä, annos, päiviäJäljellä, loppumisPäivä) {
        var $taulukko = $('#taulukko');
        var $rivi = $('<tr>').hide(); 
        $rivi.append('<td>' + tuote + '</td>');
        $rivi.append('<td>' + määrä + '</td>');
        $rivi.append('<td>' + annos + '</td>');
        $rivi.append('<td>' + päiviäJäljellä + ' päivää</td>');
        $rivi.append('<td>' + loppumisPäivä + '</td>');
        $rivi.append('<td><button class="poistaNappi">Poista</button></td>');
        $taulukko.prepend($rivi);
        $rivi.fadeIn(600);
    }

    // Funktio, joka tallentaa tuotteen tiedot LocalStorageen.
    function tallennaTiedotLocalStorageen(tuote, määrä, annos, päiviäJäljellä, loppumisPäivä) {
        var tuoteLista = JSON.parse(localStorage.getItem('tuoteLista')) || [];

        var uusiTuoteLista = {
            tuote: tuote,
            määrä: määrä,
            annos: annos,
            päiviäJäljellä: päiviäJäljellä,
            loppumisPäivä: loppumisPäivä
        };

        tuoteLista.push(uusiTuoteLista);
        console.log('uusiTuoteLista', uusiTuoteLista);
        localStorage.setItem('tuoteLista', JSON.stringify(tuoteLista));
    }

    // Funktio, joka poistaa tuotteen poista-nappia painettaessa
    $(document).on('click', '.poistaNappi', function() {
        var $rivi = $(this).closest('tr');
        var tuotteenNimi = $rivi.find('td:eq(0)').text();

        // Rivin poistaminen HTML-taulukosta hidastetusti
        $rivi.fadeOut(600, function() {
            $(this).remove();
        });

       
        poistaTuoteLocalStoragesta(tuotteenNimi);
    });

    // Funktio, joka poistaa tuotteen LocalStoragesta.
    function poistaTuoteLocalStoragesta(tuotteenNimi) {
        var tuoteLista = JSON.parse(localStorage.getItem('tuoteLista')) || [];

        // Etsi ja poista tuote listalta
        for (var i = 0; i < tuoteLista.length; i++) {
            if (tuoteLista[i].tuote === tuotteenNimi) {
                tuoteLista.splice(i, 1);
                break;
            }
        }

        localStorage.setItem('tuoteLista', JSON.stringify(tuoteLista));
    }

    // Funktio, joka lataa tiedot localStoragesta
    function lataaTiedotLocalStoragesta() {
        var tuoteLista = JSON.parse(localStorage.getItem('tuoteLista')) || [];

        for (var i = 0; i < tuoteLista.length; i++) {
            lisääTaulukkoon(
                tuoteLista[i].tuote,
                tuoteLista[i].määrä,
                tuoteLista[i].annos,
                tuoteLista[i].päiviäJäljellä,
                tuoteLista[i].loppumisPäivä
            );
        }
    }


});
