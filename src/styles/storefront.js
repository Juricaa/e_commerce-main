import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  'storefront-page': {
    'minHeight': [{ 'unit': 'vh', 'value': 100 }],
    'display': 'flex',
    'flexDirection': 'column',
    'background': 'linear-gradient(180deg, #f8fafc 0%, #ffffff 55%, #f1f5f9 100%)',
    'color': '#0f172a'
  },
  'storefront-navbar': {
    'maxWidth': [{ 'unit': 'px', 'value': 1200 }],
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'auto' }, { 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'auto' }],
    'padding': [{ 'unit': 'px', 'value': 28 }, { 'unit': 'px', 'value': 24 }, { 'unit': 'px', 'value': 28 }, { 'unit': 'px', 'value': 24 }],
    'display': 'flex',
    'justifyContent': 'space-between',
    'alignItems': 'center',
    'gap': '24px',
    '<w991': {
      'flexDirection': 'column',
      'alignItems': 'flex-start'
    },
    '<w540': {
      'padding': [{ 'unit': 'px', 'value': 24 }, { 'unit': 'px', 'value': 20 }, { 'unit': 'px', 'value': 24 }, { 'unit': 'px', 'value': 20 }]
    }
  },
  'navbar-branding': {
    'display': 'flex',
    'alignItems': 'center',
    'gap': '48px',
    'flexWrap': 'wrap',
    '<w720': {
      'gap': '24px'
    }
  },
  'brand-mark': {
    'fontSize': [{ 'unit': 'rem', 'value': 1.75 }],
    'fontWeight': '700',
    'letterSpacing': [{ 'unit': 'em', 'value': 0.04 }]
  },
  'navbar-links': {
    'display': 'flex',
    'gap': '24px',
    'alignItems': 'center'
  },
  'navbar-link': {
    'position': 'relative',
    'fontSize': [{ 'unit': 'rem', 'value': 0.95 }],
    'fontWeight': '500',
    'color': '#0f172a',
    'textDecoration': 'none',
    'padding': [{ 'unit': 'px', 'value': 6 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 6 }, { 'unit': 'px', 'value': 0 }]
  },
  'navbar-link::after': {
    'content': '""',
    'position': 'absolute',
    'insetInline': '0',
    'bottom': [{ 'unit': 'px', 'value': -6 }],
    'height': [{ 'unit': 'px', 'value': 2 }],
    'borderRadius': '999px',
    'background': 'transparent',
    'transition': 'background 0.2s'
  },
  'navbar-link:hover::after': {
    'background': '#1d4ed8'
  },
  'navbar-link:focus-visible::after': {
    'background': '#1d4ed8'
  },
  'navbar-actions': {
    'display': 'flex',
    'gap': '16px',
    'alignItems': 'center'
  },
  'cart-link': {
    'background': 'transparent',
    'border': [{ 'unit': 'string', 'value': 'none' }],
    'fontSize': [{ 'unit': 'rem', 'value': 0.95 }],
    'fontWeight': '500',
    'color': '#0f172a',
    'cursor': 'pointer',
    'padding': [{ 'unit': 'px', 'value': 8 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 8 }, { 'unit': 'px', 'value': 0 }]
  },
  'account-link': {
    'display': 'inline-flex',
    'alignItems': 'center',
    'justifyContent': 'center',
    'padding': [{ 'unit': 'px', 'value': 10 }, { 'unit': 'px', 'value': 18 }, { 'unit': 'px', 'value': 10 }, { 'unit': 'px', 'value': 18 }],
    'borderRadius': '999px',
    'background': '#1d4ed8',
    'color': '#ffffff',
    'fontWeight': '600',
    'textDecoration': 'none',
    'boxShadow': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 12 }, { 'unit': 'px', 'value': 24 }, { 'unit': 'string', 'value': 'rgba(29, 78, 216, 0.25)' }]
  },
  'account-link:hover': {
    'background': '#1e40af'
  },
  'account-link:focus-visible': {
    'background': '#1e40af'
  },
  'storefront-hero': {
    'maxWidth': [{ 'unit': 'px', 'value': 1200 }],
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'auto' }, { 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'auto' }],
    'padding': [{ 'unit': 'px', 'value': 60 }, { 'unit': 'px', 'value': 24 }, { 'unit': 'px', 'value': 80 }, { 'unit': 'px', 'value': 24 }],
    'display': 'grid',
    'gridTemplateColumns': 'minmax(0, 1.1fr) minmax(0, 0.9fr)',
    'gap': '56px',
    'alignItems': 'center'
  },
  'hero-content': {
    'maxWidth': [{ 'unit': 'px', 'value': 540 }]
  },
  'hero-eyebrow': {
    'fontSize': [{ 'unit': 'rem', 'value': 0.9 }],
    'textTransform': 'uppercase',
    'letterSpacing': [{ 'unit': 'em', 'value': 0.12 }],
    'color': '#1d4ed8',
    'marginBottom': [{ 'unit': 'px', 'value': 12 }]
  },
  'hero-title': {
    'fontSize': [{ 'unit': 'rem', 'value': 3 }],
    'lineHeight': [{ 'unit': 'px', 'value': 1.1 }],
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 24 }, { 'unit': 'px', 'value': 0 }]
  },
  'hero-description': {
    'fontSize': [{ 'unit': 'rem', 'value': 1 }],
    'lineHeight': [{ 'unit': 'px', 'value': 1.7 }],
    'color': '#334155',
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 28 }, { 'unit': 'px', 'value': 0 }]
  },
  'hero-actions': {
    'display': 'flex',
    'gap': '16px',
    'flexWrap': 'wrap',
    'marginBottom': [{ 'unit': 'px', 'value': 40 }]
  },
  'hero-primary': {
    'display': 'inline-flex',
    'alignItems': 'center',
    'justifyContent': 'center',
    'padding': [{ 'unit': 'px', 'value': 14 }, { 'unit': 'px', 'value': 26 }, { 'unit': 'px', 'value': 14 }, { 'unit': 'px', 'value': 26 }],
    'borderRadius': '999px',
    'fontWeight': '600',
    'textDecoration': 'none',
    'transition': 'transform 0.2s, box-shadow 0.2s'
  },
  'hero-secondary': {
    'display': 'inline-flex',
    'alignItems': 'center',
    'justifyContent': 'center',
    'padding': [{ 'unit': 'px', 'value': 14 }, { 'unit': 'px', 'value': 26 }, { 'unit': 'px', 'value': 14 }, { 'unit': 'px', 'value': 26 }],
    'borderRadius': '999px',
    'fontWeight': '600',
    'textDecoration': 'none',
    'transition': 'transform 0.2s, box-shadow 0.2s'
  },
  'hero-primary': {
    'background': '#0f172a',
    'color': '#f8fafc',
    'boxShadow': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 14 }, { 'unit': 'px', 'value': 30 }, { 'unit': 'string', 'value': 'rgba(15, 23, 42, 0.22)' }]
  },
  'hero-primary:hover': {
    'transform': 'translateY(-2px)'
  },
  'hero-primary:focus-visible': {
    'transform': 'translateY(-2px)'
  },
  'hero-secondary': {
    'border': [{ 'unit': 'px', 'value': 1 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': 'rgba(15, 23, 42, 0.12)' }],
    'color': '#0f172a'
  },
  'hero-secondary:hover': {
    'borderColor': 'rgba(15, 23, 42, 0.4)'
  },
  'hero-secondary:focus-visible': {
    'borderColor': 'rgba(15, 23, 42, 0.4)'
  },
  'hero-stats': {
    'display': 'grid',
    'gridTemplateColumns': 'repeat(2, minmax(0, 1fr))',
    'gap': '24px',
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }]
  },
  'hero-stat dt': {
    'fontSize': [{ 'unit': 'rem', 'value': 1.5 }],
    'fontWeight': '700',
    'marginBottom': [{ 'unit': 'px', 'value': 8 }]
  },
  'hero-stat dd': {
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'color': '#475569',
    'fontSize': [{ 'unit': 'rem', 'value': 0.95 }],
    'lineHeight': [{ 'unit': 'px', 'value': 1.6 }]
  },
  'hero-gallery': {
    'display': 'grid',
    'gridTemplateColumns': '1fr',
    'gap': '18px',
    'position': 'relative'
  },
  'hero-image': {
    'width': [{ 'unit': '%H', 'value': 1 }],
    'borderRadius': '28px',
    'objectFit': 'cover',
    'boxShadow': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 20 }, { 'unit': 'px', 'value': 38 }, { 'unit': 'string', 'value': 'rgba(15, 23, 42, 0.16)' }]
  },
  'hero-imagesecondary': {
    'justifySelf': 'flex-end',
    'maxWidth': [{ 'unit': '%H', 'value': 0.7 }]
  },
  'product-showcase': {
    'maxWidth': [{ 'unit': 'px', 'value': 1200 }],
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'auto' }, { 'unit': 'px', 'value': 100 }, { 'unit': 'string', 'value': 'auto' }],
    'padding': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 24 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 24 }]
  },
  'section-header': {
    'display': 'flex',
    'justifyContent': 'space-between',
    'alignItems': 'flex-end',
    'gap': '32px',
    'marginBottom': [{ 'unit': 'px', 'value': 40 }],
    'flexWrap': 'wrap'
  },
  'section-eyebrow': {
    'textTransform': 'uppercase',
    'letterSpacing': [{ 'unit': 'em', 'value': 0.12 }],
    'fontSize': [{ 'unit': 'rem', 'value': 0.85 }],
    'color': '#2563eb',
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 12 }, { 'unit': 'px', 'value': 0 }]
  },
  'section-title': {
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'fontSize': [{ 'unit': 'rem', 'value': 2.2 }]
  },
  'section-description': {
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'color': '#475569',
    'maxWidth': [{ 'unit': 'px', 'value': 380 }],
    'lineHeight': [{ 'unit': 'px', 'value': 1.7 }]
  },
  'product-grid': {
    'display': 'grid',
    'gridTemplateColumns': 'repeat(auto-fit, minmax(240px, 1fr))',
    'gap': '28px'
  },
  'product-card': {
    'display': 'flex',
    'flexDirection': 'column',
    'background': '#ffffff',
    'borderRadius': '22px',
    'overflow': 'hidden',
    'boxShadow': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 22 }, { 'unit': 'px', 'value': 48 }, { 'unit': 'string', 'value': 'rgba(15, 23, 42, 0.12)' }]
  },
  'product-image-wrapper': {
    'position': 'relative',
    'paddingTop': [{ 'unit': '%V', 'value': 0.7 }],
    'overflow': 'hidden'
  },
  'product-image-wrapper img': {
    'position': 'absolute',
    'inset': '0',
    'width': [{ 'unit': '%H', 'value': 1 }],
    'height': [{ 'unit': '%V', 'value': 1 }],
    'objectFit': 'cover'
  },
  'product-tag': {
    'position': 'absolute',
    'top': [{ 'unit': 'px', 'value': 16 }],
    'left': [{ 'unit': 'px', 'value': 16 }],
    'padding': [{ 'unit': 'px', 'value': 6 }, { 'unit': 'px', 'value': 12 }, { 'unit': 'px', 'value': 6 }, { 'unit': 'px', 'value': 12 }],
    'borderRadius': '999px',
    'background': 'rgba(29, 78, 216, 0.9)',
    'color': '#ffffff',
    'fontSize': [{ 'unit': 'rem', 'value': 0.75 }],
    'fontWeight': '600',
    'letterSpacing': [{ 'unit': 'em', 'value': 0.05 }]
  },
  'product-details': {
    'padding': [{ 'unit': 'px', 'value': 24 }, { 'unit': 'px', 'value': 24 }, { 'unit': 'px', 'value': 24 }, { 'unit': 'px', 'value': 24 }],
    'display': 'flex',
    'flexDirection': 'column',
    'gap': '16px'
  },
  'product-name': {
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'fontSize': [{ 'unit': 'rem', 'value': 1.25 }]
  },
  'product-description': {
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'color': '#475569',
    'lineHeight': [{ 'unit': 'px', 'value': 1.6 }]
  },
  'product-footer': {
    'display': 'flex',
    'alignItems': 'center',
    'justifyContent': 'space-between',
    'gap': '16px'
  },
  'product-price': {
    'fontWeight': '700',
    'fontSize': [{ 'unit': 'rem', 'value': 1.05 }]
  },
  'product-action': {
    'padding': [{ 'unit': 'px', 'value': 10 }, { 'unit': 'px', 'value': 18 }, { 'unit': 'px', 'value': 10 }, { 'unit': 'px', 'value': 18 }],
    'borderRadius': '999px',
    'border': [{ 'unit': 'string', 'value': 'none' }],
    'background': '#0f172a',
    'color': '#f8fafc',
    'fontWeight': '600',
    'cursor': 'pointer'
  },
  'checkout-section': {
    'maxWidth': [{ 'unit': 'px', 'value': 1200 }],
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'auto' }, { 'unit': 'px', 'value': 96 }, { 'unit': 'string', 'value': 'auto' }],
    'padding': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 24 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 24 }]
  },
  'checkout-grid': {
    'display': 'grid',
    'gridTemplateColumns': 'minmax(0, 1.1fr) minmax(0, 1fr) minmax(0, 0.9fr)',
    'gap': '28px'
  },
  'cart-summary': {
    'background': '#ffffff',
    'borderRadius': '24px',
    'padding': [{ 'unit': 'px', 'value': 28 }, { 'unit': 'px', 'value': 28 }, { 'unit': 'px', 'value': 28 }, { 'unit': 'px', 'value': 28 }],
    'boxShadow': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 28 }, { 'unit': 'px', 'value': 54 }, { 'unit': 'string', 'value': 'rgba(15, 23, 42, 0.12)' }],
    'display': 'flex',
    'flexDirection': 'column',
    'gap': '20px'
  },
  'checkout-form': {
    'background': '#ffffff',
    'borderRadius': '24px',
    'padding': [{ 'unit': 'px', 'value': 28 }, { 'unit': 'px', 'value': 28 }, { 'unit': 'px', 'value': 28 }, { 'unit': 'px', 'value': 28 }],
    'boxShadow': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 28 }, { 'unit': 'px', 'value': 54 }, { 'unit': 'string', 'value': 'rgba(15, 23, 42, 0.12)' }],
    'display': 'flex',
    'flexDirection': 'column',
    'gap': '20px'
  },
  'qr-panel': {
    'background': '#ffffff',
    'borderRadius': '24px',
    'padding': [{ 'unit': 'px', 'value': 28 }, { 'unit': 'px', 'value': 28 }, { 'unit': 'px', 'value': 28 }, { 'unit': 'px', 'value': 28 }],
    'boxShadow': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 28 }, { 'unit': 'px', 'value': 54 }, { 'unit': 'string', 'value': 'rgba(15, 23, 42, 0.12)' }],
    'display': 'flex',
    'flexDirection': 'column',
    'gap': '20px'
  },
  'cart-summary h3': {
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'fontSize': [{ 'unit': 'rem', 'value': 1.4 }]
  },
  'checkout-form h3': {
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'fontSize': [{ 'unit': 'rem', 'value': 1.4 }]
  },
  'qr-panel h3': {
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'fontSize': [{ 'unit': 'rem', 'value': 1.4 }]
  },
  'cart-empty': {
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'color': '#64748b'
  },
  'cart-list': {
    'listStyle': 'none',
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'padding': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'display': 'grid',
    'gap': '18px'
  },
  'cart-item': {
    'display': 'grid',
    'gap': '16px',
    'gridTemplateColumns': 'minmax(0, 1fr) minmax(0, 1.4fr)',
    'alignItems': 'center'
  },
  'cart-item-details h4': {
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'fontSize': [{ 'unit': 'rem', 'value': 1.05 }]
  },
  'cart-item-details p': {
    'margin': [{ 'unit': 'px', 'value': 6 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'color': '#475569'
  },
  'cart-item-controls': {
    'display': 'grid',
    'gridTemplateColumns': 'auto auto 1fr',
    'alignItems': 'center',
    'gap': '12px',
    'justifyItems': 'center'
  },
  'quantity-controls': {
    'display': 'inline-flex',
    'alignItems': 'center',
    'gap': '12px',
    'borderRadius': '999px',
    'background': 'rgba(148, 163, 184, 0.16)',
    'padding': [{ 'unit': 'px', 'value': 6 }, { 'unit': 'px', 'value': 16 }, { 'unit': 'px', 'value': 6 }, { 'unit': 'px', 'value': 16 }]
  },
  'quantity-controls button': {
    'border': [{ 'unit': 'string', 'value': 'none' }],
    'background': 'transparent',
    'fontSize': [{ 'unit': 'rem', 'value': 1.2 }],
    'fontWeight': '700',
    'color': '#0f172a',
    'cursor': 'pointer'
  },
  'quantity-controls span': {
    'minWidth': [{ 'unit': 'px', 'value': 24 }],
    'textAlign': 'center',
    'fontWeight': '600'
  },
  'remove-item': {
    'border': [{ 'unit': 'string', 'value': 'none' }],
    'background': 'transparent',
    'color': '#ef4444',
    'fontWeight': '600',
    'cursor': 'pointer'
  },
  'line-total': {
    'fontWeight': '700',
    'color': '#0f172a',
    'justifySelf': 'flex-end'
  },
  'cart-total': {
    'display': 'flex',
    'justifyContent': 'space-between',
    'alignItems': 'center',
    'paddingTop': [{ 'unit': 'px', 'value': 12 }],
    'borderTop': [{ 'unit': 'px', 'value': 1 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': 'rgba(15, 23, 42, 0.08)' }],
    'fontSize': [{ 'unit': 'rem', 'value': 1.1 }]
  },
  'checkout-form': {
    'gap': '18px'
  },
  'checkout-label': {
    'display': 'flex',
    'flexDirection': 'column',
    'gap': '10px',
    'fontWeight': '600'
  },
  'checkout-input': {
    'border': [{ 'unit': 'px', 'value': 1 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': 'rgba(15, 23, 42, 0.12)' }],
    'borderRadius': '18px',
    'padding': [{ 'unit': 'px', 'value': 14 }, { 'unit': 'px', 'value': 16 }, { 'unit': 'px', 'value': 14 }, { 'unit': 'px', 'value': 16 }],
    'fontSize': [{ 'unit': 'rem', 'value': 1 }],
    'transition': 'border 0.2s, box-shadow 0.2s'
  },
  'checkout-textarea': {
    'border': [{ 'unit': 'px', 'value': 1 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': 'rgba(15, 23, 42, 0.12)' }],
    'borderRadius': '18px',
    'padding': [{ 'unit': 'px', 'value': 14 }, { 'unit': 'px', 'value': 16 }, { 'unit': 'px', 'value': 14 }, { 'unit': 'px', 'value': 16 }],
    'fontSize': [{ 'unit': 'rem', 'value': 1 }],
    'transition': 'border 0.2s, box-shadow 0.2s'
  },
  'checkout-input:focus': {
    'outline': 'none',
    'borderColor': 'rgba(37, 99, 235, 0.5)',
    'boxShadow': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 4 }, { 'unit': 'string', 'value': 'rgba(37, 99, 235, 0.15)' }]
  },
  'checkout-textarea:focus': {
    'outline': 'none',
    'borderColor': 'rgba(37, 99, 235, 0.5)',
    'boxShadow': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 4 }, { 'unit': 'string', 'value': 'rgba(37, 99, 235, 0.15)' }]
  },
  'checkout-textarea': {
    'resize': 'vertical'
  },
  'checkout-submit': {
    'padding': [{ 'unit': 'px', 'value': 16 }, { 'unit': 'px', 'value': 16 }, { 'unit': 'px', 'value': 16 }, { 'unit': 'px', 'value': 16 }],
    'borderRadius': '18px',
    'border': [{ 'unit': 'string', 'value': 'none' }],
    'background': 'linear-gradient(135deg, #1d4ed8, #0f172a)',
    'color': '#f8fafc',
    'fontSize': [{ 'unit': 'rem', 'value': 1 }],
    'fontWeight': '700',
    'cursor': 'pointer',
    'boxShadow': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 28 }, { 'unit': 'px', 'value': 48 }, { 'unit': 'string', 'value': 'rgba(15, 23, 42, 0.18)' }]
  },
  'checkout-submit:disabled': {
    'opacity': '0.7',
    'cursor': 'progress'
  },
  'checkout-feedback': {
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'fontWeight': '600'
  },
  'checkout-feedbacksuccess': {
    'color': '#16a34a'
  },
  'checkout-feedbackerror': {
    'color': '#dc2626'
  },
  'qr-panel': {
    'alignItems': 'center',
    'textAlign': 'center'
  },
  'qr-display': {
    'display': 'flex',
    'flexDirection': 'column',
    'gap': '16px',
    'alignItems': 'center'
  },
  'qr-display img': {
    'width': [{ 'unit': 'px', 'value': 220 }],
    'height': [{ 'unit': 'px', 'value': 220 }],
    'objectFit': 'contain',
    'borderRadius': '24px',
    'background': '#f1f5f9',
    'padding': [{ 'unit': 'px', 'value': 16 }, { 'unit': 'px', 'value': 16 }, { 'unit': 'px', 'value': 16 }, { 'unit': 'px', 'value': 16 }],
    'boxShadow': [{ 'unit': 'string', 'value': 'inset' }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 1 }, { 'unit': 'string', 'value': 'rgba(15, 23, 42, 0.08)' }]
  },
  'qr-reference': {
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'fontWeight': '600',
    'color': '#0f172a'
  },
  'qr-download': {
    'display': 'inline-flex',
    'alignItems': 'center',
    'justifyContent': 'center',
    'padding': [{ 'unit': 'px', 'value': 12 }, { 'unit': 'px', 'value': 20 }, { 'unit': 'px', 'value': 12 }, { 'unit': 'px', 'value': 20 }],
    'borderRadius': '18px',
    'background': '#0f172a',
    'color': '#f8fafc',
    'textDecoration': 'none',
    'fontWeight': '600'
  },
  'qr-placeholder': {
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'color': '#475569',
    'lineHeight': [{ 'unit': 'px', 'value': 1.6 }]
  },
  'storytelling-band': {
    'maxWidth': [{ 'unit': 'px', 'value': 1200 }],
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'auto' }, { 'unit': 'px', 'value': 96 }, { 'unit': 'string', 'value': 'auto' }],
    'padding': [{ 'unit': 'px', 'value': 80 }, { 'unit': 'px', 'value': 24 }, { 'unit': 'px', 'value': 80 }, { 'unit': 'px', 'value': 24 }],
    'background': '#0f172a',
    'borderRadius': '32px',
    'color': '#e2e8f0',
    'display': 'grid',
    'gridTemplateColumns': 'minmax(0, 1fr) minmax(0, 1fr)',
    'gap': '48px',
    'alignItems': 'center'
  },
  'story-content h2': {
    'fontSize': [{ 'unit': 'rem', 'value': 2.4 }],
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 24 }, { 'unit': 'px', 'value': 0 }]
  },
  'story-content p': {
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 18 }, { 'unit': 'px', 'value': 0 }],
    'lineHeight': [{ 'unit': 'px', 'value': 1.7 }],
    'color': '#cbd5f5'
  },
  'story-gallery': {
    'display': 'grid',
    'gap': '18px'
  },
  'story-gallery img': {
    'width': [{ 'unit': '%H', 'value': 1 }],
    'borderRadius': '24px',
    'objectFit': 'cover',
    'boxShadow': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 16 }, { 'unit': 'px', 'value': 32 }, { 'unit': 'string', 'value': 'rgba(7, 10, 18, 0.45)' }]
  },
  'journal-highlight': {
    'maxWidth': [{ 'unit': 'px', 'value': 1200 }],
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'auto' }, { 'unit': 'px', 'value': 100 }, { 'unit': 'string', 'value': 'auto' }],
    'padding': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 24 }, { 'unit': 'px', 'value': 40 }, { 'unit': 'px', 'value': 24 }]
  },
  'journal-grid': {
    'display': 'grid',
    'gridTemplateColumns': 'repeat(auto-fit, minmax(260px, 1fr))',
    'gap': '28px'
  },
  'journal-card': {
    'background': '#ffffff',
    'borderRadius': '22px',
    'overflow': 'hidden',
    'display': 'flex',
    'flexDirection': 'column',
    'boxShadow': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 22 }, { 'unit': 'px', 'value': 48 }, { 'unit': 'string', 'value': 'rgba(15, 23, 42, 0.1)' }]
  },
  'journal-image-wrapper': {
    'position': 'relative',
    'paddingTop': [{ 'unit': '%V', 'value': 0.62 }],
    'overflow': 'hidden'
  },
  'journal-image-wrapper img': {
    'position': 'absolute',
    'inset': '0',
    'width': [{ 'unit': '%H', 'value': 1 }],
    'height': [{ 'unit': '%V', 'value': 1 }],
    'objectFit': 'cover'
  },
  'journal-details': {
    'display': 'flex',
    'flexDirection': 'column',
    'gap': '14px',
    'padding': [{ 'unit': 'px', 'value': 22 }, { 'unit': 'px', 'value': 22 }, { 'unit': 'px', 'value': 22 }, { 'unit': 'px', 'value': 22 }]
  },
  'journal-title': {
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'fontSize': [{ 'unit': 'rem', 'value': 1.2 }]
  },
  'journal-excerpt': {
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'color': '#475569',
    'lineHeight': [{ 'unit': 'px', 'value': 1.6 }]
  },
  'journal-action': {
    'alignSelf': 'flex-start',
    'padding': [{ 'unit': 'px', 'value': 8 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 8 }, { 'unit': 'px', 'value': 0 }],
    'background': 'none',
    'border': [{ 'unit': 'string', 'value': 'none' }],
    'color': '#1d4ed8',
    'fontWeight': '600',
    'cursor': 'pointer'
  },
  'storefront-footer': {
    'marginTop': [{ 'unit': 'string', 'value': 'auto' }],
    'background': '#0f172a',
    'color': '#e2e8f0',
    'padding': [{ 'unit': 'px', 'value': 56 }, { 'unit': 'px', 'value': 24 }, { 'unit': 'px', 'value': 56 }, { 'unit': 'px', 'value': 24 }]
  },
  'footer-branding': {
    'maxWidth': [{ 'unit': 'px', 'value': 1200 }],
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'auto' }, { 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'auto' }]
  },
  'footer-links': {
    'maxWidth': [{ 'unit': 'px', 'value': 1200 }],
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'auto' }, { 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'auto' }]
  },
  'footer-branding': {
    'display': 'flex',
    'flexDirection': 'column',
    'gap': '18px',
    'marginBottom': [{ 'unit': 'px', 'value': 48 }]
  },
  'footer-description': {
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'color': '#cbd5f5',
    'maxWidth': [{ 'unit': 'px', 'value': 440 }],
    'lineHeight': [{ 'unit': 'px', 'value': 1.6 }]
  },
  'footer-links': {
    'display': 'grid',
    'gridTemplateColumns': 'repeat(auto-fit, minmax(180px, 1fr))',
    'gap': '36px'
  },
  'footer-heading': {
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 12 }, { 'unit': 'px', 'value': 0 }],
    'fontSize': [{ 'unit': 'rem', 'value': 1 }],
    'fontWeight': '600'
  },
  'footer-link': {
    'display': 'block',
    'color': '#cbd5f5',
    'marginBottom': [{ 'unit': 'px', 'value': 8 }],
    'textDecoration': 'none',
    'fontSize': [{ 'unit': 'rem', 'value': 0.95 }]
  },
  'footer-link:hover': {
    'color': '#ffffff'
  },
  'footer-link:focus-visible': {
    'color': '#ffffff'
  }
});
