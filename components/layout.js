import React from 'react';
import Head from 'next/head';

const Layout = ({children}) => {
    return (
        <>
            <Head>
                <title>R3D</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css" integrity="sha512-oHDEc8Xed4hiW6CxD7qjbnI+B07vDdX7hEPTvn9pSZO1bcRqHp8mj9pyr+8RVC2GmtEfI2Bi9Ke9Ass0as+zpg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
            </Head>
            {children}
        </>
    );
}

export default Layout