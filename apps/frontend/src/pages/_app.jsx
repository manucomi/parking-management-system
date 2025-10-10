import PropTypes from 'prop-types';
import '@/scss/manifest.scss';

function App({ Component, pageProps }) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Component {...pageProps} />;
}

App.propTypes = {
    Component: PropTypes.func.isRequired,
    pageProps: PropTypes.shape({}).isRequired,
};

export default App;
