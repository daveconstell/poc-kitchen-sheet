// Browser-compatible Tailwind configuration
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                'serif': ['Playfair Display', 'serif'],
                'sans': ['Open Sans', 'sans-serif']
            },
            colors: {
                primary: '#7C9286',
                secondary: '#E5AEA1'
            },
            maxWidth: {
                '8xl': '1440px',
            },
            animation: {
                'fadeIn': 'fadeIn 0.3s ease-out',
                'slideInRight': 'slideInRight 0.3s ease-out'
            },
            keyframes: {
                fadeIn: {
                    'from': {
                        opacity: '0',
                        transform: 'translateY(10px)'
                    },
                    'to': {
                        opacity: '1',
                        transform: 'translateY(0)'
                    }
                },
                slideInRight: {
                    'from': {
                        transform: 'translateX(100%)'
                    },
                    'to': {
                        transform: 'translateX(0)'
                    }
                }
            }
        }
    }
}
