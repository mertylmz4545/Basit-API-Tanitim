const searchBar = document.getElementById('search-bar');
const apiContainer = document.getElementById('api-container');
const loadingDiv = document.getElementById('loading');
const mesajElemani = document.getElementById('Sonuç-yok');
const modeToggle = document.getElementById('mode-toggle');

// Arama Yardımcı Fonksiyonu
function metinIceriyorMu(anaMetin, arananKelime) {
    if (!arananKelime) return true;
    return anaMetin.toLowerCase().includes(arananKelime.toLowerCase());
}

// API Verilerini Getir
async function apiVerileriniGetir() {
    try {
        loadingDiv.style.display = 'block';
        const response = await fetch('https://api.apis.guru/v2/list.json');
        const data = await response.json();
        
        const siraliKeys = Object.keys(data).sort((a, b) => a.localeCompare(b)).slice(0, 50);
        loadingDiv.style.display = 'none';
        apiContainer.innerHTML = '';

        siraliKeys.forEach(key => {
            const api = data[key].versions[data[key].preferred];
            const kart = document.createElement('div');
            kart.className = 'metin-kutu';
            kart.innerHTML = `
                <div class="baslik">${api.info.title}</div>
                <p class="metin01">${api.info.description ? api.info.description.substring(0, 100) + '...' : 'Açıklama yok.'}</p>
            `;
            kart.onclick = () => detayGoster(api.info); 
            apiContainer.appendChild(kart);
        });
    } catch (error) {
        loadingDiv.textContent = "Veriler yüklenirken bir hata oluştu!";
    }
}

function detayGoster(info) {
    document.getElementById('detay-baslik').textContent = info.title;
    document.getElementById('detay-aciklama').textContent = info.description || "Açıklama bulunmuyor.";
    document.getElementById('detay-paneli').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function detayKapat() {
    document.getElementById('detay-paneli').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

// Arama ve Parlama Efekti
searchBar.addEventListener('input', function() {
    const query = this.value.trim();
    const kartlar = document.querySelectorAll('.metin-kutu');
    let sonucVarMi = false;

    kartlar.forEach(kart => {
        const baslikMetni = kart.querySelector('.baslik').textContent;
        const eslesmeVar = metinIceriyorMu(baslikMetni, query);
        
        kart.style.display = eslesmeVar ? '' : 'none';
        
        if (query !== "" && eslesmeVar) {
            kart.classList.add('eslesme-parlama');
            sonucVarMi = true;
        } else {
            kart.classList.remove('eslesme-parlama');
            if(eslesmeVar) sonucVarMi = true;
        }
    });
    mesajElemani.style.display = sonucVarMi ? 'none' : 'block';
});

modeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    modeToggle.querySelector('.buton-rengi').textContent = isLight ? "KARANLIK MOD" : "SİYAH-BEYAZ MOD";
});

apiVerileriniGetir();