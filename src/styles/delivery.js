import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  'delivery-page': {
    'minHeight': [{ 'unit': 'vh', 'value': 100 }],
    'display': 'flex',
    'flexDirection': 'column',
    'background': 'linear-gradient(180deg, #0f172a 0%, #0f172a 320px, #f8fafc 320px, #f8fafc 100%)'
  },
  'delivery-header': {
    'padding': [{ 'unit': 'px', 'value': 48 }, { 'unit': 'px', 'value': 32 }, { 'unit': 'px', 'value': 32 }, { 'unit': 'px', 'value': 32 }],
    'display': 'flex',
    'alignItems': 'center',
    'justifyContent': 'space-between',
    'maxWidth': [{ 'unit': 'px', 'value': 1200 }],
    'width': [{ 'unit': '%H', 'value': 1 }],
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'auto' }, { 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'auto' }],
    'color': '#f8fafc',
    '<w640': {
      'flexDirection': 'column',
      'alignItems': 'flex-start',
      'gap': '16px'
    }
  },
  'delivery-eyebrow': {
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'textTransform': 'uppercase',
    'letterSpacing': [{ 'unit': 'em', 'value': 0.16 }],
    'fontSize': [{ 'unit': 'rem', 'value': 0.85 }],
    'opacity': '0.7'
  },
  'delivery-header h1': {
    'margin': [{ 'unit': 'px', 'value': 12 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'fontSize': [{ 'unit': 'rem', 'value': 2.6 }]
  },
  'delivery-home-link': {
    'textDecoration': 'none',
    'color': '#93c5fd',
    'fontWeight': '600'
  },
  'delivery-layout': {
    'maxWidth': [{ 'unit': 'px', 'value': 1200 }],
    'width': [{ 'unit': '%H', 'value': 1 }],
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'auto' }, { 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'auto' }],
    'display': 'grid',
    'gridTemplateColumns': 'minmax(0, 1.6fr) minmax(0, 1fr)',
    'gap': '36px',
    'padding': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 32 }, { 'unit': 'px', 'value': 64 }, { 'unit': 'px', 'value': 32 }],
    '<w992': {
      'gridTemplateColumns': '1fr'
    }
  },
  'scanner-panel': {
    'background': '#ffffff',
    'borderRadius': '28px',
    'boxShadow': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 32 }, { 'unit': 'px', 'value': 60 }, { 'unit': 'string', 'value': 'rgba(15, 23, 42, 0.12)' }],
    'padding': [{ 'unit': 'px', 'value': 32 }, { 'unit': 'px', 'value': 32 }, { 'unit': 'px', 'value': 32 }, { 'unit': 'px', 'value': 32 }],
    'display': 'flex',
    'flexDirection': 'column',
    'gap': '28px'
  },
  'scanner-frame': {
    'position': 'relative',
    'borderRadius': '24px',
    'overflow': 'hidden',
    'background': 'rgba(148, 163, 184, 0.2)'
  },
  'scanner-frame video': {
    'width': [{ 'unit': '%H', 'value': 1 }, { 'unit': 'string', 'value': '!important' }],
    'height': [{ 'unit': 'string', 'value': 'auto' }, { 'unit': 'string', 'value': '!important' }],
    'display': 'block'
  },
  'scanner-status': {
    'position': 'absolute',
    'inset': '0',
    'display': 'flex',
    'alignItems': 'center',
    'justifyContent': 'center',
    'color': '#0f172a',
    'fontWeight': '600',
    'background': 'rgba(248, 250, 252, 0.82)'
  },
  'scanner-error': {
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'color': '#dc2626',
    'fontWeight': '600'
  },
  'scanner-guidelines h2': {
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 12 }, { 'unit': 'px', 'value': 0 }],
    'fontSize': [{ 'unit': 'rem', 'value': 1.2 }],
    'color': '#0f172a'
  },
  'scanner-guidelines ol': {
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'paddingLeft': [{ 'unit': 'px', 'value': 20 }],
    'color': '#475569',
    'lineHeight': [{ 'unit': 'px', 'value': 1.6 }]
  },
  'history-panel': {
    'display': 'flex'
  },
  'history-card': {
    'background': '#0f172a',
    'color': '#f8fafc',
    'borderRadius': '28px',
    'padding': [{ 'unit': 'px', 'value': 32 }, { 'unit': 'px', 'value': 32 }, { 'unit': 'px', 'value': 32 }, { 'unit': 'px', 'value': 32 }],
    'boxShadow': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 32 }, { 'unit': 'px', 'value': 60 }, { 'unit': 'string', 'value': 'rgba(15, 23, 42, 0.28)' }],
    'width': [{ 'unit': '%H', 'value': 1 }],
    'display': 'flex',
    'flexDirection': 'column',
    'gap': '20px'
  },
  'history-card h2': {
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'fontSize': [{ 'unit': 'rem', 'value': 1.4 }]
  },
  'history-empty': {
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'color': 'rgba(248, 250, 252, 0.7)'
  },
  'history-list': {
    'listStyle': 'none',
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'padding': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'display': 'grid',
    'gap': '12px'
  },
  'history-time': {
    'fontSize': [{ 'unit': 'rem', 'value': 0.8 }],
    'letterSpacing': [{ 'unit': 'em', 'value': 0.08 }],
    'textTransform': 'uppercase',
    'color': 'rgba(248, 250, 252, 0.7)'
  },
  'history-content': {
    'wordBreak': 'break-word'
  },
  'history-item': {
    'display': 'flex',
    'flexDirection': 'column',
    'gap': '6px',
    'paddingBottom': [{ 'unit': 'px', 'value': 12 }],
    'borderBottom': [{ 'unit': 'px', 'value': 1 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': 'rgba(148, 163, 184, 0.25)' }]
  },
  'order-details': {
    'display': 'flex',
    'flexDirection': 'column',
    'gap': '4px'
  },
  'order-ref': {
    'fontWeight': '600',
    'color': '#93c5fd'
  },
  'order-customer': {
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'fontSize': [{ 'unit': 'rem', 'value': 0.9 }],
    'color': 'rgba(248, 250, 252, 0.9)'
  },
  'order-address': {
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'fontSize': [{ 'unit': 'rem', 'value': 0.9 }],
    'color': 'rgba(248, 250, 252, 0.9)'
  },
  'order-total': {
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'fontSize': [{ 'unit': 'rem', 'value': 0.9 }],
    'color': 'rgba(248, 250, 252, 0.9)'
  }
});
