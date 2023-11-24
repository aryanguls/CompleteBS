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

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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

    try {
      const response = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to chatbot or login page after successful signup
        router.push('/chatbot');
      } else {
        // Display error message from the backend
        setError(data.error);
        setShowPopup(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
      setShowPopup(true);
    }
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
