import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				// 中医主题色彩系统
				'medical-green': {
					50: '#f0f9f0',
					100: '#dcf2dc', 
					200: '#bae5ba',
					300: '#8dd48d',
					400: '#5ebc5e',
					DEFAULT: '#2E8B57', // 青瓷绿 - 主色调
					600: '#267349',
					700: '#1f5c3b',
					800: '#184a2f',
					900: '#133d24'
				},
				'ancient-gold': {
					50: '#fdf8f3',
					100: '#faf0e3',
					200: '#f5e0c3', 
					300: '#efc994',
					400: '#e8ad68',
					DEFAULT: '#B8860B', // 古铜金
					600: '#9a7309',
					700: '#7c5d07',
					800: '#624906',
					900: '#4d3a05'
				},
				'ink-black': {
					50: '#f8f9fa',
					100: '#f1f3f4',
					200: '#e8eaed',
					300: '#dadce0', 
					400: '#bdc1c6',
					500: '#9aa0a6',
					600: '#80868b',
					700: '#5f6368',
					800: '#3c4043',
					DEFAULT: '#202124',
					900: '#1a1a1a'
				},
				'paper-white': {
					50: '#fefefe',
					100: '#fdfcf7',
					200: '#fbf8ed',
					300: '#f8f4e3',
					400: '#f4efd7',
					DEFAULT: '#f0e9ca', // 宣纸色
					600: '#e6dfb5',
					700: '#d9d49f',
					800: '#cbc987',
					900: '#b8b56f'
				},
				// 保留原有系统色彩
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				// 中医特色动画
				'ink-wash': {
					'0%': { 
						transform: 'scale(0.8)', 
						opacity: '0',
						filter: 'blur(10px)'
					},
					'50%': { 
						filter: 'blur(5px)'
					},
					'100%': { 
						transform: 'scale(1)', 
						opacity: '1',
						filter: 'blur(0px)'
					}
				},
				'scroll-unroll': {
					'0%': { 
						transform: 'translateX(-100%)',
						opacity: '0'
					},
					'100%': { 
						transform: 'translateX(0%)',
						opacity: '1'
					}
				},
				'fade-in-up': {
					'0%': { 
						transform: 'translateY(30px)',
						opacity: '0'
					},
					'100%': { 
						transform: 'translateY(0)',
						opacity: '1'
					}
				},
				'pulse-gold': {
					'0%, 100%': { 
						boxShadow: '0 0 20px rgba(184, 134, 11, 0.3)'
					},
					'50%': { 
						boxShadow: '0 0 40px rgba(184, 134, 11, 0.6)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'ink-wash': 'ink-wash 1.2s ease-out',
				'scroll-unroll': 'scroll-unroll 0.8s ease-out',
				'fade-in-up': 'fade-in-up 0.6s ease-out',
				'pulse-gold': 'pulse-gold 2s infinite'
			},
			fontFamily: {
				'sans': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				'serif': ['Source Serif Pro', 'ui-serif', 'Georgia', 'serif'],
				'mono': ['Source Code Pro', 'ui-monospace', 'monospace'],
				// 中文字体
				'chinese': ['Noto Sans SC', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'sans-serif'],
				'chinese-serif': ['Noto Serif SC', 'SimSun', 'STSong', 'serif'],
				'ancient': ['Ma Shan Zheng', 'ZCOOL XiaoWei', 'cursive']
			},
			backgroundImage: {
				'paper-texture': "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noise\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.65\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3CfeColorMatrix type=\"matrix\" values=\"1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.15 0\"/%3E%3C/filter%3E%3Crect width=\"100\" height=\"100\" filter=\"url(%23noise)\" opacity=\"0.4\"/%3E%3C/svg%3E')",
				'ink-gradient': 'linear-gradient(135deg, #2E8B57 0%, #B8860B 50%, #2E8B57 100%)'
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
