import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import Button from '../Button/Button';
import Icon from '../Icon/Icon';
import { useTranslation } from 'react-i18next';

const ThemeToggle: React.FC = () => {
  const { toggleTheme, theme } = useTheme();
const { t } = useTranslation();
  const icon = theme !== 'dark-mode' ? 'moon' : 'sun'
  return (
    <Button 
      onClick={toggleTheme} 
      appareance='tertiary'
      ariaLabel={t('footer.theme')}
      tooltipContent={t('footer.theme')}
    >
        <Icon color='white' icon={icon} size='small' />
    </Button>
  );
};

export default ThemeToggle;