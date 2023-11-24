// signup.tsx
import React, { FC, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Signup.module.css';

interface SignupProps {}

const Signup: FC<SignupProps> = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    return email.includes('@');
  };

  const allFieldsFilled = () => {
    return name !== '' && email !== '' && password !== '';
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (!allFieldsFilled()) {
      setError('Please fill in all the fields.');
      setShowPopup(true);
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setShowPopup(true);
      return;
    }

    setError('');
    setShowPopup(false);
    // You can add an API call here to actually sign the user up
    // After successful signup, redirect to the chatbot page
    router.push('/chatbot');
  };

  const closePopup = () => {
    setShowPopup(false);
    setError('');
  };

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
        </div>
      </nav>
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <h1>Join the Fun</h1>
          <input 
            type="text" 
            placeholder="Name" 
            className={styles.authInput} 
            value={name} 
            onChange={(e) => setName(e.target.value)}
          />
          <input 
            type="email" 
            placeholder="Email" 
            className={styles.authInput} 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password" 
            className={styles.authInput} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleSubmit} className={styles.authButton}>Sign Up</button>
          <div id="g-signin2"></div>
          <p className={styles.loginLink}>
            <Link href="/login">
              <span>Already done? Log in.</span>
            </Link>
          </p>
        </div>
      </div>
      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <span className={styles.close} onClick={closePopup}>&times;</span>
            <p className={styles.popupText}>{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signup;
