export const LEGAL_DOCS = ['aviso-legal', 'privacidad', 'cookies', 'contacto'] as const;
export type LegalSlug = (typeof LEGAL_DOCS)[number];

export interface LegalDoc {
  titulo: string;
  parrafos: string[];
}

export const LEGAL: Record<'es' | 'en', Record<LegalSlug, LegalDoc>> = {
  es: {
    'aviso-legal': {
      titulo: 'Aviso legal y descargo de responsabilidad',
      parrafos: [
        'Lotofácil ofrece resultados de loterías y herramientas de análisis estadístico con fines informativos y de entretenimiento.',
        'Lotofácil no organiza, gestiona ni comercializa juegos de azar y no vende tiquetes de lotería. No mantiene relación oficial con los operadores de las loterías mencionadas; las marcas y nombres pertenecen a sus respectivos titulares.',
        'Los resultados se recopilan de fuentes públicas y se publican con la mayor diligencia, pero pueden contener errores o retrasos. Los resultados oficiales son los que publica cada operador y, ante cualquier discrepancia, prevalecen estos últimos.',
        'Las herramientas de análisis (números frecuentes, generadores) se basan en frecuencias históricas y no predicen ni aumentan la probabilidad de obtener premios. Cada sorteo es un evento independiente y aleatorio.',
        'El uso del sitio está dirigido a personas mayores de 18 años. Jugar implica un gasto sin garantía de retorno; juega de forma responsable.',
      ],
    },
    privacidad: {
      titulo: 'Política de privacidad',
      parrafos: [
        'Esta Política de Privacidad describe cómo se tratan los datos de las personas que visitan Lotofácil.',
        'Para navegar por el sitio no es necesario registrarse y no recopilamos de forma directa datos personales identificables.',
        'Podemos utilizar cookies y tecnologías similares para medir la audiencia (analítica) y, en su caso, mostrar publicidad. Estas herramientas pueden recopilar datos de uso de forma agregada o seudónima.',
        'Cuando corresponda, la analítica y la publicidad se activan según tus preferencias de consentimiento. Puedes aceptarlas o rechazarlas desde el aviso de cookies y cambiar tu elección más adelante.',
        'Los proveedores de terceros (por ejemplo, de analítica o publicidad) tratan los datos conforme a sus propias políticas; te recomendamos revisarlas.',
        'Puedes ejercer tus derechos de acceso, rectificación o supresión escribiendo a la dirección indicada en la página de contacto.',
      ],
    },
    cookies: {
      titulo: 'Política de cookies',
      parrafos: [
        'Las cookies son pequeños archivos que se almacenan en tu dispositivo para que el sitio funcione correctamente y para medir su uso.',
        'Cookies técnicas: necesarias para el funcionamiento básico del sitio; no requieren consentimiento.',
        'Cookies de analítica: nos ayudan a entender de forma agregada cómo se utiliza el sitio.',
        'Cookies de publicidad: permiten mostrar anuncios y, según tu consentimiento, personalizarlos.',
        'Puedes aceptar o rechazar las cookies no esenciales desde el aviso que aparece al entrar y cambiar tu elección en cualquier momento borrando las cookies de tu navegador.',
      ],
    },
    contacto: {
      titulo: 'Contacto',
      parrafos: [
        '¿Tienes una duda, una corrección sobre un resultado o una solicitud relacionada con tus datos?',
        'Escríbenos a: contacto@lotofacil.example (reemplaza por el correo real del proyecto).',
        'Atendemos consultas sobre el contenido del sitio y el tratamiento de datos. No gestionamos premios ni apuestas.',
      ],
    },
  },
  en: {
    'aviso-legal': {
      titulo: 'Legal notice and disclaimer',
      parrafos: [
        'Lotofácil provides lottery results and statistical analysis tools for informational and entertainment purposes.',
        'Lotofácil does not organize, manage, or sell games of chance and does not sell lottery tickets. It has no official relationship with the operators of the lotteries listed; trademarks and names belong to their respective owners.',
        'Results are collected from public sources and published with care, but may contain errors or delays. The official results are those published by each operator and prevail in case of any discrepancy.',
        'The analysis tools (frequent numbers, generators) are based on historical frequencies and do not predict or increase the probability of winning. Each draw is an independent, random event.',
        'This site is intended for people aged 18 and over. Playing involves spending with no guaranteed return; please play responsibly.',
      ],
    },
    privacidad: {
      titulo: 'Privacy policy',
      parrafos: [
        'This Privacy Policy describes how data from visitors to Lotofácil is handled.',
        'No registration is required to browse the site, and we do not directly collect personally identifiable data.',
        'We may use cookies and similar technologies to measure audience (analytics) and, where applicable, to display advertising. These tools may collect usage data in an aggregated or pseudonymous form.',
        'Where applicable, analytics and advertising are enabled according to your consent preferences. You can accept or reject them from the cookie notice and change your choice later.',
        'Third-party providers (for example, analytics or advertising) process data under their own policies; we recommend reviewing them.',
        'You can exercise your rights of access, rectification, or erasure by writing to the address listed on the contact page.',
      ],
    },
    cookies: {
      titulo: 'Cookie policy',
      parrafos: [
        'Cookies are small files stored on your device so the site works correctly and to measure its use.',
        'Technical cookies: necessary for the basic operation of the site; they do not require consent.',
        'Analytics cookies: help us understand, in aggregate, how the site is used.',
        'Advertising cookies: allow ads to be shown and, subject to your consent, personalized.',
        'You can accept or reject non-essential cookies from the notice shown on entry and change your choice at any time by clearing your browser cookies.',
      ],
    },
    contacto: {
      titulo: 'Contact',
      parrafos: [
        'Do you have a question, a correction about a result, or a request related to your data?',
        'Write to us at: contact@lotofacil.example (replace with the project’s real email).',
        'We handle inquiries about the site content and data processing. We do not manage prizes or bets.',
      ],
    },
  },
};
