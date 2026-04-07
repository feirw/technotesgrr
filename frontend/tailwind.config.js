/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: [
  				'Manrope',
  				'ui-sans-serif',
  				'system-ui',
  				'Segoe UI',
  				'Roboto',
  				'Helvetica Neue',
  				'Arial',
  				'sans-serif',
  			],
  			mono: [
  				'ui-monospace',
  				'SFMono-Regular',
  				'Menlo',
  				'Monaco',
  				'Consolas',
  				'monospace',
  			],
  			arcade: ['ArcadeClassic', 'Manrope', 'sans-serif'],
  		},
  		typography: (theme) => ({
  			DEFAULT: {
  				css: {
  					maxWidth: 'none',
  					fontFamily: theme('fontFamily.sans').join(', '),
  					h1: { fontFamily: theme('fontFamily.sans').join(', ') },
  					h2: { fontFamily: theme('fontFamily.sans').join(', ') },
  					h3: { fontFamily: theme('fontFamily.sans').join(', ') },
  					h4: { fontFamily: theme('fontFamily.sans').join(', ') },
  				},
  			},
  		}),
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			/** Ροζ-κοραλί (ίδιο με HomePage) */
  			coral: {
  				DEFAULT: '#ff8f8e',
  				accent: '#ff6b7a',
  				strong: '#e85563',
  				light: '#ffb0a4',
  				wash: '#fff5f4',
  			},
  		}
  	},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
  darkMode: 'class',
};
