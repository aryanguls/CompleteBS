import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Add the Google Fonts link here */}
          <link 
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" 
            rel="stylesheet" 
          />
          <link rel="shortcut icon" type="image/x-icon" href="/logo2bg.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;