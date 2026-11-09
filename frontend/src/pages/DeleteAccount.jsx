import { useEffect } from 'react';
import { Link } from 'react-router-dom';

// Public account-deletion instructions (required by Google Play's Data safety form:
// a web resource where users can request deletion without reinstalling the app).
// Shown in all three languages at once so reviewers and users find it without switching.
const SECTIONS = [
  {
    lang: 'az',
    title: 'Hesabın silinməsi',
    inAppTitle: 'Tətbiqdə',
    steps: [
      'AzerScope tətbiqini açın və hesabınıza daxil olun.',
      'Profil → Tənzimləmələr → «Hesabı sil» bölməsinə keçin.',
      'Silinməni təsdiqləyin. Hesab dərhal silinir.',
    ],
    emailTitle: 'Tətbiq quraşdırılmayıbsa',
    email: 'Hesabınızın e-poçt ünvanından info@azerscope.net ünvanına «Hesabın silinməsi» mövzusu ilə yazın. Sorğunu 30 gün ərzində icra edib cavab veririk.',
    whatTitle: 'Nə silinir',
    what: [
      'hesab, e-poçt, ad və profil şəkli;',
      'müşahidələr, qeydlər və fotolar;',
      'yadda saxlanmış məkanlar və tədbir qeydiyyatları.',
    ],
    note: 'İstifadə statistikası mövcud hesabla əlaqəsiz qalır. Ehtiyat nüsxələrdəki qalıqlar 30 gün ərzində silinir.',
  },
  {
    lang: 'ru',
    title: 'Удаление аккаунта',
    inAppTitle: 'В приложении',
    steps: [
      'Откройте AzerScope и войдите в аккаунт.',
      'Перейдите: Профиль → Настройки → «Удалить аккаунт».',
      'Подтвердите удаление. Аккаунт удаляется сразу.',
    ],
    emailTitle: 'Если приложение не установлено',
    email: 'Напишите на info@azerscope.net с адреса вашего аккаунта, тема «Удаление аккаунта». Мы выполним запрос и ответим в течение 30 дней.',
    whatTitle: 'Что удаляется',
    what: [
      'аккаунт, email, имя и фото профиля;',
      'наблюдения, заметки и фотографии;',
      'сохранённые места и регистрации на мероприятия.',
    ],
    note: 'Статистика использования перестаёт быть связана с существующим аккаунтом. Остаточные копии в резервных архивах удаляются в течение 30 дней.',
  },
  {
    lang: 'en',
    title: 'Delete your account',
    inAppTitle: 'In the app',
    steps: [
      'Open AzerScope and sign in.',
      'Go to Profile → Settings → “Delete account”.',
      'Confirm. Your account is deleted immediately.',
    ],
    emailTitle: 'If the app is not installed',
    email: 'Email info@azerscope.net from your account’s email address with the subject “Account deletion”. We will complete the request and reply within 30 days.',
    whatTitle: 'What is deleted',
    what: [
      'your account, email, name and profile photo;',
      'your observations, notes and photos;',
      'saved locations and event registrations.',
    ],
    note: 'Usage statistics are no longer associated with an existing account. Residual copies in backups are overwritten within 30 days.',
  },
];

const DeleteAccount = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="legal-page page-wrap">
      <div className="legal-container glass">
        <h1>AzerScope — Delete account</h1>
        <p>Hesabın silinməsi · Удаление аккаунта · Account deletion</p>

        {SECTIONS.map((s) => (
          <div key={s.lang} lang={s.lang} className="legal-lang-block">
            <h2>{s.title}</h2>
            <h3>{s.inAppTitle}</h3>
            <ol className="legal-steps">
              {s.steps.map((step) => <li key={step}>{step}</li>)}
            </ol>
            <h3>{s.emailTitle}</h3>
            <p>{s.email}</p>
            <h3>{s.whatTitle}</h3>
            <ul>
              {s.what.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <p>{s.note}</p>
          </div>
        ))}

        <div className="contact">
          <p><strong>Email:</strong> <a href="mailto:info@azerscope.net?subject=Account%20deletion">info@azerscope.net</a></p>
          <p><Link to="/privacy">Privacy Policy</Link></p>
        </div>
      </div>
    </section>
  );
};

export default DeleteAccount;
