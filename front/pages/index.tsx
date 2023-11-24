import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

const Home = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1000 && isDropdownOpen) {
        setDropdownOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isDropdownOpen]);

  return (
    <div>
      <Head>
        <title>CompleteBS - Stop Making Sense</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <nav>
      <div className={styles.navContainer}>
          <div className={styles.brand}>
            <img src="/logo2bg.png" alt="CompleteBS Logo" className={styles.logoIcon} />
            <Link href="/">
                <span className={styles.brandName}>CompleteBS</span>
            </Link>
          </div>
          <div className={styles.hamburger} onClick={toggleDropdown}>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
          </div>
          <div className={isDropdownOpen ? styles.navLinksActive : styles.navLinks}>
            <Link href="/signup">Get Started</Link>
            <a href="mailto:aryanguls@gmail.com">Contact Us</a>
          </div>
        </div>
      </nav>
      <section className={styles.mainContent}>
        <div className={styles.contentContainer}>
          <div className={styles.intro}>
          <h1 className={styles.highlightText}>
              Let's <span className={styles.strikethrough}>Cut</span> Load the Crap.
          </h1>
            <p>Dive into a realm where conventional answers are tossed out the window and witty banter takes the helm with <span className={styles.coloredtext}>CompleteBullshitGPT</span>.</p>
            <div className={styles.btnGroup}>
              {/* <a href="/signup" className={styles.primaryBtn}>Join the Fun</a> */}
              <Link href="/signup" passHref>
                <button className={styles.primaryBtn}>Join the Fun</button>
              </Link>
              <a href="mailto:aryanguls@gmail.com" className={styles.primaryBtn}>Know More</a>
            </div>
          </div>
          <div className={styles.graphicContainer}>
            <img src="/graphic.png" alt="Graphic" className={styles.mainGraphic} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
