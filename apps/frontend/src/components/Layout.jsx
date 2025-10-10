import PropTypes from 'prop-types';
import FontPreloader from 'mfe-core/ui/FontPreloader';
import Head from 'next/head';
import Header from 'mfe-core/ui/Header';
import Footer from 'mfe-core/ui/Footer';

function Layout({ title, children }) {
    return (
        <>
            <Head>
                <title>{title}</title>
                <FontPreloader
                    variant={FontPreloader.variants.GT_AMERICA}
                    weight={FontPreloader.weights.BOLD}
                />
                <FontPreloader
                    variant={FontPreloader.variants.GT_AMERICA}
                    weight={FontPreloader.weights.EXTRA_LIGHT}
                />
                <FontPreloader
                    variant={FontPreloader.variants.GT_AMERICA}
                    weight={FontPreloader.weights.NORMAL}
                />
            </Head>
            <Header />
            <main role="main" tabIndex="-1" id="main-content">
                {children}
            </main>
            <Footer />
        </>
    );
}

Layout.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]).isRequired,
};

export default Layout;
