// aceitar imagens png, jpg, jpeg

// Função para validar formatos de imagem aceitos
export const validarFormatoImagem = (nomeArquivo: string): boolean => {
  const formatosAceitos = ['png', 'jpg', 'jpeg'];
  const extensao = nomeArquivo.split('.').pop()?.toLowerCase();
  return extensao ? formatosAceitos.includes(extensao) : false;
};

export const imagens = {
  logo: require('../assets/images/LogoDeOlho.png'),
  // Adicione outras imagens conforme necessário
};

