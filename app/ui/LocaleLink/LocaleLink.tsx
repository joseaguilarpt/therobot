// app/components/LocaleLink.tsx
import React from 'react';
import { Link, LinkProps } from '@remix-run/react';
import { useLocale } from '../../context/LocaleContext';

export function LocaleLink({ to, ...props }: LinkProps) {
  const { locale } = useLocale();
  const localizedTo = `/${locale}${to.startsWith('/') ? to : `/${to}`}`;

  return <Link to={localizedTo} {...props} />;
}