import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../backend/supabaseClient';
import { useDropzone } from 'react-dropzone';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // --- НАВИГАЦИЯ АДМИНКИ ---
  const [activeTab, setActiveTab] = useState('menu'); // 'menu', 'bloom', 'orders'

  // --- СОСТОЯНИЯ БАЗЫ ДАННЫХ ---
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [dailyBloomImageUrl, setDailyBloomImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    const authStatus = sessionStorage.getItem('tsv_admin_auth');
    if (authStatus === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const u1 = import.meta.env.VITE_ADMIN_USER_1;
    const p1 = import.meta.env.VITE_ADMIN_PASS_1;
    const u2 = import.meta.env.VITE_ADMIN_USER_2;
    const p2 = import.meta.env.VITE_ADMIN_PASS_2;

    if ((username === u1 && password === p1) || (username === u2 && password === p2)) {
      setIsAuthenticated(true);
      sessionStorage.setItem('tsv_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Неверный логин или пароль');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('tsv_admin_auth');
    setUsername('');
    setPassword('');
    setActiveTab('menu');
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

      // УМНОЕ ОБНОВЛЕНИЕ БАЗЫ ДАННЫХ
      const { data: updateData, error: settingsUpdateError } = await supabase
        .from('settings')
        .update({ value: newImageUrl })
        .eq('key', 'daily_bloom')
        .select(); 

      if (settingsUpdateError) throw settingsUpdateError;

      // Если строки нет, создаем её
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
    onDrop, accept: {'image/*': ['.jpeg', '.jpg', '.png', '.webp']}, multiple: false
  });

  const updateOrderStatus = async (orderId, currentStatus) => {
    const isCompleting = currentStatus === 'new';
    if (!window.confirm(isCompleting ? "Точно отметить как выполненный?" : "Вернуть в активные?")) return;
    
    const newStatus = isCompleting ? 'completed' : 'new';
    const completedAt = isCompleting ? new Date().toISOString() : null;
    
    const { error } = await supabase.from('orders').update({ status: newStatus, completed_at: completedAt }).eq('id', orderId);
    if (!error) fetchData(); 
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Удалить заказ навсегда?")) return;
    const { error } = await supabase.from('orders').delete().eq('id', orderId);
    if (!error) fetchData();
  };

  const getTimeLeft = (completedAt, createdAt) => {
    const diff = new Date(completedAt || createdAt).getTime() + (7 * 24 * 60 * 60 * 1000) - new Date().getTime();
    if (diff <= 0) return 'Удаляется...';
    return `Удаление через: ${Math.floor(diff / (1000 * 60 * 60 * 24))} дн. ${Math.floor((diff / (1000 * 60 * 60)) % 24)} ч.`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  // --- РЕНДЕР: ФОРМА ЛОГИНА ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#E6DBD1] flex items-center justify-center p-6">
        <div className="bg-[#DAC7B6]/30 p-10 rounded-[40px] shadow-sm border border-[#4A3F35]/5 w-full max-w-md">
          <h2 className="text-3xl font-main text-[#4A3F35] uppercase tracking-widest mb-8 text-center">Вход в систему</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <p className="text-[10px] text-[#4A3F35]/60 uppercase tracking-[0.2em] mb-2">Логин</p>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-transparent border-b border-[#4A3F35]/30 py-2 outline-none text-[#4A3F35] tracking-widest focus:border-[#4A3F35] transition-colors" autoComplete="off" />
            </div>
            <div>
              <p className="text-[10px] text-[#4A3F35]/60 uppercase tracking-[0.2em] mb-2">Пароль</p>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent border-b border-[#4A3F35]/30 py-2 outline-none text-[#4A3F35] tracking-widest focus:border-[#4A3F35] transition-colors" />
            </div>
            {loginError && <p className="text-red-700 text-xs text-center">{loginError}</p>}
            <button type="submit" className="w-full bg-[#4A3F35] text-[#E6DBD1] py-4 rounded-full mt-4 uppercase tracking-[0.2em] text-[10px] font-bold hover:opacity-90 transition-all active:scale-[0.98] shadow-md">Войти</button>
          </form>
        </div>
      </div>
    );
  }

  // --- РЕНДЕР: АДМИН-ПАНЕЛЬ ---
  return (
    <div className="min-h-screen bg-[#E6DBD1] p-6 pt-8 md:px-16 md:py-0">
      
      {/* ХЕДЕР ПАНЕЛИ (Навигация) */}
      <div className="flex justify-between items-center pb-4 border-b border-[#4A3F35]/10 mb-8 pt-2">
        <div>
          {activeTab !== 'menu' && (
            <button 
              onClick={() => setActiveTab('menu')}
              className="text-[#4A3F35]/60 text-[10px] md:text-xs uppercase tracking-[0.2em] hover:text-[#4A3F35] transition-all flex items-center gap-2"
            >
              <span className="text-lg leading-none mb-[2px]">←</span> Назад в меню
            </button>
          )}
        </div>
        
        <button 
          onClick={handleLogout} 
          className="text-[#4A3F35]/60 text-[10px] md:text-xs uppercase tracking-[0.2em] border-b border-[#4A3F35]/30 hover:text-[#4A3F35] hover:border-[#4A3F35] transition-all pb-1"
        >
          Выйти
        </button>
      </div>

      {/* ЗАГОЛОВОК ТЕКУЩЕГО ЭКРАНА */}
      <h1 className="text-3xl md:text-4xl font-main text-[#4A3F35] uppercase mb-8">
        {activeTab === 'menu' ? 'Панель управления' : activeTab === 'bloom' ? 'Daily Bloom' : 'Список заказов'}
      </h1>


      {/* ЭКРАН 1: ГЛАВНОЕ МЕНЮ */}
      {activeTab === 'menu' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-10">
          <button 
            onClick={() => setActiveTab('bloom')}
            className="bg-white/40 hover:bg-white/60 p-12 rounded-[40px] border border-[#4A3F35]/10 transition-all duration-300 flex flex-col items-center justify-center gap-6 aspect-square md:aspect-auto md:h-[300px] active:scale-[0.98]"
          >
            <span className="text-5xl">🌸</span>
            <span className="text-2xl font-main text-[#4A3F35] uppercase tracking-widest">Daily Bloom</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('orders')}
            className="bg-white/40 hover:bg-white/60 p-12 rounded-[40px] border border-[#4A3F35]/10 transition-all duration-300 flex flex-col items-center justify-center gap-6 aspect-square md:aspect-auto md:h-[300px] active:scale-[0.98]"
          >
            <span className="text-5xl">🛍️</span>
            <span className="text-2xl font-main text-[#4A3F35] uppercase tracking-widest">Список заказов</span>
            {orders.filter(o => o.status === 'new').length > 0 && (
              <span className="bg-red-800 text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-widest absolute mt-37">
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
                <img src={dailyBloomImageUrl} alt="Текущий Daily Bloom" className={`w-full h-full object-cover transition-opacity duration-300 ${isUploading ? 'opacity-30' : 'opacity-100'}`} />
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-[#4A3F35]/50 text-center p-4">Нет картинки в settings</div>
              )}
              {isUploading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/50 backdrop-blur-sm">
                  <div className="w-8 h-8 border-4 border-[#4A3F35]/20 border-t-[#4A3F35] rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            <div className="flex-1 w-full h-full">
              <div {...getRootProps()} className={`w-full aspect-[4/5] md:aspect-auto md:h-full border-4 border-dashed rounded-3xl flex flex-col items-center justify-center p-10 text-center cursor-pointer transition-colors duration-300 ${isDragActive ? 'border-[#4A3F35] bg-[#4A3F35]/5' : 'border-[#4A3F35]/20 bg-transparent hover:border-[#4A3F35]/50'} ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
              {uploadError && <p className="text-red-800 text-sm mt-4 text-center bg-red-800/10 p-3 rounded-lg">{uploadError}</p>}
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
            orders.map((order) => {
              const isCompleted = order.status === 'completed';
              return (
              <div key={order.id} className={`p-6 rounded-3xl border border-[#4A3F35]/10 flex flex-col md:flex-row justify-between gap-6 transition-all duration-500 ${isCompleted ? 'bg-transparent opacity-60 grayscale-[40%]' : 'bg-white/50 shadow-sm'}`}>
                <div className={`flex-1 ${isCompleted ? 'line-through decoration-[#4A3F35]/40' : ''}`}>
                  <div className="flex items-center gap-3 mb-2"><h2 className="text-xl font-bold text-[#4A3F35]">{order.customer_name}</h2><span className={`px-3 py-1 text-[10px] rounded-full uppercase tracking-widest no-underline ${isCompleted ? 'bg-gray-300 text-gray-600' : 'bg-orange-200 text-orange-800'}`}>{isCompleted ? 'Выполнен' : 'Новый'}</span></div>
                  <p className="text-xs text-[#4A3F35]/50 mb-3 font-bold no-underline">🕒 {formatDate(order.created_at)}</p>
                  <p className="text-sm text-[#4A3F35]/70">📞 {order.customer_phone}</p><p className="text-sm text-[#4A3F35]/70">📍 {order.address}</p>{order.comment && <p className={`text-sm text-[#4A3F35]/70 mt-2 p-2 rounded-lg italic ${isCompleted ? 'bg-transparent border border-gray-300' : 'bg-white'}`}>💬 "{order.comment}"</p>}
                </div>
                <div className={`flex-1 p-4 rounded-2xl ${isCompleted ? 'bg-transparent border border-gray-300 line-through decoration-[#4A3F35]/40' : 'bg-white/40'}`}>
                  <p className="text-xs uppercase tracking-widest text-[#4A3F35]/50 mb-2 no-underline">Корзина:</p>
                  <ul className="text-sm text-[#4A3F35] space-y-1">{order.items.map((item, idx) => (<li key={idx}>• {item.title} (x{item.quantity})</li>))}</ul>
                  <div className="mt-4 pt-2 border-t border-[#4A3F35]/10 font-bold no-underline">Итого: {order.total_price} MDL</div>
                </div>
                <div className="flex flex-col justify-center gap-3 md:w-48 no-underline">
                  {!isCompleted ? (
                    <><button onClick={() => updateOrderStatus(order.id, order.status)} className="w-full bg-[#4A3F35] text-[#E6DBD1] py-3 rounded-full uppercase tracking-[0.2em] text-[10px] font-bold hover:opacity-90 transition-all active:scale-95">Выполнить</button><button onClick={() => deleteOrder(order.id)} className="w-full text-red-800/60 hover:text-red-800 py-2 rounded-full uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-red-800/10 transition-all active:scale-95">Удалить</button></>
                  ) : (
                    <><button onClick={() => updateOrderStatus(order.id, order.status)} className="w-full bg-transparent border border-[#4A3F35] text-[#4A3F35] py-3 rounded-full uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-[#4A3F35]/10 transition-all active:scale-95">Вернуть</button><div className="flex flex-col items-center mt-2"><span className="text-[9px] text-[#4A3F35]/60 uppercase tracking-widest mb-1 text-center">{getTimeLeft(order.completed_at, order.created_at)}</span><button onClick={() => deleteOrder(order.id)} className="text-red-800/50 hover:text-red-800 text-[10px] uppercase tracking-[0.2em] hover:underline">Удалить сейчас</button></div></>
                  )}
                </div>
              </div>
            )})
          )}
        </div>
      )}
    </div>
  );
}