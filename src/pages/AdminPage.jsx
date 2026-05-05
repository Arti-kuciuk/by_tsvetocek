import React, { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../backend/supabaseClient';
import { useDropzone } from 'react-dropzone';

// ─── BIRTHDAY HELPERS ────────────────────────────────────────────────────────
const isBirthdayToday = () => {
  const now = new Date();
  return now.getMonth() === 4 && now.getDate() === 6; // May = 4
};

const isDariaAccount = (username) =>
  username?.toLowerCase().trim() === 'dasha';

// ─── ПАСХАЛКА: ЦВЕТОЧЕК В ХЕДЕРЕ ─────────────────────────────────────────────
function BirthdayFlower({ onClick }) {
  return (
    <button
      onClick={onClick}
      title="С днём рождения! 🌸"
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '22px',
        lineHeight: 1,
        padding: '4px 8px',
        borderRadius: '50%',
        transition: 'transform 0.3s ease',
        display: 'inline-flex',
        alignItems: 'center',
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.4) rotate(15deg)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1) rotate(0deg)')}
    >
      🌸
    </button>
  );
}

// ─── КОНВЕРТ + ПИСЬМО ─────────────────────────────────────────────────────────
function BirthdayLetter({ onClose }) {
  const [phase, setPhase] = useState('envelope'); // envelope → opening → card → visible
  const timerRef = useRef(null);

  useEffect(() => {
    // Конверт появляется → открывается → карточка вылетает
    timerRef.current = setTimeout(() => setPhase('opening'), 800);
    return () => clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (phase === 'opening') {
      timerRef.current = setTimeout(() => setPhase('card'), 700);
    }
    if (phase === 'card') {
      timerRef.current = setTimeout(() => setPhase('visible'), 400);
    }
    return () => clearTimeout(timerRef.current);
  }, [phase]);

  const petals = ['🌸', '🌺', '🌼', '🌷', '💐', '🌹', '🌸', '🌺'];

  return (
    // ── BACKDROP ──
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(60, 40, 30, 0.72)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'bdFadeIn 0.5s ease forwards',
      }}
    >
      {/* Летящие лепестки по фону */}
      {petals.map((p, i) => (
        <span
          key={i}
          style={{
            position: 'fixed',
            fontSize: `${18 + (i % 3) * 8}px`,
            left: `${(i * 127 + 40) % 95}%`,
            top: '-40px',
            opacity: 0,
            animation: `bdFall ${3 + (i % 3)}s ease-in ${0.3 + i * 0.25}s infinite`,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {p}
        </span>
      ))}

      {/* ── КОНВЕРТ ── */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          width: 'min(480px, 90vw)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
        }}
      >
        {/* Конверт-корпус */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            opacity: phase === 'visible' ? 0 : 1,
            transition: 'opacity 0.5s ease 0.1s',
            animation: phase === 'envelope' ? 'bdBounceIn 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards' : 'none',
          }}
        >
          {/* Тело конверта */}
          <div
            style={{
              background: 'linear-gradient(160deg, #fff8f0 0%, #f5e8d8 100%)',
              borderRadius: '12px 12px 18px 18px',
              padding: '40px 30px 30px',
              boxShadow: '0 30px 80px rgba(60,30,10,0.35), 0 2px 0 rgba(255,255,255,0.6) inset',
              border: '1px solid rgba(180,130,100,0.3)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Диагональные линии внутри конверта */}
            <svg
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }}
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <line x1="0" y1="100" x2="50" y2="50" stroke="#8B5E3C" strokeWidth="2" />
              <line x1="100" y1="100" x2="50" y2="50" stroke="#8B5E3C" strokeWidth="2" />
            </svg>

            {/* Печать / медальон */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #c8916a, #8B4513)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 26,
                boxShadow: '0 4px 20px rgba(139,69,19,0.4)',
                zIndex: 2,
              }}
            >
              🌸
            </div>
            <div style={{ height: 60 }} />
          </div>

          {/* Крышка конверта */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transformOrigin: 'top center',
              transform: phase === 'opening' || phase === 'card'
                ? 'rotateX(-175deg)'
                : 'rotateX(0deg)',
              transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1)',
              perspective: '800px',
              zIndex: 3,
            }}
          >
            <svg viewBox="0 0 480 160" style={{ width: '100%', display: 'block', filter: 'drop-shadow(0 -4px 8px rgba(60,30,10,0.1))' }}>
              <polygon
                points="0,0 480,0 240,155"
                fill="url(#envGrad)"
                stroke="rgba(180,130,100,0.3)"
                strokeWidth="1"
              />
              <defs>
                <linearGradient id="envGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fff3e8" />
                  <stop offset="100%" stopColor="#e8d0b8" />
                </linearGradient>
              </defs>
              {/* Цветочный узор на крышке */}
              <text x="200" y="80" fontSize="28" opacity="0.15">🌸</text>
              <text x="240" y="60" fontSize="20" opacity="0.12">🌷</text>
              <text x="260" y="85" fontSize="24" opacity="0.13">🌺</text>
            </svg>
          </div>
        </div>

        {/* ── КАРТОЧКА ── */}
        <div
          style={{
            width: '100%',
            position: phase === 'visible' ? 'static' : 'absolute',
            bottom: 0,
            opacity: phase === 'visible' ? 1 : 0,
            transform: phase === 'visible' ? 'translateY(0) scale(1)' : 'translateY(60px) scale(0.92)',
            transition: 'all 0.7s cubic-bezier(0.34,1.4,0.64,1)',
            pointerEvents: phase === 'visible' ? 'auto' : 'none',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(160deg, #fffaf5 0%, #fff0e8 60%, #fde8d8 100%)',
              borderRadius: 28,
              padding: '44px 40px 36px',
              boxShadow: '0 40px 100px rgba(60,30,10,0.4), 0 2px 0 rgba(255,255,255,0.8) inset',
              border: '1px solid rgba(200,145,105,0.25)',
              position: 'relative',
              overflow: 'hidden',
              textAlign: 'center',
            }}
          >
            {/* Угловые цветы */}
            {[
              { top: 12, left: 16, r: '-15deg', e: '🌸', s: 28 },
              { top: 12, right: 16, r: '15deg', e: '🌺', s: 24 },
              { bottom: 12, left: 16, r: '15deg', e: '🌷', s: 22 },
              { bottom: 12, right: 16, r: '-15deg', e: '🌼', s: 26 },
            ].map((f, i) => (
              <span
                key={i}
                style={{
                  position: 'absolute',
                  top: f.top,
                  bottom: f.bottom,
                  left: f.left,
                  right: f.right,
                  fontSize: f.s,
                  transform: `rotate(${f.r})`,
                  opacity: 0.7,
                  userSelect: 'none',
                }}
              >
                {f.e}
              </span>
            ))}

            {/* Тонкая рамка */}
            <div
              style={{
                position: 'absolute',
                inset: 12,
                borderRadius: 18,
                border: '1.5px solid rgba(200,145,105,0.2)',
                pointerEvents: 'none',
              }}
            />

            {/* Дата */}
            <p
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 11,
                letterSpacing: '0.25em',
                color: '#a07050',
                textTransform: 'uppercase',
                marginBottom: 20,
                opacity: 0.8,
              }}
            >
              6 мая · С душой
            </p>

            {/* Главный текст */}
            <h1
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: 'clamp(26px, 5vw, 38px)',
                fontWeight: 700,
                color: '#4A2C14',
                lineHeight: 1.2,
                marginBottom: 20,
                letterSpacing: '-0.01em',
              }}
            >
              С Днём Рождения,<br />
              <span style={{ color: '#8B4513', fontStyle: 'italic' }}>Даша!</span>
            </h1>

            {/* Разделитель */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                marginBottom: 22,
              }}
            >
              <div style={{ height: 1, width: 60, background: 'linear-gradient(to right, transparent, #c8916a)' }} />
              <span style={{ fontSize: 16, opacity: 0.6 }}>🌸</span>
              <div style={{ height: 1, width: 60, background: 'linear-gradient(to left, transparent, #c8916a)' }} />
            </div>

            {/* Текст поздравления */}
            <p
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 15,
                lineHeight: 1.75,
                color: '#6B4226',
                maxWidth: 320,
                margin: '0 auto 28px',
                opacity: 0.9,
              }}
            >
              Пусть этот день будет таким же прекрасным,
              как цветы в твоём магазине. Счастья, улыбок
              и всего самого лучшего! Пусть хранит тебя сила единорогов! 🌺
            </p>

            {/* Подпись */}
            <p
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: 13,
                fontStyle: 'italic',
                color: '#a07050',
                letterSpacing: '0.05em',
              }}
            >
              — Твой сайт by-tsvetocek
            </p>

            {/* Кнопка закрыть */}
            <button
              onClick={onClose}
              style={{
                marginTop: 28,
                background: 'linear-gradient(135deg, #8B4513, #c8916a)',
                color: '#fff8f0',
                border: 'none',
                borderRadius: 100,
                padding: '12px 36px',
                fontSize: 11,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(139,69,19,0.35)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.04)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(139,69,19,0.45)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(139,69,19,0.35)';
              }}
            >
              Спасибо ✨
            </button>
          </div>
        </div>
      </div>

      {/* Keyframes через style-тег */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&display=swap');

        @keyframes bdFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes bdBounceIn {
          0%   { opacity: 0; transform: scale(0.6) translateY(40px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes bdFall {
          0%   { opacity: 0; transform: translateY(0) rotate(0deg); }
          10%  { opacity: 0.9; }
          90%  { opacity: 0.7; }
          100% { opacity: 0; transform: translateY(100vh) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ─── ОСНОВНОЙ КОМПОНЕНТ ────────────────────────────────────────────────────────
export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggedInUser, setLoggedInUser] = useState('');

  const [activeTab, setActiveTab] = useState('menu');

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [dailyBloomImageUrl, setDailyBloomImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Birthday state
  const [showBirthdayLetter, setShowBirthdayLetter] = useState(false);
  const isBirthday = isBirthdayToday();

  useEffect(() => {
    const authStatus = sessionStorage.getItem('tsv_admin_auth');
    const savedUser = sessionStorage.getItem('tsv_admin_user');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      setLoggedInUser(savedUser || '');
    }
  }, []);

  // Показываем письмо при входе Даши в день рождения
  useEffect(() => {
    if (isAuthenticated && isBirthday && isDariaAccount(loggedInUser)) {
      // Небольшая задержка чтобы страница успела отрисоваться
      const t = setTimeout(() => setShowBirthdayLetter(true), 600);
      return () => clearTimeout(t);
    }
  }, [isAuthenticated, loggedInUser, isBirthday]);

  const handleLogin = (e) => {
    e.preventDefault();
    const u1 = import.meta.env.VITE_ADMIN_USER_1;
    const p1 = import.meta.env.VITE_ADMIN_PASS_1;
    const u2 = import.meta.env.VITE_ADMIN_USER_2;
    const p2 = import.meta.env.VITE_ADMIN_PASS_2;

    if ((username === u1 && password === p1) || (username === u2 && password === p2)) {
      setIsAuthenticated(true);
      setLoggedInUser(username);
      sessionStorage.setItem('tsv_admin_auth', 'true');
      sessionStorage.setItem('tsv_admin_user', username);
      setLoginError('');
    } else {
      setLoginError('Неверный логин или пароль');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoggedInUser('');
    sessionStorage.removeItem('tsv_admin_auth');
    sessionStorage.removeItem('tsv_admin_user');
    setUsername('');
    setPassword('');
    setActiveTab('menu');
    setShowBirthdayLetter(false);
  };

  const fetchData = async () => {
    setOrdersLoading(true);
    setUploadError('');

    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: settingsData, error: settingsError } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'daily_bloom')
      .single();

    if (!ordersError && ordersData) {
      const now = new Date().getTime();
      const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

      const ordersToDelete = ordersData.filter(order => {
        if (order.status !== 'completed') return false;
        const completeDate = new Date(order.completed_at || order.created_at).getTime();
        return (now - completeDate) >= SEVEN_DAYS_MS;
      });

      if (ordersToDelete.length > 0) {
        for (const order of ordersToDelete) {
          await supabase.from('orders').delete().eq('id', order.id);
        }
        fetchData();
        return;
      }

      const sortedOrders = ordersData.sort((a, b) => {
        if (a.status === 'new' && b.status === 'completed') return -1;
        if (a.status === 'completed' && b.status === 'new') return 1;
        return 0;
      });
      setOrders(sortedOrders);
    }

    if (!settingsError && settingsData) {
      setDailyBloomImageUrl(settingsData.value);
    }
    setOrdersLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `tsv_dailybloom_${new Date().toISOString().replace(/[:.]/g, '-')}.${fileExt}`;
      const filePath = `daily-bloom/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(filePath);
      const newImageUrl = publicUrlData.publicUrl;

      const { data: updateData, error: settingsUpdateError } = await supabase
        .from('settings')
        .update({ value: newImageUrl })
        .eq('key', 'daily_bloom')
        .select();

      if (settingsUpdateError) throw settingsUpdateError;

      if (!updateData || updateData.length === 0) {
        const { error: insertError } = await supabase
          .from('settings')
          .insert([{ key: 'daily_bloom', value: newImageUrl }]);
        if (insertError) throw insertError;
      }

      setDailyBloomImageUrl(newImageUrl);
      alert('Картинка Daily Bloom успешно обновлена!');
    } catch (error) {
      console.error(error);
      setUploadError(`Ошибка: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] }, multiple: false,
  });

  const updateOrderStatus = async (orderId, currentStatus) => {
    const isCompleting = currentStatus === 'new';
    if (!window.confirm(isCompleting ? 'Точно отметить как выполненный?' : 'Вернуть в активные?')) return;

    const newStatus = isCompleting ? 'completed' : 'new';
    const completedAt = isCompleting ? new Date().toISOString() : null;

    const { error } = await supabase.from('orders').update({ status: newStatus, completed_at: completedAt }).eq('id', orderId);
    if (!error) fetchData();
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Удалить заказ навсегда?')) return;
    const { error } = await supabase.from('orders').delete().eq('id', orderId);
    if (!error) fetchData();
  };

  const getTimeLeft = (completedAt, createdAt) => {
    const diff = new Date(completedAt || createdAt).getTime() + (7 * 24 * 60 * 60 * 1000) - new Date().getTime();
    if (diff <= 0) return 'Удаляется...';
    return `Удаление через: ${Math.floor(diff / (1000 * 60 * 60 * 24))} дн. ${Math.floor((diff / (1000 * 60 * 60)) % 24)} ч.`;
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });

  const showBirthdayDecor = isBirthday && isDariaAccount(loggedInUser);

  // ── РЕНДЕР: ФОРМА ЛОГИНА ────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#E6DBD1] flex items-center justify-center p-6">
        <div className="bg-[#DAC7B6]/30 p-10 rounded-[40px] shadow-sm border border-[#4A3F35]/5 w-full max-w-md">
          <h2 className="text-3xl font-main text-[#4A3F35] uppercase tracking-widest mb-8 text-center">
            Вход в систему
          </h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <p className="text-[10px] text-[#4A3F35]/60 uppercase tracking-[0.2em] mb-2">Логин</p>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-transparent border-b border-[#4A3F35]/30 py-2 outline-none text-[#4A3F35] tracking-widest focus:border-[#4A3F35] transition-colors"
                autoComplete="off"
              />
            </div>
            <div>
              <p className="text-[10px] text-[#4A3F35]/60 uppercase tracking-[0.2em] mb-2">Пароль</p>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-[#4A3F35]/30 py-2 outline-none text-[#4A3F35] tracking-widest focus:border-[#4A3F35] transition-colors"
              />
            </div>
            {loginError && <p className="text-red-700 text-xs text-center">{loginError}</p>}
            <button
              type="submit"
              className="w-full bg-[#4A3F35] text-[#E6DBD1] py-4 rounded-full mt-4 uppercase tracking-[0.2em] text-[10px] font-bold hover:opacity-90 transition-all active:scale-[0.98] shadow-md"
            >
              Войти
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── РЕНДЕР: АДМИН-ПАНЕЛЬ ────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen p-6 pt-8 md:px-16 md:py-0"
      style={{
        background: showBirthdayDecor
          ? 'linear-gradient(135deg, #f0e0d0 0%, #E6DBD1 40%, #f5ddd0 100%)'
          : '#E6DBD1',
        transition: 'background 1s ease',
      }}
    >
      {/* Поздравительное письмо */}
      {showBirthdayLetter && (
        <BirthdayLetter onClose={() => setShowBirthdayLetter(false)} />
      )}

      {/* Тонкий декоративный баннер в день рождения */}
      {showBirthdayDecor && (
        <div
          style={{
            textAlign: 'center',
            fontSize: 11,
            letterSpacing: '0.25em',
            color: '#8B5E3C',
            textTransform: 'uppercase',
            padding: '6px 0 2px',
            opacity: 0.7,
            userSelect: 'none',
          }}
        >
          🌸 &nbsp; С днём рождения, Даша! &nbsp; 🌸
        </div>
      )}

      {/* ХЕДЕР ПАНЕЛИ */}
      <div className="flex justify-between items-center pb-4 border-b border-[#4A3F35]/10 mb-8 pt-2">
        <div className="flex items-center gap-2">
          {activeTab !== 'menu' && (
            <button
              onClick={() => setActiveTab('menu')}
              className="text-[#4A3F35]/60 text-[10px] md:text-xs uppercase tracking-[0.2em] hover:text-[#4A3F35] transition-all flex items-center gap-2"
            >
              <span className="text-lg leading-none mb-[2px]">←</span> Назад в меню
            </button>
          )}
          {/* Пасхалка: цветочек только для Даши в её день */}
          {showBirthdayDecor && (
            <BirthdayFlower onClick={() => setShowBirthdayLetter(true)} />
          )}
        </div>

        <button
          onClick={handleLogout}
          className="text-[#4A3F35]/60 text-[10px] md:text-xs uppercase tracking-[0.2em] border-b border-[#4A3F35]/30 hover:text-[#4A3F35] hover:border-[#4A3F35] transition-all pb-1"
        >
          Выйти
        </button>
      </div>

      {/* ЗАГОЛОВОК */}
      <h1 className="text-3xl md:text-4xl font-main text-[#4A3F35] uppercase mb-8 flex items-center gap-3">
        {activeTab === 'menu' ? 'Панель управления' : activeTab === 'bloom' ? 'Daily Bloom' : 'Список заказов'}
        {showBirthdayDecor && activeTab === 'menu' && (
          <span style={{ fontSize: 28, opacity: 0.5 }}>🎂</span>
        )}
      </h1>

      {/* ЭКРАН 1: ГЛАВНОЕ МЕНЮ */}
      {activeTab === 'menu' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-10">
          <button
            onClick={() => setActiveTab('bloom')}
            className="bg-white/40 hover:bg-white/60 p-12 rounded-[40px] border border-[#4A3F35]/10 transition-all duration-300 flex flex-col items-center justify-center gap-6 aspect-square md:aspect-auto md:h-[300px] active:scale-[0.98]"
            style={showBirthdayDecor ? { borderColor: 'rgba(200,145,105,0.3)', background: 'rgba(255,240,225,0.5)' } : {}}
          >
            <span className="text-5xl">🌸</span>
            <span className="text-2xl font-main text-[#4A3F35] uppercase tracking-widest">Daily Bloom</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className="bg-white/40 hover:bg-white/60 p-12 rounded-[40px] border border-[#4A3F35]/10 transition-all duration-300 flex flex-col items-center justify-center gap-6 aspect-square md:aspect-auto md:h-[300px] active:scale-[0.98]"
            style={showBirthdayDecor ? { borderColor: 'rgba(200,145,105,0.3)', background: 'rgba(255,240,225,0.5)' } : {}}
          >
            <span className="text-5xl">🛍️</span>
            <span className="text-2xl font-main text-[#4A3F35] uppercase tracking-widest">Список заказов</span>
            {orders.filter(o => o.status === 'new').length > 0 && (
              <span className="bg-red-800 text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-widest absolute mt-45 md:mt-37">
                {orders.filter(o => o.status === 'new').length} новых
              </span>
            )}
          </button>
        </div>
      )}

      {/* ЭКРАН 2: DAILY BLOOM */}
      {activeTab === 'bloom' && (
        <div className="bg-white/50 p-8 rounded-3xl border border-[#4A3F35]/10 max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/3 aspect-[4/5] bg-[#E6DBD1]/50 rounded-2xl overflow-hidden border border-[#4A3F35]/10 relative">
              {dailyBloomImageUrl ? (
                <img
                  src={dailyBloomImageUrl}
                  alt="Текущий Daily Bloom"
                  className={`w-full h-full object-cover transition-opacity duration-300 ${isUploading ? 'opacity-30' : 'opacity-100'}`}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-[#4A3F35]/50 text-center p-4">
                  Нет картинки в settings
                </div>
              )}
              {isUploading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/50 backdrop-blur-sm">
                  <div className="w-8 h-8 border-4 border-[#4A3F35]/20 border-t-[#4A3F35] rounded-full animate-spin" />
                </div>
              )}
            </div>

            <div className="flex-1 w-full h-full">
              <div
                {...getRootProps()}
                className={`w-full aspect-[4/5] md:aspect-auto md:h-full border-4 border-dashed rounded-3xl flex flex-col items-center justify-center p-10 text-center cursor-pointer transition-colors duration-300 ${
                  isDragActive ? 'border-[#4A3F35] bg-[#4A3F35]/5' : 'border-[#4A3F35]/20 bg-transparent hover:border-[#4A3F35]/50'
                } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input {...getInputProps()} disabled={isUploading} />
                <div className="text-6xl mb-6 opacity-30">🖼️</div>
                {isDragActive ? (
                  <p className="text-lg font-bold text-[#4A3F35]">Отпустите, чтобы загрузить</p>
                ) : (
                  <>
                    <p className="text-lg font-bold text-[#4A3F35]">Перетащите сюда фото</p>
                    <p className="text-xs text-[#4A3F35]/60 mt-2">или просто кликните</p>
                  </>
                )}
              </div>
              {uploadError && (
                <p className="text-red-800 text-sm mt-4 text-center bg-red-800/10 p-3 rounded-lg">{uploadError}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ЭКРАН 3: ЗАКАЗЫ */}
      {activeTab === 'orders' && (
        <div className="space-y-6 max-w-5xl mx-auto">
          {ordersLoading ? (
            <div className="text-center py-10 text-[#4A3F35]/50">Загрузка заказов...</div>
          ) : orders.length === 0 ? (
            <p className="text-[#4A3F35]/60 text-center py-10 bg-white/20 rounded-2xl">Заказов пока нет.</p>
          ) : (
            orders.map(order => {
              const isCompleted = order.status === 'completed';
              return (
                <div
                  key={order.id}
                  className={`p-6 rounded-3xl border border-[#4A3F35]/10 flex flex-col md:flex-row justify-between gap-6 transition-all duration-500 ${
                    isCompleted ? 'bg-transparent opacity-60 grayscale-[40%]' : 'bg-white/50 shadow-sm'
                  }`}
                >
                  <div className={`flex-1 ${isCompleted ? 'line-through decoration-[#4A3F35]/40' : ''}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-[#4A3F35]">{order.customer_name}</h2>
                      <span className={`px-3 py-1 text-[10px] rounded-full uppercase tracking-widest no-underline ${isCompleted ? 'bg-gray-300 text-gray-600' : 'bg-orange-200 text-orange-800'}`}>
                        {isCompleted ? 'Выполнен' : 'Новый'}
                      </span>
                    </div>
                    <p className="text-xs text-[#4A3F35]/50 mb-3 font-bold no-underline">🕒 {formatDate(order.created_at)}</p>
                    <p className="text-sm text-[#4A3F35]/70">📞 {order.customer_phone}</p>
                    <p className="text-sm text-[#4A3F35]/70">📍 {order.address}</p>
                    {order.comment && (
                      <p className={`text-sm text-[#4A3F35]/70 mt-2 p-2 rounded-lg italic ${isCompleted ? 'bg-transparent border border-gray-300' : 'bg-white'}`}>
                        💬 "{order.comment}"
                      </p>
                    )}
                  </div>

                  <div className={`flex-1 p-4 rounded-2xl ${isCompleted ? 'bg-transparent border border-gray-300 line-through decoration-[#4A3F35]/40' : 'bg-white/40'}`}>
                    <p className="text-xs uppercase tracking-widest text-[#4A3F35]/50 mb-2 no-underline">Корзина:</p>
                    <ul className="text-sm text-[#4A3F35] space-y-1">
                      {order.items.map((item, idx) => (
                        <li key={idx}>• {item.title} (x{item.quantity})</li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-2 border-t border-[#4A3F35]/10 font-bold no-underline">
                      Итого: {order.total_price} MDL
                    </div>
                  </div>

                  <div className="flex flex-col justify-center gap-3 md:w-48 no-underline">
                    {!isCompleted ? (
                      <>
                        <button onClick={() => updateOrderStatus(order.id, order.status)} className="w-full bg-[#4A3F35] text-[#E6DBD1] py-3 rounded-full uppercase tracking-[0.2em] text-[10px] font-bold hover:opacity-90 transition-all active:scale-95">
                          Выполнить
                        </button>
                        <button onClick={() => deleteOrder(order.id)} className="w-full text-red-800/60 hover:text-red-800 py-2 rounded-full uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-red-800/10 transition-all active:scale-95">
                          Удалить
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => updateOrderStatus(order.id, order.status)} className="w-full bg-transparent border border-[#4A3F35] text-[#4A3F35] py-3 rounded-full uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-[#4A3F35]/10 transition-all active:scale-95">
                          Вернуть
                        </button>
                        <div className="flex flex-col items-center mt-2">
                          <span className="text-[9px] text-[#4A3F35]/60 uppercase tracking-widest mb-1 text-center">
                            {getTimeLeft(order.completed_at, order.created_at)}
                          </span>
                          <button onClick={() => deleteOrder(order.id)} className="text-red-800/50 hover:text-red-800 text-[10px] uppercase tracking-[0.2em] hover:underline">
                            Удалить сейчас
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}