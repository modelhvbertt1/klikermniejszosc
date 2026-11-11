$(document).ready(function() {
    let ileKlikniec = 0;
    let silaKlikniecia = 1;
    let autoKlikacze = 0;
    let kosztSila = 10;
    let kosztMoc10 = 150;
    let kosztMoc100 = 1500;
    
    let nickGracza = localStorage.getItem('kliker_nick') || 'Gracz1';
    let najlepszyWynik = parseInt(localStorage.getItem('kliker_rekord')) || 0;
    let ranking = JSON.parse(localStorage.getItem('kliker_ranking')) || [];
    
    let ostatniSprawdzonyProgRuletki = 0;

    let wybranySBR = null;
    let wTrakcieWysciguSBR = false;
    let licznikPrzegranychSBR = 0;
    let czyJestWAlternatywnymUniwersum = false;
    
    // ==========================================
    // --- TUTAJ MOŻESZ ZMIENIAĆ OPISY, ZDJĘCIA ---
    // --- ORAZ OSOBNE PIOSENKI DLA KAŻDEGO ZAWODNIKA ---
    // ==========================================
    const zawodnicySBRData = [
        { id: 0,  nazwa: '', opis: '', zdjecie: '', audio: '' },
        { id: 1,  nazwa: 'Johnny Joestar', opis: 'Były dżokej ze Stanów Zjednoczonych. Używa mocy Spin i Standu Tusk.', zdjecie: 'johnny11.jpg', audio: 'Fleetwood Mac - Tusk (Official Music Video) [HD].m4a' },
        { id: 2,  nazwa: 'Gyro Zeppeli', opis: 'Mistrz techniki Steel Ball pochodzący z Królestwa Neapolu Jego stand nazywa się Ball Breaker.', zdjecie: 'gyro.jpg', audio: 'Ballbreaker.m4a' },
        { id: 3,  nazwa: 'Diego Brando', opis: 'Genialny dżokej z Wielkiej Brytanii, znany ze swojej bezwzględności, jego stand Scary Monsters pozwala mu na przemiane w dinozaura.', zdjecie: 'diegobrando.jpg', audio: 'David Bowie- Scary Monsters (And super creeps).m4a' },
        { id: 4,  nazwa: 'Hot Pants', opis: 'Tajemnicza uczestniczka wyścigu używająca Standu Cream Starter.', zdjecie: 'Hot_Pants.jpg', audio: 'James Brown - Hot Pants.m4a' },
        { id: 5,  nazwa: 'Ringo Roadagain', opis: 'Rewolwerowiec kierujący się kodeksem pojedynku. Potrafi manipulować cofa czas o 6 sekund za pomocą swojego standa Mandom.', zdjecie: 'ringo.jpg', audio: 'Jerry Wallace - Lovers Of The World (1976).m4a' },
        { id: 6,  nazwa: 'Mountain Tim', opis: 'Legendarny kowboj i tropiciel, potrafi poruszać się za pomocą swojego standa Oh! Lonesome Me poprzez swoje lasso.', zdjecie: 'MountainTim.jpg', audio: 'OH LONESOME ME ~ Don Gibson  1958.wmv.m4a' },
        { id: 7,  nazwa: 'Wekapipo', opis: 'Wojownik z Neapolu, używa techniki Satiporoja Steel Ball.', zdjecie: '400px-Wekapipo_Infobox_Manga.jpg', audio: 'SOUL_d OUT - Wekapipo (Wake up people).m4a' },
        { id: 8,  nazwa: 'Pocoloco', opis: 'Nieprawdopodobne szczęście sprzyja mu na każdym kroku (Hey Ya!).', zdjecie: '640px-Pocoloco_Infobox_Manga.jpg', audio: 'OutKast - Hey Ya! (Lyrics).m4a' },
        { id: 9,  nazwa: 'Sandman', opis: 'Biegacz z plemienia rdzennych Amerykanów. Porusza się na własnych nogach!. Jego umiejętność In a Silent Way pozwala mu na umieszczanie płapek', zdjecie: 'InASilentWaycolor.jpg', audio: 'Sandman.m4a' },
{ id: 10, nazwa: 'Blackmore', opis: 'Oddany zwiadowca i zabójca Funny Valentine. Posiada Stand Catch the Rainbow, który pozwala mu kontrolować deszcz i poruszać się po kroplach wody.', zdjecie: 'catchtherainbow.jpg', audio: 'Catch The Rainbow.m4a' },
        {id: 11, nazwa: 'Oyecomova', opis: 'Ekspert od ładunków wybuchowych pochodzący z Neapolu (Boku no Rhythm wo Kiitekure).', zdjecie: 'OyecomovaStand.jpg', audio: 'Santana - Oye Como Va (Official Audio).m4a' },
        { id: 12, nazwa: 'L.A Boom Boom', opis: 'Najmłodszy z braci Boom Boom, manipuluje polem magnetycznym. Jego stand to Tomb of the Boom', zdjecie: 'L_a.jpg', audio: 'Tomb of the Boom.m4a' },
        { id: 13, nazwa: 'Benjamin Boom Boom', opis: 'Ojciec i przywódca niebezpiecznego rodu Boom Boom. Jego stand to Tomb of the Boom', zdjecie: 'Benjamin_Boom_Boom_Infobox_Manga.jpg', audio: 'Tomb of the Boom.m4a' },
        { id: 14, nazwa: 'Andre Boom Boom', opis: 'Należy do przestępczej rodziny Boom Boom, używa przyciągania magnetycznego. Jego stand to Tomb of the Boom', zdjecie: 'Andre.jpg', audio: 'Tomb of the Boom.m4a' },
        { id: 15, nazwa: 'Mrs Robinson', opis: 'Morderca z wioski na pustyni korzystający z zabójczych insektów', zdjecie: 'Mrs_Robinson_Infobox_Manga.jpg', audio: 'Simon & Garfunkel - Mrs. Robinson (Audio).m4a' }
    ];
    // ==========================================

    const imionaSBR = zawodnicySBRData.map(z => z.nazwa);

    // Zmienne obsługujące odtwarzacz sekcji zawodników
    let aktualnyAudioObiekt = null;
    let aktualnyIdZawodnikaAudio = null;
    let aktualnieWybranyDoPodgladu = 1;

    // --- OBIEKTY AUDIO DLA RESZTY GRY ---
    let audioSBRMuzyka = new Audio('Johnny Theme _Jojo_s Bizarre Adventure_ Steel Ball Run_ Trailer Song_1.mp3');
    audioSBRMuzyka.loop = true;

    let audioMuzyka10k = new Audio('Bandera_1 (1).mp3');
    audioMuzyka10k.loop = true;

    let audioMuzykaAU = new Audio(''); 
    audioMuzykaAU.loop = true;

    let audioAUValentine = new Audio('D4C Funny Valentine Animation _ SBR_1.mp3'); 
    let audioUcieczkaJohnny = new Audio('Arigato_1.mp3');

    // --- INICJALIZACJA PANELA ZAWODNIKÓW ---
    function zainicjujPanelZawodnikow() {
        let $przelacznik = $('#sbr-przelacznik-zawodnikow');
        $przelacznik.empty();

        for (let i = 1; i <= 15; i++) {
            let $btn = $('<button></button>')
                .text(i + '. ' + zawodnicySBRData[i].nazwa.split(' ')[0])
                .addClass('btn-zakladka-zawodnik')
                .attr('data-id', i)
                .css({
                    'padding': '5px 8px',
                    'background': i === 1 ? '#b14def' : '#1a0b2e',
                    'color': 'white',
                    'border': '1px solid #900bdd',
                    'border-radius': '4px',
                    'font-size': '0.75em',
                    'font-weight': 'bold',
                    'cursor': 'pointer'
                });

            $przelacznik.append($btn);
        }

        // Dodanie struktury paska postępu i czasu do podglądu, jeśli jeszcze jej nie ma w HTML
        if ($('#sbr-odtwarzacz-kontener').length === 0) {
            let odtwarzaczHtml = `
                <div id="sbr-odtwarzacz-kontener" style="width: 100%; margin-top: 10px; display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.8em; color: #ffcc00;">
                        <span id="czas-aktualny">0:00</span>
                        <span id="czas-calkowity">0:00</span>
                    </div>
                    <input type="range" id="suwak-czasu" value="0" min="0" max="100" step="0.1" style="width: 100%; cursor: pointer; accent-color: #b14def;">
                    <div style="display: flex; gap: 6px; justify-content: center; flex-wrap: wrap;">
                        <button id="btn-tyl-15" style="padding: 5px 10px; background: #6c5ce7; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 0.85em;">⏪ -15s</button>
                        <button id="btn-odtwarzaj-zawodnika" style="padding: 6px 16px; background: #2ed573; color: white; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; font-size: 0.95em;">▶ Play</button>
                        <button id="btn-zatrzymaj-zawodnika" style="padding: 6px 16px; background: #ff4757; color: white; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; font-size: 0.95em;">⏸ Pause</button>
                        <button id="btn-przod-15" style="padding: 5px 10px; background: #6c5ce7; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 0.85em;">+15s ⏩</button>
                    </div>
                </div>
            `;
            $('#podglad-zawodnika').append(odtwarzaczHtml);
        }

        pokażPodglądZawodnika(1);
    }

    function formatujCzas(sekundy) {
        if (isNaN(sekundy)) return "0:00";
        let min = Math.floor(sekundy / 60);
        let sek = Math.floor(sekundy % 60);
        return min + ":" + (sek < 10 ? "0" : "") + sek;
    }

    function pokażPodglądZawodnika(id) {
        aktualnieWybranyDoPodgladu = id;
        let dane = zawodnicySBRData[id];

        $('.btn-zakladka-zawodnik').css('background', '#1a0b2e');
        $(`.btn-zakladka-zawodnik[data-id="${id}"]`).css('background', '#b14def');

        $('#zawodnik-nazwa').text(id + '. ' + dane.nazwa);
        $('#zawodnik-opis').text(dane.opis);
        $('#zawodnik-zdjecie').attr('src', dane.zdjecie);

        // Jeśli dla tego zawodnika gra już piosenka, zaktualizuj suwak i etykiety czasu
        if (aktualnyIdZawodnikaAudio === id && aktualnyAudioObiekt) {
            $('#suwak-czasu').val(aktualnyAudioObiekt.currentTime);
            $('#suwak-czasu').attr('max', aktualnyAudioObiekt.duration || 100);
            $('#czas-aktualny').text(formatujCzas(aktualnyAudioObiekt.currentTime));
            $('#czas-calkowity').text(formatujCzas(aktualnyAudioObiekt.duration));
        } else {
            $('#suwak-czasu').val(0);
            $('#suwak-czasu').attr('max', 100);
            $('#czas-aktualny').text("0:00");
            $('#czas-calkowity').text("0:00");
        }
    }

    $(document).on('click', '.btn-zakladka-zawodnik', function() {
        let id = parseInt($(this).attr('data-id'));
        pokażPodglądZawodnika(id);
    });

    // Przycisk PLAY (wznawianie od momentu zatrzymania lub start od początku)
    $(document).on('click', '#btn-odtwarzaj-zawodnika', function() {
        let dane = zawodnicySBRData[aktualnieWybranyDoPodgladu];
        let plikAudio = dane.audio;

        if (!plikAudio) {
            alert('Ten zawodnik nie ma przypisanej piosenki!');
            return;
        }

        // Jeśli kliknięto innego zawodnika, zatrzymujemy poprzedni utwór
        if (aktualnyIdZawodnikaAudio !== aktualnieWybranyDoPodgladu) {
            if (aktualnyAudioObiekt) {
                aktualnyAudioObiekt.pause();
                aktualnyAudioObiekt = null;
            }
            aktualnyAudioObiekt = new Audio(plikAudio);
            aktualnyAudioObiekt.loop = true;
            aktualnyIdZawodnikaAudio = aktualnieWybranyDoPodgladu;

            aktualnyAudioObiekt.addEventListener('timeupdate', function() {
                if (aktualnyIdZawodnikaAudio === aktualnieWybranyDoPodgladu) {
                    $('#suwak-czasu').val(aktualnyAudioObiekt.currentTime);
                    $('#czas-aktualny').text(formatujCzas(aktualnyAudioObiekt.currentTime));
                }
            });

            aktualnyAudioObiekt.addEventListener('loadedmetadata', function() {
                if (aktualnyIdZawodnikaAudio === aktualnieWybranyDoPodgladu) {
                    $('#suwak-czasu').attr('max', aktualnyAudioObiekt.duration);
                    $('#czas-calkowity').text(formatujCzas(aktualnyAudioObiekt.duration));
                }
            });
        }

        aktualnyAudioObiekt.play().catch(e => {
            alert('Nie udało się odtworzyć pliku: ' + plikAudio);
            console.log(e);
        });
    });

    // Przycisk PAUSE (pauza bez resetowania czasu)
    $(document).on('click', '#btn-zatrzymaj-zawodnika', function() {
        if (aktualnyAudioObiekt) {
            aktualnyAudioObiekt.pause();
        }
    });

    // Przycisk przewijania o 15 sekund do tyłu (-15s)
    $(document).on('click', '#btn-tyl-15', function() {
        if (aktualnyAudioObiekt) {
            aktualnyAudioObiekt.currentTime = Math.max(0, aktualnyAudioObiekt.currentTime - 15);
        }
    });

    // Przycisk przewijania o 15 sekund do przodu (+15s)
    $(document).on('click', '#btn-przod-15', function() {
        if (aktualnyAudioObiekt) {
            aktualnyAudioObiekt.currentTime = Math.min(aktualnyAudioObiekt.duration || 0, aktualnyAudioObiekt.currentTime + 15);
        }
    });

    // Obsługa suwaka (wybór momentu utworu)
    $(document).on('input', '#suwak-czasu', function() {
        if (aktualnyAudioObiekt && aktualnyIdZawodnikaAudio === aktualnieWybranyDoPodgladu) {
            let nowyCzas = $(this).val();
            aktualnyAudioObiekt.currentTime = nowyCzas;
            $('#czas-aktualny').text(formatujCzas(nowyCzas));
        }
    });

    zainicjujPanelZawodnikow();

    // Progi obrazków w GŁÓWNYM ŚWIECIE (11 poziomów)
    const progiObrazkowGlownych = [
        { prog: 0,      url: 'malymeksykaniec.jpg', nazwa: 'Nielegalny Imigrant z Meksyku' },
        { prog: 200,    url: 'meksykanka.jpg', nazwa: 'Nielegalna Imigrantka z Meksyku' },
        { prog: 500,    url: 'George_Floyd.jpg', nazwa: 'Fentanylowy Zbrodniarz' },
        { prog: 1000,   url: 'whoopie.jpg', nazwa: 'Czarnoskóra Kobieta' },
        { prog: 2000,   url: 'indianin.jpg', nazwa: 'Brudas' },
        { prog: 5000,   url: 'Old_Indian_woman_with_a_sari.jpg', nazwa: 'Kobieta brudas' },
        { prog: 10000,  url: 'swine.jpg', nazwa: 'Ukrainiec' },
        { prog: 20000,  url: 'bandera.jpg', nazwa: 'Ciota' },
        { prog: 50000,  url: 'jew.jpg', nazwa: 'Żyd' },
        { prog: 100000, url: 'captainisrael.jpg', nazwa: 'Kapitan Izrael' },
        { prog: 250000, url: 'bigyahu.jpg', nazwa: 'Big Yahu' }
    ];

    // Progi obrazków w ALTERNATYWNYM UNIWERSUM (AU) - 11 poziomów
    const progiObrazkowAU = [
        { prog: 0,      url: 'drug-war-chicago_camp.jpg', nazwa: 'AU: Meksykański kartel' },
        { prog: 200,    url: 'Pablo_Escobar_Mug.jpg', nazwa: 'AU: Pablo Escobar' },
        { prog: 500,    url: 'derek.jpg', nazwa: 'AU: Derek Chauvin' },
        { prog: 1000,   url: 'Saddam_Hussein_at_trial,_July_2004.jpg', nazwa: 'AU: Saddam Hussein' },
        { prog: 2000,   url: 'mao.jpg', nazwa: 'AU: Mao Zedong' },
        { prog: 5000,   url: 'polpot.jpg', nazwa: 'AU: Pol Pot' },
        { prog: 10000,  url: 'Enver_Pasha_1911.jpg', nazwa: 'AU: Ismail Enver Pasza' },
        { prog: 20000,  url: 'Volodymyr_Zelensky_2022_official_portrait_(cropped).jpg', nazwa: 'AU: Zelensky' },
        { prog: 50000,  url: 'putin.jpg', nazwa: 'AU: Władimir Putin' },
        { prog: 100000, url: 'stalin.jpg', nazwa: 'AU: Józef Stalin' },
        { prog: 250000, url: 'b765760e5a9a57ba802756e1e01b.jpg', nazwa: 'AU: Adolf Hitler' }
    ];

    let aktualnyIndeksProgu = -1;

    $('#nick-gracza').val(nickGracza);
    $('#najlepszy-wynik').text(najlepszyWynik);
    odswiezTabeleWynikow();

    if ($('#konteneranimacji-ruletki').length === 0) {
        $('body').append('<div id="konteneranimacji-ruletki" style="position:fixed; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:9999;"></div>');
    }

    $('#nick-gracza').on('input', function() {
        nickGracza = $(this).val().trim() || 'Gracz1';
        localStorage.setItem('kliker_nick', nickGracza);
    });

    $('#obszar').on('mouseenter', function() {
        $('.status').hide();
        $('.status').eq(0).css('display', 'inline');
    });

    $('#obszar').on('mouseleave', function() {
        $('.status').hide();
        $('.status').eq(1).css('display', 'inline');
    });

    // KLIKNIĘCIE W OBSZAR GRY
    $('#obszar').on('click', function(e) {
        dodajPunkty(silaKlikniecia);

        let audioKlik = new Audio('Strzal_1 (1).mp3');
        audioKlik.play().catch(e => console.log("Autoplay dźwięku kliknięcia zablokowany"));

        $('.status').hide();
        $('.status').eq(2).css('display', 'inline');

        pokaźAnimacjePlus(e);
    });

    function dodajPunkty(ilosc) {
        ileKlikniec += ilosc;
        
        $('#glowny-licznik').text(ileKlikniec);
        $('#licznik').text(ileKlikniec);

        sprawdzObrazekIPoziom();
        sprawdzCoKolejneProgi();
        sprawdzTlo();
        sprawdzIRozszerzRekord();
        aktualizujSklep();
    }

    // --- OBSŁUGA MINIGRY SBR DLA 15 JEŹDŹCÓW ---
    $('.btn-sbr-faworyt').on('click', function() {
        if (wTrakcieWysciguSBR) return;
        
        wybranySBR = parseInt($(this).data('wybor'));
        $('.btn-sbr-faworyt').css({ 'border-color': 'transparent', 'background-color': '#900bdd' });
        $(this).css({ 'border-color': '#ffcc00', 'background-color': '#b14def' });
        
        $('#sbr-status').text('Wybrano: ' + imionaSBR[wybranySBR]);
    });

    $('#sbr-start').on('click', function() {
        if (wTrakcieWysciguSBR) return;
        
        if (!wybranySBR) {
            $('#sbr-status').text('Wybierz najpierw swojego jeźdźca!');
            return;
        }

        let wpisowe = 100;
        if (ileKlikniec < wpisowe) {
            $('#sbr-status').text('Za mało punktów! Wpisowe to ' + wpisowe + ' pkt.');
            return;
        }

        ileKlikniec -= wpisowe;
        $('#glowny-licznik').text(ileKlikniec);
        $('#licznik').text(ileKlikniec);

        wTrakcieWysciguSBR = true;
        $('#sbr-start').prop('disabled', true);
        $('.btn-sbr-faworyt').prop('disabled', true);

        audioSBRMuzyka.currentTime = 0;
        audioSBRMuzyka.play().catch(e => console.log("Autoplay muzyki SBR zablokowany"));
        $('#sbr-status').text('Wielki wyścig Steel Ball Run dla 15 jeźdźców wystartował!');

        let pozycje = new Array(16).fill(5);
        let metaX = 425; 

        let pętlaSBR = setInterval(function() {
            for (let i = 1; i <= 15; i++) {
                pozycje[i] += Math.floor(Math.random() * 8) + 1;
                $('#sbr-koniu-' + i).css('left', pozycje[i] + 'px');
            }

            let zwyciezca = 0;
            for (let i = 1; i <= 15; i++) {
                if (pozycje[i] >= metaX) {
                    zwyciezca = i;
                    break;
                }
            }

            if (zwyciezca > 0) {
                clearInterval(pętlaSBR);
                
                audioSBRMuzyka.pause();
                audioSBRMuzyka.currentTime = 0;

                if (wybranySBR === zwyciezca) {
                    let nagroda = 10000;
                    ileKlikniec += nagroda;
                    $('#sbr-status').html(`WYGRANA! 🎉 ${imionaSBR[zwyciezca]} wygrywa wyścig! (+${nagroda} pkt)`);

                    let audioSBRWygrana = new Audio('Fleetwood Mac - The Chain (Official Audio)_1.mp3');
                    audioSBRWygrana.play().catch(e => {});

                    if (czyJestWAlternatywnymUniwersum) {
                        setTimeout(uruchomPowrotDoGlownegoSwiata, 1500);
                    }

                } else {
                    if (!czyJestWAlternatywnymUniwersum) {
                        licznikPrzegranychSBR++;
                        $('#sbr-status').html(`PRZEGRANA (${licznikPrzegranychSBR})! 😢 Wygrał: ${imionaSBR[zwyciezca]}.`);
                    } else {
                        $('#sbr-status').html(`PRZEGRANA w AU! 😢 Wygrał: ${imionaSBR[zwyciezca]}. Wygrana jest wymagana, by uciec!`);
                    }

                    let audioSBRPrzegrana = new Audio('アニメ『スティール・ボール・ラン ジョジョの奇妙な冒険』ノンクレジットエンディング映像｜千葉雄喜 『死ぬか生きるか』_1.mp3');
                    audioSBRPrzegrana.play().catch(e => {});

                    if (licznikPrzegranychSBR === 6 && !czyJestWAlternatywnymUniwersum) {
                        setTimeout(uruchomPrzejscieDoAU, 1500);
                    }
                }

                $('#glowny-licznik').text(ileKlikniec);
                $('#licznik').text(ileKlikniec);
                sprawdzIRozszerzRekord();

                setTimeout(function() {
                    for (let i = 1; i <= 15; i++) {
                        $('#sbr-koniu-' + i).css('left', '5px');
                    }
                    wTrakcieWysciguSBR = false;
                    $('#sbr-start').prop('disabled', false);
                    $('.btn-sbr-faworyt').prop('disabled', false);
                    $('#sbr-status').text('Wybierz faworyta do kolejnego wyścigu!');
                }, 3500);
            }
        }, 70);
    });

    // --- PRZEJŚCIE DO AU Z RESETEM PUNKTÓW I SIŁY KLIKU DO 1 ---
    function uruchomPrzejscieDoAU() {
        czyJestWAlternatywnymUniwersum = true;

        ileKlikniec = 0;
        silaKlikniecia = 1;
        kosztSila = 10;
        kosztMoc10 = 150;
        kosztMoc100 = 1500;

        $('#glowny-licznik').text(ileKlikniec);
        $('#licznik').text(ileKlikniec);
        $('#koszt-sila').text(kosztSila);
        $('#koszt-moc-10').text(kosztMoc10);
        $('#koszt-moc-100').text(kosztMoc100);
        $('#moc-kliku-opisu').text(silaKlikniecia);
        
        ostatniSprawdzonyProgRuletki = 0;

        audioAUValentine.currentTime = 0;
        audioAUValentine.play().catch(e => console.log("Autoplay AU zablokowany"));

        let modalAUHtml = `
            <div id="modal-au" style="position:fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.92); z-index:99999; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:white; padding:20px;">
                <h1 style="color: #ffcc00; text-shadow: 0 0 15px #ff0000; font-size: 2.2em; margin-bottom: 10px;">D4C!</h1>
                <p style="font-size: 1.2em; max-width: 600px; color: #d0e0ff; margin-bottom: 20px;">
                    <i>"My heart and actions are unclouded. They are all those of 'Justice'."</i><br>
                    Po 6 porażkach Funny Valentine przenosi całe Twoje otoczenie do Alternatywnego Uniwersum (AU)!<br>
                    <b>Gra zaczyna się od nowa! Punkty i siła kliknięcia zostały zresetowane. Aby uciec, musisz wygrać wyścig!</b>
                </p>
                <img src="d4c.jpg" alt="D4C & Flaga USA" style="width: 250px; height: 160px; object-fit: cover; border: 4px solid gold; border-radius: 10px; box-shadow: 0 0 30px rgba(255,215,0,0.6); margin-bottom: 25px;">
                <button id="btn-wejscie-au" style="padding: 12px 30px; background: #b14def; color: white; border: none; border-radius: 8px; font-size: 1.2em; font-weight: bold; cursor: pointer; box-shadow: 0 0 15px #b14def;">Wejdź do nowego Uniwersum</button>
            </div>
        `;
        $('body').append(modalAUHtml);

        $('#btn-wejscie-au').on('click', function() {
            audioAUValentine.pause();
            audioAUValentine.currentTime = 0;

            przelaczSwiatNaAU();
            $('#modal-au').fadeOut(500, function() { $(this).remove(); });
        });
    }

    // --- POWRÓT Z AU DO GŁÓWNEGO ŚWIATA PO WYGRANEJ ---
    function uruchomPowrotDoGlownegoSwiata() {
        czyJestWAlternatywnymUniwersum = false;
        licznikPrzegranychSBR = 0; 
        
        ileKlikniec = 0; 
        silaKlikniecia = 1;
        kosztSila = 10;
        kosztMoc10 = 150;
        kosztMoc100 = 1500;

        $('#glowny-licznik').text(ileKlikniec);
        $('#licznik').text(ileKlikniec);
        $('#koszt-sila').text(kosztSila);
        $('#koszt-moc-10').text(kosztMoc10);
        $('#koszt-moc-100').text(kosztMoc100);
        $('#moc-kliku-opisu').text(silaKlikniecia);
        
        ostatniSprawdzonyProgRuletki = 0;

        audioUcieczkaJohnny.currentTime = 0;
        audioUcieczkaJohnny.play().catch(e => console.log("Autoplay ucieczki Johnny'ego zablokowany"));

        let modalPowrotHtml = `
            <div id="modal-powrot" style="position:fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.92); z-index:99999; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:white; padding:20px;">
                <h1 style="color: #00ffcc; text-shadow: 0 0 15px #00ffff; font-size: 2.2em; margin-bottom: 10px;">Ucieczka z Alternatywnego Uniwersum!</h1>
                <p style="font-size: 1.2em; max-width: 600px; color: #d0fffa; margin-bottom: 20px;">
                    <i>"Thank you Gyro"</i><br>
                    Udało Ci się wygrać wyścig! Johnny Joestar pomógł Ci przedrzeć się przez wymiary i wracasz do domu!
                </p>
                <img src="johnny.jpg" alt="Johnny Joestar" style="width: 260px; height: 160px; object-fit: cover; border: 4px solid #00ffcc; border-radius: 10px; box-shadow: 0 0 30px rgba(0,255,204,0.6); margin-bottom: 25px;">
                <button id="btn-powrot-swiat" style="padding: 12px 30px; background: #00bfff; color: white; border: none; border-radius: 8px; font-size: 1.2em; font-weight: bold; cursor: pointer; box-shadow: 0 0 15px #00bfff;">Wróć do Oryginalnego Świata</button>
            </div>
        `;
        $('body').append(modalPowrotHtml);

        $('#btn-powrot-swiat').on('click', function() {
            audioUcieczkaJohnny.pause();
            audioUcieczkaJohnny.currentTime = 0;

            przelaczSwiatNaGlowny();
            $('#modal-powrot').fadeOut(500, function() { $(this).remove(); });
        });
    }

    function przelaczSwiatNaAU() {
        $('#profil-gracza h2').text('Rozstrzelaj Zbrodniarzy itp. kliker');
        $('#sbr-kontener').css({
            'background': 'rgba(10, 25, 45, 0.95)',
            'border-color': '#00ffcc',
            'box-shadow': '0 0 25px rgba(0, 255, 204, 0.5)'
        });
        $('#sbr-status').text('Witamy w AU! Wygraj wyścig, aby uciec!');

        sprawdzObrazekIPoziom();
        sprawdzTlo();
        aktualizujSklep();
    }

    function przelaczSwiatNaGlowny() {
        $('#profil-gracza h2').text('Rozstrzelaj Mniejszości Etniczne kliker');
        $('#sbr-kontener').css({
            'background': 'rgba(25, 12, 40, 0.95)',
            'border-color': '#b14def',
            'box-shadow': '0 0 20px rgba(177, 77, 239, 0.5)'
        });
        $('#sbr-status').text('Powróciłeś do głównego świata. Wybierz faworyta!');

        sprawdzObrazekIPoziom();
        sprawdzTlo();
        aktualizujSklep();
    }

    function sprawdzCoKolejneProgi() {
        let progWymagany = ileKlikniec >= 75000 ? 50000 : 2000;
        let aktualnyProg = Math.floor(ileKlikniec / progWymagany) * progWymagany;

        if (aktualnyProg >= progWymagany && aktualnyProg > ostatniSprawdzonyProgRuletki && $('#minigra-modal').length === 0) {
            ostatniSprawdzonyProgRuletki = aktualnyProg;
            
            let czyPojawicRuletke = Math.random() < 0.1;

            if (czyPojawicRuletke) {
                if (czyJestWAlternatywnymUniwersum) {
                    uruchomMinigreRuletkiAU();
                } else {
                    uruchomMinigreRuletki();
                }
            }
        }
    }

    // --- ORYGINALNA RULETKA (GŁÓWNY ŚWIAT) ---
    function uruchomMinigreRuletki() {
        let audioWejscie = new Audio('Hava Nagila_1.mp3'); 
        audioWejscie.loop = true;
        audioWejscie.play().catch(e => console.log("Autoplay zablokowany"));

        let modalHtml = `
            <div id="minigra-modal">
                <div id="minigra-kontent">
                    <h3>Wyzwanie Ruletki!</h3>
                    <p>Zakręć kołem i zmierz się z losem!</p>
                    
                    <img id="obrazek-minigry" src="ruletazyd.jpg" alt="Postać w ruletce" style="width: 80px; height: 80px; object-fit: contain;">
                    
                    <div id="kolo-ruletki-kontener">
                        <div id="wskaznik-kola"></div>
                        <div id="kolo-ruletki"></div>
                    </div>
                    
                    <p id="wynik-tekst"><b>Wygrywasz:</b> +1.5x Twoich punktów | <b>Przegrywasz:</b> -50% pkt</p>
                    <button id="btn-losuj">Zakręć kołem!</button>
                </div>
            </div>
        `;
        $('body').append(modalHtml);

        $('#btn-losuj').on('click', function() {
            $(this).prop('disabled', true);
            
            let wygrana = Math.random() < 0.5;
            let docelowyKat = wygrana ? (1440 + Math.floor(Math.random() * 160) + 190) : (1440 + Math.floor(Math.random() * 160) + 10);
            
            $('#kolo-ruletki').css('transform', `rotate(${docelowyKat}deg)`);

            setTimeout(function() {
                if (wygrana) {
                    let bonusPunkty = Math.floor(ileKlikniec * 1.5);
                    ileKlikniec += bonusPunkty;

                    $('#minigra-kontent h3').text('WYGRANA! 🎉');
                    $('#wynik-tekst').html(`Brawo! Zyskujesz potężny bonus <b>+${bonusPunkty} pkt</b> (1.5x Twojego stanu)!`);

                    let audioWygrana = new Audio('Hitler_s speech meine arbeit_1_1.mp3');
                    audioWygrana.play().catch(e => {});

                } else {
                    $('#minigra-kontent h3').text('PRZEGRANA! 😢');
                    let strata = Math.floor(ileKlikniec / 2);
                    ileKlikniec -= strata;
                    $('#wynik-tekst').html('Niestety! Straciłeś połowę punktów (-' + strata + ' pkt).');

                    let audioPrzegrana = new Audio('Jackpot_1.mp3');
                    audioPrzegrana.play().catch(e => {});
                }

                $('#glowny-licznik').text(ileKlikniec);
                $('#licznik').text(ileKlikniec);
                sprawdzIRozszerzRekord();

                setTimeout(function() {
                    let modalRect = document.getElementById('minigra-kontent').getBoundingClientRect();
                    
                    let $zydWedrujacy = $('<img src="ruletazyd.jpg" class="postac-w-ruchu">').css({
                        position: 'fixed',
                        left: (modalRect.left + modalRect.width / 2 - 40) + 'px',
                        top: (modalRect.top + 30) + 'px',
                        width: '80px',
                        height: '80px',
                        'object-fit': 'contain',
                        'z-index': '10000',
                        transition: 'all 1.5s ease-in-out'
                    });

                    $('#konteneranimacji-ruletki').append($zydWedrujacy);
                    $('#minigra-modal').fadeOut(300, function() { $(this).remove(); });

                    setTimeout(function() {
                        let docelowyLeft = 120;
                        let docelowyTop = window.innerHeight / 2 - 70;

                        $zydWedrujacy.css({
                            left: docelowyLeft + 'px',
                            top: docelowyTop + 'px'
                        });

                        setTimeout(function() {
                            if (wygrana) {
                                let $drugiObrazek = $('<img src="auschwitz.jpg" alt="Drugie miejsce">').css({
                                    position: 'fixed',
                                    left: docelowyLeft + 'px',
                                    top: docelowyTop + 'px',
                                    width: '140px',
                                    height: '140px',
                                    'object-fit': 'contain',
                                    'z-index': '10000',
                                    opacity: '0',
                                    transform: 'scale(0.5)',
                                    transition: 'all 0.5s ease'
                                });

                                $('#konteneranimacji-ruletki').append($drugiObrazek);
                                
                                setTimeout(() => {
                                    $drugiObrazek.css({ opacity: '1', transform: 'scale(1)' });
                                }, 50);

                                setTimeout(function() {
                                    $zydWedrujacy.addClass('spalanie-na-popiol');
                                    
                                    setTimeout(() => {
                                        $zydWedrujacy.remove();
                                        
                                        setTimeout(() => {
                                            $drugiObrazek.css({ transition: 'opacity 0.8s ease', opacity: '0' });
                                            setTimeout(() => {
                                                $drugiObrazek.remove();
                                                audioWejscie.pause();
                                                audioWejscie.currentTime = 0;
                                            }, 800);
                                        }, 1500);

                                    }, 1200);
                                }, 500);

                            } else {
                                $zydWedrujacy.css({ transition: 'opacity 0.5s ease', opacity: '0' });
                                setTimeout(() => {
                                    $zydWedrujacy.remove();
                                    audioWejscie.pause();
                                    audioWejscie.currentTime = 0;
                                }, 500);
                            }

                        }, 1500);

                    }, 50);

                }, 2000);

            }, 3000);
        });
    }

    // --- RULETKA DLA AU ---
    function uruchomMinigreRuletkiAU() {
        let audioWejscieAU = new Audio('Erika German song.mp3'); 
        audioWejscieAU.loop = true;
        audioWejscieAU.play().catch(e => console.log("Autoplay zablokowany"));

        let modalHtml = `
            <div id="minigra-modal">
                <div id="minigra-kontent" style="border-color: #00ffcc; box-shadow: 0 0 25px rgba(0, 255, 204, 0.8);">
                    <h3 style="color: #00ffcc;">Ruletka Alternatywnego Uniwersum!</h3>
                    <p>Zaryzykuj w Alternatywnym Uniwersum!</p>
                    
                    <img id="obrazek-minigry" src="Adolf-Hitler-1933.jpg" alt="Postać w ruletce AU" style="width: 80px; height: 80px; object-fit: contain;">
                    
                    <div id="kolo-ruletki-kontener">
                        <div id="wskaznik-kola"></div>
                        <div id="kolo-ruletki" style="border-color: #00ffcc; background: conic-gradient(#00ffcc 0deg 180deg, #b14def 180deg 360deg);"></div>
                    </div>
                    
                    <p id="wynik-tekst"><b>Wygrywasz:</b> +2x Twoich punktów | <b>Przegrywasz:</b> Reset pkt do 0</p>
                    <button id="btn-losuj-au" style="background-color: #00ffcc; color: #02050a;">Zakręć kołem AU!</button>
                </div>
            </div>
        `;
        $('body').append(modalHtml);

        $('#btn-losuj-au').on('click', function() {
            $(this).prop('disabled', true);
            
            let wygrana = Math.random() < 0.5;
            let docelowyKat = wygrana ? (1440 + Math.floor(Math.random() * 160) + 190) : (1440 + Math.floor(Math.random() * 160) + 10);
            
            $('#kolo-ruletki').css('transform', `rotate(${docelowyKat}deg)`);

            setTimeout(function() {
                if (wygrana) {
                    let bonusPunkty = ileKlikniec > 0 ? ileKlikniec : 500;
                    ileKlikniec += bonusPunkty;

                    $('#minigra-kontent h3').text('WYGRANA! 🎉');
                    $('#wynik-tekst').html(`Niesamowite! Zyskujesz <b>+${bonusPunkty} pkt</b> w Alternatywnym Uniwersum!`);

                    let audioWygrana = new Audio('Nein_1.mp3');
                    audioWygrana.play().catch(e => {});

                } else {
                    $('#minigra-kontent h3').text('PRZEGRANA! 😢');
                    ileKlikniec = 0; 
                    $('#wynik-tekst').html('Wymiar Cię odrzucił! Twoje punkty spadły do <b>0</b>.');

                    let audioPrzegrana = new Audio('Jackpot_1.mp3');
                    audioPrzegrana.play().catch(e => {});
                }

                $('#glowny-licznik').text(ileKlikniec);
                $('#licznik').text(ileKlikniec);
                sprawdzIRozszerzRekord();

                setTimeout(function() {
                    $('#minigra-modal').fadeOut(300, function() { 
                        $(this).remove(); 
                        audioWejscieAU.pause();
                        audioWejscieAU.currentTime = 0;
                    });
                }, 2500);

            }, 3000);
        });
    }

    function sprawdzTlo() {
        $('body').removeClass('tlo-poziom-500 tlo-poziom-2000 tlo-poziom-10000 tlo-poziom-50000 au-tlo-poziom-0 au-tlo-poziom-200 au-tlo-poziom-500 au-tlo-poziom-1000 au-tlo-poziom-2000 au-tlo-poziom-5000 au-tlo-poziom-10000 au-tlo-poziom-20000 au-tlo-poziom-50000 au-tlo-poziom-100000 au-tlo-poziom-250000');

        if (!czyJestWAlternatywnymUniwersum) {
            if (ileKlikniec >= 10000 && ileKlikniec < 50000) {
                if (audioMuzyka10k.paused) {
                    audioMuzyka10k.play().catch(e => console.log("Autoplay muzyki 10k zablokowany"));
                }
            } else {
                if (!audioMuzyka10k.paused) {
                    audioMuzyka10k.pause();
                    audioMuzyka10k.currentTime = 0;
                }
            }

            if (ileKlikniec >= 50000) {
                $('body').addClass('tlo-poziom-50000');
            } else if (ileKlikniec >= 10000) {
                $('body').addClass('tlo-poziom-10000');
            } else if (ileKlikniec >= 2000) {
                $('body').addClass('tlo-poziom-2000');
            } else if (ileKlikniec >= 500) {
                $('body').addClass('tlo-poziom-500');
            }

        } else {
            if (ileKlikniec >= 10000) {
                if (audioMuzykaAU.paused) {
                    audioMuzykaAU.play().catch(e => console.log("Autoplay muzyki AU zablokowany"));
                }
            } else {
                if (!audioMuzykaAU.paused) {
                    audioMuzykaAU.pause();
                    audioMuzykaAU.currentTime = 0;
                }
            }

            if (ileKlikniec >= 250000) {
                $('body').addClass('au-tlo-poziom-250000');
            } else if (ileKlikniec >= 100000) {
                $('body').addClass('au-tlo-poziom-100000');
            } else if (ileKlikniec >= 50000) {
                $('body').addClass('au-tlo-poziom-50000');
            } else if (ileKlikniec >= 20000) {
                $('body').addClass('au-tlo-poziom-20000');
            } else if (ileKlikniec >= 10000) {
                $('body').addClass('au-tlo-poziom-10000');
            } else if (ileKlikniec >= 5000) {
                $('body').addClass('au-tlo-poziom-5000');
            } else if (ileKlikniec >= 2000) {
                $('body').addClass('au-tlo-poziom-2000');
            } else if (ileKlikniec >= 1000) {
                $('body').addClass('au-tlo-poziom-1000');
            } else if (ileKlikniec >= 500) {
                $('body').addClass('au-tlo-poziom-500');
            } else if (ileKlikniec >= 200) {
                $('body').addClass('au-tlo-poziom-200');
            } else {
                $('body').addClass('au-tlo-poziom-0');
            }
        }
    }

    function sprawdzObrazekIPoziom() {
        let aktywnaListaProgow = czyJestWAlternatywnymUniwersum ? progiObrazkowAU : progiObrazkowGlownych;

        let nowyIndeks = 0;
        for (let i = aktywnaListaProgow.length - 1; i >= 0; i--) {
            if (ileKlikniec >= aktywnaListaProgow[i].prog) {
                nowyIndeks = i;
                break;
            }
        }

        if (aktualnyIndeksProgu !== nowyIndeks) {
            aktualnyIndeksProgu = nowyIndeks;
            
            $('#moj-obrazek').attr('src', aktywnaListaProgow[nowyIndeks].url);
            $('#tekst-wewnatrz').text(aktywnaListaProgow[nowyIndeks].nazwa);

            $('#moj-obrazek').css('transform', 'scale(1.3)');
            setTimeout(function() {
                $('#moj-obrazek').css('transform', 'scale(1)');
            }, 250);
        }
    }

    function sprawdzIRozszerzRekord() {
        if (ileKlikniec > najlepszyWynik) {
            najlepszyWynik = ileKlikniec;
            $('#najlepszy-wynik').text(najlepszyWynik);
            localStorage.setItem('kliker_rekord', najlepszyWynik);
        }

        let graczIndex = ranking.findIndex(item => item.nick === nickGracza);
        if (graczIndex !== -1) {
            if (ileKlikniec > ranking[graczIndex].punkty) {
                ranking[graczIndex].punkty = ileKlikniec;
            }
        } else {
            ranking.push({ nick: nickGracza, punkty: ileKlikniec });
        }

        ranking.sort((a, b) => b.punkty - a.punkty);
        ranking = ranking.slice(0, 5);

        localStorage.setItem('kliker_ranking', JSON.stringify(ranking));
        odswiezTabeleWynikow();
    }

    function odswiezTabeleWynikow() {
        $('#lista-wynikow').empty();
        ranking.forEach(function(item) {
            $('#lista-wynikow').append('<li>' + item.nick + ': ' + item.punkty + ' pkt</li>');
        });
    }

    // Zakup +1 do kliku
    $('#kup-sila').on('click', function() {
        if (ileKlikniec >= kosztSila) {
            ileKlikniec -= kosztSila;
            silaKlikniecia += 1;
            kosztSila = Math.round(kosztSila * 1.5);

            $('#glowny-licznik').text(ileKlikniec);
            $('#licznik').text(ileKlikniec);
            $('#koszt-sila').text(kosztSila);
            $('#moc-kliku-opisu').text(silaKlikniecia);
            
            sprawdzObrazekIPoziom();
            sprawdzCoKolejneProgi();
            sprawdzTlo();
            aktualizujSklep();
        }
    });

    // Zakup +10 do kliku
    $('#kup-moc-10').on('click', function() {
        if (ileKlikniec >= kosztMoc10) {
            ileKlikniec -= kosztMoc10;
            silaKlikniecia += 10;
            kosztMoc10 = Math.round(kosztMoc10 * 1.6);

            $('#glowny-licznik').text(ileKlikniec);
            $('#licznik').text(ileKlikniec);
            $('#koszt-moc-10').text(kosztMoc10);
            $('#moc-kliku-opisu').text(silaKlikniecia);
            
            sprawdzObrazekIPoziom();
            sprawdzCoKolejneProgi();
            sprawdzTlo();
            aktualizujSklep();
        }
    });

    // Zakup +100 do kliku
    $('#kup-moc-100').on('click', function() {
        if (ileKlikniec >= kosztMoc100) {
            ileKlikniec -= kosztMoc100;
            silaKlikniecia += 100;
            kosztMoc100 = Math.round(kosztMoc100 * 1.7);

            $('#glowny-licznik').text(ileKlikniec);
            $('#licznik').text(ileKlikniec);
            $('#koszt-moc-100').text(kosztMoc100);
            $('#moc-kliku-opisu').text(silaKlikniecia);
            
            sprawdzObrazekIPoziom();
            sprawdzCoKolejneProgi();
            sprawdzTlo();
            aktualizujSklep();
        }
    });

    function aktualizujSklep() {
        $('#kup-sila').prop('disabled', ileKlikniec < kosztSila);
        $('#kup-moc-10').prop('disabled', ileKlikniec < kosztMoc10);
        $('#kup-moc-100').prop('disabled', ileKlikniec < kosztMoc100);
    }

    function pokaźAnimacjePlus(e) {
        let offset = $('#obszar').offset();
        let x = e.pageX - offset.left;
        let y = e.pageY - offset.top;

        let $plus = $('<span></span>')
            .addClass('plus-animacja')
            .text('+' + silaKlikniecia)
            .css({ left: x + 'px', top: y + 'px' });

        $('#obszar').append($plus);

        setTimeout(function() {
            $plus.remove();
        }, 800);
    }

    sprawdzObrazekIPoziom();
    sprawdzTlo();
    aktualizujSklep();
});
