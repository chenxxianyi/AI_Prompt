import type { GlobalThemeOverrides } from 'naive-ui'

export const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#6366f1',
    primaryColorHover: '#818cf8',
    primaryColorPressed: '#4f46e5',
    primaryColorSuppl: '#818cf8',
    borderRadius: '12px',
    borderRadiusSmall: '8px',
    fontFamily: "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif",
  },
  Button: {
    borderRadiusMedium: '8px',
    fontWeightStrong: '600',
  },
  Card: {
    borderRadius: '16px',
  },
  Input: {
    borderRadius: '8px',
    colorFocus: '#f0f2f8',
    borderFocus: '1px solid #6366f1',
    boxShadowFocus: '0 0 0 3px rgba(99, 102, 241, 0.12)',
  },
  Select: {
    peers: {
      InternalSelection: {
        borderRadius: '8px',
      },
    },
  },
  Tag: {
    borderRadius: '99px',
  },
}
