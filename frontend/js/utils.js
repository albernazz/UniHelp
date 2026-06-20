// =====================================================
//  UniHelp — Utilitários compartilhados
// =====================================================

// --- Toast de notificação ---
function showToast(msg, tipo = '') {
    let toast = document.getElementById('uh-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'uh-toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.className = 'toast ' + (tipo || '');
    void toast.offsetWidth; // força reflow para reiniciar animação
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 3500);
}

// --- Formata data relativa ---
function timeAgo(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d)) return '';
    const diff = Math.floor((Date.now() - d) / 1000);
    if (diff < 60) return 'agora mesmo';
    if (diff < 3600) return Math.floor(diff / 60) + ' min atrás';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h atrás';
    if (diff < 604800) return Math.floor(diff / 86400) + 'd atrás';
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

// --- Classe de cor por categoria ---
function tagClass(cat) {
    const map = { 'Programação': 'tag-prog', 'Cálculo': 'tag-calc', 'Física': 'tag-fis', 'Geral': 'tag-ger' };
    return map[cat] || 'tag-ger';
}

// --- Auth helpers ---
function getUsuario() {
    try { return JSON.parse(localStorage.getItem('unihelp_usuario')); }
    catch (e) { return null; }
}
function getToken() { return localStorage.getItem('unihelp_token') || null; }

function setAuth(usuario, token) {
    localStorage.setItem('unihelp_usuario', JSON.stringify(usuario));
    localStorage.setItem('unihelp_token', token);
}

function clearAuth() {
    localStorage.removeItem('unihelp_usuario');
    localStorage.removeItem('unihelp_token');
}

// --- Inicializa o header de usuário (se existir na página) ---
function initHeaderUser() {
    const area = document.getElementById('headerUserArea');
    if (!area) return;
    const usuario = getUsuario();
    if (usuario) {
        const ini = usuario.nome ? usuario.nome[0].toUpperCase() : 'U';
        area.innerHTML = `
            <div class="user-info-wrap">
                <span class="user-name-header">${usuario.nome}</span>
                <div class="user-avatar" title="${usuario.nome}">${ini}</div>
                <button class="btn-logout" onclick="fazerLogout()">Sair</button>
            </div>`;
    } else {
        area.innerHTML = `
            <div style="display:flex;align-items:center;gap:6px">
                <a href="login.html" class="header-btn btn-header-outline">Entrar</a>
                <a href="registro.html" class="header-btn btn-header-primary">Registrar</a>
            </div>`;
    }
}

// --- Logout ---
function fazerLogout() {
    clearAuth();
    showToast('Você saiu da conta.');
    setTimeout(() => window.location.href = 'feed.html', 800);
}

// --- Header search ---
function initHeaderSearch() {
    const inp = document.getElementById('headerSearchInput');
    if (!inp) return;
    inp.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            const q = inp.value.trim();
            if (q) window.location.href = `feed.html?busca=${encodeURIComponent(q)}`;
        }
    });
}

// --- Renderiza o header SO completo ---
function renderHeader() {
    const usuario = getUsuario();
    const header = document.getElementById('soHeader');
    if (!header) return;
    const ini = usuario ? (usuario.nome[0] || 'U').toUpperCase() : '';
    header.innerHTML = `
        <a href="feed.html" class="so-logo">
            <svg width="24" height="28" viewBox="0 0 26 30">
                <path d="M21 27v-9h3v12H0V18h3v9z"/>
                <path d="m4.5 17 14.08 2.95.63-2.98L5.13 14z" opacity=".6"/>
                <path d="m6.04 11.5 13.14 6.13 1.32-2.72-13.14-6.13z" opacity=".7"/>
                <path d="m9.53 6.44 11.4 9.27 1.87-2.3-11.4-9.27z" opacity=".8"/>
                <path d="m15.04 2 9.16 12.06-2.4 1.82L12.64 3.82z" opacity=".9"/>
            </svg>
            <span class="so-logo-text">Uni<span>Help</span></span>
        </a>
        <div class="header-search">
            <input type="text" id="headerSearchInput" placeholder="Buscar perguntas..." value="">
        </div>
        <div class="header-nav" id="headerUserArea">
            ${usuario
            ? `<div class="user-info-wrap">
                        <span class="user-name-header">${usuario.nome}</span>
                        <div class="user-avatar" title="${usuario.nome}">${ini}</div>
                        <button class="btn-logout" onclick="fazerLogout()">Sair</button>
                   </div>`
            : `<div style="display:flex;align-items:center;gap:6px">
                        <a href="login.html" class="header-btn btn-header-outline">Entrar</a>
                        <a href="registro.html" class="header-btn btn-header-primary">Registrar</a>
                   </div>`}
        </div>`;
    initHeaderSearch();
}