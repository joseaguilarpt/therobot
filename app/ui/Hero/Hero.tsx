import './Hero.scss';

import React, { ReactNode } from 'react';
import ContentContainer from '../ContentContainer/ContentContainer';
import classNames from 'classnames';

interface HeroType {
    children: ReactNode;
    background?: string;
}

export default function Hero({ children, background }: HeroType) {
    return (
        <div className={classNames('hero', background)}>
            <ContentContainer>
                {children}
            </ContentContainer>
        </div>
    )
}