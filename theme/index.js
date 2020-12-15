const { extendTheme } = require('@chakra-ui/react') 

module.exports = extendTheme({
  fonts: {
    body: "'Cera Pro', sans-serif",
    heading: "'Cera Pro Black', sans-serif"
  },
  styles: {
    global: {
      'html, body, #__next': { height: '100%' }
    }
  },
  colors: {
    black: {
      500: '#000000',
      600: '#222222'
    },
    lightPink: '#fdf9ff',
    googleBlue: {
      500: '#4285F4',
      600: '#427AF4'
    }
  },
  components: {
    Link: {
      variants: {
        'kalabam': (props) => ({
          color: props.colorMode === 'dark' ? 'blue.200' : 'blue.700'
        })
      }
    }
  }
})
