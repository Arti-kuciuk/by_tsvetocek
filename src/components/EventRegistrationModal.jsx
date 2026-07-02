import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { supabase } from '../backend/supabaseClient';

const EVENT_CAPACITY = 15;

const EVENT_WEEKDAYS = {
  1: 6, // Saturday
  2: 0, // Sunday
};

const getEventWeekday = (event) => EVENT_WEEKDAYS[event?.id] ?? 6;

const getEventHour = (time) => {
  const match = String(time).match(/(\d{1,2}):(\d{2})/);
  return {
    hours: match ? Number(match[1]) : 11,
    minutes: match ? Number(match[2]) : 0,
  };
};

const getDateLocale = (language) => {
  const code = String(language || '').split('-')[0];

  if (code === 'ro') return 'ro-RO';
  if (code === 'en') return 'en-US';
  return 'ru-RU';
};

const formatEventDate = (date, language) =>
  new Intl.DateTimeFormat(getDateLocale(language), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);

const toDateInputValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getAvailableEventDates = (event) => {
  const now = new Date();
  const weekday = getEventWeekday(event);
  const { hours, minutes } = getEventHour(event?.time);
  const dates = [];

  for (let offset = 0; offset < 21; offset += 1) {
    const candidate = new Date(now);
    candidate.setDate(now.getDate() + offset);
    candidate.setHours(hours, minutes, 0, 0);

    if (candidate.getDay() !== weekday) continue;

    const registrationDeadline = new Date(candidate);
    registrationDeadline.setDate(candidate.getDate() - 1);

    if (now < registrationDeadline) {
      dates.push(candidate);
    }

    if (dates.length === 2) break;
  }

  return dates;
};

export default function EventRegistrationModal({ event, onClose }) {
  const { t, i18n } = useTranslation();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    comment: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [spotsLeft, setSpotsLeft] = useState(EVENT_CAPACITY);
  const [loadingSpots, setLoadingSpots] = useState(false);

  const availableDates = getAvailableEventDates(event);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    if (!event) return;

    const dates = getAvailableEventDates(event);
    setSelectedDate(dates[0] ? toDateInputValue(dates[0]) : '');
    setSuccess(false);
    setForm({
      name: '',
      phone: '',
      email: '',
      comment: '',
    });
  }, [event]);

  useEffect(() => {
    if (!event || !selectedDate) return;

    const fetchSpotsLeft = async () => {
      setLoadingSpots(true);

      const { count, error } = await supabase
        .from('event_registrations')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', String(event.id))
        .eq('event_date', selectedDate)
        .neq('status', 'cancelled');

      if (error) {
        console.error(t('eventRegistration.loadSpotsError'), error);
        setSpotsLeft(EVENT_CAPACITY);
      } else {
        setSpotsLeft(Math.max(EVENT_CAPACITY - (count ?? 0), 0));
      }

      setLoadingSpots(false);
    };

    fetchSpotsLeft();
  }, [event, selectedDate, t]);

  if (!event) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (spotsLeft <= 0) {
      alert(t('eventRegistration.noSpotsAlert'));
      return;
    }
    setLoading(true);

    const { error } = await supabase.from('event_registrations').insert({
      event_id: String(event.id),
      event_title: event.title,
      event_day: event.day,
      event_time: event.time,
      event_date: selectedDate,
      name: form.name,
      phone: form.phone,
      email: form.email,
      comment: form.comment,
    });

    setLoading(false);

    if (error) {
      console.error(error);
      alert(t('eventRegistration.submitError'));
      return;
    }

    setSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center px-4">
      <div className="bg-[#E6DBD1] text-[#4A3F35] w-full max-w-xl rounded-[30px] border border-[#4A3F35]/20 p-6 md:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-2xl hover:opacity-60"
        >
          ×
        </button>

        {success ? (
          <div className="py-10 text-center">
            <h2 className="text-3xl font-main mb-4">{t('eventRegistration.successTitle')}</h2>
            <p className="text-[#4A3F35]/70">
              {t('eventRegistration.successText')}
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-main mb-2">{t('eventRegistration.title')}</h2>
            <p className="text-[#4A3F35]/70 mb-6">
              {event.title} • {event.day} • {event.time}
            </p>

            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#4A3F35]/60 mb-3">
                {t('eventRegistration.chooseDate')}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableDates.map((date) => {
                  const value = toDateInputValue(date);
                  const isSelected = selectedDate === value;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSelectedDate(value)}
                      className={`border rounded-full px-5 py-3 text-sm transition-all ${
                        isSelected
                          ? 'bg-[#4A3F35] text-[#E6DBD1] border-[#4A3F35]'
                          : 'border-[#4A3F35]/30 text-[#4A3F35] hover:border-[#4A3F35]'
                      }`}
                    >
                      <span>{formatEventDate(date, i18n.language)}</span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-sm text-[#4A3F35]/70">
                {loadingSpots
                  ? t('eventRegistration.loadingSpots')
                  : spotsLeft > 0
                    ? t('eventRegistration.spotsLeft', { spotsLeft, capacity: EVENT_CAPACITY })
                    : t('eventRegistration.noSpots')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder={t('eventRegistration.name')}
                className="w-full bg-transparent border border-[#4A3F35]/30 rounded-full px-5 py-3 outline-none"
              />

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder={t('eventRegistration.phone')}
                className="w-full bg-transparent border border-[#4A3F35]/30 rounded-full px-5 py-3 outline-none"
              />

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder={t('eventRegistration.email')}
                className="w-full bg-transparent border border-[#4A3F35]/30 rounded-full px-5 py-3 outline-none"
              />


              <textarea
                name="comment"
                value={form.comment}
                onChange={handleChange}
                placeholder={t('eventRegistration.comment')}
                rows="3"
                className="w-full bg-transparent border border-[#4A3F35]/30 rounded-[20px] px-5 py-3 outline-none resize-none"
              />

              <button disabled={loading || loadingSpots || !selectedDate || spotsLeft <= 0} className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? t('eventRegistration.sending') : spotsLeft <= 0 ? t('eventRegistration.noSpotsButton') : t('eventRegistration.submit')}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
