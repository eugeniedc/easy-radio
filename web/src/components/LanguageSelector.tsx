import { useTranslation } from 'react-i18next';

export function LanguageSelector() {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <div className="language-selector">
      <label htmlFor="language-select">{t('ui.language')}:</label>
      <select
        id="language-select"
        value={i18n.language}
        onChange={handleLanguageChange}
        aria-label={t('ui.language')}
      >
        <option value="zh">{t('ui.chinese')}</option>
        <option value="en">{t('ui.english')}</option>
      </select>
    </div>
  );
}