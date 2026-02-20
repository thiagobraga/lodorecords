import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const translations = {
  en: {
    // Header
    home: 'Home',
    shop: 'Merch',

    // Hero Section
    independentLabel: 'Independent music label & distro',
    shopNow: 'Shop Now',
    featuredItems: 'Featured Items',

    // Home sections
    staff: 'Staff',

    // About Section
    aboutTitle: 'About Lodo Records',
    aboutText1:
      'Lodo Records is an independent music label and distro service dedicated to helping artists share their music with the world. We believe in the power of independent music and supporting artists at every stage of their career.',
    aboutText2:
      'Our online store features exclusive merchandise, limited edition vinyl releases, and apparel designed for music lovers.',

    // Featured Section
    featuredProducts: 'Featured Products',
    viewAllProducts: 'View All Products',
    addToCart: 'Buy',

    // Newsletter
    stayUpdated: 'Newsletter',
    newsletterText: 'Subscribe to our newsletter for exclusive offers and updates on new releases.',
    emailPlaceholder: 'Your email address',
    subscribe: 'Subscribe',

    // Footer
    footerTagline: 'Independent music label & distro',
    footerShopTitle: 'Shop',
    footerAllProducts: 'All Products',
    footerMusic: 'Music',
    footerMerchandise: 'Merchandise',
    footerApparel: 'Apparel',
    footerInfoTitle: 'Info',
    footerAbout: 'About Us',
    footerContact: 'Contact',
    footerShipping: 'Shipping & Returns',
    footerPrivacy: 'Privacy Policy',
    footerTerms: 'Terms & Conditions',
    footerNewsletterTitle: 'Newsletter',
    footerNewsletterDescription: 'Subscribe to get updates on new releases and exclusive offers.',
    footerRights: 'All rights reserved.',

    // Loading and Error
    loading: 'Loading featured products...',
    error: 'Failed to load featured products. Please try again later.',
    addedToCart: 'added to cart!'
  },
  pt: {
    // Header
    home: 'Início',
    shop: 'Merch',

    // Hero Section
    independentLabel: 'Selo & Distro',
    shopNow: 'Comprar Agora',
    featuredItems: 'Itens em Destaque',

    // Home sections
    staff: 'Staff',

    // About Section
    aboutTitle: 'Sobre a Lodo Records',
    aboutText1:
      'A Lodo Records é uma gravadora independente e serviço de distribuição dedicado a ajudar artistas a compartilhar sua música com o mundo. Acreditamos no poder da música independente e apoiamos artistas em todas as fases de suas carreiras.',
    aboutText2:
      'Nossa loja online apresenta mercadorias exclusivas, lançamentos de vinil em edição limitada e roupas projetadas para amantes da música.',

    // Featured Section
    featuredProducts: 'Destaque',
    viewAllProducts: 'Ver Todos os Produtos',
    addToCart: 'Comprar',

    // Newsletter
    stayUpdated: 'Newsletter',
    newsletterText: 'Inscreva-se em nossa newsletter para ofertas exclusivas e atualizações sobre novos lançamentos.',
    emailPlaceholder: 'Seu endereço de email',
    subscribe: 'Inscrever-se',

    // Footer
    footerTagline: 'Selo & Distro',
    footerShopTitle: 'Loja',
    footerAllProducts: 'Todos os produtos',
    footerMusic: 'Música',
    footerMerchandise: 'Merch',
    footerApparel: 'Roupas',
    footerInfoTitle: 'Info',
    footerAbout: 'Sobre',
    footerContact: 'Contato',
    footerShipping: 'Envio & Devoluções',
    footerPrivacy: 'Política de Privacidade',
    footerTerms: 'Termos & Condições',
    footerNewsletterTitle: 'Newsletter',
    footerNewsletterDescription: 'Inscreva-se para receber novidades e ofertas exclusivas.',
    footerRights: 'Todos os direitos reservados.',

    // Loading and Error
    loading: 'Carregando produtos em destaque...',
    error: 'Falha ao carregar produtos em destaque. Tente novamente mais tarde.',
    addedToCart: 'adicionado ao carrinho!'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('pt');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'pt' : 'en'));
  };

  const t = translations[language];

  return <LanguageContext.Provider value={{ language, toggleLanguage, t }}>{children}</LanguageContext.Provider>;
};
