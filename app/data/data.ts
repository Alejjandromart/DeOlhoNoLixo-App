import React from 'react';
import {AnimationObject} from 'lottie-react-native';

export interface OnboardingData {
  id: number;
  animation: AnimationObject;
  text: string;
  textColor: string;
  backgroundColor: string;
}

const data: OnboardingData[] = [
  {
    id: 1,
    animation: require('../assets/lottie/1Beautiful city.json'),
    text: 'Sua observação em ação contra o lixo urbano',
    textColor: '#64B056',
    backgroundColor: '#0a4438',
  },
  {
    id: 2,
    animation: require('../assets/lottie/2Tourist travel.json'),
    text: 'Use a câmera e localização para denunciar em segundos',
    textColor: '#1B5E20',
    backgroundColor: '#c7f98eff',
  },
  {
    id: 3,
    animation: require('../assets/lottie/3Animation feed.json'),
    text: 'Veja o Feed e acompanhe o progresso das denúncias',
    textColor: '#E8F5E9',
    backgroundColor: '#79cf80ff',
  },
];

export default data;